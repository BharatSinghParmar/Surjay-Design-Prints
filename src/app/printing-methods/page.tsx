import Image from "next/image";
import { CheckCircle2, DraftingCompass, Paintbrush, PanelsTopLeft, Shirt } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets } from "@/data/site";
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
    body: "A dependable method for repeat designs, controlled coverage and commercial-scale printed fabric programs."
  },
  {
    icon: Paintbrush,
    title: "Hand Printing",
    body: "Craft-led printing for distinctive patterns, specialty looks and flexible customer-led textile development."
  },
  {
    icon: DraftingCompass,
    title: "Custom Pattern Development",
    body: "Design direction, color needs and fabric use case are translated into practical print execution for business buyers."
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
      <PageHero
        eyebrow="Printing Methods"
        title="Screen printing and hand printing for commercial textile programs."
        body="Surjay Design & Prints combines process control and craft-led execution to create market-ready printed fabrics."
        image={imageAssets.printing}
      />
      <Breadcrumbs items={[{ name: "Printing Methods", href: "/printing-methods" }]} />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Methods"
            title="Printing capability shaped around design clarity and production needs."
            align="center"
          />
          <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {methods.map((method) => (
              <StaggerItem key={method.title} className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
                <method.icon className="h-8 w-8 text-magenta" />
                <h2 className="mt-6 font-heading text-2xl font-semibold text-navy">{method.title}</h2>
                <p className="mt-4 leading-8 text-charcoal/72">{method.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-lg shadow-premium">
              <Image
                src={imageAssets.printing}
                alt="Screen printing table with custom textile pattern development"
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
                  <div className="flex items-center gap-3 rounded-md bg-white p-4">
                    <CheckCircle2 className="h-5 w-5 flex-none text-magenta" />
                    <span className="text-sm font-semibold text-navy">{advantage}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Applications" title="Built for commercial use cases." align="center" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <Reveal key={application} className="rounded-lg border border-slate-200 p-6">
                <Shirt className="h-6 w-6 text-magenta" />
                <h3 className="mt-5 font-heading text-xl font-semibold text-navy">{application}</h3>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Gallery"
            title="Printing textures, tables and finished fabric details."
            body="The visual direction highlights the balance between organized production and textile craft."
            align="center"
            tone="light"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[imageAssets.printing, imageAssets.hero, imageAssets.dyeing].map((image, index) => (
              <Reveal key={image} className="overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`Textile printing gallery image ${index + 1}`}
                  width={560}
                  height={420}
                  className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
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
