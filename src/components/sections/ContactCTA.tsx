"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/constants/animations";

export function ContactCTA() {
  return (
    <section className="py-28 relative overflow-hidden bg-background border-t border-border/30">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-6"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs uppercase tracking-widest text-accent font-semibold"
            style={{ letterSpacing: "0.2em" }}
          >
            SECURE YOUR LEGACY
          </motion.span>
          
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-serif text-foreground font-bold leading-tight"
          >
            Let&apos;s Tell Your Story
          </motion.h2>
          
          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base text-muted font-sans font-light tracking-wide max-w-xl leading-relaxed"
          >
            We take a highly limited number of weddings each year to ensure each film and frame receives our undivided artistic attention. Let&apos;s check if we are free on your dates.
          </motion.p>

          <motion.div variants={fadeUp} className="pt-4">
            <Link
              href="/contact"
              className="px-10 py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 shadow-xl shadow-primary/10"
              style={{ letterSpacing: "0.15em" }}
            >
              Check Date Availability
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
export default ContactCTA;
