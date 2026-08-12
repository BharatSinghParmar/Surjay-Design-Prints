"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { GA_ID, analyticsEnabled, pageview, track } from "@/lib/analytics";

/**
 * Route-change page views.
 *
 * useSearchParams() opts the tree into client-side rendering, which would make
 * every page dynamic if it were read at the top level — hence the Suspense
 * boundary in Analytics below. This is Next's documented requirement, not a
 * workaround.
 */
function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    pageview(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

/**
 * GA4 for the public site.
 *
 * Renders nothing at all when NEXT_PUBLIC_GA_ID is unset, so no third-party
 * script is requested in development, in previews, or if analytics is switched
 * off. Mounted from SiteChrome's public branch only — never on /admin, where
 * tracking staff activity would serve no purpose.
 *
 * Contact details are tracked with one capture-phase listener on the document
 * rather than handlers on each link. Phone, WhatsApp, email and map links are
 * scattered across the header, footer, floating actions and contact page; a
 * single delegated listener catches them all and cannot fall out of sync when
 * a new link is added.
 */
export function Analytics() {
  useEffect(() => {
    if (!analyticsEnabled) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) track("phone_call_click", { link_url: href });
      else if (href.startsWith("mailto:")) track("email_click", { link_url: href });
      else if (href.includes("wa.me") || href.includes("whatsapp.com"))
        track("whatsapp_click", { link_url: href });
      else if (href.includes("maps.app.goo.gl") || href.includes("google.com/maps"))
        track("maps_click", { link_url: href });
    };

    // Capture phase: fires even when a handler further down calls
    // stopPropagation, and still runs before the browser follows the link.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!analyticsEnabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}
