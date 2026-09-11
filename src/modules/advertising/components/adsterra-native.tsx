"use client";

import * as React from "react";

interface AdsterraNativeProps {
  adKey: string;
  minHeight?: number;
  className?: string;
  placement?: string;
}

/**
 * Renders an Adsterra Native Banner widget in a non-blocking container.
 * 
 * Safe Execution:
 * - Mounted via useEffect to prevent SSR hydration mismatches.
 * - In mock mode, displays an accessible native recommendation mock.
 * - In live mode, dynamically loads the container script without blocking page render.
 */
export function AdsterraNative({
  adKey,
  minHeight = 120,
  className = "",
  placement,
}: AdsterraNativeProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const isMock =
    process.env.NEXT_PUBLIC_ADSTERRA_MOCK === "true" ||
    !adKey ||
    adKey === "mock" ||
    adKey === "preview";

  React.useEffect(() => {
    if (!isMounted || isMock || !adKey || !containerRef.current) return;

    const scriptUrl =
      adKey === "363f38586769eadbbf770f22d40b30ab"
        ? "https://pl31291759.profitableratecpmnetwork.com/363f38586769eadbbf770f22d40b30ab/invoke.js"
        : `https://www.highperformanceformat.com/${adKey}/invoke.js`;

    // Prevent duplicate script injection across SPA navigation
    if (document.querySelector(`script[src="${scriptUrl}"]`)) {
      return;
    }

    // Load Adsterra Native Script into dedicated container
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = scriptUrl;

    const currentContainer = containerRef.current;
    currentContainer.appendChild(script);

    return () => {
      try {
        if (currentContainer.contains(script)) {
          currentContainer.removeChild(script);
        }
      } catch {
        // Silently handle if script was removed by ad script
      }
    };
  }, [isMounted, isMock, adKey]);

  if (!isMounted) {
    return (
      <div
        className={`w-full bg-slate-50/20 ${className}`}
        style={{ minHeight: `${minHeight}px` }}
      />
    );
  }

  // Development / Mock mode native card preview
  if (isMock) {
    return (
      <div
        className={`w-full rounded-lg border border-dashed border-slate-300 bg-white p-4 space-y-2.5 text-center ${className}`}
        style={{ minHeight: `${minHeight}px` }}
        data-testid="adsterra-mock-native"
      >
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pb-1 border-b border-slate-100">
          <span className="text-[#013089] font-bold uppercase tracking-wider">
            Sponsored Notification / Opportunity
          </span>
          <span className="text-[10px] text-slate-400">Adsterra Native Preview</span>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2">
          Relevant career guidance, preparation resources, or educational opportunities partner notices.
        </p>
        <div className="text-[10px] text-slate-400">
          Placement: <code className="text-slate-600 bg-slate-100 px-1 py-0.5 rounded">{placement || "native"}</code>
        </div>
      </div>
    );
  }

  // Live Production Adsterra Native Container
  return (
    <div
      ref={containerRef}
      id={`container-${adKey}`}
      className={`w-full min-w-[280px] overflow-hidden ${className}`}
      style={{ minHeight: `${minHeight}px` }}
    />
  );
}
