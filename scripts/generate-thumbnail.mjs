#!/usr/bin/env node
/**
 * YouTube thumbnails for the founder-interview videos.
 *
 *   node scripts/generate-thumbnail.mjs --n=1
 *   node scripts/generate-thumbnail.mjs --n=1 --photo=media-inbox/owner-interview/ajay.jpg
 *
 * Output: brand/thumbnails/NN-thumbnail.png at 1280x720.
 *
 * Design rules a thumbnail actually lives or dies by:
 *   • it is seen at ~210x118 in a sidebar, so text must be BIG and short —
 *     three or four words, never a sentence;
 *   • a human face lifts click-through more than any graphic, so the portrait
 *     gets a full half of the frame, not a corner badge;
 *   • it must read against both light and dark YouTube themes, hence the solid
 *     navy field rather than anything translucent.
 *
 * PHOTO: pass --photo with a photograph of the founder; without one the frame
 * renders a marked placeholder rather than guessing.
 *
 * public/images/ceo.jpeg IS Ajay Soni — confirmed by the owner. It is a formal
 * studio shot on light grey, so it needs the gradient feather below rather than
 * being dropped straight onto the navy. Frames pulled from the interview footage
 * will suit the in-factory videos better than this portrait does.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "brand", "thumbnails");

const W = 1280;
const H = 720;
const C = { navy: "#08162d", magenta: "#a40f5f", wine: "#65123f", gold: "#c9a84c" };

/** Short, punchy — never the full question. Sized to be legible at 210px wide. */
const THUMBS = {
  1:  { kicker: "Meet the founder", head: "WHO\nWE ARE", foot: "Textile dyeing & printing · Bagru, Jaipur" },
  2:  { kicker: "The beginning",    head: "HOW IT\nSTARTED", foot: "Surjay Design & Print · since 2010" },
  3:  { kicker: "The hard years",   head: "THE\nTOUGH\nYEARS", foot: "What got us through" },
  4:  { kicker: "What changed",     head: "WHAT\nCHANGED", foot: "16 years in textiles" },
  5:  { kicker: "Pride",            head: "WHAT WE'RE\nPROUD OF", foot: "Surjay Design & Print" },
  6:  { kicker: "The buyers",       head: "WHO WE\nSUPPLY", foot: "Wholesalers · Garment makers" },
  7:  { kicker: "The difference",   head: "WHY\nUS?", foot: "What sets our processing apart" },
  8:  { kicker: "The constraint",   head: "WHAT\nHOLDS US\nBACK", foot: "Honest answer" },
  9:  { kicker: "How orders come",  head: "HOW\nORDERS\nCOME", foot: "Referrals, repeats & walk-ins" },
  10: { kicker: "Raw fabric",       head: "WHERE THE\nFABRIC\nCOMES FROM", foot: "Sourcing & quality checks" },
  11: { kicker: "Preparation",      head: "BEFORE\nTHE DYE", foot: "Why RFD comes first" },
  12: { kicker: "Printing",         head: "SCREEN\nvs HAND", foot: "When we use each" },
  13: { kicker: "Finishing",        head: "THE FINAL\nSTEPS", foot: "Before it leaves the factory" },
  14: { kicker: "The next years",   head: "WHERE\nWE'RE\nGOING", foot: "The next three years" },
  15: { kicker: "No constraints",   head: "IF MONEY\nWERE NO\nOBJECT", foot: "What we'd do first" },
  16: { kicker: "Going wider",      head: "PAN-INDIA\n& EXPORT", foot: "What it would take" },
  17: { kicker: "For a partner",    head: "WHAT YOU\nSHOULD\nKNOW", foot: "For buyers & partners" }
};

const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};

const n = Number(arg("n", "1"));
const t = THUMBS[n];
if (!t) {
  console.error(`✗ No thumbnail defined for video ${n}. Valid: 1-17.`);
  process.exit(1);
}

const photoArg = arg("photo", null);
const photoPath = photoArg ? resolve(root, photoArg) : null;
const hasPhoto = photoPath && existsSync(photoPath);
if (photoArg && !hasPhoto) {
  console.error(`✗ Photo not found: ${photoPath}`);
  process.exit(1);
}
const photoData = hasPhoto
  ? `data:image/${photoPath.split(".").pop().replace("jpg", "jpeg")};base64,${readFileSync(photoPath).toString("base64")}`
  : null;

