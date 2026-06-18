"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function PageWrapper({ children, noPadding = false }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Exponential ease-out for luxury feel
      className={`min-h-screen flex flex-col justify-between ${noPadding ? "" : "pt-24"}`}
    >
      {children}
    </motion.main>
  );
}
export default PageWrapper;
