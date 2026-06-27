"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Clock3,
  Droplets,
  Hand,
  Layers,
  MoveHorizontal,
  PackageCheck,
  PackageSearch,
  Paintbrush,
  PanelsTopLeft,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
  Waves,
  Wind,
  type LucideIcon
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { imageAssets } from "@/data/site";

type TimelineStep = {
  title: string;
  eyebrow: string;
  description: string;
  purpose: string;
  duration: string;
  image: string;
  icon: LucideIcon;
};

const manufacturingSteps: TimelineStep[] = [
  {
    title: "Raw Fabric Procurement",
    eyebrow: "South India & Bhiwandi",
    description: "Grey fabric is sourced from established textile supply hubs and checked for suitability before processing begins.",
    purpose: "Gives buyers confidence that the base fabric is selected for construction, consistency and order requirement.",
    duration: "0.5 day",
    image: imageAssets.rawFabric,
    icon: PackageSearch
  },
  {
    title: "Ready For Dyeing (RFD)",
    eyebrow: "Batch readiness",
    description: "Fabric is moved into an RFD-ready state so it can absorb dye evenly and respond predictably in processing.",
    purpose: "Creates a dependable foundation for shade matching, print clarity and repeat batch outcomes.",
    duration: "2-4 hrs",
    image: imageAssets.dyeingMachine,
    icon: Sparkles
  },
  {
    title: "Fabric Cleaning & Preparation",
    eyebrow: "Surface preparation",
    description: "Dust, handling residue and loose impurities are reduced before the fabric enters wet processing.",
    purpose: "Improves absorbency and reduces defects that can show up later during dyeing or printing.",
    duration: "3-5 hrs",
    image: imageAssets.dyeingMachine2,
    icon: Droplets
  },
  {
    title: "Dyeing",
    eyebrow: "Controlled shade work",
    description: "Prepared fabric is dyed according to buyer shade, fabric type, quantity and end-use requirement.",
    purpose: "Builds consistent color depth across the lot so bulk buyers receive usable, repeatable inventory.",
    duration: "6-10 hrs",
    image: imageAssets.dyeingMachine,
    icon: Droplets
  },
  {
    title: "Silicate Treatment",
    eyebrow: "Color fixation",
    description: "A fixation treatment supports stronger color hold before the fabric moves to finishing stages.",
    purpose: "Helps preserve shade performance through drying, printing, folding and commercial handling.",
    duration: "2-3 hrs",
    image: imageAssets.dyeingMachine2,
    icon: ShieldCheck
  },
  {
    title: "Silicone Treatment",
    eyebrow: "Softness & shine",
    description: "Silicone finishing gives the fabric a smoother hand feel and a more polished visual surface.",
    purpose: "Improves perceived quality, drape and buyer appeal when the fabric reaches market shelves.",
    duration: "2-3 hrs",
    image: "/images/dyeing-finishing.png",
    icon: Waves
  },
  {
    title: "24-Hour Fabric Preservation",
    eyebrow: "Stabilization window",
    description: "The treated fabric rests in a controlled preservation period before the next mechanical stage.",
    purpose: "Allows shade, chemistry and moisture behavior to stabilize before drying and printing.",
    duration: "24 hrs",
    image: imageAssets.printingFabric,
    icon: Timer
  },
  {
    title: "Drying Range",
    eyebrow: "Moisture control",
    description: "Fabric passes through drying so excess moisture is reduced and the batch becomes ready for print work.",
    purpose: "Protects print sharpness, fabric handle and downstream finishing consistency.",
    duration: "4-6 hrs",
    image: "/images/dyeing-finishing.png",
    icon: Wind
  },
  {
    title: "Printing",
    eyebrow: "Design application",
    description: "Approved designs are applied to the processed fabric using the method best suited to the order.",
    purpose: "Turns processed cloth into commercially distinctive fabric for garment, wholesale and trade buyers.",
    duration: "6-12 hrs",
    image: imageAssets.printingHall,
    icon: Paintbrush
  },
  {
    title: "Screen Printing",
    eyebrow: "Repeat precision",
    description: "Screens support sharp pattern repeats and controlled coverage for larger commercial runs.",
    purpose: "Creates scalable print consistency across bulk fabric orders.",
    duration: "4-8 hrs",
    image: "/images/screen-printing.png",
    icon: PanelsTopLeft
  },
  {
    title: "Hand Printing",
    eyebrow: "Craft detail",
    description: "Skilled hands handle craft-led pattern work where flexible detailing or specialty execution is required.",
    purpose: "Adds human finish and design character for fabric programs that need a more distinctive surface.",
    duration: "6-10 hrs",
    image: imageAssets.printingFabric,
    icon: Hand
  },
  {
    title: "Pressing",
    eyebrow: "Presentation finish",
    description: "The fabric is pressed to smooth the surface and improve its finished commercial appearance.",
    purpose: "Makes the fabric easier to inspect, fold, present and dispatch.",
    duration: "2-4 hrs",
    image: imageAssets.dyedPress,
    icon: BadgeCheck
  },
  {
    title: "Elongation",
    eyebrow: "Dimensional control",
    description: "Width, stretch and handling behavior are stabilized before final inspection and packing.",
    purpose: "Reduces surprises for garment manufacturers and repeat bulk buyers.",
    duration: "1-2 hrs",
    image: imageAssets.dyedPress,
    icon: MoveHorizontal
  },
  {
    title: "Quality Inspection",
    eyebrow: "Final review",
    description: "The batch is checked for shade, print clarity, finish, fabric feel and visible processing issues.",
    purpose: "Catches avoidable issues before fabric reaches the buyer's cutting table or market counter.",
    duration: "2-4 hrs",
    image: imageAssets.printingFabric,
    icon: SearchCheck
  },
  {
    title: "Folding",
    eyebrow: "Clean handling",
    description: "Approved fabric is folded into a buyer-friendly format for easier storage, transport and resale.",
    purpose: "Preserves presentation and reduces handling friction for trade and garment customers.",
    duration: "1-2 hrs",
    image: imageAssets.rawFabric,
    icon: Layers
  },
  {
    title: "Packaging",
    eyebrow: "Dispatch protection",
    description: "Finished fabric is packed securely so it can move through logistics without losing presentation quality.",
    purpose: "Protects finished goods and helps buyers receive shelf-ready or production-ready fabric.",
    duration: "1-2 hrs",
    image: "/images/products-to-sell.jpeg",
    icon: PackageCheck
  },
  {
    title: "Market Ready Fabric",
    eyebrow: "Buyer handoff",
    description: "The final fabric lot is ready for wholesalers, garment manufacturers, textile traders and bulk buyers.",
    purpose: "Completes the conversion from raw fabric into reliable business-ready inventory.",
    duration: "Dispatch ready",
    image: imageAssets.printingFabric,
    icon: Truck
  }
];

