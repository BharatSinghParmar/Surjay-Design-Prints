import type { DesignCategory, DesignFile, DesignStatus } from "@/types/design";
import { DESIGN_CATEGORIES } from "@/types/design";

const CATEGORY_IDS = new Set<string>(DESIGN_CATEGORIES.map((c) => c.id));

export type DesignFields = {
  title: string;
  category: DesignCategory;
  description: string;
  files: DesignFile[];
  attributes: Record<string, string>;
  status: DesignStatus;
  featured: boolean;
  sortOrder: number;
};

/**
 * Validate/normalize a design payload. `partial` = true for PATCH (only provided
 * fields are returned); false for create (requires title + category, fills defaults).
 */
export function parseDesign(
  body: unknown,
  partial: boolean
): { error?: string; value: Partial<DesignFields> } {
  const b = (body ?? {}) as Record<string, unknown>;
  const out: Partial<DesignFields> = {};

  if (!partial || b.title !== undefined) {
    const title = typeof b.title === "string" ? b.title.trim() : "";
    if (!title) return { error: "Title is required.", value: {} };
    out.title = title;
  }
  if (!partial || b.category !== undefined) {
    const category = String(b.category);
    if (!CATEGORY_IDS.has(category)) return { error: "A valid category is required.", value: {} };
    out.category = category as DesignCategory;
  }
  if (b.description !== undefined) out.description = String(b.description ?? "");
  if (b.files !== undefined) {
    if (!Array.isArray(b.files)) return { error: "files must be an array.", value: {} };
    out.files = (b.files as Record<string, unknown>[]).map((f) => ({
      url: String(f.url ?? ""),
      type: f.type === "pdf" ? "pdf" : "image",
      name: String(f.name ?? ""),
      thumbnailUrl: f.thumbnailUrl ? String(f.thumbnailUrl) : undefined
    }));
  }
  if (b.attributes !== undefined && b.attributes && typeof b.attributes === "object") {
    const attrs: Record<string, string> = {};
    for (const [k, v] of Object.entries(b.attributes as Record<string, unknown>)) {
      if (v !== undefined && v !== null && String(v).trim() !== "") attrs[k] = String(v).trim();
    }
    out.attributes = attrs;
  }
  if (b.status !== undefined) out.status = b.status === "sold" ? "sold" : "available";
  if (b.featured !== undefined) out.featured = Boolean(b.featured);
  if (b.sortOrder !== undefined) out.sortOrder = Number(b.sortOrder) || 0;

  if (!partial) {
    out.description ??= "";
    out.files ??= [];
    out.attributes ??= {};
    out.status ??= "available";
    out.featured ??= false;
    out.sortOrder ??= 0;
  }
  return { value: out };
}
