"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/constants/animations";
import { GALLERY_ITEMS } from "@/constants/gallery";
import { MapPin, Calendar } from "lucide-react";

export function FeaturedWork() {
  // Take first 3 gallery items as featured works
  const featured = GALLERY_ITEMS.slice(0, 3);

  return (
    <section className="py-24 bg-luxury-bg border-t border-luxury-border/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="flex flex-col space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold" style={{ letterSpacing: "0.2em" }}>
              PORTFOLIO HIGHLIGHTS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
              Featured Love Stories
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs uppercase tracking-widest text-luxury-accent hover:text-luxury-hover border-b border-luxury-accent/30 hover:border-luxury-accent pb-1 transition-all duration-300 font-sans"
            style={{ letterSpacing: "0.15em" }}
          >
            Explore Complete Gallery &rarr;
          </Link>
        </div>

        {/* Featured Grid */}
        <motion.div
          variants={stagger(0.2, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featured.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="group relative flex flex-col space-y-4 cursor-pointer overflow-hidden rounded-sm"
            >
              {/* Image Container with Custom Zoom Scale */}
              <div className="relative aspect-[3/4] overflow-hidden border border-luxury-border/40">
                <motion.div
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                />
                {/* Overlay Vignette on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Bottom Overlay Text details */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col space-y-2 text-white">
                  <span className="text-[10px] tracking-widest uppercase text-luxury-accent/90" style={{ letterSpacing: "0.15em" }}>
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold">{item.couple}</h3>
                  <div className="flex items-center space-x-4 text-[10px] text-luxury-muted font-sans pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-luxury-accent/80" />
                      {item.location.split(",")[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} className="text-luxury-accent/80" />
                      {item.year}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default FeaturedWork;
