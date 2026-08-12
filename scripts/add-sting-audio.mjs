#!/usr/bin/env node
/**
 * Score the two clips that carry sound and mux the audio onto them.
 *
 *   node scripts/add-sting-audio.mjs
 *   node scripts/add-sting-audio.mjs --only=sign-off
 *
 * Only the logo sting and the sign-off are scored. The 17 stage clips stay
 * silent on purpose — eighteen whooshes inside sixty seconds would fight
 * whatever music is laid under the finished edit.
 *
 * Each job reads a SILENT master and writes to video-banners/, so re-running is
 * idempotent: scoring never stacks audio on top of already-scored audio, and
 * levels can be retuned without re-rendering any animation.
 *
 * Effects are Pixabay-licensed (bundled with the media-use skill): free for
 * commercial use, no attribution required — checked because this runs on a
 * public business channel.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(root, "video-banners");
const SFX = join(process.env.HOME, ".claude/skills/media-use/audio/assets/sfx");

/**
 * `from` trims into a source before placing it. riser.mp3 needs it: the bundled
 * manifest calls it a "10s build, peak at the end", but measured it crests at
 * 3.0s, falls away by 4.3s and is digital silence from 7.5s on — trimming from
 * the end as the manifest implies yields an entirely silent track. Starting at
 * 0.6s puts its crest 2.4s in, so a 0.15s delay lands it on the plaque reveal.
 */
const JOBS = [
  {
    name: "sting",
    silent: join(root, "videos", "surjay-logo-sting", "renders", "video.mp4"),
    out: join(OUT_DIR, "00-surjay-logo-sting.mp4"),
    end: 4.5,
    fadeAt: 4.05,
    // Placed against the animation's own beats, not a grid.
    cues: [
      { file: "riser.mp3", at: 0.15, vol: 0.3, from: 0.6 },   // crests on the plaque
      { file: "impact-bass-1.mp3", at: 2.45, vol: 0.45 },     // the plaque landing
      { file: "chime.mp3", at: 2.9, vol: 0.2 }                // the logo resolving
    ]
  },
  {
    name: "sign-off",
    silent: join(root, "videos", "surjay-banner-clips", "silent", "18-get-in-touch.mp4"),
    out: join(OUT_DIR, "18-get-in-touch.mp4"),
    end: 2.0,
    fadeAt: 1.55,
    // This closes the video, so it resolves rather than builds — a soft whoosh
    // as the mark lands, a low chime under the contact rows. No riser and no
    // bass hit: an ending that punches reads as another beat still to come.
    cues: [
      { file: "whoosh-short.mp3", at: 0.02, vol: 0.5 },
      { file: "chime.mp3", at: 0.5, vol: 0.42 }
    ]
  },
  // 16:9 versions of the same two bookends, for YouTube and LinkedIn. Identical
  // choreography and identical audio — only the layout is re-cut for landscape,
  // so the two aspect ratios sound the same when a viewer sees both.
  {
    name: "sting-landscape",
    silent: join(root, "videos", "surjay-logo-sting-landscape", "renders", "video.mp4"),
    out: join(OUT_DIR, "00-surjay-logo-sting-landscape.mp4"),
    end: 4.5,
    fadeAt: 4.05,
    cues: [
      { file: "riser.mp3", at: 0.15, vol: 0.3, from: 0.6 },
      { file: "impact-bass-1.mp3", at: 2.45, vol: 0.45 },
      { file: "chime.mp3", at: 2.9, vol: 0.2 }
    ]
  },
  {
    name: "sign-off-landscape",
    silent: join(root, "videos", "surjay-outro-landscape", "renders", "video.mp4"),
    out: join(OUT_DIR, "18-get-in-touch-landscape.mp4"),
    end: 2.0,
    fadeAt: 1.55,
    cues: [
      { file: "whoosh-short.mp3", at: 0.02, vol: 0.5 },
      { file: "chime.mp3", at: 0.5, vol: 0.42 }
    ]
  }
];

const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",")) : null;

function score(job) {
  if (!existsSync(job.silent)) {
    console.error(`✗ ${job.name}: silent master not found — ${job.silent}`);
    return false;
  }
  for (const c of job.cues) {
    if (!existsSync(join(SFX, c.file))) {
      console.error(`✗ ${job.name}: missing sfx ${c.file}`);
      return false;
    }
  }

  const chains = job.cues.map((c, i) => {
    const idx = i + 1; // input 0 is the video
    const trim = c.from ? `atrim=start=${c.from},asetpts=PTS-STARTPTS,` : "";
    // `all=1` applies the delay to every channel — chime.mp3 is mono and the
    // `ms|ms` form would silently delay only the first channel.
    return `[${idx}:a]${trim}volume=${c.vol},adelay=${Math.round(c.at * 1000)}:all=1[c${idx}]`;
  });

  const mixIn = job.cues.map((_, i) => `[c${i + 1}]`).join("");
  // Per-cue volumes set the BALANCE; loudnorm sets the absolute level. Without
  // it the mix lands near -19 LUFS with ~13dB of unused headroom, which plays
  // noticeably quiet once YouTube normalises everything else to about -14.
  const filter = [
    ...chains,
    `${mixIn}amix=inputs=${job.cues.length}:duration=longest:dropout_transition=0,` +
      `loudnorm=I=-14:TP=-1.5:LRA=9,` +
      `afade=t=out:st=${job.fadeAt}:d=${(job.end - job.fadeAt).toFixed(2)},` +
      `atrim=0:${job.end}[a]`
  ].join(";");

  mkdirSync(dirname(job.out), { recursive: true });
  const tmp = join(OUT_DIR, `.scored-${job.name}.mp4`);
  rmSync(tmp, { force: true });

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i", job.silent,
      ...job.cues.flatMap((c) => ["-i", join(SFX, c.file)]),
      "-filter_complex", filter,
      "-map", "0:v:0",
      "-map", "[a]",
      "-c:v", "copy",
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
      "-shortest",
      tmp
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );

  copyFileSync(tmp, job.out);
  rmSync(tmp, { force: true });

  const loud = execFileSync(
    "ffmpeg",
    ["-i", job.out, "-af", "ebur128=peak=true", "-f", "null", "-"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
  return true;
}

let done = 0;
for (const job of JOBS) {
  if (only && !only.has(job.name)) continue;
  if (!score(job)) process.exitCode = 1;
  else {
    const probe = execFileSync(
      "ffprobe",
      ["-v", "error", "-select_streams", "a", "-show_entries",
       "stream=codec_name,duration", "-of", "default=nw=1", job.out],
      { encoding: "utf8" }
    ).trim().replace(/\n/g, "  ");
    console.log(`  ✓ ${job.name.padEnd(10)} → ${job.out.split("/").pop().padEnd(30)} ${probe}`);
    done += 1;
  }
}
console.log(`\nDone. ${done} clip(s) scored.`);
