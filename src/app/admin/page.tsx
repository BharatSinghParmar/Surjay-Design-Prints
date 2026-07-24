import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listDesigns, listAttributes } from "@/lib/designs/store";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Design Catalogue", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const [designs, attributes] = await Promise.all([listDesigns(), listAttributes()]);
  return <AdminDashboard admin={admin} initialDesigns={designs} attributes={attributes} />;
}
