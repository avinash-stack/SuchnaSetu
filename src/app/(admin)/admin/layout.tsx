import * as React from "react";
import { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminPwaRegister } from "@/components/shared/admin-pwa-register";

export const metadata: Metadata = {
  title: {
    template: "%s | SuchnaSetu Admin",
    default: "SuchnaSetu Admin – Mission Control & Operations",
  },
  description: "Operations console, sync orchestrator, and real-time observability center for SuchnaSetu.",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SuchnaSetu Admin",
  },
  icons: {
    icon: [
      { url: "/icons/admin/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/admin/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/admin/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <AdminPwaRegister />
      <AdminSidebar />
      <div className="flex flex-1 flex-col h-screen min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
