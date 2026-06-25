import type { Metadata, Viewport } from "next";
import { Inter, Antonio } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { LoadingScreen } from "@/components/LoadingScreen";
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

export const metadata: Metadata = pageMetadata({
  title: "Textile Manufacturer in Rajasthan",
  description:
    "Surjay Design & Prints is a premium B2B textile manufacturing company in Rajasthan for fabric dyeing, screen printing, hand printing and fabric finishing.",
  path: "/"
});

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
        <LoadingScreen />
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
