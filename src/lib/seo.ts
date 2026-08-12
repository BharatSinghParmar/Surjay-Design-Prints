import type { Metadata } from "next";
import { site } from "@/data/site";

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  /**
   * Terms this specific page is meant to rank for, merged ahead of the
   * site-wide list.
   *
   * Expect no ranking benefit: Google dropped the keywords meta tag as a signal
   * in 2009 and Bing treats stuffing it as a negative one. This exists because
   * every page previously emitted the identical site-wide array, which is
   * useless even as documentation. Read it as a note to the next developer
   * about what the page targets — not as SEO work.
   *
   * Do not paste FAQ questions in here. Long natural-language strings in a
   * keywords tag is textbook stuffing and buys nothing.
   */
  keywords?: string[];
};

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = []
}: PageSeo): Metadata {
  const canonical = `${site.url}${path}`;
  const fullTitle = `${title} | ${site.name}`;

  return {
    metadataBase: new URL(site.url),
    title: fullTitle,
    description,
    // Page-specific terms lead, the site-wide list follows, duplicates dropped.
    // Omitting the prop reproduces the previous output exactly.
    keywords: Array.from(new Set([...keywords, ...site.keywords])),
    alternates: {
      canonical
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: site.name,
      images: [
        {
          url: "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: "Surjay Design & Print textile manufacturing floor"
        }
      ],
      locale: "en_IN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/images/og-cover.jpg"]
    }
  };
}

const SERVICES = [
  "Fabric Dyeing",
  "Screen Printing",
  "Hand Printing",
  "Textile Finishing",
  "Bulk Fabric Processing"
];

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.line1}, ${site.address.line2}`,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country
};

/**
 * LocalBusiness/Manufacturer schema — a physical factory with a verifiable
 * address, so search engines can surface it for local and map queries.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo.png`,
    image: `${site.url}/images/hand-print-hall.jpg`,
    email: site.email,
    telephone: site.phoneHref,
    founder: { "@type": "Person", name: site.proprietor },
    foundingDate: String(site.experienceSince),
    // Primary address is the works/factory — that is where buyers visit.
    address: postalAddress,
    hasMap: site.mapsUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00"
      }
    ],
    // Domestic only. The business supplies within India; processSteps describes
    // export as a future opportunity, not a current capability, and claiming
    // otherwise here would attract enquiries the factory cannot fulfil today.
    areaServed: ["India"],
    knowsAbout: SERVICES,
    makesOffer: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service }
    })),
    identifier: [
      { "@type": "PropertyValue", name: "GSTIN", value: site.registrations.gstin },
      { "@type": "PropertyValue", name: "Udyam Registration", value: site.registrations.udyam }
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Registered Office",
        value: site.registeredOffice.full
      },
      {
        "@type": "PropertyValue",
        name: "Year of Registration",
        value: String(site.registeredYear)
      }
    ]
  };
}

/**
 * FAQPage structured data for one page's question set.
 *
 * This will NOT produce FAQ rich results, and nothing about the implementation
 * can change that. In August 2023 Google restricted the expandable Q&A snippet
 * to well-known government and health sites; a textile factory does not qualify.
 * Do not measure this by watching the search results for expandable answers.
 *
 * It earns its place anyway: it hands search engines and LLM answer engines an
 * explicit question-to-answer mapping instead of asking them to infer one from
 * prose, and it is the cheapest machine-readable description of what this
 * business does that the site can publish.
 *
 * Two rules that do bite. There must be exactly one FAQPage node per URL, and
 * every question and answer here must also be visible on the rendered page —
 * structured data that disagrees with the page is the one FAQ mistake search
 * engines actually act on. FaqSection enforces both by generating this from the
 * same array it renders; keep it that way rather than hand-writing schema at
 * the page level.
 */
export function faqSchema(faqs: Array<{ question: string; answer: string }>, path?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(path ? { "@id": `${site.url}${path}#faq`, url: `${site.url}${path}` } : {}),
    // organizationSchema() is emitted from the root layout on every page, so
    // this @id always resolves within the same document. Referencing it beats
    // re-declaring the org and keeps one canonical business node per page.
    // `publisher` rather than `about`: `about` would assert the page is about
    // the company, which is false for a page of product or process questions.
    publisher: { "@id": `${site.url}/#organization` },
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`
    }))
  };
}
