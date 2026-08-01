"use client";

import Image from "next/image";
import { MediaLightbox } from "@/components/MediaLightbox";

export type LightboxPhoto = { img: string; label: string };

/**
 * Full-screen photo popup for the gallery, sharing MediaLightbox's dialog
 * behaviour with the video version.
 *
 * `index` steps through the supplied set, so a visitor can move along the grid
 * with the arrow buttons or the left/right keys instead of closing and
 * reopening for each photo.
 */
export function PhotoLightbox({
  open,
  onClose,
  photos,
  index,
  onIndexChange
}: {
  open: boolean;
  onClose: () => void;
  photos: LightboxPhoto[];
  index: number;
  onIndexChange: (next: number) => void;
}) {
  const photo = photos[index];
  if (!photo) return null;

  const step = (delta: number) =>
    onIndexChange((index + delta + photos.length) % photos.length);

  return (
    <MediaLightbox
      open={open}
      onClose={onClose}
      label={photo.label}
      ariaLabel={`Photo: ${photo.label}`}
      position={`${index + 1} / ${photos.length}`}
      onPrev={photos.length > 1 ? () => step(-1) : undefined}
      onNext={photos.length > 1 ? () => step(1) : undefined}
    >
      <div className="relative flex max-h-[75vh] min-h-[240px] w-full items-center justify-center bg-black">
        <Image
          key={photo.img}
          src={photo.img}
          alt={`${photo.label} at Surjay Design & Prints`}
          width={1600}
          height={1200}
          sizes="(min-width: 1024px) 60vw, 100vw"
          // contain, not cover: the gallery mixes 4:3 and 3:4 shots and the whole
          // frame should be visible once enlarged.
          className="max-h-[75vh] w-auto object-contain"
          priority
        />
      </div>
    </MediaLightbox>
  );
}
