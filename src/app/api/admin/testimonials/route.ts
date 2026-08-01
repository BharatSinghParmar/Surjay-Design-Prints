import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listTestimonials, createTestimonial } from "@/lib/testimonials/store";
import { parseTestimonial, type TestimonialFields } from "@/lib/testimonials/validate";

export const runtime = "nodejs";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ testimonials: await listTestimonials() });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { error, value } = parseTestimonial(body, false);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const testimonial = await createTestimonial(value as TestimonialFields);
  return NextResponse.json({ testimonial }, { status: 201 });
}
