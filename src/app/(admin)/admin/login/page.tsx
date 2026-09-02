"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { NotificationBanner } from "@/components/shared/notification-banner";
import { ShieldCheck, Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || supabaseUrl.includes("placeholder-project") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
        setError("Deployment Configuration Error: Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing in this Vercel deployment.");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Invalid administrative credentials.");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("admin_profiles")
          .select("role, is_active")
          .eq("id", data.user.id)
          .single();

        const profile = profileData as { role: string; is_active: boolean } | null;

        if (profileError || !profile || !profile.is_active) {
          setError(`Access denied: No active administrative profile found for ${email}. Please ensure your user ID (${data.user.id}) is added to the admin_profiles database table with is_active = true.`);
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        // Full browser navigation ensures refreshed cookies are sent on the initial request
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during authentication.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-950/90 text-slate-100 shadow-2xl backdrop-blur">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-semibold text-white">
          Administrator Sign In
        </CardTitle>
        <CardDescription className="text-xs text-slate-400">
          Enter your official administrative credentials to access the editorial console.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 pt-0">
          {error && (
            <NotificationBanner
              type="warning"
              title="Authentication Error"
              message={error}
            />
          )}

          <Input
            label="Official Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@suchnasetu.in"
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          />

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>
              All administrative actions and logins are cryptographically logged with IP tracking in accordance with security policy.
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            variant="brand"
            size="md"
            isLoading={isLoading}
            className="w-full gap-2 font-semibold"
          >
            <Lock className="h-4 w-4" />
            <span>Sign In to Console</span>
          </Button>

          <Link href="/" className="w-full">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-xs text-slate-400 hover:text-white hover:bg-slate-900 gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Public Information Portal</span>
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function AdminLoginPage() {
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
          <AdminLoginForm />
        </React.Suspense>
      </div>
    </div>
  );
}
