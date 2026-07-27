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
};

export function HeroBackgroundVideo({
  src,
  poster,
  className,
  eager = false
}: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Lazy clips only get a real `src` once they are on screen; until then the
  // element renders its poster and fetches nothing.
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (active) return;
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
  }, [active]);

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
      poster={poster}
      aria-hidden="true"
    />
  );
}
