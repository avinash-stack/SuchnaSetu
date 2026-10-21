import * as React from "react";
import { Metadata } from "next";
import { AdminLayoutShell } from "@/components/layout/admin-layout-shell";

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <AdminLayoutShell supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey}>
      {children}
    </AdminLayoutShell>
  );
}
