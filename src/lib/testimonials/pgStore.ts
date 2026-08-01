import "server-only";
import type { Testimonial } from "@/types/testimonial";
import type { TestimonialFields } from "./validate";
// The testimonials table is created in the design store's ensureSchema(), which
// is the app's single migration mechanism; the connection is shared too.
import { db, ensureSchema } from "@/lib/designs/pgStore";

type TestimonialRow = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  location: string | null;
  outcome: string | null;
  photo_url: string | null;
  logo_url: string | null;
  video_url: string | null;
  video_poster_url: string | null;
  consent_given: boolean;
  consent_note: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toTestimonial(r: TestimonialRow): Testimonial {
  return {
    id: r.id,
    quote: r.quote,
    authorName: r.author_name,
    authorRole: r.author_role ?? undefined,
    company: r.company ?? undefined,
    location: r.location ?? undefined,
    outcome: r.outcome ?? undefined,
    photoUrl: r.photo_url ?? undefined,
    logoUrl: r.logo_url ?? undefined,
    videoUrl: r.video_url ?? undefined,
    videoPosterUrl: r.video_poster_url ?? undefined,
    consentGiven: r.consent_given,
    consentNote: r.consent_note ?? undefined,
    featured: r.featured,
    sortOrder: r.sort_order,
    published: r.published,
    createdAt: toIso(r.created_at),
    updatedAt: toIso(r.updated_at)
  };
}

export async function pgListTestimonials(opts: {
  publishedOnly?: boolean;
  limit?: number;
}): Promise<Testimonial[]> {
  await ensureSchema();
  const rows = (await db()`
    SELECT * FROM testimonials
    WHERE (${opts.publishedOnly === true} = false OR (published = true AND consent_given = true))
    ORDER BY featured DESC, sort_order ASC, created_at DESC
    LIMIT ${opts.limit ?? 200}`) as TestimonialRow[];
  return rows.map(toTestimonial);
}

export async function pgGetTestimonial(id: string): Promise<Testimonial | null> {
  await ensureSchema();
  const rows = (await db()`SELECT * FROM testimonials WHERE id = ${id}`) as TestimonialRow[];
  return rows[0] ? toTestimonial(rows[0]) : null;
}

export async function pgCreateTestimonial(
  id: string,
  t: TestimonialFields
): Promise<Testimonial> {
  await ensureSchema();
  const rows = (await db()`
    INSERT INTO testimonials
      (id, quote, author_name, author_role, company, location, outcome,
       photo_url, logo_url, video_url, video_poster_url,
       consent_given, consent_note, featured, sort_order, published)
    VALUES (${id}, ${t.quote}, ${t.authorName}, ${t.authorRole ?? null},
            ${t.company ?? null}, ${t.location ?? null}, ${t.outcome ?? null},
            ${t.photoUrl ?? null}, ${t.logoUrl ?? null},
            ${t.videoUrl ?? null}, ${t.videoPosterUrl ?? null},
            ${t.consentGiven}, ${t.consentNote ?? null},
            ${t.featured}, ${t.sortOrder}, ${t.published})
    RETURNING *`) as TestimonialRow[];
  return toTestimonial(rows[0]);
}

/**
 * Optional text columns need three-way handling that COALESCE alone cannot give:
 * absent = keep, null = clear, value = set. `patch` only carries keys the caller
 * actually sent, so `key in patch` distinguishes "clear it" from "leave it".
 */
function textPatch(patch: Partial<TestimonialFields>, key: keyof TestimonialFields) {
  const provided = key in patch;
  const value = (patch[key] ?? null) as string | null;
  return { provided, value };
}

export async function pgUpdateTestimonial(
  id: string,
  patch: Partial<TestimonialFields>
): Promise<Testimonial | null> {
  await ensureSchema();
  const role = textPatch(patch, "authorRole");
  const company = textPatch(patch, "company");
  const location = textPatch(patch, "location");
  const outcome = textPatch(patch, "outcome");
  const photo = textPatch(patch, "photoUrl");
  const logo = textPatch(patch, "logoUrl");
  const video = textPatch(patch, "videoUrl");
  const videoPoster = textPatch(patch, "videoPosterUrl");
  const consentNote = textPatch(patch, "consentNote");

  // Every parameter carries an explicit cast: a bare NULL placeholder leaves
  // Postgres unable to resolve the parameter type, and the query throws.
  const rows = (await db()`
    UPDATE testimonials SET
      quote            = COALESCE(${patch.quote ?? null}::text, quote),
      author_name      = COALESCE(${patch.authorName ?? null}::text, author_name),
      author_role      = CASE WHEN ${role.provided}::boolean THEN ${role.value}::text ELSE author_role END,
      company          = CASE WHEN ${company.provided}::boolean THEN ${company.value}::text ELSE company END,
      location         = CASE WHEN ${location.provided}::boolean THEN ${location.value}::text ELSE location END,
      outcome          = CASE WHEN ${outcome.provided}::boolean THEN ${outcome.value}::text ELSE outcome END,
      photo_url        = CASE WHEN ${photo.provided}::boolean THEN ${photo.value}::text ELSE photo_url END,
      logo_url         = CASE WHEN ${logo.provided}::boolean THEN ${logo.value}::text ELSE logo_url END,
      video_url        = CASE WHEN ${video.provided}::boolean THEN ${video.value}::text ELSE video_url END,
      video_poster_url = CASE WHEN ${videoPoster.provided}::boolean THEN ${videoPoster.value}::text ELSE video_poster_url END,
      consent_note     = CASE WHEN ${consentNote.provided}::boolean THEN ${consentNote.value}::text ELSE consent_note END,
      consent_given    = COALESCE(${patch.consentGiven ?? null}::boolean, consent_given),
      featured         = COALESCE(${patch.featured ?? null}::boolean, featured),
      sort_order       = COALESCE(${patch.sortOrder ?? null}::int, sort_order),
      published        = COALESCE(${patch.published ?? null}::boolean, published),
      updated_at       = now()
    WHERE id = ${id}
    RETURNING *`) as TestimonialRow[];
  return rows[0] ? toTestimonial(rows[0]) : null;
}

export async function pgDeleteTestimonial(id: string): Promise<boolean> {
  await ensureSchema();
  const rows = (await db()`
    DELETE FROM testimonials WHERE id = ${id} RETURNING id`) as { id: string }[];
  return rows.length > 0;
}
