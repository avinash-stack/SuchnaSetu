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
    <header className="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Emblem & Title */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Image
            src="/brand/logo-icon.png"
            alt="SuchnaSetu Logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#013089] font-heading whitespace-nowrap">
              {SITE_CONFIG.name}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#013089]/10 text-[#013089] border border-[#013089]/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Official</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {PUBLIC_NAV_CONFIG.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm sm:text-[15px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#013089] text-white shadow-xs"
                    : "text-slate-700 hover:text-[#013089] hover:bg-slate-100"
                }`}
              >
                <span>{t(item.key)}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider leading-none ${
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

        {/* Right Actions: Quick Search + Language Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Search className="h-4 w-4 text-[#013089]" />
            <span>{t("nav.search_notices")}</span>
          </Link>

          <LanguageSelector variant="navbar" />

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-[#013089]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-1">
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
                  className={`flex items-center justify-between px-4 py-2.5 text-base font-bold rounded-lg transition-colors ${
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
                  <ChevronRight className={`h-5 w-5 ${isActive ? "text-white/70" : "text-slate-400"}`} />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link href="/search" className="block w-full">
              <Button variant="brand" size="lg" className="w-full justify-center text-sm font-bold h-11 gap-2">
                <Search className="h-4 w-4" />
                <span>{t("nav.search_notices")}</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