const logoData = readFileSync(join(root, "public", "logo.png")).toString("base64");
const headLines = t.head.split("\n");
// Long heads step down so three lines still clear the portrait column.
const headSize = headLines.length >= 3 ? 96 : headLines.length === 2 ? 118 : 132;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; }
  body { background:${C.navy}; font-family:'Inter',Arial,sans-serif; color:#fff; overflow:hidden; position:relative; }

  .vignette { position:absolute; inset:0;
    background: radial-gradient(70% 100% at 22% 45%, rgba(164,15,95,.28) 0%, rgba(8,22,45,0) 62%); }
  .weave { position:absolute; inset:0; opacity:.03;
    background-image:
      repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 6px),
      repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 6px); }

  /* Portrait owns the right half. A face is the single biggest lever on
     click-through, so it is not reduced to a corner badge. */
  .photo-col {
    position:absolute; right:0; top:0; width:530px; height:${H}px; overflow:hidden;
  }
  .photo-col img { width:100%; height:100%; object-fit:cover; object-position:center 18%; }
  /* Feathered edge so the portrait sits in the field rather than on it. */
  .photo-col::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg, ${C.navy} 0%, rgba(8,22,45,.55) 22%, rgba(8,22,45,0) 55%);
  }
  .placeholder {
    width:100%; height:100%; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:18px; text-align:center;
    background:repeating-linear-gradient(45deg,#16233d 0 22px,#1b2a47 22px 44px);
    color:rgba(255,255,255,.5); padding:0 40px;
  }
  .placeholder .big { font-size:60px; }
  .placeholder .t { font-size:22px; line-height:1.4; letter-spacing:.02em; }

  .copy { position:absolute; left:64px; top:0; height:${H}px; width:700px;
    display:flex; flex-direction:column; justify-content:center; }
  .kicker {
    font-size:26px; font-weight:700; letter-spacing:.34em; text-transform:uppercase;
    color:${C.gold}; margin-bottom:20px;
  }
  h1 {
    font-family:'Antonio',sans-serif; font-weight:700; text-transform:uppercase;
    font-size:${headSize}px; line-height:.92; letter-spacing:-.01em; color:#fff;
    text-shadow:0 6px 30px rgba(0,0,0,.5);
  }
  .rule { width:130px; height:8px; margin:26px 0 22px; border-radius:999px;
    background:linear-gradient(90deg,${C.magenta},${C.gold}); }
  .foot { font-size:25px; color:rgba(244,246,248,.82); max-width:600px; line-height:1.3; }

  .brand {
    position:absolute; left:64px; bottom:44px;
    display:flex; align-items:center; gap:16px;
  }
  .brand img { width:76px; height:76px; object-fit:contain;
    background:#fff; border-radius:16px; padding:6px 6px 9px; }
  .brand .n { font-family:'Antonio',sans-serif; font-weight:600; font-size:27px; letter-spacing:.02em; }
</style></head>
<body>
  <div class="vignette"></div>
  <div class="weave"></div>

  <div class="photo-col">
    ${hasPhoto
      ? `<img src="${photoData}" alt="">`
      : `<div class="placeholder">
           <div class="big">👤</div>
           <div class="t"><b>PHOTO GOES HERE</b><br>Re-run with --photo=&lt;path to a real
           photograph of Ajay Soni&gt;</div>
         </div>`}
  </div>

  <div class="copy">
    <div class="kicker">${t.kicker}</div>
    <h1>${headLines.join("<br>")}</h1>
    <div class="rule"></div>
    <div class="foot">${t.foot}</div>
  </div>

  <div class="brand">
    <img src="data:image/png;base64,${logoData}" alt="">
    <div class="n">Surjay Design &amp; Print</div>
  </div>
</body></html>`;

const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome"
].filter(Boolean).find((p) => existsSync(p));

if (!CHROME) {
  console.error("✗ No Chrome found. Set CHROME_PATH.");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const base = `${String(n).padStart(2, "0")}-thumbnail${hasPhoto ? "" : "-NEEDS-PHOTO"}`;
const htmlPath = join(OUT, `${base}.html`);
const pngPath = join(OUT, `${base}.png`);
writeFileSync(htmlPath, html, "utf8");

execFileSync(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--force-device-scale-factor=1", `--window-size=${W},${H}`,
  "--virtual-time-budget=8000",
  `--screenshot=${pngPath}`, `file://${htmlPath}`
], { stdio: ["ignore", "ignore", "pipe"] });

console.log(`  ✓ ${base}.png  ${W}x${H}  ${(statSync(pngPath).size / 1024).toFixed(0)} KB  (YouTube limit 2 MB)`);
if (!hasPhoto) console.log("  ⚠ rendered WITHOUT a portrait — pass --photo=<path> for the real one");
