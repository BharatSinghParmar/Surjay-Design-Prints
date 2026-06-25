import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { GalleryClient } from "./GalleryClient";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { imageAssets } from "@/data/site";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "View factory, products, workers, machinery and textile process visuals from Surjay Design & Prints.",
  path: "/gallery"
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" }
        ])}
      />
      <PageHero
        eyebrow="Gallery"
        title="Factory, process and product visuals."
        body="A visual look at the manufacturing environment, printing tables, dyeing flow and finished fabric direction."
        image={imageAssets.printingFabric}
      />
      <Breadcrumbs items={[{ name: "Gallery", href: "/gallery" }]} />
      <GalleryClient />
    </>
  );
}
