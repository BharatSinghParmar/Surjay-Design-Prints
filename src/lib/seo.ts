import type { Metadata } from "next";
import { site } from "@/data/site";

type PageSeo = {
  title: string;
  description: string;
  path?: string;
};

export function pageMetadata({ title, description, path = "/" }: PageSeo): Metadata {
  const canonical = `${site.url}${path}`;
  const fullTitle = `${title} | ${site.name}`;

  return {
    metadataBase: new URL(site.url),
    title: fullTitle,
    description,
    keywords: site.keywords,
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
          alt: "Surjay Design & Prints textile manufacturing floor"
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
    image: `${site.url}/images/hero-textile-factory.png`,
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
        opens: "10:00",
        closes: "18:00"
      }
    ],
    areaServed: ["India", "International"],
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
