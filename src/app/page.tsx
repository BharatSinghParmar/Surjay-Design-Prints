import Image from "next/image";
import { ArrowRight, BadgeCheck, Factory, Gem, ShieldCheck, Truck, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { ProductCards } from "@/components/ProductCards";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, processSteps, stats, testimonials, whyChoose } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Premium Textile Manufacturer in Rajasthan",
  description:
    "Surjay Design & Prints transforms raw fabric into market-ready dyed, printed and finished textiles for wholesalers, garment manufacturers and bulk buyers.",
  path: "/"
});

const highlights = [
  { icon: Factory, title: "Organized Processing", body: "RFD, dyeing, printing, finishing, inspection and packaging under one disciplined flow." },
  { icon: Gem, title: "Premium Finish", body: "Soft hand feel, stable color, clean folding and dispatch-ready presentation for B2B markets." },
  { icon: Users, title: "Buyer Focus", body: "Built for wholesalers, garment manufacturers, textile traders and repeat bulk programs." }
];

export default function Home() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />
      <section className="mesh-bg relative isolate min-h-[94vh] overflow-hidden pt-28 text-white">
        <div className="absolute inset-0 fabric-noise opacity-70" />
        <Image
          src={imageAssets.hero}
          alt="Modern textile manufacturing floor with dyed and printed fabric rolls"
          fill
          priority
          className="object-cover opacity-40 mix-blend-screen"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/82 to-navy/14" />
        <div className="relative mx-auto grid min-h-[calc(94vh-7rem)] max-w-7xl items-center gap-12 px-4 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
              B2B Textile Manufacturing
            </p>
            <h1 className="mt-6 max-w-4xl font-heading text-5xl font-semibold tracking-normal md:text-7xl">
              From Raw Fabric to Remarkable Finishes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 md:text-xl">
              Transforming premium fabrics through precision dyeing, printing and
              finishing for businesses across India and beyond.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/manufacturing-process" variant="light">
                Explore Manufacturing
              </ButtonLink>
              <ButtonLink href="/contact">Request a Quote</ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="hidden lg:block">
            <div className="rounded-lg border border-white/12 bg-white/10 p-4 shadow-premium backdrop-blur">
              <div className="grid gap-3">
                {["RFD Preparation", "Dyeing", "Printing", "Finishing", "Quality Inspection"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-md bg-white/10 px-4 py-3">
                    <span className="text-sm font-semibold text-white/86">{item}</span>
                    <BadgeCheck className="h-5 w-5 text-magenta" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <SectionHeading
              eyebrow="Company Introduction"
              title="A Rajasthan-based fabric processing partner for serious textile buyers."
              body="Surjay Design & Prints procures raw fabrics from South India and Bhiwandi, then converts them into market-ready dyed, printed and finished textiles through an organized manufacturing sequence."
            />
            <Stagger className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <StaggerItem key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <item.icon className="h-7 w-7 text-magenta" />
                  <h3 className="mt-5 font-heading text-xl font-semibold text-navy">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-charcoal/70">{item.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Manufacturing Highlights"
            title="Premium capability without unnecessary complexity."
            body="The factory workflow is shaped around repeatable execution, custom finishing needs and quality checks that matter to business buyers."
            align="center"
          />
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.slice(0, 4).map((item) => (
              <StaggerItem key={item} className="rounded-lg bg-white p-6 shadow-sm">
                <ShieldCheck className="h-6 w-6 text-magenta" />
                <h3 className="mt-5 font-heading text-lg font-semibold text-navy">{item}</h3>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-mist shadow-premium">
                <Image
                  src={imageAssets.dyeing}
                  alt="Deep magenta dyed fabric moving through textile finishing rollers"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </Reveal>
            <div>
              <SectionHeading
                eyebrow="Process Overview"
                title="A structured path from procurement to packaging."
                body="Every stage has a role: absorbency, shade consistency, color fixation, softness, dimensional stability and market presentation."
              />
              <div className="mt-8 grid gap-3">
                {processSteps.slice(0, 6).map((step, index) => (
                  <Reveal key={step.title} delay={index * 0.04}>
                    <div className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3">
                      <span className="font-semibold text-navy">{step.title}</span>
                      <ArrowRight className="h-4 w-4 text-magenta" />
                    </div>
                  </Reveal>
                ))}
              </div>
              <ButtonLink href="/manufacturing-process" className="mt-8">
                View Full Process
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Products Preview"
            title="Fabric programs for wholesale, garment and trade requirements."
            body="Choose from printed fabrics, dyed fabrics, custom developments and bulk manufacturing support."
            align="center"
          />
          <ProductCards />
        </div>
      </section>

      <section className="bg-navy py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/54">Statistics</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold md:text-5xl">
                Built for long-term manufacturing relationships.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {stats.map((stat) => (
                <AnimatedCounter key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Why Choose Us"
              title="A manufacturing mindset built around buyer confidence."
              body="The company combines practical processing capability, skilled people and transparent communication for reliable textile supply."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {whyChoose.map((item) => (
                <Reveal key={item}>
                  <div className="flex items-center gap-3 rounded-md border border-slate-200 p-4">
                    <BadgeCheck className="h-5 w-5 flex-none text-magenta" />
                    <span className="font-semibold text-navy">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by business buyers."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Reveal key={testimonial.name} className="rounded-lg bg-white p-7 shadow-sm">
                <p className="text-lg leading-8 text-charcoal/78">&quot;{testimonial.quote}&quot;</p>
                <p className="mt-6 font-heading font-semibold text-navy">{testimonial.name}</p>
                <p className="text-sm text-charcoal/56">{testimonial.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Truck className="mx-auto h-8 w-8 text-magenta" />
          <h2 className="mt-6 font-heading text-3xl font-semibold text-navy md:text-5xl">
            Discuss your next fabric requirement with Surjay Design & Prints.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-charcoal/72">
            Share your fabric type, quantity, finish and dispatch expectation. The team can help shape the right dyeing, printing and finishing route.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/contact">Request a Quote</ButtonLink>
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
