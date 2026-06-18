"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/routes";
import { useScroll } from "@/hooks/useScroll";
import { useUIStore } from "@/store/useUIStore";
import { theme } from "@/config/theme";

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScroll(20);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-luxury-bg/85 backdrop-blur-md border-b border-luxury-border/60 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="JP Photography Logo"
              className="h-10 w-10 object-contain rounded-sm border border-luxury-border/60 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span
                className="font-serif text-lg font-bold tracking-widest text-white leading-none group-hover:text-luxury-accent transition-colors duration-300"
                style={{ letterSpacing: "0.12em" }}
              >
                JP PHOTOGRAPHY
              </span>
              <span
                className="text-[7px] tracking-widest uppercase text-luxury-accent/80 mt-1.5 leading-none"
                style={{ letterSpacing: "0.22em" }}
              >
                fine art stories
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative py-2 text-xs uppercase tracking-widest text-luxury-text/80 hover:text-luxury-accent transition-colors duration-300 font-sans"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Contact CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="relative px-6 py-2.5 overflow-hidden group border border-luxury-accent/30 hover:border-luxury-accent text-xs uppercase tracking-widest text-white transition-all duration-500 rounded-sm font-sans"
              style={{ letterSpacing: "0.15em" }}
            >
              <span className="absolute inset-0 w-full h-full bg-luxury-accent/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              <span className="relative z-10 group-hover:text-white">Inquire</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-luxury-accent transition-colors duration-300 p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-luxury-bg flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col space-y-8 text-center">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-serif text-3xl tracking-wider hover:text-luxury-accent transition-colors duration-300 ${
                      isActive ? "text-luxury-accent font-semibold" : "text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-8">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-block px-10 py-4 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
export default Navbar;
