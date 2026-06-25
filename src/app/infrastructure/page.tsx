import Image from "next/image";
import { Cog, Factory, Gauge, ScanSearch } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, videoAssets, infrastructure } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Infrastructure",
  description:
    "Explore Surjay Design & Prints factory infrastructure, machinery, drying range, printing tables, dyeing machines, folding machines and quality control capability.",
  path: "/infrastructure"
});

const icons = [Factory, Cog, Gauge, ScanSearch];

const infraImages = [
  { img: imageAssets.dyeingMachine, label: "Dyeing Machines", desc: "Industrial dyeing line for shade consistency across bulk fabric orders." },
  { img: imageAssets.printingHall, label: "Printing Tables", desc: "Long-table screen printing setup for repeat and custom textile programs." },
  { img: imageAssets.dyedPress, label: "Pressing Line", desc: "Fabric pressing for clean finish, dimensional stability and market presentation." },
  { img: imageAssets.dyeingMachine2, label: "Processing Line", desc: "Silicate treatment, silicone softening and 24-hour fixation for quality output." },
  { img: imageAssets.rawFabric, label: "Raw Fabric Storage", desc: "Grey fabrics sourced from South India and Bhiwandi — stored for production flow." },
  { img: imageAssets.printingFabric, label: "Finished Fabric", desc: "Market-ready fabric ready for quality inspection, folding and dispatch." }
];

export default function InfrastructurePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Infrastructure", path: "/infrastructure" }
        ])}
      />
      <PageHero
        eyebrow="Infrastructure"
        title="Factory capability designed for textile production discipline."
        body="From dyeing machines and printing tables to drying, folding and inspection, infrastructure supports reliable business supply."
        image={imageAssets.printingHall}
      />
      <Breadcrumbs items={[{ name: "Infrastructure", href: "/infrastructure" }]} />

      {/* ── INFRASTRUCTURE PHOTO COLLAGE ──────────────────────── */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Factory"
            title="A practical production floor for dyeing, printing and finishing."
            body="The infrastructure is organized around the sequence that matters to fabric buyers: preparation, color work, print execution, finishing, inspection and dispatch."
            align="center"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {infraImages.map((item) => (
              <Reveal key={item.label} className="hover-lift group relative overflow-hidden rounded-2xl bg-navy shadow-premium">
                <Image
                  src={item.img}
                  alt={`${item.label} at Surjay Design & Prints`}
                  width={640}
                  height={480}
                  className="aspect-[4/3] w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy to-transparent p-5">
                  <h3 className="font-heading text-lg font-semibold text-white">{item.label}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/65">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINTING HALL FULL-WIDTH ───────────────────────────── */}
      <section className="relative h-[55vh] min-h-[360px] overflow-hidden">
        <Image
          src={imageAssets.printingHall}
          alt="Massive printing hall at Surjay Design and Prints"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
        <div className="relative flex h-full items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Scale</p>
              <h2 className="mt-3 max-w-xl font-heading text-3xl font-semibold text-white md:text-4xl">
                A printing floor built for commercial textile output.
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MACHINERY VIDEO ───────────────────────────────────── */}
      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl shadow-premium">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="aspect-video w-full object-cover"
                  poster={imageAssets.dyeingMachine}
                >
                  <source src={videoAssets.printingMachine} type="video/mp4" />
                </video>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">Live Factory</p>
                  <p className="mt-1 text-sm font-semibold text-white">Printing Machine in Operation</p>
                </div>
              </div>
            </Reveal>
            <div>
              <SectionHeading
                eyebrow="Machinery"
                title="Industrial equipment for reliable production output."
                body="The machinery investment supports consistent dyeing, printing and finishing across all production runs — giving buyers confidence in repeat orders."
              />
              <Stagger className="mt-8 grid gap-3">
                {infrastructure.slice(0, 6).map((item, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <StaggerItem key={item} className="hover-lift flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-mist">
                        <Icon className="h-5 w-5 text-magenta" />
                      </span>
                      <h3 className="font-heading text-base font-semibold text-navy">{item}</h3>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTION CAPACITY ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
        <Image
          src={imageAssets.printingFabric}
          alt="Production capacity visual"
          fill
          className="object-cover opacity-10"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Production Capacity"
            title="Scalable support for repeat business requirements."
            body="Capacity planning should be aligned with fabric type, print complexity, finishing requirements and timeline."
            align="center"
            tone="light"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {["Dyeing Machines", "Printing Tables", "Quality Control"].map((item) => (
              <Reveal key={item} className="hover-lift rounded-2xl border border-white/10 p-8 text-center backdrop-blur">
                <h3 className="font-heading text-2xl font-semibold text-white">{item}</h3>
                <p className="mt-4 text-sm leading-7 text-white/65">
                  Built into the production flow to support consistency, repeatability and buyer confidence.
                </p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink href="/contact" variant="light">Discuss Production Requirements</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
