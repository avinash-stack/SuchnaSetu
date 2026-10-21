"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { NotificationBanner } from "@/components/shared/notification-banner";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface AdminLoginFormProps {
  initialSupabaseUrl?: string;
  initialSupabaseAnonKey?: string;
}

export function AdminLoginForm({
  initialSupabaseUrl,
  initialSupabaseAnonKey,
}: AdminLoginFormProps) {
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
      const supabaseUrl =
        initialSupabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;

      const supabaseAnonKey =
        initialSupabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (
        !supabaseUrl ||
        supabaseUrl.includes("placeholder-project") ||
        !supabaseAnonKey ||
        supabaseAnonKey.includes("placeholder")
      ) {
        setError(
          "Deployment Configuration Error: Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing or invalid in this deployment."
        );
        setIsLoading(false);
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
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
          setError(
            `Access denied: No active administrative profile found for ${email}. Please ensure your user ID (${data.user.id}) is added to the admin_profiles database table with is_active = true.`
          );
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
