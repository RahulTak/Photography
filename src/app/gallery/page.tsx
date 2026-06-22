import React, { Suspense } from "react";
import { Metadata } from "next";
import { GalleryPageContent } from "@/components/sections/GalleryPageContent";

export const metadata: Metadata = {
  title: "Portfolio Vault | Luxury Photography Showcase",
  description: "Browse our wedding, pre-wedding, cinematic, traditional, and destination wedding photography portfolios. Experience luxury storytelling captured by JP Click Studio.",
  openGraph: {
    title: "Portfolio Vault | JP Click Studio",
    description: "Browse our global wedding and pre-wedding photography portfolios.",
    url: "https://jpphotography.in/gallery",
  },
};

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-luxury-muted font-sans" style={{ letterSpacing: "0.25em" }}>
            Aligning Portfolio Vault...
          </span>
        </div>
      </div>
    }>
      <GalleryPageContent />
    </Suspense>
  );
}
export const dynamic = "force-dynamic";
