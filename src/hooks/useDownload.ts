"use client";

import { useState } from "react";
import { CompanyDocument } from "@/types/resource";

export function useDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (document: CompanyDocument) => {
    setIsDownloading(true);
    
    // Simulate analytics logging
    console.log(`[Analytics] Downloading Resource: ${document.title} (${document.id})`);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const link = window.document.createElement("a");
    link.href = document.pdfUrl;
    link.download = document.pdfUrl.split('/').pop() || `${document.title}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    setIsDownloading(false);
    setDownloaded(true);
    
    setTimeout(() => setDownloaded(false), 3000);
  };

  return { isDownloading, downloaded, handleDownload };
}
