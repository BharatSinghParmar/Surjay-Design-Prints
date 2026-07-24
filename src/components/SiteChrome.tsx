"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { LoadingScreen } from "@/components/LoadingScreen";

// The admin area (/admin/*) is a self-contained app surface and must not show the
// public marketing header, footer, floating WhatsApp button or loading screen.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <LoadingScreen />
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
