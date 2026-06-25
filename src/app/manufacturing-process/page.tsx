import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Manufacturing Process",
  description:
    "Explore Surjay Design & Prints' textile manufacturing process from raw fabric procurement and RFD to dyeing, printing, finishing, inspection and packaging.",
  path: "/manufacturing-process"
});

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
        image={imageAssets.dyeing}
      />
      <Breadcrumbs items={[{ name: "Manufacturing Process", href: "/manufacturing-process" }]} />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Vertical Timeline"
            title="One organized flow. Multiple quality checkpoints."
            body="The production journey is built to protect absorbency, color, softness, print consistency, width stability and final presentation."
            align="center"
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="sticky top-28 hidden overflow-hidden rounded-lg shadow-premium lg:block">
              <Image
                src={imageAssets.dyeing}
                alt="Fabric dyeing and finishing process at Surjay Design & Prints"
                width={720}
                height={900}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <ProcessTimeline />
          </div>
        </div>
      </section>
    </>
  );
}
