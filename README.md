# Surjay Design & Prints

The website for **Surjay Design & Prints**, a B2B textile dyeing, printing and finishing house in Bagru, Jaipur, Rajasthan.

**Live:** [surjaydesignandprint.com](https://surjaydesignandprint.com)

The site is a marketing and enquiry front-end with a self-service admin area behind it, so the owner can publish fabric designs and buyer testimonials without a developer or a deployment.

---

## Highlights

**Custom CMS, no third-party platform.** A full admin area — design catalogue, buyer testimonials, team management — built directly on the app. The spec fields themselves are admin-configurable: the owner defines which attributes exist (Width, GSM, Colour…), their input type, and whether each is shown publicly.

**Authentication built from primitives.** scrypt password hashing and HMAC-signed session cookies over Node's `crypto`, with no auth dependency. Sign-in attempts are rate-limited in Postgres so the limit survives across serverless instances.

**Storage that adapts to its environment.** One interface, three interchangeable drivers — Postgres, Vercel Blob, or local JSON — selected at runtime. Development needs zero configuration; production uses the full stack without a code change.

**A media pipeline, not a media folder.** 46 photographs and 20 video clips processed from raw factory footage by a reproducible script, each encoded for the exact slot it renders in, mapped by process folder rather than guessed from content.

**Generated print and social assets.** A 17-page company profile PDF rendered from HTML through headless Chrome, plus 19 portrait social cards and their animated counterparts — produced by scripts, not by hand, so a brand change propagates everywhere at once.

**SEO handled properly.** Generated sitemap and robots, LocalBusiness structured data, per-page metadata and a deliberately pinned canonical URL.

---

## Table of contents

- [Highlights](#highlights)
- [Stack](#stack)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Pages](#pages)
- [Admin area](#admin-area)
- [How data is stored](#how-data-is-stored)
- [Content pipelines](#content-pipelines)
- [Deployment](#deployment)
- [Engineering notes](#engineering-notes)
- [Conventions](#conventions)

---

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS 3.4 + `@tailwindcss/forms` |
| Animation | Framer Motion |
| Icons | lucide-react |
| Forms | react-hook-form |
| Database | Neon Postgres via `@neondatabase/serverless` |
| File storage | Vercel Blob |
| Hosting | Vercel |

No auth library — sessions are signed cookies over Node's `crypto` (see [Admin area](#admin-area)).

---

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**Local development needs no configuration.** With no environment variables set, the app falls back to local JSON files under `.data/` and saves uploads to `public/uploads/` — both git-ignored. You get a fully working admin area without provisioning a database.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

To create your first local admin, visit `/admin/signup` — it is open only while no account exists, then locks itself to signed-in admins.

---

## Environment variables

Copy `.env.example` to `.env.local`. Everything is optional in development.

### Site

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL. Overrides the default in `src/data/site.ts`. Drives canonical tags, OG previews, sitemap, robots and structured data. |

### Lead delivery

Enquiries from the contact form, quote modal and newsletter.

| Variable | Purpose |
|---|---|
| `LEAD_INBOX` | Destination inbox for enquiries |
| `RESEND_API_KEY` / `MAIL_FROM` | Transactional email via Resend — the recommended setup, delivers fully server-side |
| `LEAD_WEBHOOK_URL` | Alternative: POST leads to a CRM, Zapier or Slack endpoint |

With none set, the server still validates and rate-limits the submission, then returns a relay instruction the browser completes. See [Engineering notes](#engineering-notes).

### Admin area (production)

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | Session-cookie signing secret. **Required in production.** Generate with `openssl rand -base64 32` |
| `DATABASE_URL` | Postgres connection string. Also accepts `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_URL_NON_POOLING`, `NEON_DATABASE_URL` — Vercel's integrations name it differently depending on which provisioned the database |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for uploaded files |

---

## Project structure

```
src/
  app/                     routes (App Router)
    api/                   route handlers
    admin/                 admin UI
  components/              shared React components
  data/site.ts             single source of truth for business facts
  hooks/
  lib/
    auth/                  password hashing, sessions, admin accounts
    designs/               design catalogue: store, drivers, validation
    testimonials/          testimonials: store, drivers, validation
    leadInbox.ts           private lead destination (server-only)
    rateLimit.ts
    seo.ts                 metadata + structured data helpers
    submitLead.ts
  types/
  middleware.ts            redirects un-authenticated /admin visitors to login

scripts/                   content pipelines (see below)
docs/                      admin setup guides
public/                    static assets, generated media, company profile PDF
media-inbox/               raw factory photos/videos (git-ignored, source only)
```

### `src/data/site.ts`

Business facts live here and nowhere else: address, both office locations, phone, email, hours, GST and Udyam numbers, founding dates, headline stats, and the image/video asset maps. Change a fact here and it updates the site, the metadata and the structured data together.

> This file is imported by client components. **Never put the private lead inbox in it** — that lives server-side in `src/lib/leadInbox.ts`.

---

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero, stats, 17-stage manufacturing timeline, products, testimonials |
| `/about` | Company story, journey, credentials |
| `/manufacturing-process` | The full process, stage by stage |
| `/printing-methods` | Screen and hand printing |
| `/products` | Admin-managed design catalogue |
| `/infrastructure` | Machinery and capacity |
| `/gallery` | Photo grid with lightbox, plus factory video clips |
| `/contact` | Enquiry form, map, both office addresses |
| `/privacy` | Privacy policy |

`/admin` and `/api/` are disallowed in `robots.txt`.

---

## Admin area

Reachable at `/admin`. There is no link to it from the public site — it is entered by URL.

| Route | What it manages |
|---|---|
| `/admin` | Design catalogue — create, edit, delete, mark sold, feature |
| `/admin/attributes` | The **feature set itself** — which spec fields exist (Width, GSM, Colour…), their input type, and whether each shows publicly |
| `/admin/testimonials` | Buyer testimonials — quote, name, role, company, outcome, headshot, logo, video |
| `/admin/admins` | Team — add admins, reset passwords, remove |
| `/admin/signup` | First-run account creation; locks after the first admin exists |

### Authentication

Deliberately dependency-free:

- Passwords hashed with **scrypt** (`saltHex:hashHex`), via Node's `crypto`
- Sessions are **HMAC-signed cookies** — `base64url(payload).base64url(signature)`, `httpOnly`, `sameSite=lax`
- Failed sign-ins are rate-limited **in Postgres**, not in memory
- `src/middleware.ts` is a UX-only gate. Real authorization is enforced in every admin page and API route through `getCurrentAdmin()`; a forged cookie never passes those.

### Testimonials consent gate

A testimonial cannot be published without `consentGiven`. This is enforced in three places: create validation, a merged check in the PATCH route against the stored record, and again on the read path, which filters on `published AND consentGiven`. The note recording *how* consent was given is private and never reaches the public page.

There is deliberately **no star rating**. A score the company assigns itself is an unearned signal; a named buyer with a concrete number carries the credibility instead.

---

## How data is stored

One interface, three interchangeable drivers, chosen at runtime. Callers never know which is active.

```
Postgres  ──  if DATABASE_URL (or any accepted alias) is set
Vercel Blob ──  else if BLOB_READ_WRITE_TOKEN is set
Local JSON  ──  else .data/*.json          ← development default
```

Uploaded files always go to Blob in production and `public/uploads/` locally.

### Schema migrations

`ensureSchema()` in `src/lib/designs/pgStore.ts` is the **only** migration mechanism. It is idempotent and runs on first use, creating every table: `designs`, `design_attributes`, `testimonials`, `admins`, `app_settings`, `login_attempts`.

To add a table or column, add it there. There is no migration folder and no migration CLI.

---

## Content pipelines

All under `scripts/`, all run with plain `node`. They read from `media-inbox/` (git-ignored) and write into `public/`.

### `process-media.mjs` — factory photos and video

Turns raw phone footage into web-ready assets. Sources are organised by process name (`media-inbox/photos/<PROCESS>/`) and mapped **by folder**, never guessed from what the picture looks like.

```bash
node scripts/process-media.mjs                     # everything
node scripts/process-media.mjs --only=silicate.mp4 # named outputs only
```

Photos become JPEGs sized to the slot they actually render in; clips become 1280×720 H.264 with `faststart` and a poster frame cut from the encoded clip. Every one of the 17 manufacturing stages gets its own image — nothing is reused.

### `generate-company-pdf.mjs` — the downloadable profile

Renders `public/company-profile.html` to `public/Surjay-Design-Company-Profile.pdf` (17 pages) via headless Chrome.

```bash
node scripts/generate-company-pdf.mjs
```

The HTML is the source. Edit that, never the PDF. It contains the site URL in several places **including a QR code**, so a domain change means regenerating it.

### `generate-video-banners.mjs` — stage cards for social video

Builds 19 portrait 1080×1920 PNGs: an opener, the 17 manufacturing stages, and a contact sign-off. Designed for a vertical Short, where each card is on screen for about a second — so the stage name is set large and the supporting line is a handful of words.

```bash
node scripts/generate-video-banners.mjs
node scripts/generate-video-banners.mjs --only=4,15
```

### `generate-video-banner-clips.mjs` — animated versions

Renders each card as an MP4 with motion (type settles, ribbon drifts, slow push-in) using [HyperFrames](https://hyperframes.heygen.com). Stages run 1s; the opener and sign-off run 2s. Imports its visuals from `generate-video-banners.mjs` so a clip is always the same artwork as its still.

```bash
node scripts/generate-video-banner-clips.mjs
```

Rendering the motion for real keeps text perfectly sharp — image-to-video models warp type badly, and these cards are mostly type.

### `add-sting-audio.mjs` — scores the logo sting and sign-off

Mixes Pixabay-licensed effects onto the two clips that carry sound and normalises to −14 LUFS (YouTube's target).

```bash
node scripts/add-sting-audio.mjs
```

Reads from silent masters, so re-running never stacks audio on already-scored audio.

> Outputs from the two video scripts land in `video-banners/` and are **not committed** — they are large binaries regenerable from source.

---

## Deployment

Pushing to `main` triggers a production deploy on Vercel via the GitHub integration.

Run `npm run build` before pushing. Vercel keeps the previous deployment serving if a build fails, so a failure is visible only in the deploy logs.

### Domains

```
surjaydesignandprint.com        production
www.surjaydesignandprint.com    308 → apex
surjay-design-prints.vercel.app production (fallback)
```

The apex is primary so it matches the canonical URL, the sitemap, the QR code in the PDF and the video sign-off card.

---

## Engineering notes

A few design decisions worth explaining, since the reasoning is not obvious from the code alone.

### Large uploads bypass the serverless function

Vercel caps a function's request body at 4.5 MB at the infrastructure level. Rather than accept that ceiling on testimonial video, uploads over it go **browser → Blob directly** using a short-lived signed token issued by `/api/admin/upload/token`. Photos and logos keep the simpler server route, so only the case that needs it pays the extra complexity.

The token route deliberately omits an `onUploadCompleted` handler: that callback arrives from Vercel's servers with no admin session, so the route's own auth guard would reject it. The browser attaches the returned URL through the normal authenticated API instead.

### Video is lazy-loaded by intersection, not by CSS

CSS `display: none` does not prevent a video downloading — a `preload="auto"` clip inside a `hidden lg:block` wrapper still fetches in full and keeps a decoder alive. `HeroBackgroundVideo` therefore holds back its `src` entirely until an `IntersectionObserver` fires. Measured on a 375×812 viewport, this cut the home page's video payload from 3,257 KB to 1,476 KB.

### Rate limiting lives in Postgres

Serverless invocations may each land on a different instance, so an in-process counter always sees an empty bucket and blocks nothing. Failed sign-in attempts are recorded in a `login_attempts` table so the limit holds across instances.

SQL parameters in those queries carry explicit casts (`${seconds}::int`) — Postgres cannot resolve the type of a bare placeholder in some positions, and the resulting error is easy to swallow in a `catch`.

### The canonical URL is pinned, not derived

`site.url` deliberately does not fall back to `NEXT_PUBLIC_VERCEL_URL`. That variable resolves to a per-deployment hostname which changes on every push, so canonical tags would churn and the mail relay would see a new origin each deploy. A single stable value drives canonicals, the sitemap, OG previews and structured data together.

### One source of truth for brand assets

Colours come from `tailwind.config.ts`, business facts from `src/data/site.ts`, and both the still stage cards and their animated versions import their visuals from the same module — so a card and its clip can never drift apart. The same discipline applies to upload formats, defined once in `src/types/design.ts` and derived into `accept=` attributes and error messages.

### Media is encoded for the slot it renders in

Source photography runs to 8064 px and 12 MB per file. `process-media.mjs` sizes each output to the box it actually occupies on the page and cuts poster frames from the encoded clip rather than the source, so a poster always matches frame one of its loop. ffmpeg's webp encoder is disabled in this build and does not need to be — `next/image` re-encodes to AVIF/WebP on serve, so a correctly sized JPEG is the right source format.

### Motion is rendered, not generated

The animated stage cards are real renders through a paused, seekable GSAP timeline. Image-to-video models warp typography badly and these cards are almost entirely type, so rendering the motion keeps every letter sharp and every frame deterministic.

---

## Conventions

- **Business facts live in `src/data/site.ts`.** Never hardcode an address, phone number or statistic in a component.
- **Media is mapped by folder name**, never inferred from image content.
- **Comments explain *why*, not *what*.** The non-obvious constraint is the thing worth writing down.
- **Accepted upload types are defined once** in `src/types/design.ts` (`UPLOAD_FORMATS`); the `accept=` attributes and error messages all derive from it.
- Run `npm run typecheck` and `npm run lint` before committing.

---

## Further reading

- [`docs/ADMIN-SETUP.md`](docs/ADMIN-SETUP.md) — step-by-step production setup for the admin area
- [`docs/admin-catalogue.md`](docs/admin-catalogue.md) — how the design catalogue works

---

© Surjay Design & Prints. Source available for reference; the brand, photography and content are not licensed for reuse.
