"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/constants/animations";
import { ABOUT_CONTENT } from "@/constants/about";
import { useAboutData } from "@/hooks/useAbout";
import { HOME_CONTENT } from "@/constants/content";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import { Award, Compass, Heart, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function AboutPageContent() {
  const { data: aboutData } = useAboutData();
  const { hero, founders, missionVision, timeline, awards, team, process } = aboutData || ABOUT_CONTENT;
  const stats = HOME_CONTENT.stats;

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative py-20 bg-luxury-sec border-b border-luxury-border/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-accent/5 to-transparent -z-10 animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <nav className="text-[10px] uppercase tracking-widest text-luxury-muted mb-4 font-sans" style={{ letterSpacing: "0.2em" }}>
            <span className="hover:text-white transition-colors duration-300">Home</span>
            <span className="mx-2">/</span>
            <span className="text-luxury-accent">About</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold tracking-wide">
            Our Story & Legacy
          </h1>
          <p className="text-sm text-luxury-muted font-sans font-light max-w-2xl mt-2 leading-relaxed">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Founders Section (Editorial Storytelling) */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Split Images */}
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute -inset-4 border border-luxury-accent/10 -z-10 rounded-sm" />
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col space-y-4"
              >
                <div
                  className="aspect-[3/4] bg-cover bg-center border border-luxury-border rounded-sm shadow-xl"
                  style={{ backgroundImage: `url('${founders.images.sujay}')` }}
                />
                <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-sans text-center">Jay Prakash</span>
              </motion.div>

              {/* <motion.div
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col space-y-4 pt-12"
              >
                <div
                  className="aspect-[3/4] bg-cover bg-center border border-luxury-border rounded-sm shadow-xl"
                  style={{ backgroundImage: `url('${founders.images.shreyanka}')` }}
                />
                <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-sans text-center">Behind the Lens</span>
              </motion.div> */}
            </div>

            {/* Founders copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger(0.2, 0.1)}
              className="flex flex-col space-y-6"
            >
              <motion.span variants={fadeUp} className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
                THE FOUNDER
              </motion.span>
              
              <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-serif text-white leading-tight">
                {founders.title}
              </motion.h2>

              <motion.h3 variants={fadeUp} className="font-serif italic text-lg text-luxury-muted">
                {founders.subtitle}
              </motion.h3>

              <div className="space-y-4 text-xs font-sans text-luxury-muted leading-relaxed font-light">
                {founders.storyParagraphs.map((para, pIdx) => (
                  <motion.p key={pIdx} variants={fadeUp}>
                    {para}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Row */}
      <section className="py-16 bg-luxury-sec border-t border-b border-luxury-border/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col space-y-1">
                <span className="font-serif text-3xl md:text-5xl font-bold text-luxury-accent">{stat.value}</span>
                <span className="text-[9px] uppercase tracking-widest text-luxury-muted font-sans" style={{ letterSpacing: "0.15em" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission */}
          <div className="p-8 bg-luxury-sec border border-luxury-border/60 rounded-sm flex flex-col space-y-4">
            <div className="w-10 h-10 bg-luxury-accent/10 border border-luxury-accent/30 rounded-sm flex items-center justify-center text-luxury-accent">
              <Compass size={20} />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">{missionVision.mission.title}</h3>
            <p className="text-xs text-luxury-muted font-sans font-light leading-relaxed">
              {missionVision.mission.description}
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 bg-luxury-sec border border-luxury-border/60 rounded-sm flex flex-col space-y-4">
            <div className="w-10 h-10 bg-luxury-accent/10 border border-luxury-accent/30 rounded-sm flex items-center justify-center text-luxury-accent">
              <Heart size={20} />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">{missionVision.vision.title}</h3>
            <p className="text-xs text-luxury-muted font-sans font-light leading-relaxed">
              {missionVision.vision.description}
            </p>
          </div>
        </div>
      </section>

      {/* Chronological Milestone Timeline */}
      <section className="py-24 bg-luxury-sec border-t border-b border-luxury-border/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
              CHRONOLOGY
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">Our Journey Through Time</h2>
          </div>

          <div className="relative border-l border-luxury-border/60 ml-4 md:ml-32 space-y-12">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                {/* Year tag left aligned on desktop */}
                <div className="hidden md:block absolute right-full mr-12 top-0.5 font-serif text-xl font-bold text-luxury-accent">
                  {event.year}
                </div>

                {/* Node circle pointer */}
                <div className="absolute -left-[6px] top-2 w-3 h-3 bg-luxury-bg border border-luxury-accent rounded-full" />

                {/* Timeline Card details */}
                <div className="space-y-1">
                  <span className="font-serif text-xs font-bold text-luxury-accent block md:hidden">
                    {event.year}
                  </span>
                  <h3 className="font-serif text-lg text-white font-bold">{event.title}</h3>
                  <p className="text-xs text-luxury-muted font-sans leading-relaxed font-light">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
              ACCOLADES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">Industry Awards</h2>
          </div>

          <div className="overflow-x-auto border border-luxury-border/60 rounded-sm">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-luxury-border/60 bg-luxury-sec/60">
                  <th className="p-4 uppercase tracking-wider text-luxury-accent font-bold">Year</th>
                  <th className="p-4 uppercase tracking-wider text-luxury-accent font-bold">Award Title</th>
                  <th className="p-4 uppercase tracking-wider text-luxury-accent font-bold">Category</th>
                  <th className="p-4 uppercase tracking-wider text-luxury-accent font-bold">Organization</th>
                </tr>
              </thead>
              <tbody>
                {awards.map((award, idx) => (
                  <tr key={idx} className="border-b border-luxury-border/40 hover:bg-luxury-sec/30 transition-colors">
                    <td className="p-4 font-serif text-luxury-accent font-semibold">{award.year}</td>
                    <td className="p-4 text-white font-bold">{award.title}</td>
                    <td className="p-4 text-luxury-muted">{award.category}</td>
                    <td className="p-4 text-luxury-muted/70">{award.organization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Reusable Studio Process (Lifecycle Steps) */}
      <section className="py-24 bg-luxury-sec border-t border-b border-luxury-border/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
              METHODOLOGY
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">The Studio Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, idx) => (
              <div key={idx} className="flex flex-col space-y-4 relative">
                <span className="font-serif text-3xl font-bold text-luxury-accent/30">{step.step}</span>
                <h3 className="font-serif text-base font-bold text-white tracking-wide">{step.title}</h3>
                <p className="text-[11px] text-luxury-muted font-sans leading-relaxed font-light">
                  {step.description}
                </p>
                {idx < 4 && (
                  <div className="hidden md:block absolute top-4 left-[90%] w-full h-[1px] bg-gradient-to-r from-luxury-accent/30 to-transparent -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">
              CREATIVE GUILD
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">Meet the Team</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col space-y-4 p-6 bg-luxury-sec border border-luxury-border/60 rounded-sm">
                <div
                  className="aspect-square bg-cover bg-center border border-luxury-border rounded-sm shadow-md"
                  style={{ backgroundImage: `url('${member.imageUrl}')` }}
                />
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-white">{member.name}</h3>
                  <span className="text-[9px] uppercase tracking-widest text-luxury-accent block">{member.role}</span>
                </div>
                <p className="text-[10px] text-luxury-muted font-sans leading-normal font-light">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page Call To Action */}
      <section className="py-28 relative overflow-hidden bg-luxury-sec">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-accent/5 rounded-full blur-[100px] -z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold">COMMISSION OUR STUDIO</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">Ready to Document Your Sparks?</h2>
          <p className="text-xs text-luxury-muted font-sans font-light max-w-lg mx-auto leading-relaxed">
            Reserve your consultation date at our lounge or schedule a digital mood-board review.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300"
              style={{ letterSpacing: "0.15em" }}
            >
              Get In Touch
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
export default AboutPageContent;
