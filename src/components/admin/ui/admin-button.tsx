import React, { forwardRef } from "react";
import { getButtonClass } from "@/utils/theme-helpers";

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
}

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className = "", variant = 'primary', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${getButtonClass(variant)} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";
export default AdminButton;
