#!/usr/bin/env node
/**
 * Turn the still stage cards into short animated clips for the walkthrough Short.
 *
 *   node scripts/generate-video-banner-clips.mjs
 *   node scripts/generate-video-banner-clips.mjs --only=0,4,15
 *
 * Output: video-banners/NN-slug.mp4 at 1080x1920, 30fps.
 *   • the 17 stage cards run 1s
 *   • the manufacturing opener runs 2s — it carries more text and is setting up
 *     the whole video, so it needs longer to land
 *
 * The visuals are imported from generate-video-banners.mjs rather than restated,
 * so a clip is always the same artwork as its PNG. Only motion is added here.
 *
 * Why not an image-to-video model: these cards are mostly type, and those models
 * warp text badly. Rendering the motion for real keeps every letter sharp.
 *
 * Motion budget at 1s is unforgiving — the card has to be readable almost
 * immediately. So the type settles inside the first third and the rest of the
 * clip is continuous ambient motion (ribbon drift, glow breath, slow push-in)
 * rather than anything that still needs reading.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, renameSync, statSync, rmSync, copyFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  W, H, CARDS, FONT_LINKS, cardCss, cardBody
} from "./generate-video-banners.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "video-banners");
const PROJ = join(root, "videos", "surjay-banner-clips");

const slug = (t) =>
  t.replace(/\n/g, " ").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * One HyperFrames composition per card.
 *
 * `d` is the clip length. Entrances are scaled to it so the 2s opener breathes
 * rather than simply holding the 1s timing for twice as long.
 */
function composition(s, d) {
  const intro = Boolean(s.intro);
  const outro = Boolean(s.outro);
  // Entrance occupies the first third; the remainder is ambient hold.
  const k = d / 1.0;
  const t = (v) => +(v * k).toFixed(3);

  /**
   * The sign-off has none of a stage card's furniture — no headline, rule or
   * footer — so it gets its own choreography: the mark lands first, then the
   * name, then the contact rows arrive one after another. Staggering the rows
   * is what makes a viewer's eye walk down them rather than seeing a block.
   */
  const outroMotion = `
  tl.fromTo(".outro-mark", { opacity: 0, scale: 0.86, transformOrigin: "0% 50%" },
    { opacity: 1, scale: 1, duration: 0.42, ease: "back.out(1.7)" }, 0);
  tl.fromTo(".eyebrow", { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.34, ease: "power3.out" }, 0.2);
  tl.fromTo(".outro-name", { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.44, ease: "power3.out" }, 0.3);
  tl.fromTo(".outro-tag", { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0.46);
  tl.fromTo(".row", { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.12 }, 0.6);`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=${W}, height=${H}" />
${FONT_LINKS}
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
${cardCss(s)}
  /* The producer can drop a background set on the root element itself, so the
     navy is repainted by a full-bleed child inside the composition. */
  #root { position:relative; width:${W}px; height:${H}px; overflow:hidden; }
  #fill { position:absolute; inset:0; background:${"#08162d"}; }
  /* Ambient drift lives on wrappers so it never fights the entrance tweens. */
  #drift { position:absolute; inset:0; }
</style></head>
<body>
  <div id="root" data-composition-id="main" data-start="0"
       data-width="${W}" data-height="${H}" data-duration="${d}">
    <section id="stage" class="clip" data-start="0" data-duration="${d}" data-track-index="1">
      <div id="fill"></div>
      <div id="drift">
${cardBody(s)}
      </div>
    </section>
  </div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });

  // ── entrance: readable almost immediately ────────────────────────────────
${outro ? outroMotion : `  tl.fromTo(".eyebrow", { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: ${t(0.26)}, ease: "power3.out" }, 0);
  ${intro ? "" : `tl.fromTo(".stage-no", { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: ${t(0.26)}, ease: "power3.out" }, ${t(0.06)});`}
  tl.fromTo("h1", { opacity: 0, y: 34 },
    { opacity: 1, y: 0, duration: ${t(0.34)}, ease: "power3.out" }, ${t(0.08)});
  tl.fromTo(".rule", { scaleX: 0, transformOrigin: "left center" },
    { scaleX: 1, duration: ${t(0.3)}, ease: "power3.inOut" }, ${t(0.2)});
  tl.fromTo(".line", { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: ${t(0.3)}, ease: "power3.out" }, ${t(0.22)});
  tl.fromTo("footer", { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: ${t(0.32)}, ease: "power3.out" }, ${t(0.26)});
  tl.fromTo(".ghost", { opacity: 0 },
    { opacity: 1, duration: ${t(0.5)}, ease: "power2.out" }, 0);`}

  // ── ambient: runs the whole clip so nothing ever sits frozen ─────────────
  // The ribbon is an SVG that already bleeds past both edges, so sliding it
  // reads as cloth moving rather than a layer shifting.
  tl.fromTo(".ribbon", { xPercent: -1.6 },
    { xPercent: 1.6, duration: ${d}, ease: "sine.inOut" }, 0);
  tl.fromTo(".vignette", { opacity: 0.82 },
    { opacity: 1, duration: ${d}, ease: "sine.inOut" }, 0);
  // A slow push-in on the whole card. Small on purpose — at this length a
  // bigger move reads as drift rather than intent.
  tl.fromTo("#drift", { scale: 1, transformOrigin: "50% 46%" },
    { scale: ${outro ? 1.025 : intro ? 1.03 : 1.022}, duration: ${d}, ease: "none" }, 0);

  tl.seek(0);
  window.__timelines["main"] = tl;
</script>
</body></html>`;
}

// ── Render ──────────────────────────────────────────────────────────────────
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg
  ? new Set(onlyArg.slice("--only=".length).split(",").map((n) => Number(n)))
  : null;

if (!existsSync(join(PROJ, "hyperframes.json"))) {
  mkdirSync(dirname(PROJ), { recursive: true });
  execFileSync(
    "npx",
    ["hyperframes", "init", PROJ, "--non-interactive", "--example=blank", "--skill=motion-graphics"],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
}

mkdirSync(OUT, { recursive: true });
const cards = CARDS;
let made = 0;

for (const s of cards) {
  if (only && !only.has(s.n)) continue;
  const base = s.file ?? `${String(s.n).padStart(2, "0")}-${slug(s.title)}`;
  // The opener and the sign-off both declare their own length; stages run 1s.
  const seconds = s.seconds ?? (s.intro ? 2 : 1);

  writeFileSync(join(PROJ, "index.html"), composition(s, seconds), "utf8");

  const tmp = join(PROJ, "renders", "clip.mp4");
  rmSync(tmp, { force: true });
  execFileSync(
    "npx",
    ["hyperframes", "render", ".", "-q", "high", "-o", "./renders/clip.mp4"],
    { cwd: PROJ, stdio: ["ignore", "ignore", "pipe"] }
  );

  // Keep a silent master. Scored clips live in video-banners/, and re-running
  // this script would otherwise overwrite the audio with a silent render and
  // leave nothing to re-score from.
  const silentDir = join(PROJ, "silent");
  mkdirSync(silentDir, { recursive: true });
  copyFileSync(tmp, join(silentDir, `${base}.mp4`));

  const dest = join(OUT, `${base}.mp4`);
  renameSync(tmp, dest);
  const kb = (statSync(dest).size / 1024).toFixed(0);
  console.log(`  ✓ ${base.padEnd(34)} ${seconds}s  ${kb} KB`);
  made += 1;
}

console.log(`\nDone. ${made} clip(s) in video-banners/`);
