import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { findAdminByEmail, listAdmins } from "@/lib/designs/store";
import { verifyPassword } from "./password";
import { SESSION_COOKIE } from "./constants";
import type { AdminPublic } from "@/types/design";

export { SESSION_COOKIE };
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set in production");
    }
    return "dev-insecure-secret-change-me";
  }
  return s;
}

// Signed, self-contained session token: base64url(payload).base64url(hmac)
export function createSessionToken(adminId: string): string {
  const payload = JSON.stringify({ sub: adminId, exp: Date.now() + MAX_AGE_SECONDS * 1000 });
  const body = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      sub?: string;
      exp?: number;
    };
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS
};

/** Validate email+password, returning the admin id on success. */
export async function authenticate(email: string, password: string): Promise<string | null> {
  const admin = await findAdminByEmail(email);
  if (!admin) return null;
  return verifyPassword(password, admin.passwordHash) ? admin.id : null;
}

/** Current signed-in admin (public shape), or null. Reads the request cookie. */
export async function getCurrentAdmin(): Promise<AdminPublic | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const adminId = verifySessionToken(token);
  if (!adminId) return null;
  const admin = (await listAdmins()).find((a) => a.id === adminId);
  return admin ? { id: admin.id, email: admin.email, name: admin.name } : null;
}