export function ManufacturingTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeStep = manufacturingSteps[activeIndex];
  const ActiveIcon = activeStep.icon;
  const progress = useMemo(
    () => (activeIndex / (manufacturingSteps.length - 1)) * 100,
    [activeIndex]
  );

  function updateActiveFromScroll() {
    const element = scrollRef.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;
    const scrollProgress = maxScroll > 0 ? element.scrollLeft / maxScroll : 0;
    const nextIndex = Math.round(scrollProgress * (manufacturingSteps.length - 1));
    setActiveIndex(Math.min(manufacturingSteps.length - 1, Math.max(0, nextIndex)));
  }

  function selectStep(index: number) {
    setActiveIndex(index);
    const element = scrollRef.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;
    const target = (index / (manufacturingSteps.length - 1)) * maxScroll;
    element.scrollTo({ left: target, behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-mist py-16 md:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fa_52%,#f4f6f8_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-magenta">
            Manufacturing Journey
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-heading text-3xl font-semibold leading-tight text-navy md:text-4xl">
            From raw fabric sourcing to dispatch-ready finished goods.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-charcoal/72">
            A buyer-facing view of the stages that protect color quality, softness,
            dimensional stability and market presentation.
          </p>
          <motion.div
            className="mx-auto mt-6 inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-navy text-white">
                <Clock3 className="h-4 w-4" />
              </span>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal/45">
                  Estimated Duration
                </p>
                <p className="mt-1 font-heading text-xl font-semibold text-navy">
                  3-5 working days
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white/88 p-4 shadow-premium md:p-6">
          <div
            ref={scrollRef}
            onScroll={updateActiveFromScroll}
            className="manufacturing-timeline-scroll overflow-x-auto scroll-smooth pb-4"
          >
            <div className="relative min-w-max px-4 pt-3">
              <div className="pointer-events-none absolute left-10 right-10 top-10 h-px bg-slate-200" />
              <motion.div
                className="pointer-events-none absolute left-10 top-10 h-px bg-gradient-to-r from-magenta via-gold to-copper"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="flex min-w-max snap-x snap-mandatory gap-3">
                {manufacturingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === activeIndex;

                  return (
                    <motion.button
                      key={step.title}
                      type="button"
                      onClick={() => selectStep(index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      className="group relative flex w-36 snap-center flex-col items-center text-center outline-none sm:w-40"
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45, delay: index * 0.018 }}
                    >
                      <span
                        className={`relative z-10 grid h-14 w-14 place-items-center rounded-full border transition duration-300 ${
                          isActive
                            ? "border-magenta bg-navy text-white shadow-premium ring-4 ring-magenta/12"
                            : "border-slate-200 bg-white text-magenta shadow-sm group-hover:border-magenta/40 group-hover:bg-mist"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/38">
                        Step {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`mt-2 min-h-10 px-1 text-xs font-semibold leading-5 transition sm:text-[13px] ${
                          isActive ? "text-navy" : "text-charcoal/58 group-hover:text-navy"
                        }`}
                      >
                        {step.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal/38">
            <span>Procurement</span>
            <span>Dispatch</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={activeStep.title}
            className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-premium lg:grid lg:grid-cols-[0.9fr_1.1fr]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative min-h-[260px] overflow-hidden bg-navy md:min-h-[360px] lg:min-h-full">
              <Image
                src={activeStep.image}
                alt={`${activeStep.title} manufacturing process`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/76 via-navy/18 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 text-white">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-white text-magenta shadow-sm">
                  <ActiveIcon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/78">
                  {String(activeIndex + 1).padStart(2, "0")} / {manufacturingSteps.length}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-magenta">
                {activeStep.eyebrow}
              </p>
              <h3 className="mt-3 font-heading text-3xl font-semibold leading-tight text-navy">
                {activeStep.title}
              </h3>
              <p className="mt-4 text-base leading-8 text-charcoal/72">
                {activeStep.description}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-md bg-mist p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/42">
                    Purpose
                  </p>
                  <p className="mt-2 text-sm leading-7 text-charcoal/76">
                    {activeStep.purpose}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-charcoal/42">
                    Stage Time
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-navy">
                    <Clock3 className="h-4 w-4 text-gold" />
                    {activeStep.duration}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <Link
                  href="/manufacturing-process"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-magenta px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-wine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
