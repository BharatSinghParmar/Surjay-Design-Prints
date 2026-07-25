import { NextResponse } from "next/server";
import { authenticate, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { clientIp, rateLimit, resetRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

// The login link is public, so cap guessing attempts. Two buckets: one per IP so
// a single source cannot hammer the endpoint, and one per email so a targeted
// attack on a known account cannot spread across addresses.
const PER_IP = { limit: 10, windowMs: 15 * 60 * 1000 };
const PER_EMAIL = { limit: 6, windowMs: 15 * 60 * 1000 };

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const ip = clientIp(req);
  const ipKey = `login:ip:${ip}`;
  const emailKey = `login:email:${email}`;

  for (const [key, opts] of [
    [ipKey, PER_IP],
    [emailKey, PER_EMAIL]
  ] as const) {
    const { allowed, retryAfterSeconds } = rateLimit(key, opts);
    if (!allowed) {
      const minutes = Math.ceil(retryAfterSeconds / 60);
      return NextResponse.json(
        { error: `Too many sign-in attempts. Please try again in ${minutes} minute(s).` },
        { status: 429, headers: { "retry-after": String(retryAfterSeconds) } }
      );
    }
  }

  const adminId = await authenticate(email, password);
  if (!adminId) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  // A correct password clears the counters so normal use is never penalised.
  resetRateLimit(ipKey);
  resetRateLimit(emailKey);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(adminId), sessionCookieOptions);
  return res;
}
