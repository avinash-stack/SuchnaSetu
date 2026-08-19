"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE_CONFIG, PUBLIC_NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Menu,
  X,
  Search,
  Briefcase,
  Calendar,
  Newspaper,
  LayoutGrid,
  Globe,
  Home,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Icon mapping for navigation links
  const getNavIcon = (href: string) => {
    switch (href) {
      case "/":
        return <Home className="h-4 w-4" />;
      case "/jobs":
        return <Briefcase className="h-4 w-4" />;
      case "/exams":
        return <Calendar className="h-4 w-4" />;
      case "/news":
        return <Newspaper className="h-4 w-4" />;
      case "/#modules":
        return <LayoutGrid className="h-4 w-4" />;
      case "/#sources":
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85 shadow-xs transition-all">
      {/* Top Civic Identity Strip */}
      <div className="bg-slate-950 px-4 py-1 text-[11px] text-slate-300 border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-200 tracking-wide">
              Official Public Notice & Gazette Aggregator
            </span>
            <span className="hidden text-slate-600 sm:inline">•</span>
            <span className="hidden text-slate-400 sm:inline">
              Real-time central & state circulars
            </span>
          </div>

          <div className="hidden items-center space-x-3 text-slate-400 sm:flex">
            <span className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Verified Authentic
            </span>
            <span className="text-[10px] text-slate-500">Free Public Access</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <Image
            src="/brand/logo-icon.png"
            alt="SuchnaSetu Logo"
            width={52}
            height={52}
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-[50px] md:w-[50px] object-contain transition-transform group-hover:scale-105 flex-shrink-0"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors font-heading leading-none">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
              सूचना सेतु • Public Portal
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/#")
                ? false
                : pathname.startsWith(item.href);

            const isLiveModule = item.href === "/jobs" || item.href === "/exams";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-900 shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{item.title}</span>
                {isLiveModule && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-brand-600" : "bg-emerald-500"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
          <Link href="/search" className="flex items-center">
            <Button
              variant="brand"
              size="sm"
              className="gap-2 font-bold shadow-xs hover:shadow-sm"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search Notices</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 lg:hidden animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : item.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(item.href);

              const icon = getNavIcon(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-900 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-brand-600" : "text-slate-400"}>
                      {icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {isActive ? (
                    <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                      Active
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button variant="brand" className="w-full gap-2 font-bold justify-center">
                <Search className="h-4 w-4" />
                <span>Search Government Jobs</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
