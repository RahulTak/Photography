import React, { forwardRef } from "react";
import { getInputClass } from "@/utils/theme-helpers";

export interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${getInputClass()} resize-y ${className}`}
        {...props}
      />
    );
  }
);

AdminTextarea.displayName = "AdminTextarea";
export default AdminTextarea;
