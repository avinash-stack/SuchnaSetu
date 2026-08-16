"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error securely
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-6 border border-red-200">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-2 font-heading">
        System Error Occurred
      </h1>
      <p className="max-w-md text-base text-slate-500 mb-8">
        We encountered an unexpected issue while retrieving official public notice data. Please try refreshing.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
