"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";
import { TranslationKey } from "@/lib/i18n/translations";
import { LanguageSelector } from "@/components/shared/language-selector";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Menu,
  X,
  Search,
  ChevronRight,
} from "lucide-react";

interface NavConfigItem {
  key: TranslationKey;
  href: string;
}

const PUBLIC_NAV_CONFIG: NavConfigItem[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.jobs", href: "/jobs" },
  { key: "nav.exams", href: "/exams" },
  { key: "nav.news", href: "/news" },
  { key: "nav.directory", href: "/directory" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t, language } = useLanguage();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Current formatted date for civic masthead based on active language
  const todayFormatted = React.useMemo(() => {
    const localeMap: Record<string, string> = {
      en: "en-IN",
      hi: "hi-IN",
      bn: "bn-IN",
      or: "or-IN",
      as: "as-IN",
      pa: "pa-IN",
    };
    const locale = localeMap[language] || "en-IN";
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    } catch {
      return new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());
    }
  }, [language]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Civic Top Masthead Strip */}
      <div className="bg-[#013089] px-4 py-1.5 text-xs text-white border-b border-[#01276E]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] font-medium tracking-wide truncate">
            <span className="font-bold text-[#FE8D01] uppercase tracking-wider shrink-0">
              {t("masthead.official_portal")}
            </span>
            <span className="text-white/40">|</span>
            <span className="hidden sm:inline text-slate-100 truncate">
              {t("masthead.subtitle")}
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-slate-200 font-mono text-[10px]">
              {todayFormatted}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] shrink-0">
            <span className="inline-flex items-center gap-1 text-slate-200 hidden md:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FE8D01]" />
              <span className="font-medium">{t("masthead.verified_sources")}</span>
            </span>
            <span className="text-white/30 hidden md:inline">•</span>
            
            {/* Language Selector in Top Masthead */}
            <LanguageSelector variant="masthead" />

            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-xs font-semibold text-white hidden sm:inline-block">
              {t("masthead.citizen_access")}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo & Editorial Title */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <Image
            src="/brand/logo-icon.png"
            alt="SuchnaSetu Logo"
            width={48}
            height={48}
            className="h-10 w-10 sm:h-11 sm:w-11 object-contain flex-shrink-0"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#013089] font-heading leading-tight">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-slate-600">
              {t("brand.subtitle")}
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {PUBLIC_NAV_CONFIG.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[#013089] font-bold border-b-2 border-[#FE8D01]"
                    : "text-slate-700 hover:text-[#013089] hover:bg-slate-50 rounded-xs"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Right Search Button & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link href="/?search=" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-semibold text-slate-700 border-slate-300 hover:border-[#013089]">
              <Search className="h-3.5 w-3.5 text-[#013089]" />
              <span>{t("nav.search_notices")}</span>
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Language / भाषा
            </span>
            <LanguageSelector variant="navbar" />
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-2 border-t border-slate-100">
            Main Sections
          </div>
          <div className="space-y-1">
            {PUBLIC_NAV_CONFIG.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-xs ${
                    isActive
                      ? "bg-[#013089]/10 text-[#013089] font-bold border-l-3 border-[#FE8D01]"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <span>{t(item.key)}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link href="/?search=" className="block w-full">
              <Button variant="primary" size="sm" className="w-full justify-center text-xs">
                <Search className="h-3.5 w-3.5 mr-1.5" />
                <span>{t("nav.search_notices")}</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
