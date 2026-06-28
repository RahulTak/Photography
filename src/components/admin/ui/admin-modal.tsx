import React from "react";
import { X } from "lucide-react";
import { getSurfaceClass, getBorderClass } from "@/utils/theme-helpers";

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = "max-w-xl",
}: AdminModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
      <div className={`${getSurfaceClass('card')} ${getBorderClass()} border ${maxWidthClass} w-full p-8 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-foreground transition-colors cursor-pointer outline-none"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h3 className="font-serif text-xl font-bold text-foreground mb-6">
          {title}
        </h3>

        {children}
      </div>
    </div>
  );
}

export default AdminModal;
