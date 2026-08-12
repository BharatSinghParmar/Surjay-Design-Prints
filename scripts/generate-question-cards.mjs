#!/usr/bin/env node
/**
 * Question cards for the founder-interview videos.
 *
 *   node scripts/generate-question-cards.mjs                  # all, both formats
 *   node scripts/generate-question-cards.mjs --only=1,7
 *   node scripts/generate-question-cards.mjs --format=landscape
 *
 * Each interview video runs: logo sting -> question card -> his answer -> sign-off.
 * The card exists so a viewer landing mid-feed knows what is being answered before
 * anyone speaks.
 *
 * Output: question-cards/NN-slug-{portrait,landscape}.png
 *   portrait  1080x1920  (Shorts / Reels)
 *   landscape 1920x1080  (YouTube / LinkedIn)
 *
 * The `short` text is NOT the question as asked. Spoken questions are long and
 * conversational — "To start, could you introduce yourself and tell us what
 * Surjay Design & Print specializes in?" cannot be read in four seconds. Each is
 * cut to the question actually being answered.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "question-cards");

const C = {
  navy: "#08162d",
  mist: "#f4f6f8",
  magenta: "#a40f5f",
  wine: "#65123f",
  gold: "#c9a84c"
};

/** `theme` groups the run so a viewer sees a consistent label per topic. */
export const QUESTIONS = [
  { n: 1,  theme: "The founder",   short: "Who are you, and\nwhat does Surjay do?" },
  { n: 2,  theme: "The beginning", short: "How did this\nbusiness begin?" },
  { n: 3,  theme: "The hard years",short: "What was the toughest\nperiod — and what\ngot you through?" },
  { n: 4,  theme: "What changed",  short: "What has changed most\nsince you started?" },
  { n: 5,  theme: "Pride",         short: "What are you most\nproud of today?" },
  { n: 6,  theme: "The buyers",    short: "Who are your\ncustomers today?" },
  { n: 7,  theme: "The difference",short: "What makes your work\ndifferent from other units?" },
  { n: 8,  theme: "The constraint",short: "What is holding you\nback from scaling up?" },
  { n: 9,  theme: "How orders come",short: "How do orders\nreach you today?" },
  { n: 10, theme: "Raw fabric",    short: "Where does your fabric\ncome from — and how\ndo you check it?" },
  { n: 11, theme: "Preparation",   short: "What has to happen\nbefore dyeing or printing?" },
  { n: 12, theme: "Printing",      short: "Screen or hand printing —\nwhen do you use each?" },
  { n: 13, theme: "Finishing",     short: "What are the final steps\nbefore dispatch?" },
  { n: 14, theme: "The next years",short: "Where do you want the\ncompany in three years?" },
  { n: 15, theme: "No constraints",short: "If nothing were a\nconstraint, what first?" },
  { n: 16, theme: "Going wider",   short: "What would going PAN-India\nor exporting look like?" },
  { n: 17, theme: "For a partner", short: "What should a buyer\nor partner know?" },
  // The plain-language opener. Runs before the process questions for a viewer
  // who has never set foot in a textile unit and needs the whole thing framed
  // once, simply, before any stage makes sense.
  { n: 18, theme: "The whole process", short: "In simple terms —\nwhat does the\nfactory actually do?" }
];

const slug = (t) =>
  t.replace(/\n/g, " ").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42);

const logoData = readFileSync(join(root, "public", "logo.png")).toString("base64");

/** Ribbon sized for the frame it sits in; the portrait one is taller and steeper. */
function ribbon(W, H) {
  const p = H > W
    ? { band: "M -80 1690 C 260 1520, 420 1880, 760 1690 S 1040 1440, 1180 1520 L 1180 1980 L -80 1980 Z",
        line: "M -60 1520 C 300 1360, 430 1750, 780 1570 S 1030 1320, 1160 1400",
        thread: "M 1140 400 C 900 490, 840 270, 600 350", w: 150 }
    : { band: "M -80 1000 C 400 900, 760 1120, 1180 1000 S 1700 860, 2000 940 L 2000 1140 L -80 1140 Z",
        line: "M -60 940 C 420 840, 780 1060, 1200 940 S 1720 800, 1990 880",
        thread: "M 1980 250 C 1640 340, 1500 150, 1180 240", w: 110 };
  return `
  <svg class="ribbon" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${C.magenta}"/><stop offset="55%" stop-color="${C.wine}"/><stop offset="100%" stop-color="${C.magenta}"/>
      </linearGradient>
      <linearGradient id="silkFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.magenta}" stop-opacity="0.85"/><stop offset="100%" stop-color="${C.wine}" stop-opacity="0.25"/>
      </linearGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${C.gold}" stop-opacity="0"/><stop offset="50%" stop-color="${C.gold}" stop-opacity="0.55"/><stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${p.band}" fill="url(#silkFade)" opacity="0.55"/>
    <path d="${p.line}" fill="none" stroke="url(#silk)" stroke-width="${p.w}" stroke-linecap="round" opacity="0.95"/>
    <path d="${p.line}" fill="none" stroke="url(#rim)" stroke-width="3" stroke-linecap="round"/>
    <path d="${p.thread}" fill="none" stroke="${C.magenta}" stroke-width="9" stroke-linecap="round" opacity="0.30"/>
  </svg>`;
}

