// ── Design Catalogue domain types ─────────────────────────────────────────
// Admin-managed fabric designs shown on the Products page. The attribute set is
// itself admin-configurable (see AttributeDef) so the owner controls which
// "features" exist and which are shown to visitors — no hardcoded spec fields.

export type DesignCategory = "printed" | "dyed" | "custom";

export const DESIGN_CATEGORIES: { id: DesignCategory; label: string; blurb: string }[] = [
  { id: "printed", label: "Printed Fabrics", blurb: "Screen & hand printed fabric designs." },
  { id: "dyed", label: "Dyed Fabrics", blurb: "Bulk dyed fabrics with shade-matched consistency." },
  { id: "custom", label: "Custom Prints", blurb: "Buyer-led custom pattern & print programs." }
];

export function categoryLabel(id: DesignCategory): string {
  return DESIGN_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

// ── Admin-defined attributes ("features") ──────────────────────────────────
export type AttributeInputType = "text" | "number" | "select" | "color";

export interface AttributeDef {
  id: string;
  key: string; // stable machine key, e.g. "color", "length_m"
  label: string; // display label, e.g. "Colour"
  unit?: string; // e.g. "m", "in", "GSM"
  inputType: AttributeInputType;
  options?: string[]; // choices when inputType === "select"
  visible: boolean; // show to public visitors
  showOnCard: boolean; // show as a chip on the catalogue card (vs. detail only)
  sortOrder: number;
}

// ── Designs ────────────────────────────────────────────────────────────────
export type DesignFileType = "image" | "pdf" | "video";

export interface DesignFile {
  url: string; // "/uploads/…" locally, blob URL in production
  type: DesignFileType;
  name: string;
  thumbnailUrl?: string; // preview image (esp. for PDFs)
}

export type DesignStatus = "available" | "sold";

export interface Design {
  id: string;
  title: string;
  category: DesignCategory;
  description?: string;
  files: DesignFile[];
  // attribute key -> value (validated against the current AttributeDef set)
  attributes: Record<string, string>;
  status: DesignStatus;
  featured: boolean;
  sortOrder: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ── Admin accounts (multiple admins) ───────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // scrypt: "<saltHex>:<hashHex>"
  createdAt: string;
}

// Public-safe admin shape (never leak the hash to the client)
export type AdminPublic = Pick<AdminUser, "id" | "email" | "name">;

/**
 * Accepted upload MIME types → our file type bucket, and the extension each is
 * stored with. Single source of truth: the API route, the `accept=` attribute
 * and the error message all derive from this map, so a new format is added in
 * one place.
 *
 * Video is here for testimonial clips. It never goes through
 * /api/admin/upload — Vercel caps a function request body at 4.5 MB at the
 * infrastructure level, well under any real video — so the browser uploads
 * straight to Blob via /api/admin/upload/token instead.
 */
export const UPLOAD_FORMATS: Record<string, { type: DesignFileType; ext: string }> = {
  "image/jpeg": { type: "image", ext: "jpg" },
  "image/png": { type: "image", ext: "png" },
  "image/webp": { type: "image", ext: "webp" },
  "image/avif": { type: "image", ext: "avif" },
  "image/tiff": { type: "image", ext: "tif" },
  "application/pdf": { type: "pdf", ext: "pdf" },
  "video/mp4": { type: "video", ext: "mp4" },
  "video/quicktime": { type: "video", ext: "mov" },
  "video/webm": { type: "video", ext: "webm" }
};

export const ACCEPTED_UPLOAD_TYPES: Record<string, DesignFileType> = Object.fromEntries(
  Object.entries(UPLOAD_FORMATS).map(([mime, f]) => [mime, f.type])
);

/** Value for an `<input type="file" accept="…">`. */
export function acceptAttribute(types: DesignFileType[]): string {
  return Object.entries(UPLOAD_FORMATS)
    .filter(([, f]) => types.includes(f.type))
    .map(([mime]) => mime)
    .join(",");
}

/** Human list for labels and error messages, e.g. "JPG, PNG, PDF". */
export function acceptLabel(types: DesignFileType[]): string {
  const exts = Object.entries(UPLOAD_FORMATS)
    .filter(([, f]) => types.includes(f.type))
    .map(([, f]) => f.ext.toUpperCase());
  return [...new Set(exts)].join(", ");
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB per file

/**
 * Ceiling for a browser→Blob client upload. Higher than MAX_UPLOAD_BYTES
 * because that path does not pass through a serverless function, so the 4.5 MB
 * request-body cap does not apply.
 */
export const MAX_VIDEO_UPLOAD_BYTES = 200 * 1024 * 1024; // 200 MB
