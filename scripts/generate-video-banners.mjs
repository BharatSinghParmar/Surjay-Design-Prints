#!/usr/bin/env node
/**
 * Build the portrait stage cards that sit between clips in the 60-second
 * factory walkthrough Short.
 *
 *   node scripts/generate-video-banners.mjs
 *   node scripts/generate-video-banners.mjs --only=04,15
 *
 * Output: video-banners/NN-slug.png at 1080x1920 (9:16), plus the source HTML
 * beside it so a card can be tweaked and re-rendered without touching this file.
 *
 * Design constraints this file encodes:
 *   • Each card is on screen for roughly a second — the stage NAME has to carry
 *     it, so it is set far larger than anything else and the supporting line is
 *     kept to a handful of words. The website's full sentences are unreadable at
 *     this duration and are deliberately not reused.
 *   • Shorts and Reels overlay their own UI — title, channel, action buttons —
 *     across roughly the bottom 400px and the top 180px. Nothing that must be
 *     read is placed there.
 *   • Colours are the site's own tokens (tailwind.config.ts), so the cards, the
 *     website and the company profile PDF all agree.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "video-banners");

export const W = 1080;
export const H = 1920;

// ── Brand tokens — must match tailwind.config.ts ────────────────────────────
export const C = {
  navy: "#08162d",
  ink: "#111827",
  charcoal: "#232833",
  mist: "#f4f6f8",
  magenta: "#a40f5f",
  wine: "#65123f",
  gold: "#c9a84c",
  copper: "#b87333"
};

/**
 * The 17 stages, in the order they appear on the website timeline and on page 5
 * of the company profile.
 *
 * `line` is written for this format specifically — four to seven words, readable
 * in a glance. It is not the website copy.
 */
export const STAGES = [
  { n: 1,  title: "Raw Fabric\nProcurement",      eyebrow: "Sourcing",            line: "Grey fabric, sourced and checked",    time: "0.5 day" },
  { n: 2,  title: "Ready For\nDyeing",            eyebrow: "Batch readiness",     line: "Prepared to take colour evenly",      time: "2–4 hrs" },
  { n: 3,  title: "Fabric\nCleaning",             eyebrow: "Surface preparation", line: "Dust and residue washed out",         time: "3–5 hrs" },
  { n: 4,  title: "Dyeing",                       eyebrow: "Controlled shade",    line: "Shade matched to buyer spec",         time: "6–10 hrs" },
  { n: 5,  title: "Printing",                     eyebrow: "Design application",  line: "Approved designs go onto cloth",      time: "6–12 hrs" },
  { n: 6,  title: "Screen\nPrinting",             eyebrow: "Repeat precision",    line: "Sharp repeats at bulk scale",         time: "4–8 hrs" },
  { n: 7,  title: "Hand\nPrinting",               eyebrow: "Craft detail",        line: "Detail placed by hand",               time: "6–10 hrs" },
  { n: 8,  title: "Silicate\nTreatment",          eyebrow: "Colour fixation",     line: "Colour locked before finishing",      time: "2–3 hrs" },
  { n: 9,  title: "Silicone\nTreatment",          eyebrow: "Softness & shine",    line: "Softer hand, cleaner surface",        time: "2–3 hrs" },
  { n: 10, title: "24-Hour\nPreservation",        eyebrow: "Stabilisation",       line: "A full day to settle",                time: "24 hrs" },
  { n: 11, title: "Pressing",                     eyebrow: "Presentation finish", line: "Surface smoothed and set",            time: "2–4 hrs" },
  { n: 12, title: "Elongation",                   eyebrow: "Dimensional control", line: "Width and stretch held true",         time: "1–2 hrs" },
  { n: 13, title: "Drying\nRange",                eyebrow: "Moisture control",    line: "Moisture pulled out",                 time: "4–6 hrs" },
  { n: 14, title: "Folding",                      eyebrow: "Clean handling",      line: "Folded buyer-ready",                  time: "1–2 hrs" },
  { n: 15, title: "Quality\nInspection",          eyebrow: "Final review",        line: "Every metre checked by hand",         time: "2–4 hrs" },
  { n: 16, title: "Packaging",                    eyebrow: "Dispatch protection", line: "Packed to travel safely",             time: "1–2 hrs" },
  { n: 17, title: "Market Ready\nFabric",         eyebrow: "Buyer handoff",       line: "Ready for dispatch",                  time: "Dispatch ready" }
];

