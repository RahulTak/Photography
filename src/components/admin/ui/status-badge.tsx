import React from "react";
import { CheckCircle, Ban, Hourglass, Mail, MailOpen } from "lucide-react";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true, className = "", ...props }: StatusBadgeProps) {
  const norm = (status || "pending").toLowerCase();
  
  let colorClasses = "bg-secondary border-border text-muted";
  let icon: React.ReactNode = null;

  switch (norm) {
    case "confirmed":
      colorClasses = "bg-green-500/10 border-green-500/20 text-green-500 dark:text-green-400";
      icon = <CheckCircle size={10} className="shrink-0" />;
      break;
    case "completed":
      colorClasses = "bg-blue-500/10 border-blue-500/20 text-blue-500 dark:text-blue-400";
      icon = <CheckCircle size={10} className="shrink-0" />;
      break;
    case "cancelled":
      colorClasses = "bg-red-500/10 border-red-500/20 text-red-500 dark:text-red-400";
      icon = <Ban size={10} className="shrink-0" />;
      break;
    case "pending":
      colorClasses = "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
      icon = <Hourglass size={10} className="shrink-0" />;
      break;
    case "unread":
      colorClasses = "bg-accent/15 border-accent/25 text-accent";
      icon = <Mail size={10} className="shrink-0" />;
      break;
    case "read":
      colorClasses = "bg-secondary border-border text-muted";
      icon = <MailOpen size={10} className="shrink-0" />;
      break;
    case "active":
      colorClasses = "bg-green-500/10 border-green-500/20 text-green-500 dark:text-green-400";
      break;
    case "inactive":
      colorClasses = "bg-secondary border-border text-muted";
      break;
  }

  return (
    <div
      className={`px-2 py-0.5 rounded-sm text-[8px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${colorClasses} ${className}`}
      {...props}
    >
      {showIcon && icon}
      <span>{status}</span>
    </div>
  );
}
