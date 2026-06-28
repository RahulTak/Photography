import React from "react";
import { getSurfaceClass, getBorderClass } from "@/utils/theme-helpers";

export interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  variant?: 'card' | 'secondary';
  borderVariant?: boolean;
}

export function AdminCard({
  className = "",
  title,
  variant = 'card',
  borderVariant = true,
  children,
  ...props
}: AdminCardProps) {
  return (
    <div
      className={`${getSurfaceClass(variant)} ${
        borderVariant ? `${getBorderClass()} border` : ""
      } p-6 rounded-sm shadow-lg space-y-6 ${className}`}
      {...props}
    >
      {title && (
        <h3 className={`font-serif text-lg font-bold text-foreground ${borderVariant ? `${getBorderClass()} border-b pb-3` : ""}`}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export default AdminCard;
