"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { CompanyDocument } from "@/types/resource";
import { useDownload } from "@/hooks/useDownload";

interface ResourceCardProps {
  document: CompanyDocument;
}

export function ResourceCard({ document }: ResourceCardProps) {
  const { isDownloading, downloaded, handleDownload } = useDownload();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": document.title,
    "description": document.description,
    "fileFormat": "application/pdf",
    "inLanguage": document.language,
    "version": document.version,
    "potentialAction": {
      "@type": "DownloadAction",
      "target": `${typeof window !== "undefined" ? window.location.origin : ""}${document.pdfUrl}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <motion.div 
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium transition-all hover:shadow-2xl sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Left Side: Visual Preview */}
        <div className="relative w-full overflow-hidden bg-mist sm:w-2/5">
          <Image
            src={document.coverImage}
            alt={`${document.title} Cover`}
            fill
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <span className="rounded-md bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-md">
              {document.category}
            </span>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-white">{document.title}</h3>
            <p className="mt-1 text-sm font-medium text-white/70">Surjay Design & Prints</p>
          </div>
        </div>

        {/* Right Side: Content & Actions */}
        <div className="flex flex-col justify-between p-6 sm:w-3/5 lg:p-8">
          <div>
            <div className="flex items-start justify-between">
              <h4 className="font-heading text-xl font-semibold text-navy">Premium Textile Manufacturing</h4>
              <div className="flex flex-col items-end gap-1 text-xs font-semibold text-charcoal/50">
                <span className="flex items-center gap-1 rounded-full bg-mist px-2 py-1"><FileText className="h-3 w-3" /> PDF</span>
                <span>{document.pages} Pages • {document.size}</span>
              </div>
            </div>
            
            <p className="mt-4 text-sm leading-6 text-charcoal/70">
              {document.description}
            </p>

            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-charcoal/50">Contents Include:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {document.contents.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-charcoal/80">
                    <ChevronRight className="h-4 w-4 flex-none text-magenta" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="text-xs font-medium text-charcoal/40">
              Version {document.version} • {document.language}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload(document)}
              disabled={isDownloading}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-md px-6 py-2 text-sm font-semibold text-white transition-colors ${
                downloaded ? "bg-green-600" : "bg-magenta hover:bg-wine"
              } disabled:cursor-not-allowed disabled:opacity-80`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Preparing...
                </>
              ) : downloaded ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Downloaded
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Download PDF
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
