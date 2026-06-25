import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Newsletter } from "@/components/Newsletter";
import { imageAssets } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "Printed fabrics, dyed fabrics, custom fabrics and bulk textile manufacturing services for wholesalers, garment manufacturers and textile traders.",
  path: "/products"
});

const categories = [
  {
    title: "Printed Fabrics",
    image: imageAssets.printingFabric,
    tag: "01",
    description:
      "Screen printed and hand printed fabrics developed for wholesalers, garment manufacturers and textile traders.",
    applications: ["Apparel", "Ethnic wear", "Home textiles", "Trade inventory"],
    specs: ["Width: 44–60 inches", "GSM: 80–200", "MOQ: Per roll", "Screen & hand printing"]
  },
  {
    title: "Dyed Fabrics",
    image: "/images/dyed-product.jpeg",
    tag: "02",
    description:
      "Bulk dyed fabrics processed with attention to shade consistency, softness, finish and dispatch presentation.",
    applications: ["Garment manufacturing", "Resale", "Uniform fabric", "Seasonal ranges"],
    specs: ["Shade matching", "Silicone softening", "24hr fixation", "Bulk orders"]
  },
  {
    title: "Custom Fabrics",
    image: "/images/products-to-sell.jpeg",
    tag: "03",
    description:
      "Customer-led dyeing, printing and finishing programs shaped around design direction, quantity and market needs.",
    applications: ["Private labels", "Custom patterns", "Regional ranges", "Buyer programs"],
    specs: ["Custom shades", "Pattern development", "Flexible MOQ", "Sample runs"]
  },
  {
    title: "Bulk Manufacturing",
    image: imageAssets.printingHall,
    tag: "04",
    description:
      "Organized fabric processing for buyers who need dependable capacity, repeatable quality and transparent execution.",
    applications: ["Wholesalers", "Textile traders", "Bulk buyers", "Export-ready supply"],
    specs: ["High volume", "Repeat orders", "Quality inspection", "Dispatch-ready"]
  }
];

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" }
        ])}
      />
      <PageHero
        eyebrow="Products"
        title="Market-ready fabric categories for serious B2B textile buyers."
        body="Surjay Design & Prints supports printed, dyed, custom and bulk manufacturing needs through organized fabric processing."
        image={imageAssets.printingFabric}
      />
      <Breadcrumbs items={[{ name: "Products", href: "/products" }]} />

      {/* ── CATEGORY SHOWCASE ─────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Categories"
            title="Choose the fabric route that matches your buyer program."
            body="Each category can be adapted by fabric type, pattern direction, finish expectation, quantity and dispatch requirement."
            align="center"
          />

          <div className="mt-14 space-y-16">
            {categories.map((cat, index) => (
              <Reveal key={cat.title}>
                <div className={`grid gap-8 lg:grid-cols-2 lg:items-center ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-2xl shadow-premium">
                    <Image
                      src={cat.image}
                      alt={`${cat.title} at Surjay Design & Prints`}
                      width={800}
                      height={600}
                      className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                    <div className="absolute left-5 top-5">
                      <span className="rounded-md bg-navy/80 px-3 py-1 font-heading text-xs font-bold uppercase tracking-widest text-gold backdrop-blur">
                        {cat.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-magenta">{`Category ${cat.tag}`}</p>
                    <h2 className="mt-3 font-heading text-3xl font-semibold text-navy md:text-4xl">{cat.title}</h2>
                    <p className="mt-4 leading-8 text-charcoal/72">{cat.description}</p>

                    {/* Applications */}
                    <div className="mt-6">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-charcoal/50">Applications</p>
                      <div className="flex flex-wrap gap-2">
                        {cat.applications.map((app) => (
                          <span key={app} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-charcoal/70">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {cat.specs.map((spec) => (
                        <div key={spec} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 flex-none text-magenta" />
                          <span className="text-sm text-charcoal/70">{spec}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <ButtonLink href="/contact">
                        Inquire About {cat.title} <ArrowRight className="inline-block h-4 w-4 ml-2" />
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT IMAGES HORIZONTAL STRIP ──────────────────── */}
      <section className="overflow-hidden bg-navy py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Fabric Varieties"
            title="From the factory to your supply chain."
            align="center"
            tone="light"
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { img: "/images/dyed-product.jpeg", label: "Dyed Textile Products" },
              { img: "/images/products-to-sell.jpeg", label: "Market-Ready Fabrics" },
              { img: imageAssets.printingFabric, label: "Printed Fabric Rolls" }
            ].map((item) => (
              <Reveal key={item.label} className="group relative overflow-hidden rounded-2xl">
                <Image
                  src={item.img}
                  alt={item.label}
                  width={600}
                  height={500}
                  className="aspect-[4/3] w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-5">
                  <p className="font-heading text-base font-semibold text-white">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
