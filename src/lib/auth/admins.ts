import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { AdminUser } from "@/types/design";
import {
  PG_ENABLED,
  pgListAdmins,
  pgCountAdmins,
  pgCreateAdmin,
  pgDeleteAdmin,
  pgUpdateAdminPassword,
  pgGetSetting,
  pgSetSettingIfAbsent
} from "@/lib/designs/pgStore";

/**
 * Admin accounts, in priority order:
 *
 *  1. Postgres — the normal case. Accounts are created from the app itself
 *     (/admin/signup on first run, then the Team page), so no CLI step and no
 *     environment variable is needed. Safe for password hashes because, unlike
 *     Blob, the database is not publicly readable.
 *  2. ADMIN_USERS env var — optional override, kept for environments without a
 *     database.
 *  3. .data/admins.json — local development fallback.
 */

const SECRET_KEY = "session_secret";

function stableId(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 32);
}

function fromEnv(): AdminUser[] {
  const raw = process.env.ADMIN_USERS;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<{
      email?: string;
      name?: string;
      hash?: string;
      passwordHash?: string;
    }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((a) => a.email && (a.hash || a.passwordHash))
      .map((a) => ({
        id: stableId(a.email as string),
        email: (a.email as string).trim().toLowerCase(),
        name: a.name?.trim() || (a.email as string).split("@")[0],
        passwordHash: (a.hash || a.passwordHash) as string,
        createdAt: "1970-01-01T00:00:00.000Z"
      }));
  } catch {
    console.error("[auth] ADMIN_USERS is not valid JSON — ignoring it");
    return [];
  }
}

async function fromFile(): Promise<AdminUser[]> {
  try {
    const file = path.join(process.cwd(), ".data", "admins.json");
    return JSON.parse(await fs.readFile(file, "utf8")) as AdminUser[];
  } catch {
    return [];
  }
}

async function appendToFile(admin: AdminUser): Promise<void> {
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "admins.json");
  const existing = await fromFile();
  if (existing.some((a) => a.email.toLowerCase() === admin.email.toLowerCase())) {
    throw new Error("An admin with that email already exists.");
  }
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify([...existing, admin], null, 2), "utf8");
}

export async function getAdmins(): Promise<AdminUser[]> {
  if (PG_ENABLED) {
    const dbAdmins = await pgListAdmins();
    if (dbAdmins.length) return dbAdmins;
  }
  const envAdmins = fromEnv();
  if (envAdmins.length) return envAdmins;
  return fromFile();
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const target = email.trim().toLowerCase();
  return (await getAdmins()).find((a) => a.email.toLowerCase() === target) ?? null;
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  return (await getAdmins()).find((a) => a.id === id) ?? null;
}

export async function countAdmins(): Promise<number> {
  if (PG_ENABLED) {
    const count = await pgCountAdmins();
    if (count > 0) return count;
  }
  return (await getAdmins()).length;
}

/** True when nobody has claimed the panel yet, so first-run setup should open. */
export async function needsSetup(): Promise<boolean> {
  return (await countAdmins()) === 0;
}

export async function addAdmin(input: {
  email: string;
  name: string;
  passwordHash: string;
}): Promise<AdminUser> {
  const admin: AdminUser = {
    id: stableId(input.email),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString()
  };

  if (PG_ENABLED) {
    const created = await pgCreateAdmin(admin);
    if (!created) throw new Error("An admin with that email already exists.");
    return admin;
  }
  await appendToFile(admin);
  return admin;
}

export async function removeAdmin(id: string): Promise<boolean> {
  if (PG_ENABLED) return pgDeleteAdmin(id);
  const existing = await fromFile();
  const next = existing.filter((a) => a.id !== id);
  if (next.length === existing.length) return false;
  const file = path.join(process.cwd(), ".data", "admins.json");
  await fs.writeFile(file, JSON.stringify(next, null, 2), "utf8");
  return true;
}

export async function changeAdminPassword(id: string, passwordHash: string): Promise<boolean> {
  if (PG_ENABLED) return pgUpdateAdminPassword(id, passwordHash);
  const existing = await fromFile();
  const idx = existing.findIndex((a) => a.id === id);
  if (idx < 0) return false;
  existing[idx] = { ...existing[idx], passwordHash };
  const file = path.join(process.cwd(), ".data", "admins.json");
  await fs.writeFile(file, JSON.stringify(existing, null, 2), "utf8");
  return true;
}

/**
 * Secret used to sign session cookies.
 *
 * Prefers AUTH_SECRET when set. Otherwise generates one on first run and stores
 * it in the database, so production needs no manual secret. Sessions survive
 * redeploys because the value is persisted rather than regenerated per instance.
 */
export async function getSessionSecret(): Promise<string> {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;

  if (PG_ENABLED) {
    const existing = await pgGetSetting(SECRET_KEY);
    if (existing) return existing;
    return pgSetSettingIfAbsent(SECRET_KEY, crypto.randomBytes(32).toString("base64"));
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "No session secret available: set AUTH_SECRET or configure a database."
    );
  }
  return "dev-insecure-secret-change-me";
}