/**
 * The opener that runs between the logo sting and stage 01, announcing the whole
 * journey. Same visual system as the stages, with the stage-specific furniture
 * dropped: no "Stage NN / 17" pill, and the ghost numeral becomes 17 — the
 * count of what is about to follow rather than a position within it.
 *
 * `n: 0` and an explicit `file` keep it sorted between 00-…-sting.mp4 and
 * 01-…: "-" sorts before "b", so the sting still plays first.
 */
export const INTRO = {
  n: 0,
  intro: true,
  file: "00b-manufacturing-journey",
  ghost: "17",
  eyebrow: "Inside the factory",
  // Bookends the sequence: stage 01 is Raw Fabric, stage 17 is Market Ready.
  title: "Raw Fabric\nTo Market Ready",
  line: "Seventeen stages, start to finish.",
  timeKey: "Full cycle",
  time: "3–5 days",
  // Set smaller than a stage headline so "To Market Ready" holds one line
  // instead of wrapping and orphaning a word over the ghost numeral.
  fontSize: 126,
  ghostSize: 400
};

/**
 * The sign-off that closes the Short. Contact details are taken verbatim from
 * src/data/site.ts — the same values the website and the company profile use —
 * so a number can never drift between the video and everything else.
 *
 * Only the Bagru works address appears. The Jodhpur registered office is also
 * public, but two addresses cannot be read in two seconds and the works address
 * is the one a buyer would visit.
 */
export const OUTRO = {
  n: 18,
  outro: true,
  seconds: 2,
  file: "18-get-in-touch",
  eyebrow: "Get in touch",
  name: "Surjay Design<br>&amp; Prints",
  tagline: "Textile dyeing, printing &amp; finishing",
  rows: [
    // Matches src/data/site.ts and the company profile PDF. The floating
    // WhatsApp button is still on the older 76186 54887 line — deliberately, so
    // a live chat link is never pointed at a number that may not be on WhatsApp.
    { k: "Call",  v: "+91 92615 55162" },
    { k: "Email", v: "surjaydesign@gmail.com" },
    { k: "Visit", v: "Plot D-2, SPL-1, Phase 2, Jaipur Block,<br>RIICO Industrial Area, Bagru, Jaipur 303007" }
  ]
};

/** Every card, in playback order. */
export const CARDS = [INTRO, ...STAGES, OUTRO];

const slug = (t) =>
  t.replace(/\n/g, " ").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Embed the logo so a render never depends on the network.
export const logoData = readFileSync(join(root, "public", "logo.png")).toString("base64");

/**
 * The ribbon behind the type, echoing the coil around the J in the logo.
 * Drawn rather than photographed so it stays crisp at any scale and carries the
 * brand gradient exactly.
 */
export function ribbon() {
  return `
  <svg class="ribbon" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="${C.magenta}"/>
        <stop offset="55%"  stop-color="${C.wine}"/>
        <stop offset="100%" stop-color="${C.magenta}"/>
      </linearGradient>
      <linearGradient id="silkFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="${C.magenta}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${C.wine}"    stop-opacity="0.25"/>
      </linearGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="${C.gold}" stop-opacity="0"/>
        <stop offset="50%"  stop-color="${C.gold}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- The ribbon is a base band, kept below y=1400 so it never runs behind
         the logo or the type. Its top edge stays visible above the Shorts UI. -->
    <path d="M -80 1690 C 260 1520, 420 1880, 760 1690 S 1040 1440, 1180 1520 L 1180 1980 L -80 1980 Z"
          fill="url(#silkFade)" opacity="0.55"/>
    <path d="M -60 1520 C 300 1360, 430 1750, 780 1570 S 1030 1320, 1160 1400"
          fill="none" stroke="url(#silk)" stroke-width="150" stroke-linecap="round" opacity="0.95"/>
    <!-- gold rim-light riding the band -->
    <path d="M -60 1520 C 300 1360, 430 1750, 780 1570 S 1030 1320, 1160 1400"
          fill="none" stroke="url(#rim)" stroke-width="3" stroke-linecap="round"/>
    <!-- a thin trailing thread high on the card, balancing the ghost numeral -->
    <path d="M 1140 400 C 900 490, 840 270, 600 350"
          fill="none" stroke="${C.magenta}" stroke-width="9" stroke-linecap="round" opacity="0.30"/>
  </svg>`;
}

/** Webfont links — shared by the still card and the animated clip. */
export const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

