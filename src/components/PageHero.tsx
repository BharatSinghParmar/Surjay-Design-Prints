import Image from "next/image";
import { imageAssets } from "@/data/site";

export function PageHero({
  eyebrow,
  title,
  body,
  image = imageAssets.hero
}: {
  eyebrow: string;
  title: string;
  body: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pt-32 text-white md:pt-40">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover opacity-40"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/82 to-navy/28" />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/68">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold tracking-normal md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">{body}</p>
      </div>
    </section>
  );
}
