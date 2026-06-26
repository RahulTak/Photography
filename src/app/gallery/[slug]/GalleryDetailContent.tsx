"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from "lucide-react";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import { GalleryItem } from "@/types/gallery";

interface GalleryDetailContentProps {
  item: GalleryItem;
}

export function GalleryDetailContent({ item }: GalleryDetailContentProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const images = item.images || [];

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    },
    [lightboxIndex, images.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  return (
    <PageWrapper>
      {/* Luxury Cover Header */}
      <section className="relative h-[65vh] w-full overflow-hidden bg-background border-b border-border/30">
        {/* Parallax Cover Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={item.coverImage || item.imageUrl || "/uploads/placeholder.jpg"}
            alt={item.title}
            className="w-full h-full object-cover object-center transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
        </div>

        {/* Back and Breadcrumbs Navigation */}
        <div className="absolute top-8 left-0 right-0 z-10 max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link
            href="/gallery"
            className="flex items-center gap-2 px-4 py-2 bg-background/60 backdrop-blur-md border border-border/40 text-xs font-sans uppercase tracking-widest text-foreground hover:text-accent transition-all duration-300 rounded-sm"
            style={{ letterSpacing: "0.15em" }}
          >
            <ArrowLeft size={12} />
            Back to Gallery
          </Link>

          <nav className="hidden sm:flex text-[9px] uppercase tracking-widest text-white/70 font-sans" style={{ letterSpacing: "0.2em" }}>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span className="mx-2 text-white/30">/</span>
            <Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
            <span className="mx-2 text-white/30">/</span>
            <span className="text-accent font-bold">{item.title}</span>
          </nav>
        </div>

        {/* Dynamic Cover Metadata Overlay */}
        <div className="absolute bottom-10 left-0 right-0 z-10 max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold bg-accent/15 px-3 py-1 border border-accent/30 rounded-sm mb-4 inline-block" style={{ letterSpacing: "0.2em" }}>
              {item.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide leading-tight mt-2">
              {item.title}
            </h1>
            <p className="text-sm font-sans font-light text-muted mt-2">
              A bespoke photography chronicle of {item.couple}
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Section & Specs */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Narrative Text */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-accent" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-accent" style={{ letterSpacing: "0.2em" }}>
                The Story
              </span>
            </div>
            <p className="font-serif text-lg md:text-xl text-foreground leading-relaxed font-light italic">
              {item.description || 
                `An editorial documentary of moments, details, and vows captured in their purest form. Every frames tells a story.`
              }
            </p>
          </div>

          {/* Details Sidebar card */}
          <div className="bg-card border border-border/60 p-8 rounded-sm self-start shadow-sm">
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-accent border-b border-border/40 pb-4 mb-6" style={{ letterSpacing: "0.2em" }}>
              Shoot Information
            </h3>
            <ul className="space-y-4 text-xs font-sans">
              <li className="flex items-center justify-between text-muted">
                <span className="flex items-center gap-2">
                  <User size={12} className="text-accent" />
                  Couple
                </span>
                <span className="text-foreground font-medium">{item.couple}</span>
              </li>
              <li className="flex items-center justify-between text-muted">
                <span className="flex items-center gap-2">
                  <MapPin size={12} className="text-accent" />
                  Location
                </span>
                <span className="text-foreground font-medium">{item.location}</span>
              </li>
              <li className="flex items-center justify-between text-muted">
                <span className="flex items-center gap-2">
                  <Calendar size={12} className="text-accent" />
                  Year
                </span>
                <span className="text-foreground font-medium">{item.year}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Asymmetric Gallery Masonry */}
      <section className="pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 mb-10">
            <div className="h-px w-8 bg-accent" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-accent" style={{ letterSpacing: "0.2em" }}>
              The Showcase ({images.length} images)
            </span>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border/40 bg-secondary/30 rounded-sm">
              <p className="text-muted font-sans text-xs">No showcase images loaded for this shoot.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {images.map((img, index) => {
                const aspectClass = index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-[4/3]" : "aspect-square";
                return (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                    onClick={() => openLightbox(index)}
                    className="break-inside-avoid group relative overflow-hidden border border-border/50 rounded-sm cursor-pointer mb-6"
                  >
                    <div className={`relative ${aspectClass} overflow-hidden`}>
                      <img
                        src={img.imageUrl}
                        alt={`${item.title} - Showcase Image ${index + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-4 py-2 bg-background/85 backdrop-blur-sm border border-accent/30 text-[9px] uppercase tracking-widest text-accent rounded-sm font-sans" style={{ letterSpacing: "0.15em" }}>
                          View Image
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Premium Lightbox Modal Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/98 flex items-center justify-center p-4 md:p-12"
          >
            {/* Close Trigger Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors duration-300 p-2 z-10 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm hover:border-accent/40"
              aria-label="Close lightbox"
            >
              <X size={20} />
            </button>

            {/* Left Navigation Button */}
            <button
              onClick={prevImage}
              className="absolute left-6 text-white/50 hover:text-white transition-colors duration-300 p-3 z-10 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm hover:border-accent/40"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Right Navigation Button */}
            <button
              onClick={nextImage}
              className="absolute right-6 text-white/50 hover:text-white transition-colors duration-300 p-3 z-10 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm hover:border-accent/40"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Lightbox content container */}
            <div className="flex flex-col max-w-5xl w-full h-full items-center justify-center space-y-6" onClick={(e) => e.stopPropagation()}>
              <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden">
                <motion.img
                  key={images[lightboxIndex].id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={images[lightboxIndex].imageUrl}
                  alt={`${item.title} - Showcase ${lightboxIndex + 1}`}
                  className="max-h-[70vh] max-w-full object-contain border border-white/5 shadow-2xl rounded-sm"
                />
              </div>

              {/* Progress and Shoot Info Footer */}
              <div className="text-center text-white/80 space-y-1 font-sans">
                <span className="text-[9px] uppercase tracking-widest text-accent" style={{ letterSpacing: "0.2em" }}>
                  {item.title} &bull; Image {lightboxIndex + 1} of {images.length}
                </span>
                <p className="text-[10px] text-white/50">{item.location} &bull; {item.year}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
