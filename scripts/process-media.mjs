#!/usr/bin/env node
/**
 * Turn the raw factory media in media-inbox/ into web-ready assets in public/.
 *
 *   node scripts/process-media.mjs
 *
 * media-inbox/photos/<PROCESS>/ and media-inbox/videos/<PROCESS>/ are organised
 * by process name, so every entry below is addressed as "<FOLDER>/<file>" and
 * the mapping is by folder — never re-inferred from what the picture looks like.
 *
 * Rules this file encodes (from the owner):
 *   • prefer the longest clip in each folder;
 *   • where one process appears on more than one page, take a *different* still
 *     or clip from that folder (the 20s SCREEN PRINTING clip is cut into three
 *     separate segments for exactly this reason);
 *   • every manufacturing step gets its own image — nothing is reused.
 *
 * Photos  → JPEG at the size each slot actually renders at (originals run to
 *           8064px / 12 MB, which is wasteful even behind next/image).
 * Videos  → compressed MP4 (H.264 + faststart) with quiet AAC factory ambience
 *           kept in — inline loops silence it with the `muted` attribute, and
 *           the gallery lightbox exposes a mute/unmute toggle. Each clip also
 *           gets a JPEG poster frame grabbed from the encoded clip; posters are
 *           plain URL attributes, so they bypass next/image and must stay small.
 *
 * ffmpeg's webp encoder is disabled in this build and does not need to be:
 * next/image re-encodes to AVIF/WebP on serve, so a correctly sized JPEG is the
 * right source format.
 *
 * Re-runnable: every output is overwritten from the original each time.
 *
 * Not used, deliberately:
 *   • videos/raw fabric/raw.mp4 (2.0s) and videos/24 HOUR FABRIC PRESERVE (1.6s)
 *     are too short to loop — both folders have good stills instead.
 *   • photos/24 HOUR FABRIC PRESERVE/PHOTO-…-22-56-19.jpg is 701×253, too small
 *     and too letterboxed for any slot on the site.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = join(root, "media-inbox");
const IMG_OUT = join(root, "public", "images");
const VID_OUT = join(root, "public", "videos");

const photo = (f) => join(INBOX, "photos", f);
const video = (f) => join(INBOX, "videos", f);

// A photo slot may be sourced from a clip instead of a still: set
// `fromVideo: true` and `at` (seconds) to grab a frame from videos/<src>.
// `crop: "w:h:x:y"` cuts a source region first (e.g. to frame out a person);
// `enhance: true` applies a light contrast/saturation/sharpen pass for the
// softer phone shots — cleanup only, never changing the content.

/**
 * Photo slots. `w`/`h` are the *maximum* pixel box; the image is scaled to cover
 * and centre-cropped to that aspect. The box is shrunk to whatever the original
 * can actually fill (see `fitBox`) so nothing is ever upscaled — several of the
 * process photos are phone screenshots only a few hundred pixels wide.
 */
