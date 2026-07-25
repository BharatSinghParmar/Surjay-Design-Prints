import { redirect } from "next/navigation";
import { needsSetup } from "@/lib/auth/admins";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false }
};

export default async function AdminLoginPage() {
  // Decided on the server so a fresh install goes straight to account creation,
  // with no redirect flash and no login form that no credentials could satisfy.
  if (await needsSetup()) redirect("/admin/setup");
  return <LoginForm />;
}
