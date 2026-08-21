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
} from "lucide-react";

interface NavConfigItem {
  key: TranslationKey;
  href: string;
  badge?: string;
  badgeColor?: string;
}

const PUBLIC_NAV_CONFIG: NavConfigItem[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.jobs", href: "/jobs" },
  { key: "nav.exams", href: "/exams" },
  { key: "nav.admit_cards", href: "/admit-cards", badge: "Live", badgeColor: "bg-[#FE8D01] text-white" },
  { key: "nav.results", href: "/results", badge: "New", badgeColor: "bg-emerald-600 text-white" },
  { key: "nav.news", href: "/news" },
  { key: "nav.directory", href: "/directory" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t } = useLanguage();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
        {/* 1-Line Brand Emblem & Title */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <Image
            src="/brand/logo-icon.png"
            alt="SuchnaSetu Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-[#013089] font-heading whitespace-nowrap">
              {SITE_CONFIG.name}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#013089]/10 text-[#013089]">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span>Official</span>
            </span>
          </div>
        </Link>

        {/* 1-Line Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {PUBLIC_NAV_CONFIG.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-2.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#013089] text-white shadow-xs"
                    : "text-slate-700 hover:text-[#013089] hover:bg-slate-100/80"
                }`}
              >
                <span>{t(item.key)}</span>
                {item.badge && (
                  <span
                    className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider leading-none ${
                      isActive ? "bg-white text-[#013089]" : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* 1-Line Right Actions: Quick Search + Language Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-[#013089]" />
            <span className="text-xs">{t("nav.search_notices")}</span>
          </Link>

          <LanguageSelector variant="navbar" />

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-1.5 rounded-md text-slate-700 hover:bg-slate-100 border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-[#013089]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-xl animate-in slide-in-from-top-1">
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
                  className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-md transition-colors ${
                    isActive
                      ? "bg-[#013089] text-white"
                      : "text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{t(item.key)}</span>
                    {item.badge && (
                      <span
                        className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
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

          <div className="pt-2 border-t border-slate-100">
            <Link href="/search" className="block w-full">
              <Button variant="brand" size="sm" className="w-full justify-center text-xs font-bold h-8 gap-1.5">
                <Search className="h-3.5 w-3.5" />
                <span>{t("nav.search_notices")}</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
