"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/constants/animations";
import { WORKSHOPS_CONTENT } from "@/constants/workshops";
import { Calendar, Users, MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function WorkshopsPreview() {
  const { title } = WORKSHOPS_CONTENT.hero;
  const upcoming = WORKSHOPS_CONTENT.upcoming.slice(0, 1); // Display the next upcoming workshop

  return (
    <section className="py-24 bg-secondary border-t border-border/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Info */}
          <div className="flex flex-col space-y-6">
            <span className="text-xs uppercase tracking-widest text-accent font-semibold" style={{ letterSpacing: "0.2em" }}>
              JP Click Studio MASTERCLASSES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-tight">
              Elevate Your Photographic Eye
            </h2>
            <p className="text-sm text-muted font-sans font-light leading-relaxed">
              We periodically open our studio doors to wedding filmmakers and photographers who want to study color science, editorial lighting, and HNW client onboarding.
            </p>
            <div className="pt-2">
              <Link
                href="/workshops"
                className="inline-block px-8 py-3.5 bg-transparent border border-border hover:border-accent text-foreground text-xs font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 hover:bg-background/40"
                style={{ letterSpacing: "0.15em" }}
              >
                Explore All Masterclasses
              </Link>
            </div>
          </div>

          {/* Featured Upcoming Workshop Card */}
          {upcoming.map((workshop) => (
            <motion.div
              key={workshop.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-background border border-border/80 p-8 rounded-sm shadow-xl flex flex-col space-y-6"
            >
              <div className="flex justify-between items-start">
                <span className="text-[9px] uppercase tracking-widest bg-accent/10 border border-accent/30 text-accent px-3 py-1 rounded-sm">
                  next cohort
                </span>
                <span className="text-xs text-muted font-sans flex items-center gap-1">
                  <Users size={12} className="text-accent" />
                  {workshop.seatsAvailable} seats remaining
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground leading-snug">
                  {workshop.title}
                </h3>
                <p className="text-xs text-muted font-sans leading-relaxed">
                  {workshop.description}
                </p>
              </div>

              {/* Detail Items */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans border-t border-b border-border/40 py-4">
                <div className="flex items-center gap-2 text-muted">
                  <Calendar size={14} className="text-accent" />
                  <span>{workshop.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <MapPin size={14} className="text-accent" />
                  <span className="truncate">{workshop.location.split(",")[0]}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted font-sans">
                    enrolment fee
                  </span>
                  <span className="font-serif text-lg font-bold text-foreground">
                    ₹{workshop.price.toLocaleString()}
                  </span>
                </div>
                <Link
                  href={{ pathname: ROUTES.WORKSHOPS, query: { select: workshop.id } }}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Reserve Seat
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default WorkshopsPreview;
