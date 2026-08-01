// ── Testimonials domain types ──────────────────────────────────────────────
// Admin-managed buyer testimonials shown on the home page. The owner adds them
// from /admin/testimonials — text, headshot, company logo and an optional video
// clip — so a new endorsement never needs a code change.
//
// The field set follows what makes B2B social proof credible: a verifiable
// identity (name + role + company), a concrete outcome rather than vague praise,
// and a recorded note that the person agreed to be quoted. There is deliberately
// no star rating — a self-assigned score is an unearned signal, and a named
// quote from a real buyer carries the trust on its own.

export interface Testimonial {
  id: string;
  quote: string;

  // The verifiable-identity triad. Only the name is required — a buyer may be
  // willing to be named without naming their firm.
  authorName: string;
  authorRole?: string;
  company?: string;
  location?: string;

  /** Optional quantified result, e.g. "40,000 m/month, zero shade rejections". */
  outcome?: string;

  photoUrl?: string;
  logoUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;

  /**
   * Permission to publish. Unticked testimonials stay unpublished no matter what
   * `published` says — publishing someone's name and face is not something to
   * get wrong.
   */
  consentGiven: boolean;
  /** How consent was given, e.g. "WhatsApp, 12 Mar 2026". */
  consentNote?: string;

  featured: boolean;
  sortOrder: number;
  published: boolean;

  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/** Everything the public component needs; never expose the consent note. */
export type PublicTestimonial = Omit<
  Testimonial,
  "consentGiven" | "consentNote" | "published" | "createdAt" | "updatedAt"
>;

export function toPublicTestimonial(t: Testimonial): PublicTestimonial {
  const {
    consentGiven: _consentGiven,
    consentNote: _consentNote,
    published: _published,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...rest
  } = t;
  return rest;
}
