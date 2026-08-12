"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

// The admin area (/admin/*) is a self-contained app surface and must not show the
// public marketing header, footer or floating WhatsApp button.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    // reducedMotion="user" makes every framer-motion animation site-wide honour
    // the OS "reduce motion" preference (transforms snap, opacity still fades).
    //
    // There is deliberately no splash screen here. The previous one shipped in the
    // server HTML as an opaque full-bleed overlay and was dismissed by a timer
    // inside an effect — so the countdown could not even start until React had
    // hydrated. On a throttled phone that pushed the largest text on the page past
    // four seconds for no content benefit.
    <MotionConfig reducedMotion="user">
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
    </MotionConfig>
  );
}
