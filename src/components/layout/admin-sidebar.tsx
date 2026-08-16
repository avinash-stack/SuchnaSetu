"use client";

import * as React from "react";
import Link from "next/link";
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
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Building2,
  Globe,
  ScrollText,
  Settings,
  Newspaper,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-slate-200 bg-slate-900 text-slate-300">
      {/* Top Brand Bar */}
      <div>
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-emerald-700 text-white shadow-md">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white">
              SuchnaSetu
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-6">
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
      </div>

      {/* Bottom System Status Badge */}
      <div className="p-4 border-t border-slate-800">
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
    </aside>
  );
}