const PHOTOS = [
  // ── Raw fabric ──────────────────────────────────────────────────────────
  { src: "raw fabric/IMG_5858.JPG",  out: "raw-bales.jpg", w: 1600, h: 1200, note: "Baled grey fabric in the store" },
  { src: "raw fabric/IMG_5919.JPG",  out: "raw-rolls.jpg", w: 1200, h: 1500, note: "Grey fabric rolls standing, lot-tagged" },

  // ── RFD (ready for dyeing) ──────────────────────────────────────────────
  { src: "RFD/IMG_5867.JPG",                out: "rfd-pile.jpg",   w: 1800, h: 1200, note: "RFD cloth heaped ready for the next batch" },
  { src: "RFD/PHOTO-2026-07-26-23-53-58.jpg", out: "rfd-roller.jpg", w: 1200, h: 900,  note: "Prepared cloth running over the padding roller" },
  { src: "RFD/PHOTO-2026-07-26-23-58-46.jpg", out: "rfd-beam.jpg",   w: 900,  h: 900,  note: "RFD fabric wound onto the beam" },
  // The folder's stills are all small phone shots, so the strongest RFD frame
  // comes from its 4K clip instead (fromVideo pulls a still at `at` seconds).
  { src: "RFD/rfd1.mp4", fromVideo: true, at: 1.6, out: "rfd-winding.jpg", w: 1600, h: 1200, note: "Cream lot winding onto the beam — home timeline" },

  // ── Fabric cleaning & preparation ───────────────────────────────────────
  { src: "FABRIC CLEANING/PHOTO-2026-07-27-00-30-27.jpg", out: "cleaning-tank.jpg",     w: 1200, h: 900,  note: "Operator feeding rope-form cloth into the wash tank" },
  { src: "FABRIC CLEANING/IMG_5869.JPG",                  out: "cleaning-trolley.jpg",  w: 1600, h: 1200, note: "Washed cloth in the stainless trolley" },
  { src: "FABRIC CLEANING/PHOTO-2026-07-26-23-52-57.jpg", out: "cleaning-rollers.jpg",  w: 1600, h: 900,  note: "Cloth passing through the cleaning rollers" },
  { src: "FABRIC CLEANING/PHOTO-2026-07-26-23-55-00.jpg", out: "cleaning-pile.jpg",     w: 640,  h: 480,  note: "Cleaned cloth stacking off the machine" },
  { src: "FABRIC CLEANING/PHOTO-2026-07-27-00-01-24.jpg", out: "cleaning-beam.jpg",     w: 640,  h: 480,  note: "Cleaned cloth wound back onto the beam" },

  // ── Dyeing ──────────────────────────────────────────────────────────────
  { src: "DYEING/PHOTO-2026-07-26-23-06-52.jpg", out: "dyeing-machine.jpg", w: 900, h: 700, note: "Dyeing line, drum loaded and running" },
  { src: "DYEING/PHOTO-2026-07-26-23-02-24.jpg", out: "dye-drum.jpg",       w: 640, h: 480, note: "Dye-loaded drum, close" },

  // ── Silicate & silicone ─────────────────────────────────────────────────
  { src: "SILICATE TREATMENT/PHOTO-2026-07-26-23-05-00.jpg", out: "silicate-treatment.jpg", w: 1250, h: 800, note: "Silicate fixation running over the coated drum" },
  { src: "SILICON TREATMENT/PHOTO-2026-07-26-23-08-45.jpg",  out: "silicone-treatment.jpg", w: 1100, h: 750, note: "Silicone softening line" },
  { src: "SILICON TREATMENT/PHOTO-2026-07-26-23-03-24.jpg",  out: "silicone-magenta.jpg",   w: 900,  h: 500, note: "Softened magenta lot coming off the roll" },

  // ── 24-hour colour fixation ─────────────────────────────────────────────
  { src: "24 HOUR FABRIC PRESERVE/IMG_5913.JPG", out: "fixation-stock.jpg", w: 1600, h: 1200, note: "Dyed lots resting through the 24-hour fixation window" },

  // ── Screen printing ─────────────────────────────────────────────────────
  { src: "SCREEN PRINTING/IMG_5883.JPG", out: "print-green.jpg",        w: 1800, h: 1050, note: "Green repeat running down the printing table" },
  { src: "SCREEN PRINTING/IMG_5885.JPG", out: "print-green-screen.jpg", w: 1600, h: 1050, note: "Green screen lifted, blank cloth ahead of it" },
  { src: "SCREEN PRINTING/IMG_5891.JPG", out: "print-table-dark.jpg",   w: 1600, h: 1200, note: "Printing table between runs, paste still wet" },
  { src: "SCREEN PRINTING/IMG_5892.JPG", out: "print-mono.jpg",         w: 1600, h: 1200, note: "Monochrome paisley repeat on the table" },
  { src: "SCREEN PRINTING/IMG_5896.JPG", out: "print-mono-screen.jpg",  w: 2000, h: 1100, note: "Monochrome run with the screen in position" },

  // ── Hand printing ───────────────────────────────────────────────────────
  { src: "HANDPRINTING/IMG_5902.JPG", out: "hand-print-hall.jpg",   w: 2000, h: 1200, note: "Red bandana print running the length of the hall — site hero" },
  { src: "HANDPRINTING/IMG_5898.JPG", out: "hand-print-table.jpg",  w: 1600, h: 1200, note: "Hand-printed bandana at the table, roll feeding in" },
  { src: "HANDPRINTING/IMG_5899.JPG", out: "hand-print-detail.jpg", w: 1200, h: 1600, note: "Bandana print, close detail" },

  // ── Design & screen preparation ─────────────────────────────────────────
  { src: "DESIGN_SCREEN/CUSTOM_DESIGN_TOOLSETUP.JPG", out: "design-setup.jpg",            w: 1600, h: 900,  note: "Table set up and squared before a custom run" },
  { src: "DESIGN_SCREEN/IMG_5905.JPG",                out: "design-screen.jpg",           w: 1600, h: 1200, note: "Exposed screen positioned on the table" },
  { src: "DESIGN_SCREEN/IMG_5906.JPG",                out: "design-screen-portrait.jpg",  w: 1000, h: 1250, note: "Screen and design station, portrait" },
  { src: "DESIGN_SCREEN/IMG_5910.JPG",                out: "screen-frame.jpg",            w: 1400, h: 1050, note: "Coated screen frame ready for exposure" },

  // ── Pressing ────────────────────────────────────────────────────────────
  { src: "PRESSING/PHOTO-2026-07-26-22-42-18.jpg", out: "pressing-line.jpg",    w: 900,  h: 600, note: "Operator feeding the pressing line" },
  { src: "PRESSING/PHOTO-2026-07-26-22-49-05.jpg", out: "pressing-rollers.jpg", w: 1280, h: 560, note: "Pressed cloth leaving the roller bed" },

  // ── Elongation ──────────────────────────────────────────────────────────
  { src: "ELONGATION/PHOTO-2026-07-26-22-53-18.jpg", out: "elongation-loops.jpg", w: 1000, h: 1000, note: "Cloth plaiting down in loops off the line" },
  { src: "ELONGATION/PHOTO-2026-07-26-22-44-41.jpg", out: "elongation-line.jpg",  w: 1280, h: 600,  note: "Elongation line, width held across the bed" },
  { src: "ELONGATION/PHOTO-2026-07-26-22-57-51.jpg", out: "elongation-feed.jpg",  w: 1200, h: 900,  note: "Cloth feeding into the elongation rollers" },
  { src: "ELONGATION/PHOTO-2026-07-27-00-11-21.jpg", out: "elongation-roll.jpg",  w: 1600, h: 800,  note: "Stabilised lot rolled off beside the print tables" },

  // ── Drying range ────────────────────────────────────────────────────────
  { src: "DRYING RANGE/PHOTO-2026-07-27-00-25-30.jpg", out: "drying-colour.jpg", w: 1560, h: 940, note: "Dyed lots hanging on the drying range" },
  { src: "DRYING RANGE/PHOTO-2026-07-27-00-27-12.jpg", out: "drying-white.jpg",  w: 900,  h: 830, note: "Drying range under the shed roof" },

  // ── Folding ─────────────────────────────────────────────────────────────
  { src: "FOLDING/IMG_5920.JPG", out: "folding.jpg",        w: 1400, h: 1200, note: "Finished cloth folded down by hand" },
  { src: "FOLDING/IMG_5921.JPG", out: "folding-detail.jpg", w: 1200, h: 1450, note: "Fold being squared before inspection" },

  // ── Quality inspection ──────────────────────────────────────────────────
  { src: "QUALITY INSPECTION/PHOTO-2026-07-27-00-22-46.jpg", out: "quality-inspection.jpg", w: 740, h: 950, note: "Print and shade checked against the light" },
  { src: "QUALITY INSPECTION/PHOTO-2026-07-27-00-23-55.jpg", out: "quality-table.jpg",      w: 770, h: 930, note: "Second check on the inspection table" },

  // ── Packaging ───────────────────────────────────────────────────────────
  { src: "PACKAGING/PHOTO-2026-07-27-01-00-11.jpg", out: "packaging.jpg", w: 1030, h: 630, note: "Wrapped bales staged for dispatch" },

  // ── Market-ready fabric ─────────────────────────────────────────────────
  { src: "MARKET READY FABRIC/IMG_5914.JPG",                out: "market-ready.jpg",       w: 1600, h: 1200, note: "Finished lots racked and tied, ready to ship" },
  { src: "MARKET READY FABRIC/IMG_5915.JPG",                out: "market-ready-wide.jpg",  w: 2000, h: 950,  note: "Finished-goods store, wide" },
  { src: "MARKET READY FABRIC/PHOTO-2026-07-27-00-09-14.jpg", out: "market-ready-rolls.jpg", w: 900, h: 600,  note: "Rolled stock stacked for collection" },

  // ── Social preview card ─────────────────────────────────────────────────
  { src: "HANDPRINTING/IMG_5902.JPG", out: "og-cover.jpg", w: 1200, h: 630, note: "OG / social share card" },

  // ── Print-safe JPEGs for the company profile PDF ────────────────────────
  { src: "HANDPRINTING/IMG_5902.JPG",                        out: "pdf-hero.jpg",         w: 1800, h: 1100, note: "PDF cover" },
  { src: "raw fabric/IMG_5858.JPG",                          out: "pdf-raw-fabric.jpg",   w: 1400, h: 1050, note: "PDF raw fabric" },
  { src: "RFD/IMG_5867.JPG",                                 out: "pdf-rfd.jpg",          w: 1400, h: 1050, note: "PDF RFD" },
  { src: "FABRIC CLEANING/IMG_5869.JPG",                     out: "pdf-cleaning.jpg",     w: 1050, h: 1400, enhance: true, note: "PDF cleaning — washed cloth in the trolley (no operator)" },
  { src: "DYEING/PHOTO-2026-07-26-23-06-52.jpg",             out: "pdf-dyeing.jpg",       w: 800,  h: 600,  enhance: true, note: "PDF dyeing" },
  { src: "SCREEN PRINTING/IMG_5883.JPG",                     out: "pdf-printing.jpg",     w: 1400, h: 900,  note: "PDF screen printing" },
  { src: "SCREEN PRINTING/IMG_5892.JPG",                     out: "pdf-mono.jpg",         w: 1400, h: 1050, note: "PDF monochrome print" },
  { src: "HANDPRINTING/IMG_5899.JPG",                        out: "pdf-hand-print.jpg",   w: 1400, h: 1050, note: "PDF hand printing" },
  { src: "DESIGN_SCREEN/IMG_5905.JPG",                       out: "pdf-screen.jpg",       w: 1400, h: 1050, note: "PDF screen preparation" },
  { src: "24 HOUR FABRIC PRESERVE/IMG_5913.JPG",             out: "pdf-fixation.jpg",     w: 1400, h: 1050, note: "PDF colour fixation" },
  { src: "PRESSING/PHOTO-2026-07-26-22-49-05.jpg",           out: "pdf-pressing.jpg",     w: 1280, h: 560,  enhance: true, note: "PDF pressing — roller bed (no operator)" },
  { src: "ELONGATION/PHOTO-2026-07-27-00-11-21.jpg",         out: "pdf-elongation.jpg",   w: 1400, h: 700,  note: "PDF elongation" },
  { src: "DRYING RANGE/PHOTO-2026-07-27-00-25-30.jpg",       out: "pdf-drying.jpg",       w: 1400, h: 840,  note: "PDF drying range" },
  { src: "FOLDING/IMG_5921.JPG", crop: "1500:1350:1085:900", out: "pdf-folding.jpg",      w: 1400, h: 1250, note: "PDF folding — folded lot, framed to exclude the operator" },
  { src: "MARKET READY FABRIC/IMG_5915.JPG",                 out: "pdf-stock.jpg",        w: 1600, h: 1000, note: "PDF finished-goods store" },
  { src: "MARKET READY FABRIC/IMG_5914.JPG",                 out: "pdf-market-ready.jpg", w: 1400, h: 1050, note: "PDF market-ready stock" }
];

