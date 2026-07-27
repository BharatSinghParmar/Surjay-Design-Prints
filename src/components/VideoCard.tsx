"use client";

import Image from "next/image";
import { Maximize2, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VideoLightbox } from "@/components/VideoLightbox";

/**
 * A clickable video tile that opens the clip in the VideoLightbox.
 *
 * Two preview modes:
 *  - "poster"   — a still with a play button (gallery cards);
 *  - "autoplay" — the clip already looping silently inline (process /
 *                 infrastructure sections), where the lightbox is the enlarge.
 *
 * Rendered as a real <button> so it works with keyboard and screen readers —
 * the previous gallery player was a plain div and only worked with a mouse.
 */
export function VideoCard({
  src,
  poster,
  label,
  preview = "poster",
  overlay,
  className = ""
}: {
  src: string;
  poster: string;
  label: string;
  preview?: "poster" | "autoplay";
  /** Extra caption content shown over the bottom gradient (defaults to the label). */
  overlay?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);

  // React doesn't serialise `muted` into SSR HTML, so the parse-time autoplay
  // attempt is blocked as "unmuted". Re-assert muted and kick playback once
  // hydrated (same workaround as HeroBackgroundVideo).
  useEffect(() => {
    const video = previewRef.current;
    if (!video) return;
    video.muted = true;
    const kick = () => void video.play().catch(() => undefined);
    kick();
    document.addEventListener("visibilitychange", kick);
    return () => document.removeEventListener("visibilitychange", kick);
  }, [src]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Play video: ${label}`}
        className={`group relative block w-full overflow-hidden rounded-2xl bg-navy text-left shadow-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta ${className}`}
      >
        {preview === "autoplay" ? (
          <video
            ref={previewRef}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="aspect-video w-full object-cover"
          />
        ) : (
          <Image
            src={poster}
            alt=""
            width={640}
            height={360}
            className="aspect-video w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        <span
          className={`absolute inset-0 flex items-center justify-center transition duration-300 ${
            preview === "autoplay" ? "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100" : "bg-navy/35"
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30 backdrop-blur transition duration-300 group-hover:scale-110 group-hover:bg-magenta">
            {preview === "autoplay" ? (
              <Maximize2 className="h-6 w-6 text-white" />
            ) : (
              <Play className="ml-1 h-6 w-6 fill-white text-white" />
            )}
          </span>
        </span>

        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-5">
          {overlay ?? <span className="block text-sm font-semibold text-white">{label}</span>}
        </span>
      </button>

      <VideoLightbox
        open={open}
        onClose={() => setOpen(false)}
        src={src}
        poster={poster}
        label={label}
      />
    </>
  );
}
