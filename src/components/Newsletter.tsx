import { Send } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-mist py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr] md:items-center lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">Newsletter</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-navy">
            Textile updates for business buyers
          </h2>
        </div>
        <form className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="business@email.com"
            className="min-h-12 flex-1 rounded-md border-slate-200 focus:border-magenta focus:ring-magenta"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-magenta"
          >
            <Send className="h-4 w-4" />
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
