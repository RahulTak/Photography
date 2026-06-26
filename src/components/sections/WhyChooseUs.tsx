"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/constants/animations";
import { HOME_CONTENT } from "@/constants/content";
import { useHomeContent } from "@/hooks/useHomeContent";
import { Camera, Sparkles, Award, Globe } from "lucide-react";

export function WhyChooseUs() {
  const { data: homeContent } = useHomeContent();
  const whyChooseUs = homeContent?.whyChooseUs || HOME_CONTENT.whyChooseUs;
  const { tag, title, features } = whyChooseUs;

  // Icon mapper
  const getIcon = (id: string) => {
    switch (id) {
      case "editorial":
        return <Camera className="text-accent" size={24} />;
      case "candid":
        return <Sparkles className="text-accent" size={24} />;
      case "luxury":
        return <Award className="text-accent" size={24} />;
      default:
        return <Globe className="text-accent" size={24} />;
    }
  };

  return (
    <section className="py-24 bg-background border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold" style={{ letterSpacing: "0.2em" }}>
            {tag}
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground max-w-2xl leading-tight">
            {title}
          </h2>
        </div>

        {/* Pillars Grid */}
        <motion.div
          variants={stagger(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feat: any) => (
            <motion.div
              key={feat.id}
              variants={fadeUp}
              className="flex flex-col space-y-4 p-8 bg-card border border-border/40 hover:border-accent/30 transition-all duration-300 rounded-sm hover:-translate-y-1"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-background border border-border/60 rounded-sm">
                {getIcon(feat.id)}
              </div>
              <h3 className="font-serif text-lg text-foreground font-bold tracking-wide">
                {feat.title}
              </h3>
              <p className="text-xs text-muted font-sans font-light leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default WhyChooseUs;
