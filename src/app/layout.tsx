import type { Metadata, Viewport } from "next";
import { Inter, Antonio } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SiteChrome } from "@/components/SiteChrome";
import { organizationSchema, pageMetadata } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const heading = Antonio({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Textile Manufacturer in Rajasthan",
    description:
      "Surjay Design & Prints is a premium B2B textile manufacturing company in Rajasthan for fabric dyeing, screen printing, hand printing and fabric finishing.",
    path: "/"
  })
  // No `icons` block: src/app/icon.png (48px) and src/app/apple-icon.png (180px)
  // are picked up by Next's file convention and emitted with the right sizes.
  //
  // These used to point at /logo.png — the full 1024x1024, 144KB source. Browsers
  // fetch a favicon at High priority, so it was the single largest request on the
  // page and it was competing with the hero for bandwidth.
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08162d"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${heading.variable}`}>
      <body>
        <JsonLd data={organizationSchema()} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
