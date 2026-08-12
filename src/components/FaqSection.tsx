import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PrintBackdrop } from "@/components/PrintBackdrop";
import { SectionHeading } from "@/components/SectionHeading";
import type { Faq } from "@/data/faqs";
import { faqSchema } from "@/lib/seo";

/**
 * FAQ accordion — a server component that ships zero client JavaScript.
 *
 * Built on native <details>/<summary>, so the browser owns the open state,
 * Enter/Space activation, focus order and the expanded/collapsed announcement.
 * The panel opens instantly; only the chevron is animated (see globals.css).
 * A slide-open animation was tried and deliberately removed — the note there
 * explains why it is not worth the risk of the answer failing to appear.
 *
 * A framer-motion accordion would need "use client", useState and a wrapper
 * that measures the DOM on every toggle. This site fought its mobile Lighthouse
 * score from 56 to 90; spending that back on a disclosure widget the browser
 * already implements would be a poor trade.
 *
 * Deliberately NOT wrapped in <Reveal>: framer-motion serialises the hidden
 * variant into the server HTML, so every answer would ship as `opacity: 0`.
 * These answers are the most valuable crawlable prose on the site, and answer
 * engines largely do not execute JavaScript. SectionHeading brings its own
 * Reveal, which is all the entrance motion this section needs.
 *
 * Note the two `tone` props below mean opposite things — SectionHeading's
 * "light" means light TEXT for a dark section, PrintBackdrop's "light" means a
 * faint watermark for a LIGHT section. This component only ever renders on
 * light surfaces, so it hard-codes each correctly and exposes no tone prop.
 */
export function FaqSection({
  items,
  eyebrow = "FAQ",
  title,
  body,
  path,
  surface = "mist"
}: {
  items: Faq[];
  eyebrow?: string;
  title: string;
  body?: string;
  /** Page path, e.g. "/products" — gives the FAQPage node a stable @id. */
  path?: string;
  surface?: "white" | "mist";
}) {
  if (items.length === 0) return null;

  return (
    <section
      className={`relative overflow-hidden py-20 md:py-28 ${
        surface === "mist" ? "bg-mist" : "bg-white"
      }`}
    >
      <PrintBackdrop tone="light" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} align="center" />

        {/* Generated from the same array the list below renders, so the schema
            and the visible copy cannot drift apart. */}
        <JsonLd data={faqSchema(items, path)} />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 border-y border-slate-200">
          {items.map((item) => (
            <details key={item.question} className="faq-item">
              {/*
                The <h3> sits inside <summary>, which the HTML spec permits
                (summary accepts a single heading element). It is the only
                ordering that works: <summary> must be the first child of
                <details>, so wrapping it in a heading instead would be invalid
                and would break the disclosure entirely. h3 is right because
                PageHero owns the h1 and SectionHeading above owns the h2.

                Do not add role="button", tabIndex or aria-expanded. The browser
                supplies all three; hand-written ARIA on a <summary> replaces
                working native semantics with a worse copy. The chevron is
                decorative and hidden from assistive tech.
              */}
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-sm py-5 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-magenta [&::-webkit-details-marker]:hidden">
                <h3 className="font-heading text-lg font-semibold text-navy md:text-xl">
                  {item.question}
                </h3>
                <ChevronDown
                  aria-hidden="true"
                  className="faq-chevron mt-1 h-5 w-5 flex-none text-magenta"
                />
              </summary>
              <p className="pb-6 pr-9 text-sm leading-7 text-charcoal/75 md:text-base md:leading-8">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