/**
 * Video slots. Most clips are 3-5s and are used whole so the loop has as much
 * material as possible; only the 20s SCREEN PRINTING clip is cut, into three
 * non-overlapping segments so the home hero, the process page and the gallery
 * each show a different part of the hall.
 *
 * Omit `start`/`duration` to keep the whole clip. `posterAt` is the fraction of
 * the encoded clip the poster frame is taken from (0.4 by default) — bumped on a
 * couple of clips where a later frame is far more representative.
 */
const VIDEOS = [
  // SCREEN PRINTING — one 20s take, three segments (see note above)
  { src: "SCREEN PRINTING/screenprinting.mp4", out: "screen-printing.mp4",       poster: "screen-printing-poster.jpg",       start: 13.4, duration: 6.6, note: "Green repeat being pulled — home hero" },
  { src: "SCREEN PRINTING/screenprinting.mp4", out: "screen-printing-table.mp4", poster: "screen-printing-table-poster.jpg", start: 7.4,  duration: 5.6, note: "Red bandana table + carriage — process page" },
  { src: "SCREEN PRINTING/screenprinting.mp4", out: "screen-printing-run.mp4",   poster: "screen-printing-run-poster.jpg",   start: 1.0,  duration: 5.6, note: "Cloth feeding onto the table past the screen racks — gallery" },

  { src: "HANDPRINTING/handprinting.mp4",            out: "hand-printing.mp4",      poster: "hand-printing-poster.jpg",      note: "Hand printing at the long table" },
  { src: "DYEING/chemical.mp4",                      out: "dyeing.mp4",             poster: "dyeing-poster.jpg",             posterAt: 0.78, note: "Dyeing — lot running on the drum" },
  { src: "DYEING/Untitled design.mp4",               out: "dye-drum.mp4",           poster: "dye-drum-poster.jpg",           note: "Dye drum turning (second dyeing angle)" },
  { src: "FABRIC CLEANING/afterclean.mp4",           out: "fabric-cleaning.mp4",    poster: "fabric-cleaning-poster.jpg",    note: "Cloth pulled through the wash tank" },
  { src: "RFD/rfd.mp4",                              out: "rfd.mp4",                poster: "rfd-poster.jpg",                note: "RFD cloth winding onto the beam" },
  { src: "SILICON TREATMENT/Untitled design.mp4",    out: "silicone.mp4",           poster: "silicone-poster.jpg",           note: "Silicone softening line" },
  { src: "PRESSING/pressing.mp4",                    out: "pressing.mp4",           poster: "pressing-poster.jpg",           note: "Pressing line running" },
  { src: "ELONGATION/elongation.mp4",                out: "elongation.mp4",         poster: "elongation-poster.jpg",         posterAt: 0.9, note: "Elongation line — home hero background" },
  { src: "ELONGATION/onlyelongation.mp4",            out: "elongation-run.mp4",     poster: "elongation-run-poster.jpg",     note: "Roller bed feeding cloth — live tile in the home hero mosaic" },
  { src: "ELONGATION/Untitled design.mp4",           out: "elongation-wide.mp4",    poster: "elongation-wide-poster.jpg",    posterAt: 0.4, note: "Wide sweep down the elongation line — infrastructure machinery section" },
  { src: "DRYING RANGE/drying.mp4",                  out: "drying-range.mp4",       poster: "drying-range-poster.jpg",       note: "Drying range" },
  { src: "QUALITY INSPECTION/qualitycheck.mp4",      out: "quality-inspection.mp4", poster: "quality-inspection-poster.jpg", note: "Shade and print checked by hand" },
  { src: "MARKET READY FABRIC/marketready.mp4",      out: "market-ready.mp4",       poster: "market-ready-poster.jpg",       note: "Finished stock in the dispatch store" }
];

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: ["ignore", "ignore", "pipe"] });
}

