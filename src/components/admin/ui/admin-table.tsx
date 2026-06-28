import React from "react";

export interface AdminTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export function AdminTable({ children, className = "", containerClassName = "", ...props }: AdminTableProps) {
  return (
    <div className={`w-full overflow-x-auto bg-card border border-border rounded-sm shadow-sm ${containerClassName}`}>
      <table className={`w-full text-left text-xs font-sans text-muted border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function AdminThead({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-secondary/40 border-b border-border text-[9px] uppercase tracking-wider text-muted ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function AdminTbody({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-border ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function AdminTr({ children, className = "", isHeader = false, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { isHeader?: boolean }) {
  const baseClass = isHeader
    ? ""
    : "hover:bg-secondary/25 hover:text-foreground transition-colors";
  return (
    <tr className={`${baseClass} ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function AdminTh({ children, className = "", ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`p-4 font-bold ${className}`} {...props}>
      {children}
    </th>
  );
}

export function AdminTd({ children, className = "", ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`p-4 ${className}`} {...props}>
      {children}
    </td>
  );
}
