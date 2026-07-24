"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email, website })
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Subscription failed. Please try again.");
      setEmail("");
      setStatus({ type: "success", text: "Thank you — you're subscribed." });
    } catch (err) {
      setStatus({
        type: "error",
        text: err instanceof Error ? err.message : "Subscription failed. Please try again."
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-mist py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr] md:items-center lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">Newsletter</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-navy">
            Textile updates for business buyers
          </h2>
        </div>
        <div className="relative">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit} noValidate>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="business@email.com"
              className="min-h-12 flex-1 rounded-md border-slate-200 focus:border-magenta focus:ring-magenta"
            />
            {/* Honeypot — hidden from humans */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-magenta disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {busy ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
          <p
            role="status"
            aria-live="polite"
            className={`mt-3 min-h-5 text-sm ${
              status?.type === "error" ? "text-red-700" : "text-charcoal/70"
            }`}
          >
            {status?.text ?? ""}
          </p>
        </div>
      </div>
    </section>
  );
}
