"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * The dialog shell behind every media popup on the site.
 *
 * Extracted so the accessibility contract lives in exactly one place: Escape
 * closes, Tab is trapped inside, background scroll is locked, and focus returns
 * to whatever opened it. Two copies of this logic would inevitably drift.
 *
 * Callers supply the media itself plus any extra corner controls (the video
 * lightbox adds a mute toggle). Passing onPrev/onNext adds arrow navigation,
 * which the photo gallery uses to step through the grid.
 */
export function MediaLightbox({
  open,
  onClose,
  label,
  ariaLabel,
  children,
  controls,
  onPrev,
  onNext,
  position
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  /** Full accessible name for the dialog, e.g. `Video: Dyeing`. */
  ariaLabel: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  /** e.g. "3 / 15" — shown beside the caption when stepping through a set. */
  position?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  /**
   * The key handler reads the callbacks through a ref so the effect below can
   * depend on `open` alone.
   *
   * Callers pass inline arrows — PhotoLightbox's onPrev/onNext close over the
   * current index — so their identity changes on every render. As effect
   * dependencies they would tear the effect down and set it up again on each
   * arrow press, and the teardown restores focus to whatever opened the dialog.
   * Focus would jump out to the page behind on every step through the gallery.
   */
  const handlers = useRef({ onClose, onPrev, onNext });
  handlers.current = { onClose, onPrev, onNext };

  // Lock background scroll, close on Escape, keep focus inside, restore on close.
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    if (overlay) overlay.style.pointerEvents = "auto";

    function onKeyDown(event: KeyboardEvent) {
      const { onClose: close, onPrev: prev, onNext: next } = handlers.current;
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowLeft" && prev) {
        prev();
        return;
      }
      if (event.key === "ArrowRight" && next) {
        next();
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
      // Stop intercepting clicks the instant closing starts, rather than when
      // the exit animation finishes. Written directly to the node rather than
      // left to framer-motion's `exit`: that runs on requestAnimationFrame, and
      // a backgrounded tab freezes rAF, so the overlay stays fully transparent
      // AND fully click-blocking — measurably swallowing every click on the
      // page underneath. AnimatePresence keeps rendering the exiting element
      // with its last props, so a prop-driven style could not fix it either.
      if (overlay) overlay.style.pointerEvents = "none";
    };
  }, [open]);

  const arrowClass =
    "grid h-11 w-11 place-items-center rounded-full bg-navy/70 text-white backdrop-blur transition hover:bg-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/85 px-4 py-6 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, pointerEvents: "auto" }}
          // Belt and braces with the effect cleanup above, which is the one that
          // actually holds when the animation loop is stalled.
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className="w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
          >
            <div className="relative overflow-hidden rounded-lg bg-black shadow-premium">
              {children}

              {/* Corner controls */}
              <div className="absolute right-3 top-3 flex gap-2">
                {controls}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className={arrowClass}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {onPrev && onNext ? (
                <>
                  <button
                    type="button"
                    onClick={onPrev}
                    aria-label="Previous"
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${arrowClass}`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    aria-label="Next"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${arrowClass}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-navy/85 to-transparent p-5">
                <p className="text-sm font-semibold text-white">{label}</p>
                {position ? (
                  <p className="flex-none text-xs font-semibold text-white/70">{position}</p>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
