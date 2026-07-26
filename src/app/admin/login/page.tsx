import { needsSetup } from "@/lib/auth/admins";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false }
};

export default async function AdminLoginPage() {
  // The sign-up link is surfaced only while no account exists, so nobody browsing
  // the site is ever pointed at it. Once the panel has an owner it disappears and
  // /admin/signup requires being signed in.
  return <LoginForm showFirstRunLink={await needsSetup()} />;
}
