"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Download, Loader2, CheckCircle2 } from "lucide-react";
import { navItems, site } from "@/data/site";
import { useDownload } from "@/hooks/useDownload";
import { companyResources } from "@/data/resources";

export function Footer() {
  const { isDownloading, downloaded, handleDownload } = useDownload();
  const profileDoc = companyResources[0];

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-white p-1">
              <Image
                src="/logo.png"
                alt="Surjay Design & Prints"
                width={120}
                height={120}
                className="h-full w-full object-contain"
              />
            </span>
            <div>
              <p className="font-heading text-lg font-semibold">{site.name}</p>
              <p className="text-sm text-white/62">{site.location}</p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
            Textile manufacturing and fabric processing partner for premium dyeing,
            screen printing, hand printing, textile finishing and custom bulk solutions.
          </p>
          <div className="mt-6">
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
              Download Company Profile
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold">Company</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/68 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold">Contact</h3>
          <div className="mt-5 grid gap-4 text-sm text-white/70">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-magenta" />
              {site.location}
            </p>
            <a className="flex gap-3 hover:text-white" href={`tel:${site.phone}`}>
              <Phone className="mt-0.5 h-4 w-4 flex-none text-magenta" />
              {site.phone}
            </a>
            <a className="flex gap-3 hover:text-white" href={`mailto:${site.mailTo}`}>
              <Mail className="mt-0.5 h-4 w-4 flex-none text-magenta" />
              {site.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
