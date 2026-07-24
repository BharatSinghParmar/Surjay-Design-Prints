import { NextResponse } from "next/server";
import { site } from "@/data/site";
import { LEAD_INBOX } from "@/lib/leadInbox";

export const runtime = "nodejs";

/**
 * Single server-side lead endpoint for every form on the site:
 *   - "inquiry"   → full contact form (/contact)
 *   - "quote"     → Request Quote modal (header CTA, every page)
 *   - "newsletter"→ newsletter subscribe
 *
 * Why server-side: the destination inbox is never shipped to the browser (it used
 * to be hardcoded in the client bundle and scraped by spam crawlers), and every
 * submission is validated and rate-limited before it leaves us.
 *
 * Delivery uses FormSubmit (no account/API key needed) unless LEAD_WEBHOOK_URL is
 * set. Set LEAD_INBOX to change the destination without touching code.
 */

const INBOX = LEAD_INBOX;
const WEBHOOK = process.env.LEAD_WEBHOOK_URL; // optional: CRM/Zapier/Slack
const RESEND_KEY = process.env.RESEND_API_KEY; // optional: proper transactional email
const MAIL_FROM = process.env.MAIL_FROM || "Surjay Website <onboarding@resend.dev>";

type LeadType = "inquiry" | "quote" | "newsletter";

const REQUIRED: Record<LeadType, string[]> = {
  inquiry: ["name", "company", "phone", "email", "message"],
  quote: ["name", "company", "phone", "email"],
  newsletter: ["email"]
};

const SUBJECTS: Record<LeadType, string> = {
  inquiry: "New website inquiry",
  quote: "New QUOTE request",
  newsletter: "New newsletter subscriber"
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 4000;

// Simple in-memory rate limit (per warm serverless instance): 5 posts / 10 min / IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude memory bound
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again shortly." },
      { status: 429 }
    );
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: real users never fill this hidden field; bots do.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }); // silently accept, never deliver
  }

  const type = (["inquiry", "quote", "newsletter"] as const).includes(body.type as LeadType)
    ? (body.type as LeadType)
    : "inquiry";

  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (key === "type" || key === "website") continue;
    if (value === undefined || value === null) continue;
    const str = String(value).trim();
    if (str) fields[key] = str.slice(0, MAX_FIELD);
  }

  const missing = REQUIRED[type].filter((f) => !fields[f]);
  if (missing.length) {
    return NextResponse.json(
      { error: `Please fill in: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(fields.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const subject = `${SUBJECTS[type]}${fields.name ? ` — ${fields.name}` : ""}${
    fields.company ? ` (${fields.company})` : ""
  }`;

  const payload = { _subject: subject, _template: "table", ...fields };

  try {
    if (WEBHOOK) {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, subject, ...fields, receivedAt: new Date().toISOString() })
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else if (RESEND_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${RESEND_KEY}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [INBOX],
          reply_to: fields.email,
          subject,
          text: Object.entries(fields)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        })
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    } else {
      // FormSubmit accepts submissions from browsers but blocks datacenter IPs,
      // so a serverless function cannot relay to it. Validation, spam checks and
      // rate limiting have already run here; hand the vetted payload back for the
      // browser to post. The address never appears in the static client bundle —
      // it is only returned on a request that passed every check.
      return NextResponse.json({
        ok: true,
        relay: {
          url: `https://formsubmit.co/ajax/${encodeURIComponent(INBOX)}`,
          payload
        }
      });
    }
  } catch (err) {
    // Safety net: if email delivery fails, the lead is still written to the server
    // log so it can be recovered from the hosting dashboard rather than lost.
    console.error("[lead] DELIVERY FAILED — lead preserved below", {
      type,
      subject,
      fields,
      ip,
      receivedAt: new Date().toISOString(),
      reason: err instanceof Error ? err.message : String(err)
    });
    return NextResponse.json(
      {
        error: `Sorry — we could not send that. Please WhatsApp or call us on ${site.phone}.`
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
