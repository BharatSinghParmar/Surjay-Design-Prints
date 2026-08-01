import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import {
  getTestimonial,
  updateTestimonial,
  deleteTestimonial
} from "@/lib/testimonials/store";
import { parseTestimonial } from "@/lib/testimonials/validate";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { error, value } = parseTestimonial(body, true);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const id = (await params).id;
  const current = await getTestimonial(id);
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Consent is checked against the record as it will be after the patch, so
  // ticking "published" on a testimonial with no consent on file is rejected
  // with a clear message rather than saving and silently never rendering.
  const published = value.published ?? current.published;
  const consentGiven = value.consentGiven ?? current.consentGiven;
  if (published && !consentGiven) {
    return NextResponse.json(
      { error: "Record the buyer's consent before publishing." },
      { status: 400 }
    );
  }

  const testimonial = await updateTestimonial(id, value);
  if (!testimonial) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ testimonial });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ok = await deleteTestimonial((await params).id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
