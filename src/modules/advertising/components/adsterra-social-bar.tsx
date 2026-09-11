"use client";

import * as React from "react";
import Script from "next/script";
import { isAdsterraEnabled, isAdsterraSocialBarEnabled, ADSTERRA_EXACT_KEYS } from "../config";

/**
 * Adsterra Social Bar Script Loader.
 * 
 * Non-Intrusive & Non-Blocking Guarantees:
 * 1. Returns null when NEXT_PUBLIC_ADSTERRA_ENABLED is false (default).
 * 2. Can be individually disabled via NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ENABLED="false".
 * 3. Uses strategy="lazyOnload" to ensure zero negative impact on LCP, FCP, or TBT.
 * 4. Deduplicated via unique script id to prevent duplicate script injection across SPA navigation.
 */
export function AdsterraSocialBar() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isAdsterraEnabled() || !isAdsterraSocialBarEnabled()) {
    return null;
  }

  return (
    <Script
      id="adsterra-social-bar"
      strategy="lazyOnload"
      src={ADSTERRA_EXACT_KEYS.socialBarScript}
    />
  );
}
