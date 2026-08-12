#!/usr/bin/env node
/**
 * YouTube channel banner (channel art).
 *
 *   node scripts/generate-youtube-banner.mjs
 *   node scripts/generate-youtube-banner.mjs --guides   # overlay the safe areas
 *
 * Output: brand/youtube-banner.png at 2560x1440.
 *
 * YouTube crops this differently on every surface, and only ONE region is safe:
 *
 *   2560 x 1440  full canvas          — TV only
 *   2560 x 423   centre band          — desktop
 *   1855 x 423   centre band          — tablet
 *   1546 x 423   centre band          — MOBILE, and the only guaranteed region
 *
 * So every readable thing — logo, name, contact — sits inside the centre
 * 1546 x 423. Outside it is navy and ribbon only: decoration a TV viewer gets
 * and a phone viewer never misses.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "brand");

const W = 2560;
const H = 1440;
const SAFE_W = 1546;
const SAFE_H = 423;
const SAFE_X = (W - SAFE_W) / 2; // 507
const SAFE_Y = (H - SAFE_H) / 2; // 508.5

const C = {
  navy: "#08162d",
  magenta: "#a40f5f",
  wine: "#65123f",
  gold: "#c9a84c"
};

const logoData = readFileSync(join(root, "public", "logo.png")).toString("base64");
const guides = process.argv.includes("--guides");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; }
  body { background:${C.navy}; font-family:'Inter',Arial,sans-serif; color:#fff; overflow:hidden; position:relative; }

  .vignette { position:absolute; inset:0;
    background:
      radial-gradient(60% 120% at 50% 50%, rgba(164,15,95,.22) 0%, rgba(8,22,45,0) 62%),
      radial-gradient(100% 100% at 50% 120%, rgba(0,0,0,.5) 0%, rgba(8,22,45,0) 55%);
  }
  .ribbon { position:absolute; inset:0; width:${W}px; height:${H}px; }
  .weave { position:absolute; inset:0; opacity:.028;
    background-image:
      repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 8px),
      repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 8px); }

  /* The only region guaranteed to survive YouTube's crop on every device.
     The inner padding is not decorative: content laid flush to these bounds sits
     exactly on the crop line, so any variation in how a device rounds it clips
     the first and last characters. */
  .safe {
    position:absolute; left:${SAFE_X}px; top:${SAFE_Y}px;
    width:${SAFE_W}px; height:${SAFE_H}px;
    padding:0 52px;
    display:flex; align-items:center; justify-content:space-between; gap:56px;
  }

  .id { display:flex; align-items:center; gap:38px; }
  .id .brand {
    width:186px; height:186px; object-fit:contain; flex:0 0 186px;
    background:#fff; border-radius:30px; padding:14px 14px 20px;
  }
  .id .name {
    font-family:'Antonio',sans-serif; font-weight:700; text-transform:uppercase;
    font-size:82px; line-height:.92; letter-spacing:-.005em; color:#fff;
  }
  .id .tag {
    font-size:27px; color:rgba(244,246,248,.72); margin-top:14px; letter-spacing:.01em;
  }
  .id .where {
    font-size:22px; letter-spacing:.26em; text-transform:uppercase;
    color:${C.gold}; margin-top:16px; font-weight:700;
  }

  /* Contact sits inside the safe band too, so a phone viewer gets it as well. */
  .contact { text-align:right; flex:0 0 auto; }
  .contact .site {
    font-family:'Antonio',sans-serif; font-weight:600;
    font-size:40px; color:#fff; letter-spacing:.01em;
  }
  .contact .rule {
    height:4px; width:150px; margin:18px 0 18px auto; border-radius:999px;
    background:linear-gradient(90deg,${C.magenta},${C.gold});
  }
  .contact .line { font-size:26px; color:rgba(244,246,248,.78); margin-top:10px; }
  .contact .line b { color:${C.gold}; font-weight:700; letter-spacing:.2em;
    font-size:18px; text-transform:uppercase; margin-right:14px; }

  ${guides ? `
  .guide { position:absolute; border:3px dashed rgba(255,255,255,.55); }
  .guide span { position:absolute; top:-34px; left:0; font-size:20px; color:#fff;
    background:rgba(0,0,0,.6); padding:3px 10px; }
  ` : ""}
</style></head>
<body>
  <div class="vignette"></div>

  <svg class="ribbon" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="silk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${C.wine}"/><stop offset="45%" stop-color="${C.magenta}"/><stop offset="100%" stop-color="${C.wine}"/>
      </linearGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${C.gold}" stop-opacity="0"/>
        <stop offset="50%" stop-color="${C.gold}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <!-- Kept low and wide so it reads as a band under the lockup at every crop. -->
    <path d="M -100 1180 C 500 1040, 1000 1330, 1500 1150 S 2200 950, 2660 1060 L 2660 1500 L -100 1500 Z"
          fill="url(#silk)" opacity="0.5"/>
    <path d="M -100 1090 C 520 950, 1020 1250, 1520 1065 S 2220 865, 2660 975"
          fill="none" stroke="url(#silk)" stroke-width="120" stroke-linecap="round" opacity="0.9"/>
    <path d="M -100 1090 C 520 950, 1020 1250, 1520 1065 S 2220 865, 2660 975"
          fill="none" stroke="url(#rim)" stroke-width="3"/>
    <path d="M 2660 330 C 2100 450, 1750 210, 1150 330"
          fill="none" stroke="${C.magenta}" stroke-width="10" stroke-linecap="round" opacity="0.28"/>
  </svg>

  <div class="weave"></div>

  <div class="safe">
    <div class="id">
      <img class="brand" src="data:image/png;base64,${logoData}" alt="">
      <div>
        <div class="name">Surjay Design<br>&amp; Print</div>
        <div class="tag">Textile dyeing, printing &amp; finishing since 2010</div>
        <div class="where">Bagru &middot; Jaipur &middot; Rajasthan</div>
      </div>
    </div>

    <div class="contact">
      <div class="site">surjaydesignandprint.com</div>
      <div class="rule"></div>
      <div class="line"><b>Call</b>+91 92615 55162</div>
      <div class="line"><b>Email</b>surjaydesign@gmail.com</div>
    </div>
  </div>

  ${guides ? `
  <div class="guide" style="left:${SAFE_X}px; top:${SAFE_Y}px; width:${SAFE_W}px; height:${SAFE_H}px;"><span>MOBILE SAFE 1546x423 — everything readable must be here</span></div>
  <div class="guide" style="left:${(W - 1855) / 2}px; top:${SAFE_Y}px; width:1855px; height:${SAFE_H}px; border-color:rgba(201,168,76,.5);"><span>TABLET 1855x423</span></div>
  <div class="guide" style="left:0; top:${SAFE_Y}px; width:${W}px; height:${SAFE_H}px; border-color:rgba(164,15,95,.6);"><span>DESKTOP 2560x423</span></div>
  ` : ""}
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
const name = guides ? "youtube-banner-guides" : "youtube-banner";
const htmlPath = join(OUT, `${name}.html`);
const pngPath = join(OUT, `${name}.png`);
writeFileSync(htmlPath, html, "utf8");

execFileSync(CHROME, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--force-device-scale-factor=1", `--window-size=${W},${H}`,
  "--virtual-time-budget=8000",
  `--screenshot=${pngPath}`, `file://${htmlPath}`
], { stdio: ["ignore", "ignore", "pipe"] });

const kb = (statSync(pngPath).size / 1024).toFixed(0);
console.log(`  ✓ ${name}.png  ${W}x${H}  ${kb} KB  (YouTube allows up to 6 MB)`);
