"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/constants/animations";
import { HOME_CONTENT } from "@/constants/content";
import { useHomeContent } from "@/hooks/useHomeContent";

export function StoryPreview() {
  const { data: homeContent } = useHomeContent();
  const aboutPreview = homeContent?.aboutPreview || HOME_CONTENT.aboutPreview;
  const { tag, title, description, founders, foundersTitle, portraitImg, ctaText } = aboutPreview;

  return (
    <section className="py-24 bg-secondary border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Story Text Box */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-6"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs uppercase tracking-widest text-accent font-semibold"
            style={{ letterSpacing: "0.2em" }}
          >
            {tag}
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-5xl font-serif text-foreground leading-tight"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm text-muted font-sans font-light leading-relaxed max-w-lg"
          >
            {description}
          </motion.p>
          
          <motion.div variants={fadeUp} className="pt-4 border-l-2 border-accent/30 pl-6 my-4">
            <p className="font-serif italic text-lg text-foreground/90">
              &ldquo;The best photographs are not staged; they are the electric sparks of truth that occur between two heartbeats.&rdquo;
            </p>
            <span className="block text-[11px] uppercase tracking-wider text-accent font-sans mt-3">
              — {founders}, {foundersTitle}
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-2">
            <Link
              href="/about"
              className="inline-block px-8 py-3.5 bg-transparent border border-border hover:border-accent text-foreground text-xs font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 hover:bg-background/40"
              style={{ letterSpacing: "0.15em" }}
            >
              {ctaText}
            </Link>
          </motion.div>
        </motion.div>

        {/* Story Portrait Image Box */}
        <motion.div
          initial={{ opacity: 0, x: 55 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative justify-self-center lg:justify-self-end w-full max-w-md aspect-[3/4] border border-border/60"
        >
          {/* Framed Background Border */}
          <div className="absolute -inset-4 border border-accent/20 -z-10 rounded-sm" />
          
          {/* Image */}
          <div
            className="w-full h-full bg-cover bg-center rounded-sm shadow-2xl"
            style={{ backgroundImage: `url('${portraitImg}')` }}
          />

          {/* Mini Floating Accolade badge */}
          <div className="absolute -bottom-6 -left-6 bg-background border border-border/80 px-6 py-4 rounded-sm shadow-xl flex flex-col space-y-1">
            <span className="text-[20px] font-serif font-bold text-accent">2011</span>
            <span className="text-[9px] uppercase tracking-widest text-foreground/75 font-sans" style={{ letterSpacing: "0.15em" }}>
              established
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
export default StoryPreview;
