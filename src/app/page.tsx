import Image from "next/image";
import { ArrowRight, BadgeCheck, Factory, Gem, ShieldCheck, Truck, Users, Play } from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { ProductCards } from "@/components/ProductCards";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, videoAssets, processSteps, stats, testimonials, whyChoose } from "@/data/site";
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

const journeySteps = [
  { label: "Raw Fabric", img: imageAssets.rawFabric },
  { label: "Dyeing", img: imageAssets.dyeingMachine },
  { label: "Color Fixation", img: imageAssets.dyeingMachine2 },
  { label: "Printing", img: imageAssets.printingHall },
  { label: "Pressing", img: imageAssets.dyedPress },
  { label: "Market Ready", img: imageAssets.printingFabric }
];

export default function Home() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />

      {/* ── CINEMATIC VIDEO HERO ────────────────────────────────────── */}
      <section className="video-hero relative isolate min-h-[100vh] overflow-hidden text-white">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={imageAssets.printingHall}
        >
          <source src={videoAssets.printingMachine} type="video/mp4" />
          <source src={videoAssets.dyeingProcess} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        {/* Fabric noise texture */}
        <div className="absolute inset-0 fabric-noise opacity-40" />

        {/* Content */}
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
              B2B Textile Manufacturing · Rajasthan, India
            </p>
            <h1 className="mt-6 font-heading text-5xl font-semibold leading-tight tracking-tight md:text-6xl xl:text-7xl">
              From Raw Fabric to{" "}
              <span className="gradient-text-magenta">Remarkable</span>{" "}
              Finishes
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76 md:text-xl">
              Transforming premium fabrics through precision dyeing, printing and
              finishing for businesses across India and beyond.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/manufacturing-process" variant="light">
                Explore Manufacturing
              </ButtonLink>
              <ButtonLink href="/contact">Request a Quote</ButtonLink>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-6">
              {["10+ Years", "500+ Projects", "100+ Clients", "B2B Focused"].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-gold" />
                  <span className="text-sm font-semibold text-white/80">{badge}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Right — Real photo mosaic */}
          <Reveal delay={0.15} className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3">
              {[
                { img: imageAssets.rawFabric, label: "Raw Fabric", tall: true },
                { img: imageAssets.printingHall, label: "Printing Hall", tall: false },
                { img: imageAssets.dyeingMachine2, label: "Dyeing", tall: false },
                { img: imageAssets.dyedPress, label: "Processing", tall: true }
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`group relative overflow-hidden rounded-xl ${i % 2 === 0 ? "row-span-2" : ""}`}
                >
                  <Image
                    src={item.img}
                    alt={item.label}
                    width={400}
                    height={i % 2 === 0 ? 480 : 230}
                    className={`w-full object-cover transition duration-700 group-hover:scale-105 ${i % 2 === 0 ? "h-[300px]" : "h-[140px]"}`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent px-3 py-2">
                    <span className="text-xs font-semibold text-white/90">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── MANUFACTURING JOURNEY STRIP ──────────────────────────────── */}
      <section className="overflow-hidden border-y border-slate-100 bg-mist py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.28em] text-charcoal/50">
            Manufacturing Journey
          </p>
          <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-hide">
            {journeySteps.map((step, index) => (
              <div key={step.label} className="flex flex-none items-center">
                <div className="group flex flex-col items-center gap-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-premium ring-2 ring-magenta/20 transition duration-300 group-hover:ring-magenta/60">
                    <Image
                      src={step.img}
                      alt={step.label}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                  <span className="w-20 text-center text-xs font-semibold text-charcoal/70">{step.label}</span>
                </div>
                {index < journeySteps.length - 1 && (
                  <div className="mx-2 flex flex-none items-center">
                    <div className="h-px w-8 bg-gradient-to-r from-magenta/40 to-magenta/10 sm:w-12" />
                    <ArrowRight className="h-3 w-3 flex-none text-magenta/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY INTRODUCTION ────────────────────────────────────── */}
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
                <StaggerItem key={item.title} className="hover-lift rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <item.icon className="h-7 w-7 text-magenta" />
                  <h3 className="mt-5 font-heading text-xl font-semibold text-navy">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-charcoal/70">{item.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH PRINTING HALL BANNER ─────────────────────────── */}
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <Image
          src={imageAssets.printingHall}
          alt="Surjay Design & Prints printing hall with fabric on tables"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-transparent" />
        <div className="relative flex h-full items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Manufacturing at Scale</p>
              <h2 className="mt-4 max-w-2xl font-heading text-4xl font-semibold text-white md:text-5xl">
                Industrial precision across every meter of fabric.
              </h2>
              <p className="mt-5 max-w-lg text-lg text-white/72">
                From raw grey rolls to finished printed cloth — every step is engineered for consistency, color and commercial reliability.
              </p>
              <div className="mt-8">
                <ButtonLink href="/manufacturing-process" variant="light">
                  View Full Process
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PROCESS OVERVIEW ────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist shadow-premium">
                <Image
                  src={imageAssets.dyeingMachine2}
                  alt="Textile dyeing machinery at Surjay Design & Prints"
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
                {processSteps.slice(0, 7).map((step, index) => (
                  <Reveal key={step.title} delay={index * 0.04}>
                    <div className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 transition hover:border-magenta/30 hover:bg-mist">
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

      {/* ── PRODUCTS PREVIEW ─────────────────────────────────────────── */}
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

      {/* ── STATISTICS SECTION ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
        <Image
          src={imageAssets.printingFabric}
          alt="Textile printing at scale"
          fill
          className="object-cover opacity-10 mix-blend-luminosity"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      {/* ── REAL FACTORY IMAGE GALLERY STRIP ────────────────────────── */}
      <section className="overflow-hidden bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Factory Visuals"
            title="Real manufacturing. Real process. Real quality."
            align="center"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { img: imageAssets.rawFabric, label: "Raw Fabric Procurement" },
              { img: imageAssets.dyeingMachine, label: "Dyeing Machines" },
              { img: imageAssets.printingHall, label: "Printing Floor" },
              { img: imageAssets.dyedPress, label: "Fabric Pressing" },
              { img: imageAssets.printingFabric, label: "Printed Fabric" },
              { img: imageAssets.dyeingMachine2, label: "Processing Line" }
            ].map((item) => (
              <Reveal key={item.label} className="group relative overflow-hidden rounded-xl bg-navy">
                <Image
                  src={item.img}
                  alt={`${item.label} at Surjay Design & Prints`}
                  width={640}
                  height={480}
                  className="aspect-[4/3] w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy to-transparent p-5">
                  <h3 className="font-heading text-lg font-semibold text-white">{item.label}</h3>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/gallery">View Full Gallery</ButtonLink>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
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
                  <div className="hover-lift flex items-center gap-3 rounded-md border border-slate-200 p-4">
                    <BadgeCheck className="h-5 w-5 flex-none text-magenta" />
                    <span className="font-semibold text-navy">{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by business buyers."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Reveal key={testimonial.name} className="hover-lift rounded-xl bg-white p-8 shadow-sm">
                <div className="mb-4 text-gold">{"★★★★★"}</div>
                <p className="text-lg leading-8 text-charcoal/78">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-navy">{testimonial.name}</p>
                    <p className="text-sm text-charcoal/56">{testimonial.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-24 text-white md:py-32">
        <Image
          src={imageAssets.rawFabric}
          alt="Raw fabric rolls at Surjay Design and Prints"
          fill
          className="object-cover opacity-10"
        />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <Truck className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-6 font-heading text-3xl font-semibold md:text-5xl">
            Discuss your next fabric requirement with Surjay Design & Prints.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/72">
            Share your fabric type, quantity, finish and dispatch expectation. The team can help shape the right dyeing, printing and finishing route.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/contact" variant="light">Request a Quote</ButtonLink>
            <ButtonLink href="/manufacturing-process">Explore Manufacturing</ButtonLink>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
