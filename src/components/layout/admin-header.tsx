"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, ExternalLink, User } from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string;
  userRole?: string;
}

export function AdminHeader({ userEmail = "admin@suchnasetu.in", userRole = "super_admin" }: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-600" />
          <span className="text-sm font-semibold text-slate-800 hidden sm:inline">
            SuchnaSetu Admin Console
          </span>
        </div>
        <Badge variant="warning" className="uppercase text-[10px]">
          {userRole.replace("_", " ")}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" target="_blank">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600">
            <span>View Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>

        <div className="h-5 w-[1px] bg-slate-200" />

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <User className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium text-slate-700 hidden md:inline">
            {userEmail}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
