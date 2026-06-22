import React, { Suspense } from "react";
import { Metadata } from "next";
import { AboutPageContent } from "@/components/sections/AboutPageContent";

export const metadata: Metadata = {
  title: "Our Story & Legacy | Luxury Wedding Photographers",
  description: "Learn more about Jay Prakash, our fine art storytelling ethos, awards, milestones, and the specialized production team.",
  openGraph: {
    title: "About Us | JP Click Studio",
    description: "Learn more about our decadal history, co-creators, and fine art wedding philosophy.",
    url: "https://jpphotography.in/about",
  },
};

export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-luxury-muted font-sans" style={{ letterSpacing: "0.25em" }}>
            Aligning Legacy Stories...
          </span>
        </div>
      </div>
    }>
      <AboutPageContent />
    </Suspense>
  );
}
export const dynamic = "force-dynamic";
