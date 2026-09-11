"use client";

import * as React from "react";
import { AdPlacement } from "../types";
import {
  isAdsterraEnabled,
  isAdsterraModuleEnabled,
  getAdPlacementConfig,
  resolveAdsterraPlacementKey,
} from "../config";
import { AdContainer } from "./ad-container";
import { AdsterraBanner } from "./adsterra-banner";
import { AdsterraNative } from "./adsterra-native";
import { AdsterraSmartlinkCTA } from "./adsterra-smartlink-cta";
import { AdsterraSocialBar } from "./adsterra-social-bar";

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
  containerClassName?: string;
}

/**
 * Unified Ad Slot Component for SuchnaSetu.
 * 
 * Strict Zero-Impact Guarantees:
 * 1. Returns null when NEXT_PUBLIC_ADSTERRA_ENABLED is false.
 * 2. Returns null when the specific portal module (jobs, exams, news) is disabled.
 * 3. Returns null when no key is configured (unless in mock preview mode).
 * 4. Renders nothing on the server or DOM when disabled, leaving zero footprint.
 * 5. Completely isolated from AdSense and translation.
 */
export function AdSlot({
  placement,
  className = "",
  containerClassName = "",
}: AdSlotProps) {
  // Feature flag checks
  if (!isAdsterraEnabled()) {
    return null;
  }

  const config = getAdPlacementConfig(placement);
  if (!config) {
    return null;
  }

  if (!isAdsterraModuleEnabled(config.module)) {
    return null;
  }

  // Handle Social Bar
  if (config.format === "social_bar") {
    return <AdsterraSocialBar />;
  }

  // Handle Smartlink CTA
  if (config.format === "smartlink") {
    return <AdsterraSmartlinkCTA className={className} />;
  }

  const key = resolveAdsterraPlacementKey(config);
  const isMock = process.env.NEXT_PUBLIC_ADSTERRA_MOCK === "true";

  // If no key provided and not in mock mode, render nothing
  if (!key && !isMock) {
    return null;
  }

  return (
    <AdContainer
      placement={placement}
      label={config.label}
      minHeight={config.minHeight}
      className={containerClassName}
    >
      {config.format === "banner" ? (
        <AdsterraBanner
          adKey={key}
          dimensions={config.dimensions}
          placement={placement}
          className={className}
        />
      ) : (
        <AdsterraNative
          adKey={key}
          minHeight={config.minHeight}
          placement={placement}
          className={className}
        />
      )}
    </AdContainer>
  );
}

