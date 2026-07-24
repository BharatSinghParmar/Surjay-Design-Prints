"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FileText, X } from "lucide-react";
import {
  DESIGN_CATEGORIES,
  categoryLabel,
  type AttributeDef,
  type Design,
  type DesignCategory
} from "@/types/design";

type Filter = "all" | DesignCategory;

export function DesignCatalogue({
  designs,
  attributes
}: {
  designs: Design[];
  attributes: AttributeDef[]; // already filtered to visible
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<Design | null>(null);
  const [fileIdx, setFileIdx] = useState(0);

  const cardAttrs = useMemo(() => attributes.filter((a) => a.showOnCard), [attributes]);
  const shown = useMemo(
    () => (filter === "all" ? designs : designs.filter((d) => d.category === filter)),
    [designs, filter]
  );

  function open(d: Design) {
    setActive(d);
    setFileIdx(0);
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All Designs" },
    ...DESIGN_CATEGORIES.map((c) => ({ id: c.id as Filter, label: c.label }))
  ];

  return (
    <>
      {/* Filter tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => {
          const count = t.id === "all" ? designs.length : designs.filter((d) => d.category === t.id).length;
          if (t.id !== "all" && count === 0) return null;
          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === t.id ? "bg-navy text-white" : "border border-slate-200 text-charcoal/70 hover:border-magenta/40"
              }`}
            >
              {t.label} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((d) => {
          const cover = d.files[0];
          return (
            <button
              key={d.id}
              onClick={() => open(d)}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-premium"
            >
              <div className="relative aspect-square overflow-hidden bg-mist">
                {cover?.type === "image" ? (
                  <Image
                    src={cover.thumbnailUrl || cover.url}
                    alt={d.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width:1024px) 25vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-charcoal/40">
                    <FileText className="h-10 w-10" />
                    <span className="text-xs font-semibold">PDF Design</span>
                  </div>
                )}
                {d.status === "sold" && (
                  <span className="absolute right-2 top-2 rounded-md bg-navy px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gold shadow">
                    Sold
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="truncate font-heading text-sm font-semibold text-navy">{d.title}</h3>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-charcoal/45">{categoryLabel(d.category)}</p>
                {cardAttrs.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {cardAttrs
                      .filter((a) => d.attributes[a.key])
                      .slice(0, 3)
                      .map((a) => (
                        <span key={a.id} className="rounded bg-mist px-1.5 py-0.5 text-[10px] font-medium text-charcoal/70">
                          {d.attributes[a.key]}
                          {a.unit ? ` ${a.unit}` : ""}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="relative grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-premium md:grid-cols-[1.2fr_1fr]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-navy/70 p-1.5 text-white hover:bg-navy"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Media */}
            <div className="relative flex min-h-[280px] items-center justify-center bg-mist">
              {active.files[fileIdx]?.type === "image" ? (
                <Image
                  src={active.files[fileIdx].url}
                  alt={active.title}
                  fill
                  className="object-contain"
                  sizes="(min-width:768px) 55vw, 100vw"
                />
              ) : (
                <a
                  href={active.files[fileIdx]?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 text-navy"
                >
                  <FileText className="h-16 w-16" />
                  <span className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white">Open PDF</span>
                </a>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col overflow-y-auto p-6">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-magenta">{categoryLabel(active.category)}</p>
                {active.status === "sold" && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">Sold</span>
                )}
              </div>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-navy">{active.title}</h3>
              {active.description && <p className="mt-3 text-sm leading-7 text-charcoal/72">{active.description}</p>}

              {/* All visible attributes */}
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
                {attributes
                  .filter((a) => active.attributes[a.key])
                  .map((a) => (
                    <div key={a.id}>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-charcoal/45">{a.label}</dt>
                      <dd className="text-sm font-semibold text-navy">
                        {active.attributes[a.key]}
                        {a.unit ? ` ${a.unit}` : ""}
                      </dd>
                    </div>
                  ))}
              </dl>

              {/* File thumbnails */}
              {active.files.length > 1 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {active.files.map((f, i) => (
                    <button
                      key={f.url}
                      onClick={() => setFileIdx(i)}
                      className={`relative h-14 w-14 overflow-hidden rounded-lg border ${i === fileIdx ? "border-magenta" : "border-slate-200"}`}
                    >
                      {f.type === "image" ? (
                        <Image src={f.thumbnailUrl || f.url} alt="" fill className="object-cover" sizes="56px" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-charcoal/40">
                          <FileText className="h-5 w-5" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <a
                href="/contact"
                className="mt-auto inline-flex items-center justify-center rounded-lg bg-magenta px-5 py-2.5 pt-3 text-sm font-semibold text-white hover:bg-wine"
              >
                Inquire About This Design
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
