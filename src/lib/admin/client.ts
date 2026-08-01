"use client";

import { upload } from "@vercel/blob/client";
import type { Design, AttributeDef, DesignFile } from "@/types/design";
import type { Testimonial } from "@/types/testimonial";

async function req<T>(url: string, method: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(url, {
    method,
    headers: isForm || body === undefined ? undefined : { "content-type": "application/json" },
    body: isForm ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}

/** Cached per page load — the answer is fixed for a deployment. */
let clientUploadEnabled: boolean | null = null;

async function canClientUpload(): Promise<boolean> {
  if (clientUploadEnabled === null) {
    const res = await req<{ clientUploadEnabled: boolean }>("/api/admin/upload/token", "GET");
    clientUploadEnabled = res.clientUploadEnabled;
  }
  return clientUploadEnabled;
}

/**
 * Send a video straight from the browser to Vercel Blob.
 *
 * It cannot go through /api/admin/upload: Vercel caps a function's request body
 * at 4.5 MB at the infrastructure level, and any usable clip is bigger. `upload`
 * asks our token route for a short-lived credential, then PUTs the file to Blob
 * directly, so the function never sees the bytes.
 *
 * Development has no Blob token, so it falls back to the ordinary upload route —
 * fine locally, where nothing sits between the browser and the dev server to
 * impose a body limit. Which path applies is asked up front rather than inferred
 * from a failure: `upload()` reports every problem as the same generic "Failed
 * to retrieve the client token", so the real reason is not recoverable from it.
 */
async function uploadVideo(file: File): Promise<string> {
  if (await canClientUpload()) {
    const blob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload/token"
    });
    return blob.url;
  }
  const fd = new FormData();
  fd.append("files", file);
  const { files } = await req<{ files: DesignFile[] }>("/api/admin/upload", "POST", fd);
  return files[0].url;
}

export const adminApi = {
  uploadFiles: (fd: FormData) => req<{ files: DesignFile[] }>("/api/admin/upload", "POST", fd),
  uploadVideo,
  createTestimonial: (t: Partial<Testimonial>) =>
    req<{ testimonial: Testimonial }>("/api/admin/testimonials", "POST", t),
  updateTestimonial: (id: string, t: Partial<Testimonial>) =>
    req<{ testimonial: Testimonial }>(`/api/admin/testimonials/${id}`, "PATCH", t),
  deleteTestimonial: (id: string) => req<{ ok: true }>(`/api/admin/testimonials/${id}`, "DELETE"),
  createDesign: (d: Partial<Design>) => req<{ design: Design }>("/api/admin/designs", "POST", d),
  updateDesign: (id: string, d: Partial<Design>) =>
    req<{ design: Design }>(`/api/admin/designs/${id}`, "PATCH", d),
  deleteDesign: (id: string) => req<{ ok: true }>(`/api/admin/designs/${id}`, "DELETE"),
  createAttribute: (a: Partial<AttributeDef>) =>
    req<{ attribute: AttributeDef }>("/api/admin/attributes", "POST", a),
  updateAttribute: (id: string, a: Partial<AttributeDef>) =>
    req<{ attribute: AttributeDef }>(`/api/admin/attributes/${id}`, "PATCH", a),
  deleteAttribute: (id: string) => req<{ ok: true }>(`/api/admin/attributes/${id}`, "DELETE"),
  logout: () => req<{ ok: true }>("/api/admin/logout", "POST")
};
