import React, { Suspense } from "react";
import { Metadata } from "next";
import { ContactPageContent } from "@/components/sections/ContactPageContent";

export const metadata: Metadata = {
  title: "Reserve Your Date | Contact Us",
  description: "Check our wedding dates availability. Fill out our contact form to speak with our studio coordinator and schedule a consultation in Nagaur, Rajasthan.",
  openGraph: {
    title: "Contact Us | JP Click Studio",
    description: "Submit your inquiry details and verify date availability for luxury film and photography commissions.",
    url: "https://jpphotography.in/contact",
  },
};

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-luxury-accent/30 border-t-luxury-accent rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-luxury-muted font-sans" style={{ letterSpacing: "0.25em" }}>
            Aligning Secure Lines...
          </span>
        </div>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  );
}
export const dynamic = "force-dynamic";
