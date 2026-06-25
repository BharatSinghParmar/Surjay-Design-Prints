"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-navy text-white">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-white p-2">
          <Image
            src="/logo.png"
            alt="Surjay Design & Prints"
            width={120}
            height={120}
            className="h-full w-full object-contain"
            priority
          />
        </div>
        <div className="mx-auto mb-5 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-[loading_0.9s_ease-in-out_infinite] bg-magenta" />
        </div>
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.24em]">
          Surjay Design & Prints
        </p>
      </div>
    </div>
  );
}
