"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems, site } from "@/data/site";
import { RequestQuoteModal } from "@/components/RequestQuoteModal";
import { useDownload } from "@/hooks/useDownload";
import { companyResources } from "@/data/resources";
import { Loader2, CheckCircle2 } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { isDownloading, downloaded, handleDownload } = useDownload();
  const profileDoc = companyResources[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-navy/95 shadow-lg shadow-navy/10 backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-1">
              <Image
                src="/logo.png"
                alt="Surjay Design & Prints"
                width={120}
                height={120}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="leading-tight text-white">
              <span className="block font-heading text-sm font-semibold uppercase tracking-[0.16em]">
                Surjay
              </span>
              <span className="block text-[11px] text-white/70">Design & Prints</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-white text-navy" : "text-white/78 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => handleDownload(profileDoc)}
              disabled={isDownloading}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white transition ${
                downloaded ? "bg-green-600 border-green-600" : "hover:bg-white hover:text-navy"
              } disabled:cursor-not-allowed disabled:opacity-80`}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : downloaded ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Profile
            </button>
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="min-h-11 rounded-md bg-magenta px-4 py-2 text-sm font-semibold text-white transition hover:bg-wine"
            >
              Request Quote
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-md border border-white/20 p-2 text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-white/10 bg-navy px-4 py-5 lg:hidden">
            <nav className="grid gap-2" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-3 text-sm font-semibold text-white/85 hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="mt-3 rounded-md bg-magenta px-4 py-3 text-sm font-semibold text-white"
              >
                Request Quote
              </button>
            </nav>
          </div>
        ) : null}
      </header>
      <RequestQuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
