"use client";

import * as React from "react";

interface AdContainerProps {
  children: React.ReactNode;
  label?: string;
  minHeight?: number;
  className?: string;
  placement?: string;
}

/**
 * Accessible, CLS-safe container wrapper for advertising slots.
 * 
 * Guarantees:
 * 1. "notranslate" and translate="no" attributes to strictly prevent Google Translate
 *    from altering ad DOM nodes or corrupting dynamic ad iframes/scripts.
 * 2. Reserved min-height to eliminate Cumulative Layout Shift (CLS).
 * 3. Subtle, accessible "ADVERTISEMENT" badge for civic transparency and policy compliance.
 */
export function AdContainer({
  children,
  label = "ADVERTISEMENT",
  minHeight = 90,
  className = "",
  placement,
}: AdContainerProps) {
  return (
    <aside
      role="complementary"
      aria-label={label}
      translate="no"
      className={`notranslate my-5 mx-auto w-full max-w-4xl flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/40 p-2.5 transition-all ${className}`}
      style={{ minHeight: `${minHeight}px` }}
      data-ad-placement={placement}
    >
      <div className="w-full flex items-center justify-between pb-1.5 px-2 text-[10px] font-semibold tracking-wider text-slate-600 uppercase select-none">
        <span>{label}</span>
        <span className="text-[9px] text-slate-500">Sponsored</span>
      </div>
      <div className="w-full flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </aside>
  );
}
