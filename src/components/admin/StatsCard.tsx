"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <div className="bg-[#151515] border border-white/5 p-6 rounded-sm relative overflow-hidden group shadow-lg">
      <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-accent/5 rounded-full blur-2xl -z-10 group-hover:bg-luxury-accent/10 transition-colors" />

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-luxury-muted block font-medium font-sans">
            {title}
          </span>
          <h3 className="text-3xl font-bold font-serif text-white tracking-wide">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-sm bg-luxury-accent/10 border border-luxury-accent/20 flex items-center justify-center text-luxury-accent">
          <Icon size={20} />
        </div>
      </div>

      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs font-sans">
          {trend && (
            <span className={`font-semibold ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
              {trend.isPositive ? "+" : ""}{trend.value}
            </span>
          )}
          {description && <span className="text-luxury-muted font-light">{description}</span>}
        </div>
      )}
    </div>
  );
}
export default StatsCard;
