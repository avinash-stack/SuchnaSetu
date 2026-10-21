import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AdminLoginForm } from "./admin-login-form";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Portal Branding */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/brand/logo-icon.png"
            alt="SuchnaSetu Logo"
            width={56}
            height={56}
            className="h-14 w-14 object-contain bg-white rounded-2xl p-1.5 shadow-lg mb-3"
            priority
            unoptimized
          />
          <h1 className="text-2xl font-bold tracking-tight text-white font-heading">
            SuchnaSetu Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Access • Authorized Editorial Personnel Only
          </p>
        </div>

        {/* Login Card inside Suspense */}
        <React.Suspense
          fallback={
            <Card className="border-slate-800 bg-slate-950/90 p-8 text-center text-slate-400">
              Loading admin authentication...
            </Card>
          }
        >
          <AdminLoginForm
            initialSupabaseUrl={supabaseUrl}
            initialSupabaseAnonKey={supabaseAnonKey}
          />
        </React.Suspense>
      </div>
    </div>
  );
}
