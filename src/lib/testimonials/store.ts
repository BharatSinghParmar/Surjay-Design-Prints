import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { toPublicTestimonial, type PublicTestimonial, type Testimonial } from "@/types/testimonial";
import { BLOB_ENABLED, readBlobJson, writeBlobJson } from "@/lib/designs/blobStore";
import { PG_ENABLED } from "@/lib/designs/pgStore";
import {
  pgListTestimonials,
  pgGetTestimonial,
  pgCreateTestimonial,
  pgUpdateTestimonial,
  pgDeleteTestimonial
} from "./pgStore";
import type { TestimonialFields } from "./validate";

/**
 * Data-access layer for admin-managed testimonials — the same three-way driver
 * dispatch as the design catalogue: Postgres when a connection string is set,
 * else Vercel Blob, else local JSON under `.data/` for development.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = "testimonials.json";

async function readAll(): Promise<Testimonial[]> {
  if (BLOB_ENABLED) return readBlobJson<Testimonial[]>(FILE, []);
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, FILE), "utf8")) as Testimonial[];
  } catch {
    return [];
  }
}

async function writeAll(data: Testimonial[]): Promise<void> {
  if (BLOB_ENABLED) return writeBlobJson(FILE, data);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, FILE), JSON.stringify(data, null, 2), "utf8");
}

function nowIso(): string {
  return new Date().toISOString();
}

function byPlacement(a: Testimonial, b: Testimonial): number {
  return (
    Number(b.featured) - Number(a.featured) ||
    a.sortOrder - b.sortOrder ||
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function listTestimonials(
  opts: { publishedOnly?: boolean; limit?: number } = {}
): Promise<Testimonial[]> {
  if (PG_ENABLED) return pgListTestimonials(opts);
  let all = await readAll();
  // Consent is enforced here as well as in the query: an unpublished-but-
  // consented record and a published-without-consent record must both stay off
  // the public page.
  if (opts.publishedOnly) all = all.filter((t) => t.published && t.consentGiven);
  all.sort(byPlacement);
  return opts.limit ? all.slice(0, opts.limit) : all;
}

/**
 * Read path for the public home page.
 *
 * Returns the public shape, so the consent note and the draft flags never enter
 * the rendering scope at all — a stray serialization of the record cannot leak
 * what was never passed to it.
 *
 * Never throws: a storage outage should drop the testimonials section, not 500
 * the whole page.
 */
export async function listPublishedTestimonials(limit = 6): Promise<PublicTestimonial[]> {
  try {
    return (await listTestimonials({ publishedOnly: true, limit })).map(toPublicTestimonial);
  } catch {
    return [];
  }
}

export async function getTestimonial(id: string): Promise<Testimonial | null> {
  if (PG_ENABLED) return pgGetTestimonial(id);
  return (await readAll()).find((t) => t.id === id) ?? null;
}

export async function createTestimonial(input: TestimonialFields): Promise<Testimonial> {
  const id = crypto.randomUUID();
  if (PG_ENABLED) return pgCreateTestimonial(id, input);
  const all = await readAll();
  const testimonial: Testimonial = {
    ...input,
    id,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  all.push(testimonial);
  await writeAll(all);
  return testimonial;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<TestimonialFields>
): Promise<Testimonial | null> {
  if (PG_ENABLED) return pgUpdateTestimonial(id, patch);
  const all = await readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx < 0) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: nowIso() };
  await writeAll(all);
  return all[idx];
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  if (PG_ENABLED) return pgDeleteTestimonial(id);
  const all = await readAll();
  const next = all.filter((t) => t.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
