"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-transparent"
            onClick={onCancel}
          />
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="bg-[#151515] border border-white/10 max-w-sm w-full p-6 rounded-sm shadow-2xl relative z-10"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDanger ? "bg-red-500/10 border border-red-500/30 text-red-500" : "bg-luxury-accent/10 border border-luxury-accent/30 text-luxury-accent"}`}>
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">{title}</h3>
              <p className="text-xs text-luxury-muted font-sans leading-relaxed">{message}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 py-2.5 border border-white/10 hover:bg-white/5 text-white text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 py-2.5 text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 cursor-pointer ${isDanger ? "bg-red-500 hover:bg-red-600 text-white" : "bg-luxury-accent hover:bg-luxury-hover"}`}
              >
                {isLoading ? "Processing..." : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default ConfirmModal;
