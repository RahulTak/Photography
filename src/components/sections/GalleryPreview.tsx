"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/constants/animations";
import { GALLERY_ITEMS } from "@/constants/gallery";

export function GalleryPreview() {
  // Select a different set of gallery items for variety
  const previewItems = GALLERY_ITEMS.slice(3, 7);

  return (
    <section className="py-24 bg-background border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold" style={{ letterSpacing: "0.2em" }}>
            CAPTURED SEGMENTS
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground max-w-2xl leading-tight">
            Explore the Portfolios
          </h2>
          <p className="text-xs text-muted font-sans font-light tracking-wide max-w-md">
            Click into our dedicated galleries containing wedding, pre-wedding, cinematic, and traditional documentation.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <motion.div
          variants={stagger(0.2, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {previewItems.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className={`relative overflow-hidden group border border-border/40 rounded-sm cursor-pointer ${
                idx === 0 || idx === 3 ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <div className="relative aspect-[16/10] md:aspect-square overflow-hidden">
                <motion.div
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-90 transition-all duration-300" />

                {/* Floating Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[9px] tracking-widest uppercase text-accent" style={{ letterSpacing: "0.15em" }}>
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold mt-1">{item.couple}</h3>
                  <p className="text-[10px] text-muted font-sans">{item.location}</p>
                </div>

                {/* Always-on Tag */}
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 border border-border/60 rounded-sm">
                  <span className="text-[8px] uppercase tracking-widest text-foreground/90 font-sans" style={{ letterSpacing: "0.1em" }}>
                    {item.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/gallery"
            className="px-8 py-3.5 bg-transparent border border-border hover:border-accent text-foreground text-xs font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 hover:bg-secondary/40"
            style={{ letterSpacing: "0.15em" }}
          >
            Launch Gallery Grid &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
export default GalleryPreview;
