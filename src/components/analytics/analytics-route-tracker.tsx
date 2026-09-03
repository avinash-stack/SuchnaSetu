"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, trackScrollDepth, trackInternalNavigation } from "@/lib/analytics";

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPathRef = React.useRef<string | null>(null);
  const scrollMilestones = React.useRef<Set<number>>(new Set());
  const startTimeRef = React.useRef<number>(Date.now());

  // 1. Route Navigation Tracking
  React.useEffect(() => {
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Skip duplicate or initial load if already handled
    if (lastPathRef.current !== null && lastPathRef.current !== fullPath) {
      // Record pageview on client navigation transition
      trackPageView(fullPath, document.title);

      // Track movement from previous page to current page
      let fromModule: "news" | "job" | "exam" | "bulletin" = "bulletin";
      if (lastPathRef.current.startsWith("/news")) fromModule = "news";
      else if (lastPathRef.current.startsWith("/jobs")) fromModule = "job";
      else if (lastPathRef.current.startsWith("/exams")) fromModule = "exam";

      let toModule: "news" | "job" | "exam" | "bulletin" = "bulletin";
      if (fullPath.startsWith("/news")) toModule = "news";
      else if (fullPath.startsWith("/jobs")) toModule = "job";
      else if (fullPath.startsWith("/exams")) toModule = "exam";

      if (fromModule !== toModule) {
        trackInternalNavigation(lastPathRef.current, fullPath, toModule, document.title);
      }
    }

    lastPathRef.current = fullPath;
    scrollMilestones.current.clear();
    startTimeRef.current = Date.now();
  }, [pathname, searchParams]);

  // 2. Scroll Depth Telemetry
  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (docHeight <= 0) return;

          const scrollPercent = Math.round((scrollTop / docHeight) * 100);
          const currentPath = pathname || window.location.pathname;

          [25, 50, 75, 90].forEach((threshold) => {
            if (scrollPercent >= threshold && !scrollMilestones.current.has(threshold)) {
              scrollMilestones.current.add(threshold);
              trackScrollDepth(threshold, currentPath);
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}

export function AnalyticsRouteTracker() {
  return (
    <React.Suspense fallback={null}>
      <RouteTracker />
    </React.Suspense>
  );
}
