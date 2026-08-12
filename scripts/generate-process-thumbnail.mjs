#!/usr/bin/env node
/**
 * Thumbnail for the 17-stage process Short.
 *
 *   node scripts/generate-process-thumbnail.mjs
 *
 * Output: brand/thumbnails/process-short-thumbnail.png at 1080x1920.
 *
 * Portrait, not 16:9 — YouTube shows a Short's thumbnail in a 9:16 slot on the
 * Shorts shelf, in search and on the channel grid. A landscape thumbnail gets
 * letterboxed or centre-cropped there, losing the ends of any headline.
 *
 * The design is a split: raw grey fabric above, finished dyed stock below, with
 * the transformation stated across the join. The whole proposition — beige cloth
 * in, coloured cloth out — is legible before a single word is read, which is what
 * a thumbnail has to do at 210px in a feed.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "brand", "thumbnails");

const W = 1080;
const H = 1920;
const C = { navy: "#08162d", magenta: "#a40f5f", wine: "#65123f", gold: "#c9a84c" };

const b64 = (p) => readFileSync(join(root, p)).toString("base64");
const rawImg = `data:image/jpeg;base64,${b64("public/images/raw-rolls.jpg")}`;
const doneImg = `data:image/jpeg;base64,${b64("public/images/market-ready.jpg")}`;
const logoData = b64("public/logo.png");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; }
  body { background:${C.navy}; font-family:'Inter',Arial,sans-serif; color:#fff; overflow:hidden; position:relative; }

  .half { position:absolute; left:0; width:${W}px; height:${H / 2}px; overflow:hidden; }
  .half img { width:100%; height:100%; object-fit:cover; }
  .top    { top:0; }
  .bottom { top:${H / 2}px; }

  /* Darkened enough that white type holds at any size, light enough that the
     cloth is still obviously cloth. */
  .top::after, .bottom::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(180deg, rgba(8,22,45,.72) 0%, rgba(8,22,45,.42) 45%, rgba(8,22,45,.86) 100%);
  }
  .bottom::after {
    background:linear-gradient(180deg, rgba(8,22,45,.86) 0%, rgba(8,22,45,.40) 55%, rgba(8,22,45,.80) 100%);
  }

  /* The join carries the transformation. */
  .seam {
    position:absolute; left:0; top:${H / 2 - 5}px; width:${W}px; height:10px;
    background:linear-gradient(90deg,${C.magenta},${C.gold}); z-index:4;
  }
  .arrow {
    position:absolute; left:50%; top:${H / 2}px; transform:translate(-50%,-50%);
    width:132px; height:132px; border-radius:50%; z-index:5;
    background:${C.magenta}; border:8px solid ${C.navy};
    display:flex; align-items:center; justify-content:center;
    font-size:74px; line-height:1; color:#fff; font-weight:700;
    box-shadow:0 14px 44px rgba(0,0,0,.55);
  }

  .stack { position:absolute; inset:0; z-index:3; display:flex; flex-direction:column; }

  .kicker {
    position:absolute; left:0; right:0; top:96px; text-align:center;
    font-size:34px; font-weight:700; letter-spacing:.34em; text-transform:uppercase;
    color:${C.gold}; z-index:6;
  }

  .label {
    position:absolute; left:0; right:0; text-align:center; z-index:6;
    font-family:'Antonio',sans-serif; font-weight:700; text-transform:uppercase;
    color:#fff; font-size:128px; line-height:.9; letter-spacing:-.01em;
    text-shadow:0 8px 34px rgba(0,0,0,.7);
  }
  .label.a { top:520px; }
  .label.b { top:1160px; }
  .label small {
    display:block; font-family:'Inter',sans-serif; font-weight:600;
    font-size:31px; letter-spacing:.24em; margin-top:20px;
    color:rgba(244,246,248,.8); text-transform:uppercase;
  }

  .foot {
    position:absolute; left:0; right:0; bottom:96px; z-index:6;
    display:flex; align-items:center; justify-content:center; gap:20px;
  }
  .foot img { width:84px; height:84px; object-fit:contain;
    background:#fff; border-radius:18px; padding:7px 7px 10px; }
  .foot .t { text-align:left; }
  .foot .n { font-family:'Antonio',sans-serif; font-weight:600; font-size:33px; letter-spacing:.02em; }
  .foot .s { font-size:24px; color:rgba(244,246,248,.7); margin-top:5px; }
</style></head>
<body>
  <div class="half top"><img src="${rawImg}" alt=""></div>
  <div class="half bottom"><img src="${doneImg}" alt=""></div>
  <div class="seam"></div>
  <div class="arrow">&darr;</div>

  <div class="kicker">Cloth manufacturing</div>

  <div class="label a">Raw<br>Fabric<small>Grey · unfinished</small></div>
  <div class="label b">Finished<br>Cloth<small>17 stages later</small></div>

  <div class="foot">
    <img src="data:image/png;base64,${logoData}" alt="">
    <div class="t">
      <div class="n">Surjay Design &amp; Print</div>
      <div class="s">Bagru, Jaipur</div>
    </div>
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
const htmlPath = join(OUT, "process-short-thumbnail.html");
const pngPath = join(OUT, "process-short-thumbnail.png");
writeFileSync(htmlPath, html, "utf8");

execFileSync(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--force-device-scale-factor=1", `--window-size=${W},${H}`,
  "--virtual-time-budget=8000",
  `--screenshot=${pngPath}`, `file://${htmlPath}`
], { stdio: ["ignore", "ignore", "pipe"] });

console.log(`  ✓ process-short-thumbnail.png  ${W}x${H}  ${(statSync(pngPath).size / 1024).toFixed(0)} KB  (YouTube limit 2 MB)`);
