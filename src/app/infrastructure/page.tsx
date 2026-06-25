import Image from "next/image";
import { Cog, Factory, Gauge, ScanSearch } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, infrastructure } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Infrastructure",
  description:
    "Explore Surjay Design & Prints factory infrastructure, machinery, drying range, printing tables, dyeing machines, folding machines and quality control capability.",
  path: "/infrastructure"
});

const icons = [Factory, Cog, Gauge, ScanSearch];

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
        image={imageAssets.dyeing}
      />
      <Breadcrumbs items={[{ name: "Infrastructure", href: "/infrastructure" }]} />

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Factory"
              title="A practical production floor for dyeing, printing and finishing."
              body="The infrastructure is organized around the sequence that matters to fabric buyers: preparation, color work, print execution, finishing, inspection and dispatch."
            />
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {infrastructure.map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <StaggerItem key={item} className="rounded-lg border border-slate-200 p-5">
                    <Icon className="h-6 w-6 text-magenta" />
                    <h2 className="mt-4 font-heading text-lg font-semibold text-navy">{item}</h2>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
          <Reveal>
            <div className="grid gap-5">
              <Image
                src={imageAssets.dyeing}
                alt="Dyeing machines and textile finishing infrastructure"
                width={820}
                height={640}
                className="aspect-[4/3] rounded-lg object-cover shadow-premium"
              />
              <Image
                src={imageAssets.printing}
                alt="Printing tables and textile production floor"
                width={820}
                height={500}
                className="aspect-[16/9] rounded-lg object-cover shadow-premium"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Production Capacity"
            title="Scalable support for repeat business requirements."
            body="Capacity planning should be aligned with fabric type, print complexity, finishing requirements and timeline. The production conversation starts with clarity on quantity, quality expectation and dispatch date."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {["Dyeing Machines", "Printing Tables", "Quality Control"].map((item) => (
              <Reveal key={item} className="rounded-lg bg-white p-8 text-center shadow-sm">
                <h3 className="font-heading text-2xl font-semibold text-navy">{item}</h3>
                <p className="mt-4 text-sm leading-7 text-charcoal/70">
                  Built into the production flow to support consistency, repeatability and buyer confidence.
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
