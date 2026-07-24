"use client";

import type { Design, AttributeDef, DesignFile } from "@/types/design";

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

export const adminApi = {
  uploadFiles: (fd: FormData) => req<{ files: DesignFile[] }>("/api/admin/upload", "POST", fd),
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
