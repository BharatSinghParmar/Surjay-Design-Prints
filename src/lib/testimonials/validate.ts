import type { Testimonial } from "@/types/testimonial";

export type TestimonialFields = Omit<Testimonial, "id" | "createdAt" | "updatedAt">;

/** Trimmed string, or undefined when the caller sent nothing usable. */
function optionalText(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text === "" ? undefined : text;
}

/**
 * Validate/normalize a testimonial payload, mirroring `parseDesign`.
 * `partial` = true for PATCH (only the provided fields come back); false for
 * create (requires quote + author, fills defaults).
 */
export function parseTestimonial(
  body: unknown,
  partial: boolean
): { error?: string; value: Partial<TestimonialFields> } {
  const b = (body ?? {}) as Record<string, unknown>;
  const out: Partial<TestimonialFields> = {};

  if (!partial || b.quote !== undefined) {
    const quote = typeof b.quote === "string" ? b.quote.trim() : "";
    if (!quote) return { error: "A quote is required.", value: {} };
    out.quote = quote;
  }
  if (!partial || b.authorName !== undefined) {
    const authorName = typeof b.authorName === "string" ? b.authorName.trim() : "";
    if (!authorName) return { error: "The author's name is required.", value: {} };
    out.authorName = authorName;
  }

  for (const key of [
    "authorRole",
    "company",
    "location",
    "outcome",
    "photoUrl",
    "logoUrl",
    "videoUrl",
    "videoPosterUrl",
    "consentNote"
  ] as const) {
    // `null` clears a field; omitting it leaves the stored value alone.
    if (b[key] !== undefined) out[key] = optionalText(b[key]);
  }

  if (b.consentGiven !== undefined) out.consentGiven = Boolean(b.consentGiven);
  if (b.featured !== undefined) out.featured = Boolean(b.featured);
  if (b.published !== undefined) out.published = Boolean(b.published);
  if (b.sortOrder !== undefined) out.sortOrder = Number(b.sortOrder) || 0;

  // Publishing someone's words under their name needs their permission on
  // record. On PATCH the stored values are not visible here, so the merged
  // check lives in the route; the read path filters on consent regardless, so
  // an unconsented record can never reach the public page either way.
  if (!partial && out.published && !out.consentGiven) {
    return { error: "Record the buyer's consent before publishing.", value: {} };
  }

  if (!partial) {
    out.consentGiven ??= false;
    out.featured ??= false;
    out.published ??= false;
    out.sortOrder ??= 0;
  }
  return { value: out };
}
