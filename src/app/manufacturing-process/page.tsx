import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, videoAssets } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Manufacturing Process",
  description:
    "Explore Surjay Design & Prints' textile manufacturing process from raw fabric procurement and RFD to dyeing, printing, finishing, inspection and packaging.",
  path: "/manufacturing-process"
});

const processHighlights = [
  {
    img: imageAssets.rawFabric,
    step: "01",
    title: "Raw Fabric Procurement",
    desc: "Grey fabrics sourced from South India and Bhiwandi — selected for consistency, construction and buyer requirements."
  },
  {
    img: imageAssets.dyeingMachine,
    step: "02",
    title: "RFD & Dyeing",
    desc: "Fabric is cleaned, prepared and dyed to precise shade specifications with controlled process discipline."
  },
  {
    img: imageAssets.printingHall,
    step: "03",
    title: "Printing",
    desc: "Screen printing and hand printing for commercial-scale fabric programs and custom design development."
  },
  {
    img: imageAssets.dyedPress,
    step: "04",
    title: "Pressing & Finishing",
    desc: "Pressing, elongation, folding and final inspection to deliver market-ready fabric to every buyer."
  }
];

export default function ManufacturingProcessPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Manufacturing Process", path: "/manufacturing-process" }
        ])}
      />
      <PageHero
        eyebrow="Manufacturing Process"
        title="A visual textile journey from raw fabric to market-ready products."
        body="Each process stage supports consistency, finish quality and dispatch confidence for B2B textile buyers."
        image={imageAssets.dyeingMachine2}
      />
      <Breadcrumbs items={[{ name: "Manufacturing Process", href: "/manufacturing-process" }]} />

      {/* ── PROCESS HIGHLIGHTS GRID ──────────────────────────── */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Process Stages"
            title="Four pillars of manufacturing excellence."
            body="From raw procurement to packaged dispatch — a disciplined sequence that protects quality at every stage."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processHighlights.map((item) => (
              <Reveal key={item.step} className="hover-lift group relative overflow-hidden rounded-2xl bg-navy shadow-premium">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={400}
                  height={320}
                  className="aspect-[4/3] w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="font-heading text-4xl font-bold text-white/20">{item.step}</span>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-white/65">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DYEING PROCESS VIDEO ──────────────────────────────── */}
      <section className="bg-mist py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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
                  <source src={videoAssets.dyeingProcess} type="video/mp4" />
                </video>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-5">
                  <span className="text-sm font-semibold text-white">Live: Dyeing Process</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading
                eyebrow="Dyeing Stage"
                title="Precision color work at industrial scale."
                body="Prepared fabric enters the dyeing process where shade, absorbency, silicate treatment, silicone softening and a 24-hour fixation window work together to ensure stable, commercial-grade color."
              />
              <ul className="mt-6 space-y-3">
                {["RFD Preparation", "Controlled Dyeing", "Silicate Treatment", "Silicone Softening", "24-Hour Color Fixation", "Drying Range"].map((step) => (
                  <li key={step} className="flex items-center gap-3 text-sm font-semibold text-navy">
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-magenta" />
                    {step}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FULL PROCESS TIMELINE ─────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Vertical Timeline"
            title="One organized flow. Multiple quality checkpoints."
            body="The production journey is built to protect absorbency, color, softness, print consistency, width stability and final presentation."
            align="center"
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="sticky top-28 hidden overflow-hidden rounded-2xl shadow-premium lg:block">
              <Image
                src={imageAssets.dyedPress}
                alt="Fabric pressing and finishing process at Surjay Design & Prints"
                width={720}
                height={900}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="bg-navy p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">In Progress</p>
                <p className="mt-2 font-heading text-lg font-semibold text-white">Real factory — every step</p>
              </div>
            </div>
            <ProcessTimeline />
          </div>
        </div>
      </section>

      {/* ── PRINTING PROCESS VIDEO ────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-20 text-white md:py-28">
        <Image
          src={imageAssets.printingFabric}
          alt="Printing process background"
          fill
          className="object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Printing Stage</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold md:text-4xl">
                Screen printing and hand printing for commercial textile programs.
              </h2>
              <p className="mt-5 leading-8 text-white/72">
                Fabric moves from the drying range into screen printing or hand printing — executed for repeat patterns, custom motifs and commercial-scale output.
              </p>
              <div className="mt-8">
                <ButtonLink href="/printing-methods" variant="light">
                  Explore Printing Methods
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden rounded-2xl shadow-premium">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="aspect-video w-full object-cover"
                  poster={imageAssets.printingHall}
                >
                  <source src={videoAssets.printingMachine} type="video/mp4" />
                </video>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
