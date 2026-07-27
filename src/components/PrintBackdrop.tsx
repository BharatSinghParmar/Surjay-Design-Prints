import Image from "next/image";
import { imageAssets } from "@/data/site";

/**
 * The faded hand-print sitting behind a section's content — the treatment the
 * About page "Future Vision" block established. One signature paisley print is
 * used everywhere so it reads as a brand watermark, not as process photography
 * (process imagery stays unique per manufacturing step).
 *
 * The parent section must be `relative` (and ideally `overflow-hidden`);
 * content that should sit above it needs `relative` too.
 */
export function PrintBackdrop({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={imageAssets.handPrintDetail}
        alt=""
        fill
        sizes="100vw"
        className={
          tone === "dark"
            ? "object-cover opacity-10"
            : "object-cover opacity-[0.07] grayscale"
        }
      />
    </div>
  );
}
