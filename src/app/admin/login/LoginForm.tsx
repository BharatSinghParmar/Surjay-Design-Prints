"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const from = new URLSearchParams(window.location.search).get("from");
        router.push(from && from.startsWith("/admin") ? from : "/admin");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
        setBusy(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy">
            <Lock className="h-5 w-5 text-gold" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold text-navy">Admin Access</h1>
          <p className="mt-1 text-sm text-charcoal/60">Surjay Design &amp; Prints — Design Catalogue</p>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60"
              htmlFor="login-email"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-magenta focus:outline-none focus:ring-1 focus:ring-magenta"
            />
          </div>
          <div>
            <label
              className="mb-1 block text-xs font-bold uppercase tracking-wider text-charcoal/60"
              htmlFor="login-password"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-magenta focus:outline-none focus:ring-1 focus:ring-magenta"
            />
          </div>
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
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-xs text-charcoal/50 underline hover:text-charcoal"
        >
          Back to website
        </a>
      </div>
    </main>
  );
}
