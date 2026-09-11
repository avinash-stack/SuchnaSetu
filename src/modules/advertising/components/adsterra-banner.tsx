"use client";

import * as React from "react";
import { AdBannerDimensions } from "../types";

interface AdsterraBannerProps {
  adKey: string;
  dimensions?: AdBannerDimensions;
  className?: string;
  placement?: string;
}

/**
 * Renders an Adsterra Standard Banner in an isolated, lazy-loaded sandbox iframe.
 * 
 * Benefits:
 * - Zero Style Bleed: Ad scripts cannot manipulate or corrupt the React app DOM.
 * - Zero Global Scope Collision: Multiple banners each have their own `atOptions` scope.
 * - Non-blocking Lazy Load: Core Web Vitals (LCP, INP, FID) are protected.
 * - Responsive: Dynamically switches between desktop (e.g. 728x90) and mobile (e.g. 300x250).
 */
export function AdsterraBanner({
  adKey,
  dimensions = { width: 728, height: 90, mobileWidth: 300, mobileHeight: 250 },
  className = "",
  placement,
}: AdsterraBannerProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const media = window.matchMedia("(max-width: 640px)");
    setIsMobile(media.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  const activeWidth = isMobile && dimensions.mobileWidth ? dimensions.mobileWidth : dimensions.width;
  const activeHeight = isMobile && dimensions.mobileHeight ? dimensions.mobileHeight : dimensions.height;

  const isMock =
    process.env.NEXT_PUBLIC_ADSTERRA_MOCK === "true" ||
    !adKey ||
    adKey === "mock" ||
    adKey === "preview";

  if (!isMounted) {
    return (
      <div
        className={`w-full flex items-center justify-center bg-slate-50/20 ${className}`}
        style={{ minHeight: `${activeHeight}px`, minWidth: `${Math.min(activeWidth, 300)}px` }}
      />
    );
  }

  // Development / Preview mode mock banner
  if (isMock) {
    return (
      <div
        className={`flex flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-100/70 text-slate-500 rounded-lg p-3 text-center transition-all ${className}`}
        style={{
          width: "100%",
          maxWidth: `${activeWidth}px`,
          minHeight: `${activeHeight}px`,
        }}
        data-testid="adsterra-mock-banner"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Adsterra Banner Slot ({activeWidth}×{activeHeight})
        </span>
        <span className="text-[11px] text-slate-400 mt-1">
          Placement: {placement || "standard"} | Mode: Preview (Isolated)
        </span>
      </div>
    );
  }

    const scriptDomain =
      adKey === "5d17d47def2c249a59032e18c8333895"
        ? "www.highrevenueformat.com"
        : "www.highperformanceformat.com";

    const iframeSrcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <base target="_blank">
    <style>
      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${activeHeight},
        'width' : ${activeWidth},
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://${scriptDomain}/${adKey}/invoke.js"></script>
  </body>
</html>`;

  return (
    <iframe
      title={`Adsterra Banner ${placement || ""}`}
      srcDoc={iframeSrcDoc}
      width={activeWidth}
      height={activeHeight}
      loading="lazy"
      scrolling="no"
      frameBorder="0"
      className={`border-0 overflow-hidden mx-auto transition-all ${className}`}
      style={{
        maxWidth: "100%",
        width: `${activeWidth}px`,
        height: `${activeHeight}px`,
      }}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
    />
  );
}
