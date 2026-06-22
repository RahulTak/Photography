"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/constants/animations";
import { HOME_CONTENT } from "@/constants/content";
import { useHomeContent } from "@/hooks/useHomeContent";

export function Hero() {
  const { data: homeContent } = useHomeContent();
  const hero = homeContent?.hero || HOME_CONTENT.hero;
  const { title, subtitle, description, ctaPrimary, ctaSecondary, videoPlaceholderImg } = hero;

  return (
    <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Cinematic Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${videoPlaceholderImg}')` }}
        />
        {/* Radial & Linear Gradients for Premium Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg via-luxury-bg/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-12">
        <motion.div
          variants={stagger(0.2, 0.3)}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center space-y-8"
        >
          {/* Subtitle */}
          <motion.span
            variants={fadeUp}
            className="text-xs uppercase tracking-widest text-luxury-accent font-semibold font-sans"
            style={{ letterSpacing: "0.25em" }}
          >
            {subtitle}
          </motion.span>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-7xl lg:text-8xl font-serif text-white font-bold leading-tight"
          >
            {title}
          </motion.h1>

          {/* Slogan */}
          <motion.p
            variants={fadeUp}
            className="text-sm md:text-lg text-luxury-muted font-sans font-light tracking-wide max-w-2xl leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <Link
              href="/gallery"
              className="px-8 py-3.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-xs font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 shadow-lg shadow-luxury-accent/15"
              style={{ letterSpacing: "0.15em" }}
            >
              {ctaPrimary}
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 border border-white/20 hover:border-luxury-accent text-white text-xs font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300"
              style={{ letterSpacing: "0.15em" }}
            >
              {ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Elegant Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 z-10 opacity-70">
        <span className="text-[9px] uppercase tracking-widest text-luxury-accent" style={{ letterSpacing: "0.25em" }}>
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-gradient-to-b from-luxury-accent to-transparent"
        />
      </div>
    </section>
  );
}
export default Hero;