/** The card's stylesheet. Exported so the animated clip renders pixel-identically. */
export function cardCss(s) {
  const [, line2] = (s.title ?? "").split("\n");
  return `  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${W}px; height:${H}px; }
  body {
    background:${C.navy};
    font-family:'Inter','Helvetica Neue',Arial,sans-serif;
    color:#fff; overflow:hidden; position:relative;
  }
  /* depth: a warm lift behind the type, dark corners */
  .vignette {
    position:absolute; inset:0;
    background:
      radial-gradient(120% 55% at 50% 38%, rgba(164,15,95,.20) 0%, rgba(8,22,45,0) 62%),
      radial-gradient(100% 60% at 50% 100%, rgba(0,0,0,.55) 0%, rgba(8,22,45,0) 60%);
  }
  .ribbon { position:absolute; inset:0; width:${W}px; height:${H}px; }
  /* Woven texture, nodding to cloth. Kept very faint on purpose: a 1px grid at
     higher opacity turns into shimmering compression artefacts once the card is
     encoded into a video. */
  .weave {
    position:absolute; inset:0; opacity:.03;
    background-image:
      repeating-linear-gradient(0deg,  #fff 0 1px, transparent 1px 7px),
      repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 7px);
  }

  /* Shorts overlays its own UI top and bottom — everything that must be read
     lives inside this band. */
  .safe {
    position:absolute; left:0; right:0; top:300px; bottom:840px;
    padding:0 96px; display:flex; flex-direction:column; justify-content:center;
  }

  .ghost {
    position:absolute; right:56px; top:150px;
    font-family:'Antonio','Oswald','Arial Narrow',sans-serif; font-weight:700;
    font-size:${s.ghostSize ?? 520}px; line-height:.8; letter-spacing:-.02em;
    color:transparent; -webkit-text-stroke:3px rgba(164,15,95,.42);
    user-select:none;
  }

  .eyebrow {
    font-size:30px; font-weight:700; letter-spacing:.42em; text-transform:uppercase;
    color:${C.gold}; margin-bottom:34px;
  }
  .stage-no {
    display:inline-block; font-family:'Antonio','Oswald',sans-serif; font-weight:600;
    font-size:34px; letter-spacing:.16em; color:rgba(255,255,255,.55);
    border:2px solid rgba(201,168,76,.5); border-radius:999px;
    padding:10px 26px 8px; margin-bottom:40px;
  }
  /* One weight, one colour. Six of the seventeen stages are a single word, so a
     two-tone headline would only apply to some of them and the set would stop
     looking like a family. Gold is reserved for the eyebrow, rule and time. */
  h1 {
    font-family:'Antonio','Oswald','Arial Narrow',sans-serif;
    font-weight:700; text-transform:uppercase; color:#fff;
    font-size:${s.fontSize ?? (line2 ? 158 : 182)}px; line-height:.9; letter-spacing:-.005em;
    text-wrap:balance;
  }
  .rule {
    width:150px; height:7px; margin:52px 0 40px;
    background:linear-gradient(90deg,${C.magenta},${C.gold});
    border-radius:999px;
  }
  .line {
    font-size:47px; font-weight:400; line-height:1.34; color:rgba(244,246,248,.80);
    max-width:800px;
  }

  /* Lifted to 470px off the floor. Shorts and Reels paint the video title,
     channel row and action buttons across roughly the bottom 400px — a footer
     any lower than this gets covered on the phone even though it looks fine in
     the exported file. */
  footer {
    position:absolute; left:96px; right:96px; bottom:560px;
    display:flex; align-items:center; justify-content:space-between; gap:36px;
  }
  /* The supplied logo already contains the SURJAY / DESIGN & PRINTS wordmark,
     so it is used whole as one lockup rather than setting the name twice. It
     needs a light plate — the wordmark inside it is black. */
  footer .brand {
    width:250px; height:250px; object-fit:contain;
    background:#fff; border-radius:30px; padding:14px 14px 22px;
  }
  .time { text-align:right; }
  .time .k {
    font-size:20px; letter-spacing:.28em; text-transform:uppercase;
    color:rgba(244,246,248,.45);
  }

  /* ── sign-off card ─────────────────────────────────────────────────────── */
  .outro-safe {
    position:absolute; left:0; right:0; top:210px; bottom:620px;
    padding:0 96px; display:flex; flex-direction:column; justify-content:center;
  }
  .outro-mark {
    width:180px; height:180px; object-fit:contain;
    background:#fff; border-radius:26px; padding:11px 11px 16px; margin-bottom:34px;
  }
  .outro-name {
    font-family:'Antonio','Oswald','Arial Narrow',sans-serif;
    font-weight:700; text-transform:uppercase; color:#fff;
    font-size:104px; line-height:.9; letter-spacing:-.005em; margin-bottom:18px;
  }
  .outro-tag {
    font-size:34px; color:rgba(244,246,248,.68); margin-bottom:34px;
  }
  /* Label column is fixed-width so the three values start on one vertical line —
     that alignment is what makes a block of contact details scannable. */
  .row {
    display:flex; align-items:baseline; gap:28px;
    padding:19px 0; border-top:1px solid rgba(255,255,255,.13);
  }
  .row:last-child { border-bottom:1px solid rgba(255,255,255,.13); }
  .row .k {
    flex:0 0 150px;
    font-size:22px; font-weight:700; letter-spacing:.24em; text-transform:uppercase;
    color:${C.gold};
  }
  .row .v { font-size:36px; line-height:1.3; color:#fff; }
  .time .v {
    font-family:'Antonio','Oswald',sans-serif; font-weight:600;
    font-size:52px; color:${C.gold}; margin-top:10px; white-space:nowrap;
  }
`;
}

