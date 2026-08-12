/**
 * Google Analytics 4 helpers.
 *
 * Everything here is inert unless NEXT_PUBLIC_GA_ID is set. That is deliberate:
 * the measurement ID lives in Vercel's environment, not in the repo, so local
 * development and preview deploys send nothing, and analytics can be switched
 * off entirely by clearing one variable rather than by reverting code.
 *
 * NEXT_PUBLIC_ vars are inlined into the client bundle at build time, so
 * changing this value in Vercel requires a redeploy to take effect.
 *
 * Note the privacy policy at /privacy describes this. If analytics is ever
 * turned off for good, that page has to change back — the two must agree.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const analyticsEnabled = GA_ID !== "";

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Record a page view. The App Router does not trigger a document load on
 * client-side navigation, so GA's automatic page_view would only ever fire
 * once per session; Analytics.tsx calls this on every route change instead.
 */
export function pageview(url: string) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  const w = window as GtagWindow;
  w.gtag?.("config", GA_ID, { page_path: url });
}

/**
 * Record a custom event. Fails silently when analytics is off or gtag has not
 * loaded yet — a blocked script or an ad blocker must never break a form
 * submission or a download.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  const w = window as GtagWindow;
  w.gtag?.("event", event, params);
}
