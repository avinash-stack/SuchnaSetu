import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline" | "brand" | "saffron" | "navy";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-colors border";

  const variants = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    secondary: "bg-slate-200 text-slate-900 border-slate-300",
    success: "bg-emerald-50 text-emerald-800 border-emerald-300",
    warning: "bg-amber-50 text-amber-900 border-amber-300",
    danger: "bg-red-50 text-red-800 border-red-300",
    outline: "bg-white border-slate-300 text-slate-700",
    brand: "bg-[#013089]/10 text-[#013089] border-[#013089]/30",
    navy: "bg-[#013089] text-white border-[#013089]",
    saffron: "bg-[#FE8D01] text-white border-[#FE8D01]",
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}
