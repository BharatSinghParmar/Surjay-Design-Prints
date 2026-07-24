#!/usr/bin/env node
/**
 * Regenerate the downloadable Company Profile PDF from its HTML source.
 *
 * The PDF at public/Surjay-Design-Company-Profile.pdf is a *build artifact* of
 * public/company-profile.html (a print-styled, A4-landscape document). Whenever
 * that HTML changes — stats, timeline, process order, photos — run this script
 * to re-render the PDF so the download stays in sync with the site.
 *
 *   node scripts/generate-company-pdf.mjs
 *
 * Requires a Chromium-based browser (Google Chrome by default). Override the
 * binary with CHROME_PATH=/path/to/chrome if needed.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, statSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_HTML = join(root, "public", "company-profile.html");
const OUT_PDF = join(root, "public", "Surjay-Design-Company-Profile.pdf");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error("✗ No Chrome/Chromium found. Set CHROME_PATH to your browser binary.");
  process.exit(1);
}
if (!existsSync(SRC_HTML)) {
  console.error(`✗ Source HTML not found: ${SRC_HTML}`);
  process.exit(1);
}

console.log("• Chrome  :", chrome);
console.log("• Source  :", SRC_HTML);

// Chrome's headless print-to-pdf can intermittently fail ("Printing failed"),
// especially while the auto-updater is churning on a cold profile. Suppress the
// background chatter and retry a few times before giving up.
// NOTE: keep glyphs in company-profile.html to plain text / CSS — certain emoji
// make Chrome's print path emit "Printing failed". Avoid --disable-background-networking
// here: it can starve the Google Fonts requests the profile depends on.
const QUIET_FLAGS = [
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-sync",
  "--disable-extensions",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=20000"
];

function renderOnce(attempt) {
  const profileDir = mkdtempSync(join(tmpdir(), "surjay-pdf-"));
  const tmpPdf = join(profileDir, "out.pdf");
  const mode = attempt >= 3 ? "--headless" : "--headless=new"; // fall back to classic headless
  console.log(`• Rendering (attempt ${attempt}, ${mode})…`);
  const result = spawnSync(
    chrome,
    [mode, ...QUIET_FLAGS, `--user-data-dir=${profileDir}`, `--print-to-pdf=${tmpPdf}`, pathToFileURL(SRC_HTML).href],
    { stdio: ["ignore", "inherit", "inherit"], timeout: 150000 }
  );
  const ok = result.status === 0 && existsSync(tmpPdf) && statSync(tmpPdf).size > 100000;
  return ok ? tmpPdf : null;
}

let tmpPdf = null;
for (let attempt = 1; attempt <= 4 && !tmpPdf; attempt++) {
  tmpPdf = renderOnce(attempt);
  if (!tmpPdf) console.warn(`  … attempt ${attempt} failed, retrying`);
}

if (!tmpPdf) {
  console.error("✗ PDF generation failed after retries. Existing PDF left untouched.");
  process.exit(1);
}

copyFileSync(tmpPdf, OUT_PDF);
const mb = (statSync(OUT_PDF).size / 1024 / 1024).toFixed(2);
console.log(`✓ Wrote ${OUT_PDF} (${mb} MB)`);