/** The card's markup, minus <html>/<head>. Same reason. */
export function cardBody(s) {
  const [line1, line2] = (s.title ?? "").split("\n");
  return `  <div class="vignette"></div>
  ${ribbon()}
  <div class="weave"></div>

${s.outro ? `
  <div class="outro-safe">
    <div><img class="outro-mark" src="data:image/png;base64,${logoData}" alt=""></div>
    <div class="eyebrow">${s.eyebrow}</div>
    <h2 class="outro-name">${s.name}</h2>
    <p class="outro-tag">${s.tagline}</p>
    ${s.rows.map((r) => `<div class="row"><span class="k">${r.k}</span><span class="v">${r.v}</span></div>`).join("\n    ")}
  </div>
` : `  <div class="ghost">${s.ghost ?? String(s.n).padStart(2, "0")}</div>

  <div class="safe">
    <div class="eyebrow">${s.eyebrow}</div>
    ${s.intro ? "" : `<div><span class="stage-no">Stage ${String(s.n).padStart(2, "0")} / 17</span></div>`}
    <h1>${line1}${line2 ? `<br>${line2}` : ""}</h1>
    <div class="rule"></div>
    <p class="line">${s.line}</p>
  </div>

  <footer>
    <img class="brand" src="data:image/png;base64,${logoData}" alt="">
    <div class="time">
      <div class="k">${s.timeKey ?? "Stage time"}</div>
      <div class="v">${s.time}</div>
    </div>
  </footer>
`}`;
}

function card(s) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
${FONT_LINKS}
<style>
${cardCss(s)}</style></head>
<body>
${cardBody(s)}</body></html>`;
}

// ── Render ──────────────────────────────────────────────────────────────────
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("✗ No Chrome/Chromium found. Set CHROME_PATH to your browser binary.");
  process.exit(1);
}

const RUN_DIRECTLY = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;

const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg
  ? new Set(onlyArg.slice("--only=".length).split(",").map((n) => Number(n)))
  : null;

if (RUN_DIRECTLY) {
mkdirSync(OUT, { recursive: true });
console.log("• Chrome :", chrome);
console.log("• Output :", OUT, `(${W}x${H})\n`);

for (const s of CARDS) {
  if (only && !only.has(s.n)) continue;
  const base = s.file ?? `${String(s.n).padStart(2, "0")}-${slug(s.title)}`;
  const htmlPath = join(OUT, `${base}.html`);
  const pngPath = join(OUT, `${base}.png`);

  writeFileSync(htmlPath, card(s), "utf8");

  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${W},${H}`,
      // Long enough for the webfonts to arrive and lay out before capture.
      "--virtual-time-budget=8000",
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );

  const kb = (statSync(pngPath).size / 1024).toFixed(0);
  // The sign-off card has no `title` — it carries `name` instead.
  const label = (s.title ?? s.name ?? "")
    .replace(/<br>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n/g, " ");
  console.log(`  ✓ ${base.padEnd(34)} ${kb} KB   ${label}`);
}

console.log(`\nDone. ${only ? only.size : CARDS.length} card(s) in video-banners/`);
}
