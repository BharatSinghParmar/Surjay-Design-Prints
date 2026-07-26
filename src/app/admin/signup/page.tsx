import { redirect } from "next/navigation";
import { needsSetup } from "@/lib/auth/admins";
import { getCurrentAdmin } from "@/lib/auth/session";
import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Signup",
  robots: { index: false, follow: false }
};

/**
 * Create an admin account.
 *
 * This URL is unlisted, but an unlisted URL is not a control on its own, so
 * access is decided by state rather than by secrecy:
 *
 *   - no account exists → open, so the owner can claim the panel once
 *   - account exists    → signed-in admins only; everyone else goes to login
 */
export default async function AdminSignupPage() {
  const firstRun = await needsSetup();

  if (!firstRun) {
    const current = await getCurrentAdmin();
    if (!current) redirect("/admin/login");
    return <SignupForm mode="authenticated" invitedBy={current.name} />;
  }

  return <SignupForm mode="first-run" requiresToken={Boolean(process.env.ADMIN_SETUP_TOKEN)} />;
}
