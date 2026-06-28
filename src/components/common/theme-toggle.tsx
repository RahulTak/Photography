"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-sm border border-luxury-border/40 bg-luxury-sec/20" />
    );
  }

  const cycleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("system");
    } else {
      setTheme("dark");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={12} className="text-accent animate-pulse" />;
      case "dark":
        return <Moon size={12} className="text-accent" />;
      case "system":
        return <Laptop size={12} className="text-accent" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="px-2.5 py-1.5 rounded-sm border border-border/60 hover:border-accent bg-card/30 hover:bg-accent/5 text-muted hover:text-foreground transition-all duration-300 cursor-pointer flex items-center gap-1.5 font-sans text-[9px] uppercase tracking-widest font-semibold"
      style={{ letterSpacing: "0.15em" }}
      aria-label={`Current theme is ${theme}. Click to switch.`}
      title={`Theme: ${theme.toUpperCase()}`}
    >
      {getIcon()}
      <span>{theme}</span>
    </button>
  );
}

export default ThemeToggle;
