import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getAdmins } from "@/lib/auth/admins";
import { PG_ENABLED, ensureSchema } from "@/lib/designs/pgStore";
import { BLOB_ENABLED } from "@/lib/designs/blobStore";
import { checkRateLimit, clearAttempts, recordFailure } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Setup diagnostics for the admin catalogue: reports which storage drivers are
 * active so a misconfiguration is obvious instead of surfacing as a vague error.
 *
 * Returns booleans and counts only — never a connection string, token or hash.
 *
 * Readable without signing in *only while no admin is configured*, i.e. during
 * first-time setup when there is nothing to protect. Once ADMIN_USERS is set it
 * requires a valid session.
 */
export async function GET() {
  const admins = await getAdmins();
  const configured = admins.length > 0;

  if (configured && !(await getCurrentAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let postgres: "not configured" | "ready" | "error" = "not configured";
  let postgresError: string | undefined;
  if (PG_ENABLED) {
    try {
      await ensureSchema();
      postgres = "ready";
    } catch (err) {
      postgres = "error";
      postgresError = err instanceof Error ? err.message : String(err);
    }
  }

  const storage = PG_ENABLED
    ? "postgres (records) + blob (files)"
    : BLOB_ENABLED
      ? "blob (records + files)"
      : "local filesystem — will not persist in production";

  // Live round-trip through the rate limiter. An in-memory counter silently does
  // nothing on serverless (each request may hit a different instance), so prove
  // the database-backed path actually works rather than assuming it.
  let rateLimiter: "database" | "in-memory only" | "error" = "in-memory only";
  let rateLimiterError: string | undefined;
  if (PG_ENABLED) {
    try {
      const probe = `selftest:${Math.random().toString(36).slice(2)}`;
      await recordFailure(probe, { limit: 1, windowMs: 60_000 });
      const after = await checkRateLimit(probe, { limit: 1, windowMs: 60_000 });
      await clearAttempts(probe);
      rateLimiter = after.allowed ? "in-memory only" : "database";
    } catch (err) {
      rateLimiter = "error";
      rateLimiterError = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    ready: Boolean(process.env.AUTH_SECRET) && configured && postgres === "ready" && BLOB_ENABLED,
    authSecretSet: Boolean(process.env.AUTH_SECRET),
    adminAccounts: admins.length,
    adminSource: process.env.ADMIN_USERS ? "ADMIN_USERS env" : "local file (dev only)",
    postgres,
    ...(postgresError ? { postgresError } : {}),
    blobConfigured: BLOB_ENABLED,
    activeStorage: storage,
    rateLimiter,
    ...(rateLimiterError ? { rateLimiterError } : {})
  });
}
