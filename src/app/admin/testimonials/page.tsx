import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listTestimonials } from "@/lib/testimonials/store";
import { TestimonialsManager } from "./TestimonialsManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Testimonials", robots: { index: false, follow: false } };

export default async function TestimonialsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return <TestimonialsManager initial={await listTestimonials()} />;
}
