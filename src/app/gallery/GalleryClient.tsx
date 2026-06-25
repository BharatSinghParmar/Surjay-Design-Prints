"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { imageAssets, videoAssets } from "@/data/site";

const galleryItems = [
  { img: imageAssets.rawFabric,       label: "Raw Fabric Storage",    category: "factory",   tall: true },
  { img: imageAssets.printingHall,    label: "Printing Floor",        category: "printing",  tall: false },
  { img: imageAssets.dyeingMachine,   label: "Dyeing Machine",        category: "machinery", tall: false },
  { img: imageAssets.printingFabric,  label: "Printed Fabric Detail", category: "printing",  tall: true },
  { img: imageAssets.dyedPress,       label: "Fabric Pressing",       category: "factory",   tall: false },
  { img: imageAssets.dyeingMachine2,  label: "Processing Line",       category: "machinery", tall: false },
];

const videos = [
  { src: videoAssets.printingMachine, poster: imageAssets.printingHall,   label: "Printing Machine in Action" },
  { src: videoAssets.dyeingProcess,   poster: imageAssets.dyeingMachine,  label: "Dyeing Process" },
  { src: videoAssets.printingTextile, poster: imageAssets.printingFabric, label: "Fabric on Printing Tables" }
];

const categories = ["all", "factory", "printing", "machinery"];

function VideoPlayer({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play(); setPlaying(true); }
  };

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-navy shadow-premium"
      onClick={toggle}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        className="aspect-video w-full object-cover"
        playsInline
        onEnded={() => setPlaying(false)}
      />
      <div
        className={`absolute inset-0 flex items-center justify-center transition duration-300 ${
          playing ? "opacity-0 group-hover:opacity-100" : "bg-navy/40"
        }`}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur ring-2 ring-white/30 transition duration-300 hover:scale-110 hover:bg-magenta">
          {playing
            ? <Pause className="h-7 w-7 fill-white text-white" />
            : <Play className="ml-1 h-7 w-7 fill-white text-white" />
          }
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-5">
        <p className="text-sm font-semibold text-white">{label}</p>
      </div>
    </div>
  );
}

export function GalleryClient() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? galleryItems : galleryItems.filter(i => i.category === active);

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
                onClick={() => setActive(cat)}
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

          {/* Masonry grid */}
          <div className="masonry-grid mt-10">
            {filtered.map((item) => (
              <Reveal key={item.label} className="masonry-item">
                <div className="group relative overflow-hidden rounded-2xl bg-navy shadow-sm">
                  <Image
                    src={item.img}
                    alt={`${item.label} at Surjay Design & Prints`}
                    width={640}
                    height={item.tall ? 640 : 400}
                    className={`w-full object-cover opacity-88 transition duration-700 group-hover:scale-105 group-hover:opacity-100 ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                    <h3 className="font-heading text-base font-semibold text-white">{item.label}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO GALLERY ──────────────────────────────────────── */}
      <section className="bg-mist py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Video Gallery"
            title="Real factory — watch the process live."
            body="Play the videos below to see dyeing, printing and machinery in action."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {videos.map((v) => (
              <Reveal key={v.label}>
                <VideoPlayer src={v.src} poster={v.poster} label={v.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH PRINTING PANORAMIC ─────────────────────── */}
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden">
        <Image
          src={imageAssets.printingHall}
          alt="Full printing hall panoramic at Surjay Design and Prints"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/70" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <p className="font-heading text-xl font-semibold text-white md:text-3xl">
              Surjay Design & Prints — Rajasthan, India
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
