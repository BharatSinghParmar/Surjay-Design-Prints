import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Design, AttributeDef, AdminUser, DesignCategory } from "@/types/design";
import { DEFAULT_ATTRIBUTES } from "./seed";

/**
 * Data-access layer for the admin design catalogue.
 *
 * Driver = local JSON files under `.data/` (git-ignored). This runs in `next dev`
 * and `next start` locally. In production on Vercel (ephemeral filesystem) this
 * module is the single swap point: reimplement the same async functions against
 * Neon/Postgres + Vercel Blob and every caller keeps working unchanged.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILES = {
  designs: path.join(DATA_DIR, "designs.json"),
  attributes: path.join(DATA_DIR, "attributes.json"),
  admins: path.join(DATA_DIR, "admins.json")
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Serverless hosts (Vercel) have a read-only, ephemeral filesystem, so this
 * local driver cannot persist there. Writes must never take down a page that
 * only reads — notably the public Products page. Swallow write failures and let
 * callers fall back to defaults until a real database driver is wired in.
 */
async function tryWriteJson(file: string, data: unknown): Promise<void> {
  try {
    await writeJson(file, data);
  } catch {
    // read-only filesystem — non-fatal for reads
  }
}

export function newId(): string {
  return crypto.randomUUID();
}

function nowIso(): string {
  return new Date().toISOString();
}

// ── Attributes ─────────────────────────────────────────────────────────────
export async function listAttributes(): Promise<AttributeDef[]> {
  const attrs = await readJson<AttributeDef[] | null>(FILES.attributes, null);
  if (!attrs) {
    await tryWriteJson(FILES.attributes, DEFAULT_ATTRIBUTES);
    return [...DEFAULT_ATTRIBUTES];
  }
  return attrs.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function saveAttributes(attrs: AttributeDef[]): Promise<void> {
  await writeJson(FILES.attributes, attrs);
}

export async function upsertAttribute(attr: AttributeDef): Promise<AttributeDef> {
  const attrs = await listAttributes();
  const idx = attrs.findIndex((a) => a.id === attr.id);
  if (idx >= 0) attrs[idx] = attr;
  else attrs.push(attr);
  await saveAttributes(attrs);
  return attr;
}

export async function deleteAttribute(id: string): Promise<void> {
  const attrs = (await listAttributes()).filter((a) => a.id !== id);
  await saveAttributes(attrs);
}

// ── Designs ────────────────────────────────────────────────────────────────
interface ListOpts {
  category?: DesignCategory;
  includeSold?: boolean; // default true (sold items stay visible with a badge)
}

export async function listDesigns(opts: ListOpts = {}): Promise<Design[]> {
  let designs = await readJson<Design[]>(FILES.designs, []);
  if (opts.category) designs = designs.filter((d) => d.category === opts.category);
  if (opts.includeSold === false) designs = designs.filter((d) => d.status !== "sold");
  return designs.sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      a.sortOrder - b.sortOrder ||
      b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getDesign(id: string): Promise<Design | null> {
  const designs = await readJson<Design[]>(FILES.designs, []);
  return designs.find((d) => d.id === id) ?? null;
}

type DesignInput = Omit<Design, "id" | "createdAt" | "updatedAt">;

export async function createDesign(input: DesignInput): Promise<Design> {
  const designs = await readJson<Design[]>(FILES.designs, []);
  const design: Design = { ...input, id: newId(), createdAt: nowIso(), updatedAt: nowIso() };
  designs.push(design);
  await writeJson(FILES.designs, designs);
  return design;
}

export async function updateDesign(
  id: string,
  patch: Partial<DesignInput>
): Promise<Design | null> {
  const designs = await readJson<Design[]>(FILES.designs, []);
  const idx = designs.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  designs[idx] = { ...designs[idx], ...patch, updatedAt: nowIso() };
  await writeJson(FILES.designs, designs);
  return designs[idx];
}

export async function deleteDesign(id: string): Promise<boolean> {
  const designs = await readJson<Design[]>(FILES.designs, []);
  const next = designs.filter((d) => d.id !== id);
  if (next.length === designs.length) return false;
  await writeJson(FILES.designs, next);
  return true;
}

// ── Admin users ────────────────────────────────────────────────────────────
export async function listAdmins(): Promise<AdminUser[]> {
  return readJson<AdminUser[]>(FILES.admins, []);
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const admins = await listAdmins();
  const target = email.trim().toLowerCase();
  return admins.find((a) => a.email.toLowerCase() === target) ?? null;
}

export async function createAdmin(admin: AdminUser): Promise<void> {
  const admins = await listAdmins();
  admins.push(admin);
  await writeJson(FILES.admins, admins);
}

export async function countAdmins(): Promise<number> {
  return (await listAdmins()).length;
}
