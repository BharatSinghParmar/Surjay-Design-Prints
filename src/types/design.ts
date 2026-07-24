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
export type DesignFileType = "image" | "pdf";

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

// Accepted upload MIME types → our file type bucket
export const ACCEPTED_UPLOAD_TYPES: Record<string, DesignFileType> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/avif": "image",
  "image/tiff": "image",
  "application/pdf": "pdf"
};

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB per file
