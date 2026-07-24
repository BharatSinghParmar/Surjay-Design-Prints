"use client";

import { useState } from "react";
import { CompanyDocument } from "@/types/resource";

export function useDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (document: CompanyDocument) => {
    if (isDownloading) return;            // prevent double-clicks
    setIsDownloading(true);

    // Simulate analytics logging
    console.log(`[Analytics] Downloading Resource: ${document.title} (${document.id})`);

    try {
      // Let the browser stream the file straight to disk. Fetching into a Blob
      // first would buffer the whole ~12 MB PDF in memory, which stalls (and can
      // crash) low-end mobile devices.
      const link = window.document.createElement("a");
      link.href = document.pdfUrl;
      link.download = document.pdfUrl.split("/").pop() || `${document.title}.pdf`;
      link.rel = "noopener";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("[Download] Failed:", err);
      window.open(document.pdfUrl, "_blank", "noopener");
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, downloaded, handleDownload };
}
