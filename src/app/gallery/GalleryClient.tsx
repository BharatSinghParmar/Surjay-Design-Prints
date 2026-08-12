"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoCard } from "@/components/VideoCard";
import { imageAssets, videoAssets, videoPosters } from "@/data/site";

const galleryItems = [
  { img: imageAssets.handPrintHall,        label: "Bandana Print Down the Hall",  category: "printing",  tall: false },
  { img: imageAssets.rawRolls,             label: "Raw Fabric Rolls",             category: "factory",   tall: true  },
  { img: imageAssets.printGreen,           label: "Green Repeat on the Table",    category: "printing",  tall: false },
  { img: imageAssets.fixationStock,        label: "Dyed Lots in Fixation",        category: "factory",   tall: false },
  { img: imageAssets.handPrintDetail,      label: "Hand Print Detail",            category: "printing",  tall: true  },
  { img: imageAssets.dyeingMachine,        label: "Dyeing Line",                  category: "machinery", tall: false },
  { img: imageAssets.cleaningTank,         label: "Wash & Preparation Tank",      category: "machinery", tall: false },
  { img: imageAssets.designScreenPortrait, label: "Screen & Design Station",      category: "printing",  tall: true  },
  { img: imageAssets.elongationLine,       label: "Elongation Line",              category: "machinery", tall: false },
  { img: imageAssets.qualityTable,         label: "Quality Check",                category: "factory",   tall: false },
  { img: imageAssets.dryingColour,         label: "Drying Range",                 category: "factory",   tall: false },
  { img: imageAssets.foldingDetail,        label: "Folding & Inspection",         category: "factory",   tall: true  },
  { img: imageAssets.cleaningRollers,      label: "Cleaning Rollers",             category: "machinery", tall: false },
  { img: imageAssets.printMonoScreen,      label: "Monochrome Run",               category: "printing",  tall: false },
  { img: imageAssets.marketReady,          label: "Market-Ready Stock",           category: "factory",   tall: false }
];

// One clip per process, each unique to the gallery — the clips used on the
// home, process, printing and infrastructure pages are different segments or
// different takes from the same folders.
const videos = [
  { src: videoAssets.screenPrintingRun, poster: videoPosters.screenPrintingRun, label: "Screen Printing — Cloth on the Table" },
  { src: videoAssets.dyeDrum,           poster: videoPosters.dyeDrum,           label: "Dye Drum Turning" },
  { src: videoAssets.fabricCleaning,    poster: videoPosters.fabricCleaning,    label: "Fabric Cleaning & Washing" },
  { src: videoAssets.rfd,               poster: videoPosters.rfd,               label: "RFD — Winding onto the Beam" },
  { src: videoAssets.silicone,          poster: videoPosters.silicone,          label: "Silicone Softening Line" },
  { src: videoAssets.pressing,          poster: videoPosters.pressing,          label: "Pressing & Calendering" },
  { src: videoAssets.dryingRange,       poster: videoPosters.dryingRange,       label: "Drying Range" },
  { src: videoAssets.qualityInspection, poster: videoPosters.qualityInspection, label: "Quality Inspection by Hand" },
  { src: videoAssets.marketReady,       poster: videoPosters.marketReady,       label: "Market-Ready Stock" }
];

const categories = ["all", "factory", "printing", "machinery"];

export function GalleryClient() {
  const [active, setActive] = useState("all");
  // Index into `filtered`, so prev/next walks the set the visitor is looking at.
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const filtered = active === "all" ? galleryItems : galleryItems.filter(i => i.category === active);

  function selectCategory(cat: string) {
    setActive(cat);
    // The open photo's index belongs to the old filter — drop it rather than
    // leave the lightbox pointing at a different picture.
    setPhotoIndex(null);
  }

  return (
    <>
      {/* ── CATEGORY FILTER + MASONRY ─────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Image Gallery"
            title="Manufacturing visuals for buyer confidence."
            align="center"
          />

          {/* Filter tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                  active === cat
                    ? "bg-navy text-white shadow-sm"
                    : "border border-slate-200 text-charcoal/70 hover:border-navy hover:text-navy"
                }`}
              >
                {cat === "all" ? "All Photos" : cat}
              </button>
            ))}
          </div>

          {/* Masonry grid — each tile opens the photo lightbox. A real <button>
              rather than a div with onClick, so it is reachable by keyboard. */}
          <div className="masonry-grid mt-10">
            {filtered.map((item, index) => (
              <Reveal key={item.label} className="masonry-item">
                <button
                  type="button"
                  onClick={() => setPhotoIndex(index)}
                  aria-haspopup="dialog"
                  aria-label={`View photo: ${item.label}`}
                  className="group relative block w-full overflow-hidden rounded-2xl bg-navy text-left shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
                >
                  <Image
                    src={item.img}
                    alt={`${item.label} at Surjay Design & Print`}
                    width={640}
                    height={item.tall ? 640 : 400}
                    className={`w-full object-cover opacity-88 transition duration-700 group-hover:scale-105 group-hover:opacity-100 ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
                  />
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-navy/60 text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
                    <Maximize2 className="h-4 w-4" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-navy/80 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="block font-heading text-base font-semibold text-white">
                      {item.label}
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          <PhotoLightbox
            open={photoIndex !== null}
            onClose={() => setPhotoIndex(null)}
            photos={filtered}
            index={photoIndex ?? 0}
            onIndexChange={setPhotoIndex}
          />
        </div>
      </section>

      {/* ── VIDEO GALLERY ──────────────────────────────────────── */}
      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Video Gallery"
            title="Real factory — watch the process live."
            body="Click any clip to watch it full size — every stage from washing and dyeing to inspection and dispatch."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {videos.map((v) => (
              <Reveal key={v.label}>
                <VideoCard src={v.src} poster={v.poster} label={v.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH PRINTING PANORAMIC ─────────────────────── */}
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden">
        <Image
          src={imageAssets.printGreenScreen}
          alt="Screen printing table panoramic at Surjay Design and Print"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <p className="font-heading text-xl font-semibold text-white md:text-3xl">
              Surjay Design & Print — Rajasthan, India
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