function mb(p) {
  return (statSync(p).size / 1024 / 1024).toFixed(2);
}

/** Decoded (EXIF/rotation-corrected) dimensions — phone stills are often stored sideways. */
function sourceSize(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-select_streams", "v:0",
     "-show_entries", "stream=width,height:side_data=rotation",
     "-of", "default=noprint_wrappers=1:nokey=0", file],
    { encoding: "utf8" }
  );
  const w = Number(/^width=(\d+)/m.exec(out)?.[1]);
  const h = Number(/^height=(\d+)/m.exec(out)?.[1]);
  const rotation = Math.abs(Number(/^rotation=(-?\d+)/m.exec(out)?.[1] ?? 0)) % 180;
  return rotation === 90 ? { w: h, h: w } : { w, h };
}

/**
 * Largest box of the requested aspect that the original can fill without being
 * upscaled. Dimensions are forced even so libx264 stays happy.
 */
function fitBox(box, src) {
  const aspect = box.w / box.h;
  const maxW = src.w / src.h > aspect ? src.h * aspect : src.w;
  const scale = Math.min(1, maxW / box.w);
  const even = (n) => Math.max(2, Math.round(n / 2) * 2);
  return { w: even(box.w * scale), h: even(box.h * scale) };
}

mkdirSync(IMG_OUT, { recursive: true });
mkdirSync(VID_OUT, { recursive: true });

