"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminPwaRegister } from "@/components/shared/admin-pwa-register";
import { setBrowserClientConfig } from "@/lib/supabase/client";

interface AdminLayoutShellProps {
  children: React.ReactNode;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export function AdminLayoutShell({
  children,
  supabaseUrl,
  supabaseAnonKey,
}: AdminLayoutShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  React.useEffect(() => {
    if (supabaseUrl && supabaseAnonKey) {
      setBrowserClientConfig(supabaseUrl, supabaseAnonKey);
    }
  }, [supabaseUrl, supabaseAnonKey]);

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-900">
        <AdminPwaRegister />
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <AdminPwaRegister />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col h-screen min-w-0 overflow-hidden">
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(true)}
          supabaseUrl={supabaseUrl}
          supabaseAnonKey={supabaseAnonKey}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
