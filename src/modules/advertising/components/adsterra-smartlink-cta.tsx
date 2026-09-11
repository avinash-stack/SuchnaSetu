"use client";

import * as React from "react";
import { ExternalLink, Sparkles } from "lucide-react";
import { isAdsterraEnabled, isAdsterraSmartlinkEnabled, ADSTERRA_EXACT_KEYS } from "../config";

interface AdsterraSmartlinkCTAProps {
  className?: string;
  title?: string;
  description?: string;
}

/**
 * Intentional, transparent CTA card for Adsterra Smartlink.
 * 
 * Safety & Compliance:
 * 1. Returns null when Adsterra is disabled (zero DOM footprint).
 * 2. Clearly labeled as "SPONSORED PARTNER NOTICE" with rel="sponsored nofollow noopener".
 * 3. Never disguised as an official government notification, admit card, or apply link.
 * 4. Placed only in intentional, optional locations outside critical tables and workflows.
 */
export function AdsterraSmartlinkCTA({
  className = "",
  title = "Career & Examination Preparation Resources",
  description = "Access optional third-party test series, preparation materials, and educational partner resources.",
}: AdsterraSmartlinkCTAProps) {
  if (!isAdsterraEnabled() || !isAdsterraSmartlinkEnabled()) {
    return null;
  }

  return (
    <div
      role="complementary"
      aria-label="Sponsored Partner Opportunity"
      translate="no"
      className={`notranslate my-6 mx-auto w-full max-w-4xl rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50 to-blue-50/30 p-4 sm:p-5 text-slate-800 shadow-2xs transition-all ${className}`}
      data-testid="adsterra-smartlink-cta"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
              <Sparkles className="h-3 w-3 text-[#FE8D01]" />
              Sponsored Partner Resource
            </span>
            <span className="text-[10px] text-slate-400">Optional Resource</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {title}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <a
            href={ADSTERRA_EXACT_KEYS.smartlinkUrl}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#013089] hover:bg-[#01256b] text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors"
          >
            <span>Explore Partner Link</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Third-party sponsored link. Primary application details remain on the official government portal.</span>
      </div>
    </div>
  );
}
