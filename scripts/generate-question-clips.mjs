#!/usr/bin/env node
/**
 * Animate the question cards into 4-second clips.
 *
 *   node scripts/generate-question-clips.mjs
 *   node scripts/generate-question-clips.mjs --only=1,7 --format=landscape
 *
 * Output: question-cards/NN-slug-{portrait,landscape}.mp4 — 4s, 30fps.
 *
 * Visuals are pulled from generate-question-cards.mjs rather than restated, so a
 * clip is always the same artwork as its PNG. Only motion is added here.
 *
 * Four seconds is generous next to the 1s stage banners, so the question reveals
 * a line at a time rather than arriving whole — the viewer reads it at the pace
 * it appears, and the card is fully settled with over a second still to run.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, renameSync, statSync, rmSync, copyFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { QUESTIONS, card } from "./generate-question-cards.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "question-cards");
const PROJ = join(root, "videos", "surjay-question-clips");
const DURATION = 4;

const slug = (t) =>
  t.replace(/\n/g, " ").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42);

/** Split the finished card into the pieces a composition needs. */
function parts(q, format) {
  const html = card(q, format);
  const css = html.slice(html.indexOf("<style>") + 7, html.indexOf("</style>"));
  const body = html.slice(html.indexOf("<body>") + 6, html.indexOf("</body>"));
  const fonts = html.slice(html.indexOf('<link rel="preconnect"'), html.indexOf("<style>"));
  return { css, body, fonts };
}

function composition(q, format) {
  const portrait = format === "portrait";
  const W = portrait ? 1080 : 1920;
  const H = portrait ? 1920 : 1080;
  const { css, body, fonts } = parts(q, format);
  const lineCount = q.short.split("\n").length;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=${W}, height=${H}" />
${fonts}
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
${css}
  /* The producer can drop a background set on the root itself, so the navy is
     repainted by a full-bleed child inside the composition. */
  #root { position:relative; width:${W}px; height:${H}px; overflow:hidden; }
  #fill { position:absolute; inset:0; background:#08162d; }
  #drift { position:absolute; inset:0; }
  /* Each question line animates on its own, so they are split into spans. */
  h1 .ln { display:block; }
</style></head>
<body>
  <div id="root" data-composition-id="main" data-start="0"
       data-width="${W}" data-height="${H}" data-duration="${DURATION}">
    <section id="stage" class="clip" data-start="0" data-duration="${DURATION}" data-track-index="1">
      <div id="fill"></div>
      <div id="drift">
${body.replace(/<h1>([\s\S]*?)<\/h1>/, (_, inner) =>
    `<h1>${inner.split("<br>").map((l) => `<span class="ln">${l}</span>`).join("")}</h1>`)}
      </div>
    </section>
  </div>
<script>
  window.__timelines = window.__timelines || {};
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(".quote", { opacity: 0, scale: 0.7, y: 20, transformOrigin: "0% 100%" },
    { opacity: 0.55, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, 0);
  tl.fromTo(".theme", { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0.2);

  // A line at a time: the viewer reads at the pace the question appears.
  tl.fromTo("h1 .ln", { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.46, ease: "power3.out", stagger: 0.13 }, 0.36);

  tl.fromTo(".rule", { scaleX: 0, transformOrigin: "left center" },
    { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, ${(0.36 + lineCount * 0.13 + 0.2).toFixed(2)});
  tl.fromTo("footer", { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.44, ease: "power3.out" }, ${(0.36 + lineCount * 0.13 + 0.3).toFixed(2)});

  // Ambient for the full run so nothing sits frozen while the viewer reads.
  tl.fromTo(".ribbon", { xPercent: -1.5 }, { xPercent: 1.5, duration: ${DURATION}, ease: "sine.inOut" }, 0);
  tl.fromTo(".vignette", { opacity: 0.84 }, { opacity: 1, duration: ${DURATION}, ease: "sine.inOut" }, 0);
  tl.fromTo("#drift", { scale: 1, transformOrigin: "50% 48%" },
    { scale: 1.03, duration: ${DURATION}, ease: "none" }, 0);

  tl.seek(0);
  window.__timelines["main"] = tl;
</script>
</body></html>`;
}

// ── Render ──────────────────────────────────────────────────────────────────
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice(7).split(",").map(Number)) : null;
const fmtArg = process.argv.find((a) => a.startsWith("--format="));
const formats = fmtArg ? [fmtArg.slice(9)] : ["portrait", "landscape"];

if (!existsSync(join(PROJ, "hyperframes.json"))) {
  mkdirSync(dirname(PROJ), { recursive: true });
  execFileSync("npx", ["hyperframes", "init", PROJ, "--non-interactive", "--example=blank", "--skill=motion-graphics"],
    { stdio: ["ignore", "ignore", "pipe"] });
}
mkdirSync(OUT, { recursive: true });
mkdirSync(join(PROJ, "silent"), { recursive: true });

let made = 0;
for (const q of QUESTIONS) {
  if (only && !only.has(q.n)) continue;
  for (const format of formats) {
    const base = `${String(q.n).padStart(2, "0")}-${slug(q.short)}-${format}`;
    writeFileSync(join(PROJ, "index.html"), composition(q, format), "utf8");

    const tmp = join(PROJ, "renders", "clip.mp4");
    rmSync(tmp, { force: true });
    execFileSync("npx", ["hyperframes", "render", ".", "-q", "high", "-o", "./renders/clip.mp4"],
      { cwd: PROJ, stdio: ["ignore", "ignore", "pipe"] });

    copyFileSync(tmp, join(PROJ, "silent", `${base}.mp4`));
    const dest = join(OUT, `${base}.mp4`);
    renameSync(tmp, dest);
    console.log(`  ✓ ${base.padEnd(56)} ${(statSync(dest).size / 1024).toFixed(0)} KB`);
    made += 1;
  }
}
console.log(`\nDone. ${made} clip(s) in question-cards/`);
