import Image from "next/image";
import { CheckCircle2, DraftingCompass, Paintbrush, PanelsTopLeft, Shirt } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, videoAssets } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Printing Methods",
  description:
    "Screen printing, hand printing and custom textile pattern development services for bulk fabric buyers from Surjay Design & Prints.",
  path: "/printing-methods"
});

const methods = [
  {
    icon: PanelsTopLeft,
    title: "Screen Printing",
    body: "A dependable method for repeat designs, controlled coverage and commercial-scale printed fabric programs.",
    img: imageAssets.printingHall
  },
  {
    icon: Paintbrush,
    title: "Hand Printing",
    body: "Craft-led printing for distinctive patterns, specialty looks and flexible customer-led textile development.",
    img: imageAssets.printingFabric
  },
  {
    icon: DraftingCompass,
    title: "Custom Pattern Development",
    body: "Design direction, color needs and fabric use case are translated into practical print execution for business buyers.",
    img: imageAssets.dyeingMachine2
  }
];

const advantages = [
  "Repeatable print quality",
  "Flexible motif and color development",
  "Suitable for bulk textile programs",
  "Works across apparel and trade fabric needs",
  "Supports premium regional design ranges",
  "Clear process communication"
];

const applications = ["Apparel fabric", "Ethnic wear", "Home textile ranges", "Wholesale inventory", "Private label development", "Export-facing orders"];

export default function PrintingMethodsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Printing Methods", path: "/printing-methods" }
        ])}
      />

      {/* ── VIDEO HERO ──────────────────────────────────────────── */}
      <section className="video-hero relative isolate min-h-[90vh] overflow-hidden text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={imageAssets.printingFabric}
        >
          <source src={videoAssets.printingTextile} type="video/mp4" />
          <source src={videoAssets.printingMachine} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/65 to-navy/30" />
        <div className="absolute inset-0 fabric-noise opacity-30" />
        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Printing Methods</p>
            <h1 className="mt-5 max-w-3xl font-heading text-5xl font-semibold leading-tight md:text-6xl">
              Screen printing and hand printing for commercial textile programs.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">
              Surjay Design & Prints combines process control and craft-led execution to create market-ready printed fabrics at B2B scale.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" variant="light">Discuss Printing Requirement</ButtonLink>
              <ButtonLink href="/manufacturing-process">View Full Process</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <Breadcrumbs items={[{ name: "Printing Methods", href: "/printing-methods" }]} />

      {/* ── THREE PRINTING METHODS ──────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Methods"
            title="Printing capability shaped around design clarity and production needs."
            align="center"
          />
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {methods.map((method) => (
              <StaggerItem key={method.title} className="hover-lift group relative overflow-hidden rounded-2xl bg-navy shadow-premium">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={method.img}
                    alt={method.title}
                    fill
                    className="object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent" />
                </div>
                <div className="p-7">
                  <method.icon className="h-8 w-8 text-gold" />
                  <h2 className="mt-4 font-heading text-2xl font-semibold text-white">{method.title}</h2>
                  <p className="mt-3 leading-7 text-white/70">{method.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── PRINTING HALL PANORAMIC ─────────────────────────────── */}
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden">
        <Image
          src={imageAssets.printingHall}
          alt="Printing hall at Surjay Design and Prints — long tables with fabric"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/80" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <Reveal>
              <p className="font-heading text-xl font-semibold text-white md:text-2xl">
                100+ metres of printing tables — organized for scale, quality and speed.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ──────────────────────────────────────────── */}
      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-2xl shadow-premium">
              <Image
                src={imageAssets.printingFabric}
                alt="Beautifully printed teal and blue patterned fabric on printing table"
                width={900}
                height={700}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Advantages"
              title="Print production that supports wholesale and garment supply chains."
              body="From repeat pattern discipline to custom development, the printing route is chosen for the fabric, buyer objective and production volume."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {advantages.map((advantage) => (
                <Reveal key={advantage}>
                  <div className="hover-lift flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 flex-none text-magenta" />
                    <span className="text-sm font-semibold text-navy">{advantage}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── APPLICATIONS ───────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Applications" title="Built for commercial use cases." align="center" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <Reveal key={application} className="hover-lift rounded-xl border border-slate-200 p-6">
                <Shirt className="h-6 w-6 text-magenta" />
                <h3 className="mt-5 font-heading text-xl font-semibold text-navy">{application}</h3>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINTING GALLERY ────────────────────────────────────── */}
      <section className="bg-navy py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Printing Gallery"
            title="Printing textures, tables and finished fabric details."
            body="The visual direction highlights the balance between organized production and textile craft."
            align="center"
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { img: imageAssets.printingHall, alt: "Printing hall with red patterned fabric on long tables" },
              { img: imageAssets.printingFabric, alt: "Beautifully printed blue fabric panoramic" },
              { img: imageAssets.dyeingMachine2, alt: "Dyeing and fabric processing machinery" }
            ].map((item, index) => (
              <Reveal key={index} className="group overflow-hidden rounded-2xl">
                <Image
                  src={item.img}
                  alt={item.alt}
                  width={560}
                  height={420}
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/contact" variant="light">
              Discuss Printing Requirement
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
