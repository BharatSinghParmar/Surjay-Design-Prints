import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { getAdmins } from "@/lib/auth/admins";
import { AdminsManager } from "./AdminsManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Team", robots: { index: false, follow: false } };

export default async function AdminsPage() {
  const current = await getCurrentAdmin();
  if (!current) redirect("/admin/login");
  const admins = await getAdmins();
  return (
    <AdminsManager
      currentId={current.id}
      initial={admins.map((a) => ({
        id: a.id,
        email: a.email,
        name: a.name,
        createdAt: a.createdAt
      }))}
    />
  );
}
