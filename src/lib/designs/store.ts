import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Design, AttributeDef, DesignCategory } from "@/types/design";
import { DEFAULT_ATTRIBUTES } from "./seed";
import { BLOB_ENABLED, readBlobJson, writeBlobJson } from "./blobStore";
import {
  PG_ENABLED,
  pgListAttributes,
  pgUpsertAttribute,
  pgDeleteAttribute,
  pgListDesigns,
  pgGetDesign,
  pgCreateDesign,
  pgUpdateDesign,
  pgDeleteDesign
} from "./pgStore";

/**
 * Data-access layer for the admin design catalogue.
 *
 * Two interchangeable drivers behind one interface:
 *   - Vercel Blob, when BLOB_READ_WRITE_TOKEN is set (production)
 *   - local JSON files under `.data/` (git-ignored) for development
 *
 * Callers never know which is active.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILES = {
  designs: "designs.json",
  attributes: "attributes.json",
  admins: "admins.json"
} as const;

type StoreFile = (typeof FILES)[keyof typeof FILES];

async function readJson<T>(name: StoreFile, fallback: T): Promise<T> {
  if (BLOB_ENABLED) return readBlobJson<T>(name, fallback);
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, name), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(name: StoreFile, data: unknown): Promise<void> {
  if (BLOB_ENABLED) return writeBlobJson(name, data);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, name), JSON.stringify(data, null, 2), "utf8");
}

/**
 * Writes must never take down a page that only reads — notably the public
 * Products page, which would otherwise 500 on a read-only serverless filesystem.
 */
async function tryWriteJson(name: StoreFile, data: unknown): Promise<void> {
  try {
    await writeJson(name, data);
  } catch {
    // storage unavailable — non-fatal for reads
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
  if (PG_ENABLED) return pgListAttributes();
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
  if (PG_ENABLED) return pgUpsertAttribute(attr);
  const attrs = await listAttributes();
  const idx = attrs.findIndex((a) => a.id === attr.id);
  if (idx >= 0) attrs[idx] = attr;
  else attrs.push(attr);
  await saveAttributes(attrs);
  return attr;
}

export async function deleteAttribute(id: string): Promise<void> {
  if (PG_ENABLED) return pgDeleteAttribute(id);
  const attrs = (await listAttributes()).filter((a) => a.id !== id);
  await saveAttributes(attrs);
}

// ── Designs ────────────────────────────────────────────────────────────────
interface ListOpts {
  category?: DesignCategory;
  includeSold?: boolean; // default true (sold items stay visible with a badge)
  limit?: number;
}

export async function listDesigns(opts: ListOpts = {}): Promise<Design[]> {
  if (PG_ENABLED) return pgListDesigns(opts);
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
  if (PG_ENABLED) return pgGetDesign(id);
  const designs = await readJson<Design[]>(FILES.designs, []);
  return designs.find((d) => d.id === id) ?? null;
}

type DesignInput = Omit<Design, "id" | "createdAt" | "updatedAt">;

export async function createDesign(input: DesignInput): Promise<Design> {
  if (PG_ENABLED) return pgCreateDesign(newId(), input);
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
  if (PG_ENABLED) return pgUpdateDesign(id, patch);
  const designs = await readJson<Design[]>(FILES.designs, []);
  const idx = designs.findIndex((d) => d.id === id);
  if (idx < 0) return null;
  designs[idx] = { ...designs[idx], ...patch, updatedAt: nowIso() };
  await writeJson(FILES.designs, designs);
  return designs[idx];
}

export async function deleteDesign(id: string): Promise<boolean> {
  if (PG_ENABLED) return pgDeleteDesign(id);
  const designs = await readJson<Design[]>(FILES.designs, []);
  const next = designs.filter((d) => d.id !== id);
  if (next.length === designs.length) return false;
  await writeJson(FILES.designs, next);
  return true;
}

// Admin accounts live in src/lib/auth/admins.ts — they are an auth concern, and
// must never be written to Blob, which is publicly readable.
