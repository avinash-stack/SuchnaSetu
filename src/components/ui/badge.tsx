import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline" | "brand";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors";

  const variants = {
    default: "bg-slate-100 text-slate-800",
    secondary: "bg-slate-200 text-slate-900",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    outline: "border border-slate-300 text-slate-700",
    brand: "bg-brand-100 text-brand-900 border border-brand-200",
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}
