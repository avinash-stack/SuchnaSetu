"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NEWS_CATEGORIES } from "../constants/categories";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageSelector } from "@/components/shared/language-selector";
import { Search, ExternalLink, Menu, X, Newspaper, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { language } = useLanguage();

  const isHindi = language === "hi";

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
      {/* 1. Top Masthead Utility Strip */}
      <div className="bg-[#080E1E] text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-white font-bold tracking-wide uppercase text-[10.5px]">
              {isHindi ? "राष्ट्रीय समाचार डेस्क" : "National News Desk"}
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              {isHindi ? "सत्यापित सार्वजनिक एवं सरकारी सूचनाएं" : "Verified Public Affairs & Policy Reporting"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Seamless Link to Main Recruitment Portal */}
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FE8D01] hover:text-amber-400 transition-colors"
            >
              <span>{isHindi ? "सरकारी नौकरी एवं परीक्षा पोर्टल" : "Govt Jobs & Exams Portal"}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/news" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#FE8D01] to-[#013089] p-0.5 shadow-xs flex items-center justify-center shrink-0">
              <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/brand/logo-icon.png"
                  alt="SuchnaSetu News"
                  width={30}
                  height={30}
                  className="h-7 w-7 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 notranslate" translate="no">
                <span className="text-lg sm:text-xl font-black text-[#013089] tracking-tight font-heading leading-none">
                  SuchnaSetu
                </span>
                <span className="text-base sm:text-lg font-black text-[#FE8D01] font-heading leading-none">
                  News
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                {isHindi ? "राष्ट्रीय समाचार एवं सार्वजनिक मामले" : "National News & Public Affairs"}
              </p>
            </div>
          </Link>
        </div>

        {/* Right Search, Language Selector & Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/news/search"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors border border-slate-200"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>{isHindi ? "समाचार खोजें..." : "Search news, topics, states..."}</span>
          </Link>

          {/* Multilingual Selector */}
          <LanguageSelector variant="capsule" className="shrink-0" />

          <Button
            variant="outline"
            size="sm"
            className="sm:hidden p-2 h-9 w-9 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* 3. Category Navigation Track */}
      <nav className="border-t border-slate-100 bg-slate-50/70" aria-label="News Categories">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar text-xs font-bold text-slate-700">
            <Link
              href="/news"
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                pathname === "/news"
                  ? "bg-[#013089] text-white"
                  : "hover:bg-slate-200 text-slate-700"
              }`}
            >
              {isHindi ? "मुख्य पृष्ठ" : "All News"}
            </Link>

            {NEWS_CATEGORIES.map((cat) => {
              const href = `/news/category/${cat.slug}`;
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#013089] text-white"
                      : "hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {isHindi ? cat.name_hi : cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-lg">
          <Link href="/news/search" className="block w-full">
            <Button variant="outline" className="w-full justify-start text-xs font-semibold gap-2 h-10">
              <Search className="h-4 w-4 text-slate-400" />
              <span>{isHindi ? "समाचार खोजें..." : "Search news..."}</span>
            </Button>
          </Link>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
              {isHindi ? "समाचार श्रेणियाँ" : "Categories"}
            </span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {NEWS_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/news/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors block"
                >
                  {isHindi ? cat.name_hi : cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-blue-50 text-[#013089] font-bold text-xs"
            >
              <span>{isHindi ? "सरकारी नौकरी एवं भर्ती पोर्टल पर जाएं" : "Go to Recruitment & Jobs Portal"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
