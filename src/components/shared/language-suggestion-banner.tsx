"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { SUPPORTED_LANGUAGES, getStateDisplayName } from "@/lib/i18n/config";
import { Globe, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSuggestionBanner() {
  const { suggestedLanguage, suggestedStateCode, acceptSuggestion, dismissSuggestion } = useLanguage();

  if (!suggestedLanguage || !suggestedStateCode) {
    return null;
  }

  const targetLangInfo = SUPPORTED_LANGUAGES[suggestedLanguage];
  if (!targetLangInfo) return null;

  const stateName = getStateDisplayName(suggestedStateCode);

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-950 transition-all duration-300">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-[#FE8D01] shrink-0" />
          <span>
            Viewing <strong>{stateName}</strong> notifications. Would you like to read in{" "}
            <strong>{targetLangInfo.nativeName} ({targetLangInfo.name})</strong>?
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={acceptSuggestion}
            className="h-6 px-2.5 text-[11px] font-bold bg-[#013089] hover:bg-[#01276E] text-white rounded-xs"
          >
            <Check className="h-3 w-3 mr-1" />
            <span>Switch to {targetLangInfo.nativeName}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={dismissSuggestion}
            className="h-6 px-2 text-[11px] text-amber-900 border-amber-300 hover:bg-amber-100 rounded-xs"
          >
            Keep English
          </Button>

          <button
            onClick={dismissSuggestion}
            className="text-amber-700 hover:text-amber-950 p-1 rounded-xs"
            aria-label="Dismiss language suggestion"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
