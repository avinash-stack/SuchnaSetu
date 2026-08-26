"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export function PublicLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isNewsPage = pathname === "/news" || pathname.startsWith("/news/");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 w-full relative">
      {/* Accessibility: Skip to Content link for keyboard and screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#013089] focus:text-white focus:text-sm focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Skip to main content
      </a>

      {/* Main SuchnaSetu Navbar is omitted on News pages */}
      {!isNewsPage && <PublicHeader />}

      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 focus:outline-none w-full ${isNewsPage ? "pt-0" : "pt-20 sm:pt-24"}`}
      >
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}
