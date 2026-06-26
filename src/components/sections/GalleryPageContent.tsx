"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGalleryInfinite } from "@/hooks/useGallery";
import { useUIStore } from "@/store/useUIStore";
import { GALLERY_CATEGORIES } from "@/constants/gallery";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import { MapPin } from "lucide-react";

export function GalleryPageContent() {
  const searchParams = useSearchParams();
  const activeCategory = useUIStore((state) => state.activeGalleryCategory);
  const setActiveCategory = useUIStore((state) => state.setActiveGalleryCategory);

  // Sync category filter from query params if present (e.g. /gallery?cat=wedding)
  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam) {
      const matched = GALLERY_CATEGORIES.find(
        (c) => c.toLowerCase() === catParam.toLowerCase()
      );
      if (matched) setActiveCategory(matched);
    }
  }, [searchParams, setActiveCategory]);

  // React Query Infinite scroll query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGalleryInfinite(activeCategory, 6);

  // Flattened array of all items loaded so far
  const items = data ? data.pages.flatMap((page) => page.items) : [];

  // Helper for dynamic masonry aspect ratio classes
  const getAspectClass = (index: number) => {
    const r = index % 3;
    if (r === 0) return "aspect-[3/4]";  // Portrait
    if (r === 1) return "aspect-[4/3]";  // Landscape
    return "aspect-square";             // Square
  };

  return (
    <PageWrapper>
      {/* Hero Banner */}
      <section className="relative py-20 bg-luxury-sec border-b border-luxury-border/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-accent/5 to-transparent -z-10 animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <nav className="text-[10px] uppercase tracking-widest text-luxury-muted mb-4 font-sans" style={{ letterSpacing: "0.2em" }}>
            <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-luxury-accent">Gallery</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold tracking-wide">
            Portfolio Vault
          </h1>
          <p className="text-sm text-luxury-muted font-sans font-light max-w-lg mt-2 leading-relaxed">
            A visual anthology of fleeting laughs, tears, and vows captured across the world. Use the editorial filters below to explore.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-10 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap items-center gap-3 border-b border-luxury-border/40 pb-6 overflow-x-auto">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                }}
                className={`px-5 py-2 text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-sm border ${
                  activeCategory === cat
                    ? "bg-luxury-accent text-luxury-bg border-luxury-accent"
                    : "bg-transparent text-luxury-muted border-luxury-border/60 hover:text-white hover:border-white/30"
                }`}
                style={{ letterSpacing: "0.15em" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Portfolio Grid */}
      <section className="pb-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            /* Premium skeleton loading cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-luxury-sec border border-luxury-border/60 aspect-[3/4] animate-pulse rounded-sm" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-muted font-sans text-sm">No stories found in this category.</p>
            </div>
          ) : (
            <>
              {/* Asymmetric Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {items.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/gallery/${item.slug || item.id}`}
                    className="block break-inside-avoid mb-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                      className="group relative overflow-hidden border border-luxury-border/50 rounded-sm cursor-pointer"
                    >
                      <div className={`relative ${getAspectClass(index)} overflow-hidden`}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        {/* Hover Info */}
                        <div className="absolute bottom-5 left-5 right-5 flex flex-col text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-[8px] uppercase tracking-widest text-luxury-accent/90" style={{ letterSpacing: "0.15em" }}>
                            {item.category}
                          </span>
                          <h3 className="font-serif text-lg font-bold mt-1 leading-snug">{item.couple}</h3>
                          <p className="text-[9px] text-luxury-muted font-sans flex items-center gap-1 mt-1">
                            <MapPin size={8} /> {item.location}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {hasNextPage && (
                <div className="flex justify-center mt-16">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-8 py-3.5 bg-transparent border border-luxury-accent/30 hover:border-luxury-accent text-luxury-accent hover:text-white text-xs font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 disabled:opacity-40"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {isFetchingNextPage ? "Loading Stories..." : "Load More Stories"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
export default GalleryPageContent;
