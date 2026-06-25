"use client";

import { ArrowUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

export function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 grid gap-3">
      <a
        aria-label="Contact on WhatsApp"
        href={`https://wa.me/${site.whatsapp}`}
        className="grid h-12 w-12 place-items-center rounded-md bg-[#128c7e] text-white shadow-premium transition hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      {visible ? (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-12 w-12 place-items-center rounded-md bg-navy text-white shadow-premium transition hover:scale-105"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