let missing = 0;

console.log("── Photos ─────────────────────────────────────────────");
for (const p of PHOTOS) {
  const src = p.fromVideo ? video(p.src) : photo(p.src);
  if (!existsSync(src)) {
    console.warn(`  ⚠ missing ${p.src} — skipped`);
    missing += 1;
    continue;
  }
  const dest = join(IMG_OUT, p.out);
  const srcSize = p.crop
    ? { w: Number(p.crop.split(":")[0]), h: Number(p.crop.split(":")[1]) }
    : sourceSize(src);
  const { w, h } = fitBox({ w: p.w, h: p.h }, srcSize);
  // Optional region crop, then scale to cover the target box and centre-crop.
  const filters = [
    ...(p.crop ? [`crop=${p.crop}`] : []),
    `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`,
    ...(p.enhance ? ["eq=contrast=1.05:saturation=1.12:brightness=0.015", "unsharp=5:5:0.5:5:5:0.0"] : [])
  ];
  run("ffmpeg", [
    "-y",
    ...(p.fromVideo ? ["-ss", String(p.at ?? 0)] : []),
    "-i", src,
    ...(p.fromVideo ? ["-frames:v", "1"] : []),
    "-vf", filters.join(","),
    "-q:v", "5",
    dest
  ]);
  const capped = w !== p.w ? ` (capped from ${p.w}×${p.h})` : "";
  console.log(`  ✓ ${p.out.padEnd(26)} ${w}×${h}${capped}  ${mb(dest)}MB   ${p.note}`);
}

