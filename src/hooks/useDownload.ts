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
      // Fetch the file as a blob for a reliable programmatic download
      const response = await fetch(document.pdfUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = window.document.createElement("a");
      link.href = blobUrl;
      link.download = document.pdfUrl.split('/').pop() || `${document.title}.pdf`;
      window.document.body.appendChild(link);
      link.click();

      // Clean up
      window.document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("[Download] Failed:", err);
      // Fallback: direct navigation download
      const link = window.document.createElement("a");
      link.href = document.pdfUrl;
      link.download = document.pdfUrl.split('/').pop() || `${document.title}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, downloaded, handleDownload };
}
