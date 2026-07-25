import { NextResponse } from "next/server";
import { addAdmin, needsSetup } from "@/lib/auth/admins";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * First-run setup: creates the very first admin account from the browser, so the
 * panel needs no CLI step and no environment variables.
 *
 * Only works while zero admins exist. Once the panel has an owner this route
 * refuses, and further accounts are added from inside the panel by a signed-in
 * admin. An optional ADMIN_SETUP_TOKEN adds a shared secret to the same check.
 */

export async function GET() {
  return NextResponse.json({ needsSetup: await needsSetup() });
}

export async function POST(req: Request) {
  if (!(await needsSetup())) {
    return NextResponse.json(
      { error: "Setup has already been completed. Please sign in instead." },
      { status: 409 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = String(body.email ?? "").trim();
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "");
  const token = String(body.token ?? "");

  const requiredToken = process.env.ADMIN_SETUP_TOKEN;
  if (requiredToken && token !== requiredToken) {
    return NextResponse.json({ error: "Invalid setup token." }, { status: 403 });
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  let admin;
  try {
    admin = await addAdmin({ email, name, passwordHash: hashPassword(password) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create the account." },
      { status: 409 }
    );
  }

  // Sign the new owner straight in.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(admin.id), sessionCookieOptions);
  return res;
}
