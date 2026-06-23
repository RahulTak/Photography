"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_LINKS, ROUTES } from "@/constants/routes";
import { CONTACT_CONTENT } from "@/constants/contact";
import { GALLERY_CATEGORIES } from "@/constants/gallery";
import { ArrowRight } from "lucide-react";
import { useAdminSettings } from "@/hooks/admin/useAdmin";

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: settingsRes } = useAdminSettings();
  const settings = settingsRes?.data || {};

  const address = settings.address || CONTACT_CONTENT.info.address;
  const phone = settings.telephone || CONTACT_CONTENT.info.phone;
  const emailVal = settings.email || CONTACT_CONTENT.info.email;

  const socialsList = [
    { name: "Instagram", url: settings.instagram || CONTACT_CONTENT.socials.find(s => s.name === "Instagram")?.url || "" },
    { name: "YouTube", url: settings.youtube || CONTACT_CONTENT.socials.find(s => s.name === "YouTube")?.url || "" },
    { name: "Facebook", url: settings.facebook || CONTACT_CONTENT.socials.find(s => s.name === "Facebook")?.url || "" },
  ].filter(s => s.url);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <footer className="bg-luxury-sec border-t border-luxury-border/60 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="flex flex-col space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="JP Click Studio Logo"
              className="h-10 w-10 bg-white object-contain rounded-sm border border-luxury-border/60 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span
                className="font-serif text-lg font-bold tracking-widest text-white leading-none group-hover:text-luxury-accent transition-colors duration-300"
                style={{ letterSpacing: "0.12em" }}
              >
                JP Click Studio
              </span>
              <span
                className="text-[7px] tracking-widest uppercase text-luxury-accent/85 mt-1.5 leading-none"
                style={{ letterSpacing: "0.22em" }}
              >
                fine art stories
              </span>
            </div>
          </Link>
          <p className="text-xs text-luxury-muted leading-relaxed font-sans max-w-sm">
            We capture the fleeting, electric sparks of human connection and preserve them in high-art editorial frames.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold mb-6" style={{ letterSpacing: "0.15em" }}>
            Explore
          </h3>
          <ul className="space-y-4 text-xs font-sans">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link href={link.path} className="text-luxury-muted hover:text-white transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold mb-6" style={{ letterSpacing: "0.15em" }}>
            Portfolio
          </h3>
          <ul className="space-y-4 text-xs font-sans">
            {GALLERY_CATEGORIES.filter((cat) => cat !== "All").map((cat) => (
              <li key={cat}>
                <Link
                  href={{ pathname: ROUTES.GALLERY, query: { cat: cat.toLowerCase() } }}
                  className="text-luxury-muted hover:text-white transition-colors duration-300"
                >
                  {cat} Shoots
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div className="flex flex-col space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-luxury-accent font-semibold mb-4" style={{ letterSpacing: "0.15em" }}>
              The Gazette
            </h3>
            <p className="text-xs text-luxury-muted mb-4 font-sans">
              Subscribe to receive exclusive insights, wedding calendars, and workshop schedules.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-white/20 focus-within:border-luxury-accent transition-colors duration-300 pb-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs w-full text-white placeholder-white/30 outline-none pr-8 font-sans"
              />
              <button type="submit" aria-label="Subscribe" className="absolute right-0 text-white hover:text-luxury-accent transition-colors duration-300">
                <ArrowRight size={16} />
              </button>
            </form>
            {submitted && (
              <p className="text-[10px] text-luxury-accent mt-2 font-sans">Welcome to our exclusive list.</p>
            )}
          </div>
          <div className="text-[10px] text-luxury-muted space-y-1 font-sans leading-relaxed pt-2">
            <p className="font-semibold text-white/90">HQ: {address}</p>
            <p>Tel: {phone}</p>
            <p>Mail: {emailVal}</p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-luxury-border/30 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-luxury-muted font-sans">
        <p>&copy; {new Date().getFullYear()} JP Click Studio. All rights reserved.</p>
        <div className="flex space-x-6">
          {socialsList.map((social) => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
