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
          url: "/images/hero-textile-factory.png",
          width: 1200,
          height: 630,
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
      images: ["/images/hero-textile-factory.png"]
    }
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Rajasthan",
      addressCountry: "IN"
    },
    areaServed: ["India", "International"],
    makesOffer: [
      "Fabric Dyeing",
      "Screen Printing",
      "Hand Printing",
      "Textile Finishing",
      "Bulk Fabric Processing"
    ],
    sameAs: []
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
