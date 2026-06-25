import Image from "next/image";
import { Play } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets } from "@/data/site";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "View factory, products, workers, machinery and textile process visuals from Surjay Design & Prints.",
  path: "/gallery"
});

const gallery = [
  { title: "Factory", image: imageAssets.hero },
  { title: "Products", image: imageAssets.printing },
  { title: "Workers", image: imageAssets.printing },
  { title: "Machinery", image: imageAssets.dyeing },
  { title: "Process", image: imageAssets.dyeing },
  { title: "Finished Fabric", image: imageAssets.hero }
];

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
      />
      <Breadcrumbs items={[{ name: "Gallery", href: "/gallery" }]} />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Image Grid"
            title="Manufacturing visuals for buyer confidence."
            align="center"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <Reveal key={item.title} className="group relative overflow-hidden rounded-lg bg-navy">
                <Image
                  src={item.image}
                  alt={`${item.title} at Surjay Design & Prints`}
                  width={640}
                  height={520}
                  className="aspect-[4/3] w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy to-transparent p-5">
                  <h2 className="font-heading text-xl font-semibold text-white">{item.title}</h2>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Video Gallery" title="Process reels and factory walkthroughs." align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {["Factory walkthrough", "Printing process"].map((item) => (
              <Reveal key={item} className="grid aspect-video place-items-center rounded-lg bg-navy text-white shadow-premium">
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-magenta">
                    <Play className="h-6 w-6 fill-current" />
                  </span>
                  <h2 className="mt-5 font-heading text-2xl font-semibold">{item}</h2>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
