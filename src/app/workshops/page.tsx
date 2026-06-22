import React, { Suspense } from "react";
import { Metadata } from "next";
import { WorkshopsPageContent } from "@/components/sections/WorkshopsPageContent";

export const metadata: Metadata = {
  title: "Photography Masterclasses & Workshops",
  description: "Learn luxury wedding photography and cinematic filmmaking directly from Jay Prakash. Practical residencies in lighting, grading, and business growth.",
  openGraph: {
    title: "Masterclasses & Workshops | JP Click Studio",
    description: "Learn lighting, cinematography, and high-net-worth client strategies.",
    url: "https://jpphotography.in/workshops",
  },
};

export default function WorkshopsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-luxury-muted font-sans" style={{ letterSpacing: "0.25em" }}>
            Aligning Masterclasses...
          </span>
        </div>
      </div>
    }>
      <WorkshopsPageContent />
    </Suspense>
  );
}
export const dynamic = "force-dynamic";
