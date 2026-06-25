import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProductCards } from "@/components/ProductCards";
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
        image={imageAssets.hero}
      />
      <Breadcrumbs items={[{ name: "Products", href: "/products" }]} />
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Modern Category Cards"
            title="Choose the fabric route that matches your buyer program."
            body="Each category can be adapted by fabric type, pattern direction, finish expectation, quantity and dispatch requirement."
            align="center"
          />
          <ProductCards />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
