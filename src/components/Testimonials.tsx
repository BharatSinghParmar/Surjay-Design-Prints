"use client";

import Image from "next/image";
import { useState } from "react";
import { Play, Quote } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { VideoLightbox } from "@/components/VideoLightbox";
import type { PublicTestimonial } from "@/types/testimonial";

/**
 * Buyer testimonials, managed from /admin/testimonials.
 *
 * Deliberately no star rating: a score the company assigns itself is an
 * unearned signal, and B2B buyers read it as decoration. Credibility here comes
 * from a named person with a role and a company, a concrete result, and — where
 * the buyer recorded one — their own voice on video.
 *
 * `fallback` keeps the section from disappearing before the first real
 * testimonial is added. Those entries are shown as unattributed buyer feedback,
 * never dressed up with an invented name or face.
 */
export function Testimonials({
  testimonials,
  fallback
}: {
  testimonials: PublicTestimonial[];
  fallback: { quote: string; segment: string }[];
}) {
  const [playing, setPlaying] = useState<PublicTestimonial | null>(null);
  const hasReal = testimonials.length > 0;

  return (
    <section className="bg-mist py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="Trusted by business buyers." align="center" />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {hasReal
            ? testimonials.map((t) => (
                <Reveal key={t.id} className="hover-lift flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                  {t.videoUrl ? (
                    <button
                      type="button"
                      onClick={() => setPlaying(t)}
                      aria-haspopup="dialog"
                      aria-label={`Play video testimonial from ${t.authorName}`}
                      className="group relative block aspect-video w-full overflow-hidden bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-magenta"
                    >
                      {t.videoPosterUrl ? (
                        <Image
                          src={t.videoPosterUrl}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover opacity-88 transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        // No poster: the clip's own first frame stands in.
                        <video
                          src={t.videoUrl}
                          muted
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                          className="h-full w-full object-cover opacity-88"
                        />
                      )}
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/92 text-magenta shadow-premium transition duration-300 group-hover:scale-105 group-hover:bg-white">
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </span>
                      </span>
                    </button>
                  ) : null}

                  <div className="flex flex-1 flex-col p-8">
                    <Quote className="h-6 w-6 flex-none text-magenta/35" aria-hidden="true" />
                    <p className="mt-3 text-lg leading-8 text-charcoal/78">&ldquo;{t.quote}&rdquo;</p>

                    {t.outcome ? (
                      <p className="mt-4 inline-flex self-start rounded-md bg-mist px-3 py-1.5 text-sm font-semibold text-navy">
                        {t.outcome}
                      </p>
                    ) : null}

                    <div className="mt-6 flex items-center gap-3 pt-2">
                      <div className="relative h-10 w-10 flex-none overflow-hidden rounded-full bg-navy">
                        {t.photoUrl ? (
                          <Image src={t.photoUrl} alt="" fill sizes="40px" className="object-cover" />
                        ) : (
                          <span className="grid h-full w-full place-items-center text-sm font-bold text-white">
                            {t.authorName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-semibold text-navy">{t.authorName}</p>
                        <p className="text-sm text-charcoal/56">
                          {[t.authorRole, t.company, t.location].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      {t.logoUrl ? (
                        <Image
                          src={t.logoUrl}
                          alt={t.company ? `${t.company} logo` : ""}
                          width={80}
                          height={32}
                          className="h-8 w-auto flex-none object-contain"
                        />
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              ))
            : fallback.map((f) => (
                <Reveal key={f.quote} className="hover-lift rounded-xl bg-white p-8 shadow-sm">
                  <Quote className="h-6 w-6 text-magenta/35" aria-hidden="true" />
                  <p className="mt-3 text-lg leading-8 text-charcoal/78">&ldquo;{f.quote}&rdquo;</p>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-charcoal/45">
                    {f.segment}
                  </p>
                </Reveal>
              ))}
        </div>
      </div>

      <VideoLightbox
        open={playing !== null}
        onClose={() => setPlaying(null)}
        src={playing?.videoUrl ?? ""}
        poster={playing?.videoPosterUrl}
        label={
          playing
            ? [playing.authorName, playing.company].filter(Boolean).join(" · ")
            : ""
        }
        // Buyers record these on a phone, often in portrait. `cover` at 16:9
        // would crop the speaker's head out of frame.
        fit="contain"
      />
    </section>
  );
}
