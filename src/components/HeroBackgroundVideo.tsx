"use client";

import { useEffect, useRef } from "react";

type HeroBackgroundVideoProps = {
  src: string;
  poster: string;
  className?: string;
};

export function HeroBackgroundVideo({ src, poster, className }: HeroBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;

    const playVideo = () => {
      void video.play().catch(() => undefined);
    };

    playVideo();
    video.addEventListener("canplay", playVideo);

    return () => {
      video.removeEventListener("canplay", playVideo);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      src={src}
      className={className}
      poster={poster}
      aria-hidden="true"
    />
  );
}
