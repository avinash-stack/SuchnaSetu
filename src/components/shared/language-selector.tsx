"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/i18n/config";
import { Globe, ChevronDown, Check } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "masthead" | "navbar" | "capsule" | "mobile";
  className?: string;
}

export function LanguageSelector({ variant = "capsule", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en;
  const langList = Object.values(SUPPORTED_LANGUAGES);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code, true);
    setIsOpen(false);
  };

  // Base button styles per variant
  const buttonStyle =
    variant === "masthead"
      ? "bg-white/10 hover:bg-white/20 text-white border-white/20 text-[11px] rounded-full"
      : variant === "capsule"
      ? "bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border-slate-200/80 text-xs rounded-full px-3 py-1.5"
      : variant === "navbar"
      ? "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 text-xs rounded-lg px-2.5 py-1"
      : "w-full justify-between bg-slate-50 text-slate-900 border-slate-200 text-sm rounded-lg";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 font-semibold border transition-all shadow-2xs ${buttonStyle}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Select language. Current language is ${currentLang.name}`}
      >
        <Globe className="h-3.5 w-3.5 text-[#FE8D01] shrink-0" />
        <span className="font-bold tracking-wide">{currentLang.nativeName}</span>
        <ChevronDown className={`h-3 w-3 opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Choose Language / भाषा चुनें
          </div>
          <div className="space-y-0.5" role="menu" aria-orientation="vertical">
            {langList.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  onClick={() => handleSelect(item.code)}
                  role="menuitem"
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left rounded-xl transition-colors text-xs ${
                    isSelected
                      ? "bg-[#013089]/10 text-[#013089] font-bold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-[13px] leading-tight text-slate-900">
                      {item.nativeName}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-[#013089] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
