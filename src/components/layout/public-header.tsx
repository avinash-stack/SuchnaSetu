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
  Menu,
  X,
  Search,
  ChevronRight,
  ShieldCheck,
  Building2,
  KeyRound,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface NavConfigItem {
  key: TranslationKey;
  href: string;
  badge?: string;
  badgeColor?: string;
}

// 6 Core Navigation Links
const MAIN_NAV_CONFIG: NavConfigItem[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.jobs", href: "/jobs" },
  { key: "nav.exams", href: "/exams" },
  { key: "nav.admit_cards", href: "/admit-cards", badge: "Live", badgeColor: "bg-[#FE8D01] text-white" },
  { key: "nav.results", href: "/results", badge: "New", badgeColor: "bg-emerald-600 text-white" },
  { key: "nav.news", href: "/news" },
];

// Additional portals for Mobile Drawer
const MOBILE_EXTRA_PORTALS: { href: string; key: TranslationKey; icon: any }[] = [
  { href: "/directory", key: "nav.directory", icon: Building2 },
  { href: "/answer-keys", key: "nav.answer_keys", icon: KeyRound },
  { href: "/syllabus", key: "nav.syllabus", icon: BookOpen },
  { href: "/coming-soon", key: "nav.coming_soon", icon: Sparkles },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t } = useLanguage();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Completely omit the main header on News pages (News has its own dedicated header)
  if (pathname === "/news" || pathname.startsWith("/news/")) {
    return null;
  }

  return (
    <header className="fixed top-3 left-0 right-0 z-50 pointer-events-none px-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl pointer-events-auto">
        {/* Floating Capsule Island Navbar */}
        <div className="rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl shadow-slate-900/10 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 transition-all">
          {/* ================================================================= */}
          {/* 1. Left: Circular Brand Logo & Title */}
          {/* ================================================================= */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#FE8D01] to-[#013089] p-[2px] shadow-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/brand/logo-icon.png"
                  alt="SuchnaSetu Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col notranslate" translate="no">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#013089] font-heading leading-none notranslate">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#FE8D01] mt-0.5 leading-none notranslate">
                Official Gazette
              </span>
            </div>
          </Link>

          {/* ================================================================= */}
          {/* 2. Center: Inner Pill Navigation Track */}
          {/* ================================================================= */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 border border-slate-200/70 rounded-full p-1 shadow-2xs gap-0.5 shrink-0" aria-label="Main Navigation">
            {MAIN_NAV_CONFIG.map((item) => {
              const isNews = item.href === "/news";
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={isNews ? "_blank" : undefined}
                  rel={isNews ? "noopener noreferrer" : undefined}
                  className={`relative px-3.5 py-1 rounded-full text-xs xl:text-[13px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-white text-[#013089] shadow-xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-semibold"
                  }`}
                >
                  <span>{t(item.key)}</span>
                  {item.badge && (
                    <span
                      className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider leading-none shrink-0 ${
                        isActive ? "bg-[#013089] text-white" : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ================================================================= */}
          {/* 3. Right: Saffron Gradient Search CTA + Language Selector + Menu */}
          {/* ================================================================= */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Vibrant Search CTA Pill */}
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FE8D01] to-[#E07B00] hover:from-[#E07B00] hover:to-[#C66D00] text-white font-bold text-xs sm:text-[13px] shadow-xs shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
              title={t("nav.search_notices")}
              aria-label={t("nav.search_notices")}
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block whitespace-nowrap">{t("nav.search_notices")}</span>
            </Link>

            {/* Multilingual Selector (Capsule Variant) */}
            <LanguageSelector variant="capsule" className="shrink-0" />

            {/* Mobile / Tablet Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-9 w-9 rounded-full inline-flex items-center justify-center text-slate-700 hover:bg-slate-100 border border-slate-200/90 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-[#013089]" />}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. Mobile & Tablet Drawer Menu (Floating Rounded Card) */}
        {/* ================================================================= */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 mx-auto max-w-lg rounded-3xl border border-slate-200/90 bg-white/98 backdrop-blur-2xl px-5 py-4 shadow-2xl space-y-4 animate-in slide-in-from-top-2 fade-in-50">
            {/* Main Navigation Links */}
            <div className="space-y-1">
              {MAIN_NAV_CONFIG.map((item) => {
                const isNews = item.href === "/news";
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={isNews ? "_blank" : undefined}
                    rel={isNews ? "noopener noreferrer" : undefined}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-[14px] sm:text-[15px] font-bold rounded-2xl transition-colors ${
                      isActive
                        ? "bg-[#013089] text-white"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{t(item.key)}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isActive ? "bg-white text-[#013089]" : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isActive ? "text-white/70" : "text-slate-400"}`} />
                  </Link>
                );
              })}
            </div>

            {/* Quick Portals & Directory */}
            <div className="pt-3 border-t border-slate-100">
              <div className="px-3 pb-2 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Civic Portals &amp; Directory
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {MOBILE_EXTRA_PORTALS.map((hub) => {
                  const HubIcon = hub.icon;
                  const isHubActive = pathname.startsWith(hub.href);
                  return (
                    <Link
                      key={hub.href}
                      href={hub.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isHubActive
                          ? "bg-[#013089]/10 text-[#013089]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <HubIcon className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{t(hub.key)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Search CTA */}
            <div className="pt-2 border-t border-slate-100">
              <Link href="/search" className="block w-full">
                <Button variant="brand" size="lg" className="w-full justify-center text-sm font-bold h-11 gap-2 rounded-full shadow-md shadow-amber-500/20">
                  <Search className="h-4 w-4" />
                  <span>{t("nav.search_notices")}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
