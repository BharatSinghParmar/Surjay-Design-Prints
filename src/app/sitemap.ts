import type { MetadataRoute } from "next";
import { site, navItems } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = [...navItems.map((item) => item.href), "/privacy"];

  return pages.map((href) => ({
    url: `${site.url}${href === "/" ? "" : href}`,
    lastModified,
    changeFrequency: href === "/" ? "weekly" : href === "/privacy" ? "yearly" : "monthly",
    priority:
      href === "/" ? 1 : href === "/privacy" ? 0.3 : href === "/contact" || href === "/products" ? 0.9 : 0.8
  }));
}
