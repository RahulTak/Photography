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
import { useAdminSettings } from "@/hooks/admin/useAdmin";
import { ThemeToggle } from "@/components/common/theme-toggle";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1.2em"
    height="1.2em"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.556 0 10.076-4.522 10.079-10.082.002-2.693-1.04-5.225-2.935-7.122C16.524 1.503 14.004.46 11.312.46c-5.558 0-10.078 4.522-10.082 10.082-.001 1.91.506 3.774 1.47 5.434L1.758 21.94l6.096-1.597c.001.001 0 0 0 0zM17.01 14.39c-.272-.136-1.614-.797-1.863-.888-.25-.09-.432-.136-.614.137-.182.273-.705.888-.864 1.07-.159.182-.318.204-.59.069-.273-.136-1.15-.425-2.19-1.355-.808-.72-1.353-1.61-1.512-1.884-.159-.273-.017-.42.12-.556.123-.122.272-.318.408-.477.136-.16.182-.273.272-.455.09-.182.046-.341-.023-.477-.069-.136-.614-1.477-.841-2.023-.222-.533-.443-.46-.614-.469-.159-.008-.341-.01-.523-.01-.182 0-.477.069-.727.341-.25.273-.954.932-.954 2.273s.977 2.636 1.114 2.818c.136.182 1.92 2.932 4.653 4.113.65.28 1.157.447 1.55.573.656.208 1.253.179 1.725.108.527-.08 1.614-.66 1.841-1.295.228-.636.228-1.182.16-1.295-.069-.115-.25-.183-.523-.319z" />
  </svg>
);

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScroll(20);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  const { data: settingsRes } = useAdminSettings();
  const settings = settingsRes || {};
  const telephone = settings.telephone || "+91 98860 12345";
  const cleanPhone = telephone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/85 backdrop-blur-md border-b border-border/60 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="JP Click Studio Logo"
              className="h-10 w-10 bg-card object-contain rounded-sm border border-border/60 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span
                className="font-serif text-lg font-bold tracking-widest text-accent leading-none group-hover:text-accent/50 transition-colors duration-300"
                style={{ letterSpacing: "0.12em" }}
              >
                JP Click Studio
              </span>
              <span
                className="text-[7px] tracking-widest uppercase text-accent/80 mt-1.5 leading-none"
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
                  className="relative py-2 text-xs uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors duration-300 font-sans"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Contact CTA Button & WhatsApp */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-[#25D366]/30 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 text-xs uppercase tracking-widest text-[#25D366] hover:text-[#25D366] transition-all duration-500 rounded-sm font-sans"
              style={{ letterSpacing: "0.15em" }}
            >
              <WhatsAppIcon className="w-4 h-4 animate-bounce hover:animate-none" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="relative px-6 py-2.5 overflow-hidden group border border-accent/30 hover:border-accent text-xs uppercase tracking-widest text-foreground transition-all duration-500 rounded-sm font-sans"
              style={{ letterSpacing: "0.15em" }}
            >
              <span className="absolute inset-0 w-full h-full bg-accent/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              <span className="relative z-10 group-hover:text-foreground">Inquire</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground hover:text-accent transition-colors duration-300 p-2"
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
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col space-y-8 text-center">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-serif text-3xl tracking-wider hover:text-accent transition-colors duration-300 ${
                      isActive ? "text-accent font-semibold" : "text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="pt-8 flex flex-col space-y-4 items-center">
                <ThemeToggle />
                <a
                  href={whatsappUrl}
                  onClick={() => setMobileMenuOpen(false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[240px] px-8 py-3.5 border border-[#25D366]/30 hover:border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 text-[#25D366] text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2"
                  style={{ letterSpacing: "0.15em" }}
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp Us
                </a>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full max-w-[240px] px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm text-center"
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
