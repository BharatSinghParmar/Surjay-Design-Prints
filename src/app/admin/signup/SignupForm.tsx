"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export function SignupForm({
  mode,
  requiresToken = false,
  invitedBy
}: {
  mode: "first-run" | "authenticated";
  requiresToken?: boolean;
  invitedBy?: string;
}) {
  const firstRun = mode === "first-run";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords do not match.");

    setBusy(true);
    try {
      // First run claims the panel and signs the owner in. Once an owner exists
      // this becomes an ordinary "add a teammate" action by a signed-in admin.
      const res = await fetch(firstRun ? "/api/admin/setup" : "/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(firstRun ? { name, email, password, token } : { name, email, password })
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Could not create the account.");
      router.push(firstRun ? "/admin" : "/admin/admins");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-magenta focus:outline-none focus:ring-1 focus:ring-magenta";
  const label = "mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60";

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy">
            <ShieldCheck className="h-5 w-5 text-gold" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold text-navy">
            {firstRun ? "Create your admin account" : "Add an admin account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-charcoal/64">
            {firstRun
              ? "This is a one-time setup for the Design Catalogue. You will use these details to sign in from now on."
              : `Signed in as ${invitedBy}. The new admin will be able to manage the design catalogue.`}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label className={label} htmlFor="setup-name">
              Your name
            </label>
            <input
              id="setup-name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={field}
              placeholder="Ajay Soni"
            />
          </div>
          <div>
            <label className={label} htmlFor="setup-email">
              Email
            </label>
            <input
              id="setup-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="setup-password">
              Password
            </label>
            <input
              id="setup-password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label className={label} htmlFor="setup-confirm">
              Confirm password
            </label>
            <input
              id="setup-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={field}
            />
          </div>
          {requiresToken && (
            <div>
              <label className={label} htmlFor="setup-token">
                Setup token
              </label>
              <input
                id="setup-token"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={field}
              />
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-magenta px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-wine disabled:opacity-60"
          >
            {busy ? "Creating account…" : firstRun ? "Create account & sign in" : "Create admin account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs leading-5 text-charcoal/55">
          {firstRun
            ? "Open only until the first account is created. After that, only a signed-in admin can add more."
            : "Only signed-in admins can reach this page."}
        </p>
      </div>
    </main>
  );
}
