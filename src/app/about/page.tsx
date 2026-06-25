import { Award, Compass, Eye, Factory, MessageSquareQuote, Target } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Newsletter } from "@/components/Newsletter";
import { values } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Learn about Surjay Design & Prints, a Rajasthan textile manufacturing and fabric processing company serving wholesalers, garment manufacturers and bulk buyers.",
  path: "/about"
});

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
      />
      <Breadcrumbs items={[{ name: "About Us", href: "/about" }]} />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeading
            eyebrow="Company Story"
            title="From raw fabric sourcing to market-ready textile supply."
            body="The company sources raw fabrics from trusted suppliers across South India and Bhiwandi, then transforms them through RFD preparation, dyeing, printing, silicate treatment, silicone softening, drying, pressing, elongation, folding, inspection and packaging."
          />
          <div className="grid gap-4">
            <Reveal className="rounded-lg bg-mist p-7">
              <Target className="h-7 w-7 text-magenta" />
              <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Mission</h2>
              <p className="mt-3 leading-8 text-charcoal/72">
                To deliver dependable fabric processing and customized textile solutions that help business buyers move confidently from concept to market.
              </p>
            </Reveal>
            <Reveal className="rounded-lg bg-navy p-7 text-white">
              <Eye className="h-7 w-7 text-magenta" />
              <h2 className="mt-5 font-heading text-2xl font-semibold">Vision</h2>
              <p className="mt-3 leading-8 text-white/72">
                To expand nationally and internationally while building a premium manufacturing brand from Rajasthan.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Values"
            title="The operating principles behind every order."
            align="center"
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title} className="rounded-lg bg-white p-6 shadow-sm">
                <Award className="h-6 w-6 text-magenta" />
                <h3 className="mt-5 font-heading text-xl font-semibold text-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-charcoal/72">{value.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <Reveal className="rounded-lg border border-slate-200 p-7">
            <MessageSquareQuote className="h-7 w-7 text-magenta" />
            <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Founder Message</h2>
            <p className="mt-4 leading-8 text-charcoal/72">
              &quot;Our work is to make fabric dependable for the next business in the chain. Every process decision must protect quality, timing and trust.&quot;
            </p>
          </Reveal>
          <Reveal className="rounded-lg border border-slate-200 p-7">
            <Compass className="h-7 w-7 text-magenta" />
            <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Business Philosophy</h2>
            <p className="mt-4 leading-8 text-charcoal/72">
              Transparent manufacturing, practical communication and disciplined finishing help buyers plan with fewer surprises.
            </p>
          </Reveal>
          <Reveal className="rounded-lg border border-slate-200 p-7">
            <Factory className="h-7 w-7 text-magenta" />
            <h2 className="mt-5 font-heading text-2xl font-semibold text-navy">Manufacturing Strengths</h2>
            <p className="mt-4 leading-8 text-charcoal/72">
              Dyeing, screen printing, hand printing, softening, drying, pressing, folding and inspection support a wide range of fabric programs.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy py-20 text-white md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/54">Future Vision</p>
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
