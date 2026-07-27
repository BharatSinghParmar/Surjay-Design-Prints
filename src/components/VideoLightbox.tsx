"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Full-screen video popup. Plays on loop, starts muted (the clips carry live
 * factory ambience) with a mute/unmute toggle in the corner.
 *
 * Accessibility matches RequestQuoteModal: Escape closes, Tab is trapped inside
 * the dialog, background scroll is locked and focus returns to the trigger.
 */
export function VideoLightbox({
  open,
  onClose,
  src,
  poster,
  label
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  poster: string;
  label: string;
}) {
  const [muted, setMuted] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Lock background scroll, close on Escape, keep focus inside, restore on close.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the dialog
    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  // Fresh start each time: muted, from the top.
  useEffect(() => {
    if (open) setMuted(true);
  }, [open, src]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/85 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Video: ${label}`}
            className="w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
          >
        <div className="relative overflow-hidden rounded-lg bg-black shadow-premium">
          <video
            ref={videoRef}
            key={src}
            src={src}
            poster={poster}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="aspect-video w-full object-cover"
          />

          {/* Corner controls */}
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
              className="grid h-11 w-11 place-items-center rounded-full bg-navy/70 text-white backdrop-blur transition hover:bg-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="grid h-11 w-11 place-items-center rounded-full bg-navy/70 text-white backdrop-blur transition hover:bg-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-5">
            <p className="text-sm font-semibold text-white">{label}</p>
          </div>
        </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
