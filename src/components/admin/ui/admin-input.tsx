import React, { forwardRef } from "react";
import { getInputClass } from "@/utils/theme-helpers";

export interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${getInputClass()} ${className}`}
        {...props}
      />
    );
  }
);

AdminInput.displayName = "AdminInput";
export default AdminInput;
