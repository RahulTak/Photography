"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/constants/animations";
import { HOME_CONTENT } from "@/constants/content";
import { Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = HOME_CONTENT.testimonials;

  return (
    <section className="py-24 bg-luxury-sec border-t border-luxury-border/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold" style={{ letterSpacing: "0.2em" }}>
            CLIENT STORIES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white max-w-2xl leading-tight">
            Loved By Modern Couples
          </h2>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={stagger(0.2, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="flex flex-col justify-between p-8 bg-luxury-bg border border-luxury-border/50 rounded-sm relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 text-luxury-accent/10" size={32} />

              <div className="space-y-6">
                <p className="text-xs text-luxury-muted font-sans font-light italic leading-relaxed pt-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-luxury-border/30">
                {/* Avatar */}
                <div
                  className="w-10 h-10 bg-cover bg-center rounded-full border border-luxury-accent/40"
                  style={{ backgroundImage: `url('${item.avatar}')` }}
                />
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-sans font-semibold tracking-wider text-white">
                    {item.author}
                  </span>
                  <span className="text-[9px] uppercase font-sans tracking-widest text-luxury-accent">
                    {item.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default Testimonials;
