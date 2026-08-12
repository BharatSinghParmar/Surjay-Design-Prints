"use client";

import { track } from "@/lib/analytics";

type LeadType = "inquiry" | "quote" | "newsletter";

/**
 * GA4 event name per lead type. Conversions are reported from here rather than
 * from each form component, so every caller is counted exactly once no matter
 * which of the two delivery paths below actually succeeded.
 */
const CONVERSION_EVENT: Record<LeadType, string> = {
  inquiry: "contact_form_submit",
  quote: "quote_request",
  newsletter: "newsletter_subscribe"
};

type RelayInstruction = { url: string; payload: Record<string, unknown> };

/**
 * Submit a website lead.
 *
 * Everything goes through /api/contact first, which validates the input, checks
 * the honeypot and applies rate limiting. If the server has a mail provider
 * configured (Resend or a webhook) it delivers directly and we are done.
 *
 * Otherwise it returns a `relay` instruction and the browser completes delivery.
 * That extra hop exists because the default relay accepts submissions from
 * browsers but blocks datacenter IPs, so a serverless function cannot reach it.
 *
 * Throws with a user-facing message on failure.
 */
export async function submitLead(
  type: LeadType,
  values: Record<string, unknown>
): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, ...values })
  });

  const data = (await res.json().catch(() => null)) as
    | { error?: string; relay?: RelayInstruction }
    | null;

  if (!res.ok) {
    throw new Error(data?.error || "Unable to send. Please try again.");
  }

  if (!data?.relay) {
    track(CONVERSION_EVENT[type]); // server delivered it
    return;
  }

  const relayRes = await fetch(data.relay.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data.relay.payload)
  });

  // The relay answers 200 even on failure — the body is the source of truth.
  const relayData = (await relayRes.json().catch(() => null)) as
    | { success?: string | boolean; message?: string }
    | null;
  const delivered =
    relayRes.ok &&
    (relayData?.success === true || String(relayData?.success ?? "").toLowerCase() === "true");

  if (!delivered) {
    throw new Error(
      relayData?.message || "We could not send that. Please call or WhatsApp us instead."
    );
  }

  track(CONVERSION_EVENT[type]);
}
