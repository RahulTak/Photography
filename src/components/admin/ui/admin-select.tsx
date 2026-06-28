import React, { forwardRef } from "react";
import { getInputClass } from "@/utils/theme-helpers";

export interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${getInputClass()} cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

AdminSelect.displayName = "AdminSelect";
export default AdminSelect;
