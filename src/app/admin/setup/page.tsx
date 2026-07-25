import { redirect } from "next/navigation";
import { needsSetup } from "@/lib/auth/admins";
import { SetupForm } from "./SetupForm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Setup",
  robots: { index: false, follow: false }
};

export default async function AdminSetupPage() {
  // Once the panel has an owner there is nothing to set up.
  if (!(await needsSetup())) redirect("/admin/login");
  return <SetupForm requiresToken={Boolean(process.env.ADMIN_SETUP_TOKEN)} />;
}
