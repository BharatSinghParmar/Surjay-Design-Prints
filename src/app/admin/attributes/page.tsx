import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/session";
import { listAttributes } from "@/lib/designs/store";
import { AttributesManager } from "./AttributesManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Features", robots: { index: false, follow: false } };

export default async function AttributesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return <AttributesManager initial={await listAttributes()} />;
}
