import React, { forwardRef } from "react";

export interface AdminCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const AdminCheckbox = forwardRef<HTMLInputElement, AdminCheckboxProps>(
  ({ className = "", label, description, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          className={`w-4 h-4 rounded border-border bg-background text-accent focus:ring-accent accent-accent cursor-pointer ${className}`}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-sans font-bold text-foreground uppercase tracking-wider">
                {label}
              </span>
            )}
            {description && (
              <span className="text-[9px] text-muted font-sans">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

AdminCheckbox.displayName = "AdminCheckbox";
export default AdminCheckbox;
