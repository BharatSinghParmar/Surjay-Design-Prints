"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";

/**
 * Full-screen video popup. Plays on loop and starts muted — the factory clips
 * carry live ambience — with a mute/unmute toggle in the corner.
 *
 * The dialog behaviour (Escape, focus trap, focus restore, scroll lock) lives in
 * MediaLightbox, shared with the photo lightbox.
 */
export function VideoLightbox({
  open,
  onClose,
  src,
  poster,
  label,
  /**
   * Testimonial clips are often shot in portrait on a phone, where the default
   * 16:9 cover crop would cut the speaker's head off. `contain` letterboxes
   * instead, showing the whole frame whatever its shape.
   */
  fit = "cover"
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  label: string;
  fit?: "cover" | "contain";
}) {
  const [muted, setMuted] = useState(true);

  // Fresh start each time: muted, from the top.
  useEffect(() => {
    if (open) setMuted(true);
  }, [open, src]);

  return (
    <MediaLightbox
      open={open}
      onClose={onClose}
      label={label}
      ariaLabel={`Video: ${label}`}
      controls={
        <button
          type="button"
          onClick={() => setMuted((value) => !value)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
          className="grid h-11 w-11 place-items-center rounded-full bg-navy/70 text-white backdrop-blur transition hover:bg-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      }
    >
      <video
        key={src}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted={muted}
        playsInline
        className={
          fit === "contain"
            ? "max-h-[75vh] w-full bg-black object-contain"
            : "aspect-video w-full object-cover"
        }
      />
    </MediaLightbox>
  );
}
