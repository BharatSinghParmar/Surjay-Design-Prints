import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { AdminUser } from "@/types/design";

/**
 * Admin accounts.
 *
 * In production these come from the ADMIN_USERS environment variable, never from
 * Blob storage: Blob objects are publicly readable, and password hashes must not
 * be. Environment variables are encrypted at rest by the host.
 *
 * ADMIN_USERS is a JSON array — generate it with:
 *   node scripts/create-admin.mjs
 *
 *   [{ "email": "owner@example.com", "name": "Ajay Soni", "hash": "<salt>:<hash>" }]
 *
 * Locally, if ADMIN_USERS is unset, accounts fall back to .data/admins.json so
 * development keeps working with no configuration.
 */

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
    console.error("[auth] ADMIN_USERS is not valid JSON — no admins loaded from env");
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

export async function getAdmins(): Promise<AdminUser[]> {
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