export function card(q, format) {
  const portrait = format === "portrait";
  const W = portrait ? 1080 : 1920;
  const H = portrait ? 1920 : 1080;
  const lines = q.short.split("\n");

  /**
   * Size from the LONGEST line, not the line count.
   *
   * Sizing by line count lets a long line overflow and wrap anyway, which
   * silently turns an authored two-line break into three and strands the last
   * word on its own — exactly what "…what does Surjay do?" did at 112px.
   * 0.46em is Antonio's measured average advance in caps.
   */
  const avail = portrait ? 1080 - 192 : 1360 - 300;
  const longest = Math.max(...lines.map((l) => l.length));
  const size = Math.min(portrait ? 112 : 108, Math.floor(avail / (longest * 0.46)));

  return `<!doctype html>
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
      radial-gradient(${portrait ? "120% 55% at 50% 38%" : "80% 90% at 34% 44%"}, rgba(164,15,95,.20) 0%, rgba(8,22,45,0) 62%),
      radial-gradient(100% 60% at 50% 100%, rgba(0,0,0,.55) 0%, rgba(8,22,45,0) 60%);
  }
  .ribbon { position:absolute; inset:0; width:${W}px; height:${H}px; }
  .weave { position:absolute; inset:0; opacity:.03;
    background-image:
      repeating-linear-gradient(0deg,#fff 0 1px,transparent 1px 7px),
      repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 7px); }

  /* Shorts paints its UI over the bottom ~400px of a portrait frame; the safe
     band keeps every readable thing above it. Landscape has no such overlay. */
  .safe {
    position:absolute; left:0; right:0;
    top:${portrait ? "300px" : "0"}; bottom:${portrait ? "620px" : "0"};
    padding:0 ${portrait ? "96px" : "150px"};
    display:flex; flex-direction:column; justify-content:center;
    ${portrait ? "" : "max-width:1360px;"}
  }

  /* An oversized quotation mark, not a decorative flourish: it signals at a
     glance that this is a question being put to someone. */
  .quote {
    font-family:'Antonio',sans-serif; font-weight:700;
    font-size:${portrait ? 190 : 170}px; line-height:.6;
    color:${C.magenta}; opacity:.55; margin-bottom:${portrait ? 26 : 20}px;
  }
  .theme {
    font-size:${portrait ? 28 : 24}px; font-weight:700; letter-spacing:.42em;
    text-transform:uppercase; color:${C.gold}; margin-bottom:${portrait ? 30 : 26}px;
  }
  h1 {
    font-family:'Antonio',sans-serif; font-weight:700; text-transform:uppercase;
    color:#fff; font-size:${size}px; line-height:1.02; letter-spacing:-.005em;
  }
  .rule {
    width:150px; height:7px; margin:${portrait ? "46px 0 0" : "40px 0 0"};
    background:linear-gradient(90deg,${C.magenta},${C.gold}); border-radius:999px;
  }

  /* Part of the centred stack, not pinned to the frame. Pinned to the bottom it
     collided with the ribbon in landscape, where the band rides much higher
     relative to the frame than it does in portrait. */
  footer {
    display:flex; align-items:center; gap:26px;
    margin-top:${portrait ? 70 : 56}px;
  }
  footer .brand {
    width:${portrait ? 130 : 112}px; height:${portrait ? 130 : 112}px; object-fit:contain;
    background:#fff; border-radius:22px; padding:9px 9px 13px;
  }
  footer .who .name {
    font-family:'Antonio',sans-serif; font-weight:600;
    font-size:${portrait ? 40 : 36}px; letter-spacing:.02em; color:#fff;
  }
  footer .who .role {
    font-size:${portrait ? 24 : 22}px; color:rgba(244,246,248,.55); margin-top:6px;
  }
</style></head>
<body>
  <div class="vignette"></div>
  ${ribbon(W, H)}
  <div class="weave"></div>

  <div class="safe">
    <div class="quote">&ldquo;</div>
    <div class="theme">${q.theme}</div>
    <h1>${lines.join("<br>")}</h1>
    <div class="rule"></div>

  <footer>
    <img class="brand" src="data:image/png;base64,${logoData}" alt="">
    <div class="who">
      <div class="name">Ajay Soni</div>
      <div class="role">Founder &middot; Surjay Design &amp; Print</div>
    </div>
  </footer>
  </div>
</body></html>`;
}

// ── Render ──────────────────────────────────────────────────────────────────
const CHROME = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome"
].filter(Boolean).find((p) => existsSync(p));

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!CHROME) {
    console.error("✗ No Chrome found. Set CHROME_PATH.");
    process.exit(1);
  }
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? new Set(onlyArg.slice(7).split(",").map(Number)) : null;
  const fmtArg = process.argv.find((a) => a.startsWith("--format="));
  const formats = fmtArg ? [fmtArg.slice(9)] : ["portrait", "landscape"];

  mkdirSync(OUT, { recursive: true });
  let made = 0;
  for (const q of QUESTIONS) {
    if (only && !only.has(q.n)) continue;
    for (const format of formats) {
      const base = `${String(q.n).padStart(2, "0")}-${slug(q.short)}-${format}`;
      const htmlPath = join(OUT, `${base}.html`);
      const pngPath = join(OUT, `${base}.png`);
      writeFileSync(htmlPath, card(q, format), "utf8");
      execFileSync(CHROME, [
        "--headless=new", "--disable-gpu", "--hide-scrollbars",
        "--force-device-scale-factor=1",
        `--window-size=${format === "portrait" ? "1080,1920" : "1920,1080"}`,
        "--virtual-time-budget=8000",
        `--screenshot=${pngPath}`, `file://${htmlPath}`
      ], { stdio: ["ignore", "ignore", "pipe"] });
      console.log(`  ✓ ${base.padEnd(56)} ${(statSync(pngPath).size / 1024).toFixed(0)} KB`);
      made += 1;
    }
  }
  console.log(`\nDone. ${made} card(s) in question-cards/`);
}