console.log("\n── Videos ─────────────────────────────────────────────");
for (const v of VIDEOS) {
  const src = video(v.src);
  if (!existsSync(src)) {
    console.warn(`  ⚠ missing ${v.src} — skipped`);
    missing += 1;
    continue;
  }
  const dest = join(VID_OUT, v.out);
  // 1280x720 + faststart so playback can begin before the file has fully
  // downloaded. -ss before -i seeks fast; the crop handles rotated phone footage.
  run("ffmpeg", [
    "-y",
    ...(v.start ? ["-ss", String(v.start)] : []),
    "-i", src,
    ...(v.duration ? ["-t", String(v.duration)] : []),
    "-map", "0:v:0", "-map", "0:a:0?",
    "-c:a", "aac", "-b:a", "96k", "-ac", "1",
    "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "28",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    dest
  ]);

  // Poster comes from the *encoded* clip so it always matches frame one of the
  // loop, and stays small because it bypasses next/image.
  const posterDest = join(IMG_OUT, v.poster);
  const clipLength = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", dest], { encoding: "utf8" }).trim()
  );
  run("ffmpeg", [
    "-y",
    "-ss", (clipLength * (v.posterAt ?? 0.4)).toFixed(2),
    "-i", dest,
    "-frames:v", "1",
    "-q:v", "5",
    posterDest
  ]);

  console.log(
    `  ✓ ${v.out.padEnd(26)} ${clipLength.toFixed(2)}s  ${mb(dest)}MB  + poster ${mb(posterDest)}MB   ${v.note}`
  );
}

console.log(
  `\nDone${missing ? ` — ${missing} source(s) missing` : ""}. Sources are untouched in media-inbox/.`
);
