import "server-only";
import { put, list, del } from "@vercel/blob";

/**
 * Vercel Blob backend for the design catalogue.
 *
 * The catalogue is small (tens to hundreds of designs), so its records live as
 * JSON documents in Blob alongside the uploaded design files. That keeps
 * production to a single service — no separate database to provision.
 *
 * Admin credentials are deliberately NOT stored here: Blob objects are publicly
 * readable, so password hashes belong in environment variables instead
 * (see src/lib/auth/admins.ts).
 */

export const BLOB_ENABLED = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const PREFIX = "catalogue/";

/** Read a JSON document, or `fallback` when it does not exist yet. */
export async function readBlobJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const { blobs } = await list({ prefix: `${PREFIX}${name}`, limit: 1 });
    const blob = blobs.find((b) => b.pathname === `${PREFIX}${name}`);
    if (!blob) return fallback;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** Write a JSON document at a stable pathname, overwriting in place. */
export async function writeBlobJson(name: string, data: unknown): Promise<void> {
  await put(`${PREFIX}${name}`, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0
  });
}

/** Store an uploaded design file and return its public URL. */
export async function putBlobFile(
  filename: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const { url } = await put(`uploads/${filename}`, body, {
    access: "public",
    contentType,
    addRandomSuffix: false
  });
  return url;
}

/** Best-effort removal of an uploaded file. */
export async function deleteBlobFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // already gone, or not a blob URL — nothing to do
  }
}
