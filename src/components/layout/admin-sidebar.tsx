"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/lib/constants";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Globe,
  ScrollText,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Newspaper,
  Calendar,
  Activity,
  X,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Building2,
  Globe,
  Activity,
  ScrollText,
  Settings,
  Newspaper,
};

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    onClose?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sidebarContent = (
    <>
      {/* Top Brand Bar */}
      <div className="flex-shrink-0">
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-icon.png"
              alt="SuchnaSetu Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain bg-white rounded-xl p-1 shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white">
                SuchnaSetu
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Admin Console
              </span>
            </div>
          </div>
          {/* Close button — visible only on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Section (Independently Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">
          Core Modules
        </div>
        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.title}</span>
                {item.href === "/admin/jobs" && (
                  <span className="ml-auto rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">
                    Active
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status Badge */}
      <div className="flex-shrink-0 p-4 border-t border-slate-800">
        <div className="rounded-lg bg-slate-800/80 p-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-emerald-400 mb-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Database Connected</span>
          </div>
          <p className="text-[11px] text-slate-400">
            PostgreSQL & Supabase Auth active.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-300 flex-shrink-0 sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-300 shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
