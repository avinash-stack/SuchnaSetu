"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG, PUBLIC_NAV_ITEMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Menu, X, Lock, ExternalLink } from "lucide-react";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top Civic Identity Bar */}
      <div className="bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-slate-100">Official Public Information Aggregator</span>
            <span className="hidden text-slate-500 md:inline">|</span>
            <span className="hidden text-slate-400 md:inline">Citing direct official gazettes & notifications</span>
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Free & Open Citizen Access</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-brand-600 to-emerald-700 text-white shadow-md shadow-amber-500/10">
            <ShieldCheck className="h-6 w-6 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
              {SITE_CONFIG.name}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              सूचना सेतु • Public Portal
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center space-x-1 md:flex">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/jobs">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>Explore Govt Jobs</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400 uppercase">
                Active
              </span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden">
          <div className="space-y-1">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full"
            >
              <Button variant="primary" className="w-full">
                Explore Govt Jobs
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
