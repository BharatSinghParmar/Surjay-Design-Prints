import Image from "next/image";
import { Award, Compass, Eye, Factory, MessageSquareQuote, Target } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ResourceCard } from "@/components/ResourceCard";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Newsletter } from "@/components/Newsletter";
import { companyResources } from "@/data/resources";
import { values } from "@/data/site";
import { imageAssets } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about Surjay Design & Prints, a Rajasthan textile manufacturing and fabric processing company serving wholesalers, garment manufacturers and bulk buyers.",
  path: "/about"
});

const milestones = [
  { year: "Founded", event: "Established in Rajasthan with a focus on quality dyeing and fabric processing." },
  { year: "Growth", event: "Expanded to screen printing and hand printing for B2B textile markets." },
  { year: "Scale", event: "Serving 100+ business clients across India with 1,000+ fabric designs." },
  { year: "Today", event: "Full-spectrum manufacturer: RFD → Dyeing → Printing → Finishing → Dispatch." },
  { year: "Vision", event: "Expanding nationally and internationally as a premium textile brand." }
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" }
        ])}
      />
      <PageHero
        eyebrow="About Us"
        title="A premium textile manufacturing brand in motion."
        body="Surjay Design & Prints brings together sourcing, dyeing, printing, finishing and quality inspection for B2B textile buyers."
        image={imageAssets.printingHall}
      />
      <Breadcrumbs items={[{ name: "About Us", href: "/about" }]} />

      {/* ── COMPANY STORY ─────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeading
            eyebrow="Company Story"
            title="From raw fabric sourcing to market-ready textile supply."
            body="The company sources raw fabrics from trusted suppliers across South India and Bhiwandi, then transforms them through RFD preparation, dyeing, printing, silicate treatment, silicone softening, drying, pressing, elongation, folding, inspection and packaging."
          />
          <div className="grid gap-4">
            <Reveal className="rounded-xl bg-mist p-7">
              <Target className="h-7 w-7 text-magenta" />
              <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Mission</h2>
              <p className="mt-3 leading-8 text-charcoal/72">
                To deliver dependable fabric processing and customized textile solutions that help business buyers move confidently from concept to market.
              </p>
            </Reveal>
            <Reveal className="rounded-xl bg-navy p-7 text-white">
              <Eye className="h-7 w-7 text-gold" />
              <h2 className="mt-5 font-heading text-2xl font-semibold">Vision</h2>
              <p className="mt-3 leading-8 text-white/72">
                To expand nationally and internationally while building a premium manufacturing brand from Rajasthan.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH RAW FABRIC BANNER ──────────────────────── */}
      <section className="relative h-[50vh] min-h-[320px] overflow-hidden">
        <Image
          src={imageAssets.rawFabric}
          alt="Raw grey fabric rolls stacked at Surjay Design and Prints"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
        <div className="relative flex h-full items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Raw to Remarkable</p>
              <h2 className="mt-3 max-w-2xl font-heading text-3xl font-semibold text-white md:text-4xl">
                Every batch begins with the right raw fabric — sourced with purpose.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CEO / FOUNDER SECTION ─────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-premium">
                  <Image
                    src={imageAssets.ceo}
                    alt="Founder of Surjay Design & Prints"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 1024px) 40vw, 90vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                </div>
                {/* Floating quote badge */}
                <div className="absolute -bottom-5 -right-4 max-w-[260px] rounded-xl bg-navy p-5 shadow-premium">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Founder</p>
                  <p className="mt-2 text-sm leading-6 text-white/85">
                    &quot;Our work is to make fabric dependable for the next business in the chain.&quot;
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <MessageSquareQuote className="h-8 w-8 text-magenta" />
              <h2 className="mt-5 font-heading text-3xl font-semibold text-navy md:text-4xl">
                A Founder&apos;s Message
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-charcoal/72">
                <p>
                  At Surjay Design & Prints, we believe that the quality of a fabric is not just about its appearance — it is about the discipline, consistency and care embedded in every process stage.
                </p>
                <p>
                  From the moment raw grey fabric enters our factory to the moment finished textiles are dispatched, every decision is made with the buyer&apos;s commercial confidence in mind.
                </p>
                <p>
                  Our goal is not just to manufacture fabric — it is to build a textile brand that Rajasthan and India can be proud of, serving domestic and international markets with equal seriousness.
                </p>
              </div>
              <div className="mt-8">
                <p className="font-heading text-lg font-semibold text-navy">Founder, Surjay Design & Prints</p>
                <p className="text-sm text-charcoal/56">Rajasthan, India</p>
              </div>
              <div className="mt-8">
                <ButtonLink href="/contact">Start a Conversation</ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ────────────────────────────────────────── */}
      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Values"
            title="The operating principles behind every order."
            align="center"
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title} className="hover-lift rounded-xl bg-white p-6 shadow-sm">
                <Award className="h-6 w-6 text-magenta" />
                <h3 className="mt-5 font-heading text-xl font-semibold text-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/72">{value.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── RESOURCE CENTER ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-4xl">
              <ResourceCard document={companyResources[0]} />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPANY MILESTONE TIMELINE ──────────────────────────── */}
      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Journey"
            title="Building a textile brand — one process at a time."
            align="center"
          />
          <div className="relative mt-14">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-magenta/60 via-magenta/20 to-transparent lg:block" />
            <div className="grid gap-8 lg:gap-0">
              {milestones.map((milestone, index) => (
                <Reveal key={milestone.year} delay={index * 0.06}>
                  <div className={`relative flex items-start gap-8 lg:gap-0 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:max-w-[45%] ${index % 2 === 0 ? "lg:mr-auto lg:pr-12" : "lg:ml-auto lg:pl-12"}`}>
                      <span className="text-xs font-bold uppercase tracking-widest text-magenta">{milestone.year}</span>
                      <p className="mt-3 leading-7 text-charcoal/72">{milestone.event}</p>
                    </div>
                    {/* Center dot */}
                    <div className="absolute left-0 top-5 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-magenta bg-white lg:left-1/2 lg:block" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BUSINESS PHILOSOPHY ───────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <Reveal className="hover-lift rounded-xl border border-slate-200 p-7">
            <MessageSquareQuote className="h-7 w-7 text-magenta" />
            <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Founder Message</h2>
            <p className="mt-4 leading-8 text-charcoal/72">
              &quot;Our work is to make fabric dependable for the next business in the chain. Every process decision must protect quality, timing and trust.&quot;
            </p>
          </Reveal>
          <Reveal className="hover-lift rounded-xl border border-slate-200 p-7">
            <Compass className="h-7 w-7 text-magenta" />
            <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Business Philosophy</h2>
            <p className="mt-4 leading-8 text-charcoal/72">
              Transparent manufacturing, practical communication and disciplined finishing help buyers plan with fewer surprises.
            </p>
          </Reveal>
          <Reveal className="hover-lift rounded-xl border border-slate-200 p-7">
            <Factory className="h-7 w-7 text-magenta" />
            <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Manufacturing Strengths</h2>
            <p className="mt-4 leading-8 text-charcoal/72">
              Dyeing, screen printing, hand printing, softening, drying, pressing, folding and inspection support a wide range of fabric programs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FUTURE VISION ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-24 text-white md:py-32">
        <Image
          src={imageAssets.printingFabric}
          alt="Future textile manufacturing vision"
          fill
          className="object-cover opacity-10"
        />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Future Vision</p>
          <h2 className="mt-5 font-heading text-3xl font-semibold md:text-5xl">
            From regional capability to national and international recognition.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">
            The next chapter is focused on stronger production systems, wider buyer reach and a premium manufacturing identity that can serve domestic and export-facing textile markets.
          </p>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
