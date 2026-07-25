import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getAdmins } from "@/lib/auth/admins";
import { PG_ENABLED, ensureSchema } from "@/lib/designs/pgStore";
import { BLOB_ENABLED } from "@/lib/designs/blobStore";

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

  return NextResponse.json({
    ready: Boolean(process.env.AUTH_SECRET) && configured && postgres === "ready" && BLOB_ENABLED,
    authSecretSet: Boolean(process.env.AUTH_SECRET),
    adminAccounts: admins.length,
    adminSource: process.env.ADMIN_USERS ? "ADMIN_USERS env" : "local file (dev only)",
    postgres,
    ...(postgresError ? { postgresError } : {}),
    blobConfigured: BLOB_ENABLED,
    activeStorage: storage
  });
}
