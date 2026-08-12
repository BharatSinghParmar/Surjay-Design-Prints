"use client";

import { useEffect, useRef, useState } from "react";

type HeroBackgroundVideoProps = {
  src: string;
  poster: string;
  className?: string;
  /**
   * `true` only for the one clip behind the hero, which must start immediately.
   *
   * Everything else defaults to lazy. That matters because CSS `display:none` is
   * not a load barrier: a `preload="auto"` video inside a `hidden lg:block`
   * wrapper still downloads in full and keeps a decoder running, so the
   * desktop-only hero mosaic was costing phone visitors ~1.7 MB of video they
   * can never see. A lazy video downloads nothing until it is actually on screen.
   */
  eager?: boolean;
  /**
   * Only load the clip at or above this viewport width, in px.
   *
   * The hero clip is decorative and sits behind a heavy gradient, but it is the
   * heaviest file on the site. On a phone it saturated the connection, so the JS
   * bundle arrived late and the largest text on the page painted late with it.
   * Below this width the element shows its poster and downloads nothing.
   *
   * Note this necessarily defers the decision to the client: the server cannot
   * know the viewport, so a gated clip is never `eager` in the server HTML and
   * starts a beat after hydration. That is imperceptible next to the poster
   * already being on screen.
   */
  minWidth?: number;
};

export function HeroBackgroundVideo({
  src,
  poster,
  className,
  eager = false,
  minWidth
}: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Lazy clips only get a real `src` once they are on screen; until then the
  // element renders its poster and fetches nothing.
  const [active, setActive] = useState(eager && minWidth === undefined);

  // Viewport gate. Runs before the intersection observer below, and when the
  // viewport is too narrow it simply never activates.
  useEffect(() => {
    if (minWidth === undefined || active) return;
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    if (mq.matches) setActive(true);
  }, [minWidth, active]);

  useEffect(() => {
    if (active || minWidth !== undefined) return;
    const video = videoRef.current;
    if (!video) return;

    // An element hidden with display:none is never intersecting, so this never
    // fires on viewports where the mosaic is hidden.
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [active, minWidth]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;

    const playVideo = () => {
      void video.play().catch(() => undefined);
    };

    playVideo();
    video.addEventListener("canplay", playVideo);
    // A tab restored from the background may have had its parse-time autoplay
    // blocked — retry as soon as the page is visible again.
    document.addEventListener("visibilitychange", playVideo);

    return () => {
      video.removeEventListener("canplay", playVideo);
      document.removeEventListener("visibilitychange", playVideo);
    };
  }, [src, active]);

  return (
    <video
      ref={videoRef}
      autoPlay={active}
      loop
      muted
      playsInline
      preload={active ? "auto" : "none"}
      src={active ? src : undefined}
      className={className}
      /**
       * A viewport-gated clip keeps its poster always: below `minWidth` the clip
       * never loads, so the poster IS the visual.
       *
       * A lazy clip only gets one once active. Browsers fetch `poster` even for a
       * video inside a `display:none` wrapper, so the desktop-only hero mosaic
       * was pulling 129KB of stills onto phones that can never see them.
       */
      poster={minWidth !== undefined || active ? poster : undefined}
      aria-hidden="true"
    />
  );
}
