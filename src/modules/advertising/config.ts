import {
  AdPlacement,
  AdPlacementConfig,
  AdModule,
  AdsterraGlobalConfig,
} from "./types";

/**
 * Exact Adsterra Integration Parameters & Official CDN Endpoints
 */
export const ADSTERRA_EXACT_KEYS = {
  socialBarScript: "https://pl31291760.profitableratecpmnetwork.com/e5/4f/7b/e54f7be86bf67df29c3c825fa2b7b6a1.js",
  smartlinkUrl: "https://www.profitableratecpmnetwork.com/rd25qqri?key=7b4068ae568ae3b5d8d4da2c685bffa8",
  nativeContainerId: "container-363f38586769eadbbf770f22d40b30ab",
  nativeKey: "363f38586769eadbbf770f22d40b30ab",
  nativeScriptUrl: "https://pl31291759.profitableratecpmnetwork.com/363f38586769eadbbf770f22d40b30ab/invoke.js",
  banner160x300Key: "5d17d47def2c249a59032e18c8333895",
  banner160x300Script: "https://www.highrevenueformat.com/5d17d47def2c249a59032e18c8333895/invoke.js",
};

/**
 * Checks if Adsterra is globally enabled via feature flag.
 * Default is FALSE to ensure complete safety and isolation.
 */
export function isAdsterraEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADSTERRA_ENABLED === "true";
}

/**
 * Checks if Adsterra is enabled for a specific module (jobs, exams, news, home, global).
 * Requires the master flag to be ON.
 */
export function isAdsterraModuleEnabled(module: AdModule): boolean {
  if (!isAdsterraEnabled()) return false;

  switch (module) {
    case "jobs":
      return process.env.NEXT_PUBLIC_ADSTERRA_JOBS_ENABLED !== "false";
    case "exams":
      return process.env.NEXT_PUBLIC_ADSTERRA_EXAMS_ENABLED !== "false";
    case "news":
      return process.env.NEXT_PUBLIC_ADSTERRA_NEWS_ENABLED !== "false";
    case "home":
    case "global":
    default:
      return true;
  }
}

/**
 * Checks if the Social Bar overlay script is enabled.
 */
export function isAdsterraSocialBarEnabled(): boolean {
  if (!isAdsterraEnabled()) return false;
  return process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ENABLED !== "false";
}

/**
 * Checks if the optional Smartlink CTA is enabled.
 */
export function isAdsterraSmartlinkEnabled(): boolean {
  if (!isAdsterraEnabled()) return false;
  return process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_ENABLED !== "false";
}

/**
 * Reads global Adsterra configuration.
 */
export function getAdsterraConfig(): AdsterraGlobalConfig {
  const enabled = isAdsterraEnabled();
  return {
    enabled,
    bannerKey: process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY || ADSTERRA_EXACT_KEYS.banner160x300Key,
    nativeKey: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY || ADSTERRA_EXACT_KEYS.nativeKey,
    modules: {
      jobs: isAdsterraModuleEnabled("jobs"),
      exams: isAdsterraModuleEnabled("exams"),
      news: isAdsterraModuleEnabled("news"),
    },
  };
}

/**
 * Placement catalogue defining verified non-intrusive ad slots.
 */
export const AD_PLACEMENTS: Record<AdPlacement, AdPlacementConfig> = {
  // Jobs Portal Placements
  jobs_listing_infeed: {
    placement: "jobs_listing_infeed",
    module: "jobs",
    format: "native",
    minHeight: 120,
    label: "Sponsored Notice",
    defaultAdsterraKey: ADSTERRA_EXACT_KEYS.nativeKey,
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_JOBS_NATIVE_KEY",
  },
  jobs_detail_middle: {
    placement: "jobs_detail_middle",
    module: "jobs",
    format: "banner",
    dimensions: {
      width: 728,
      height: 90,
      mobileWidth: 300,
      mobileHeight: 250,
    },
    minHeight: 90,
    label: "Advertisement",
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_JOBS_BANNER_KEY",
  },
  jobs_detail_bottom: {
    placement: "jobs_detail_bottom",
    module: "jobs",
    format: "native",
    minHeight: 140,
    label: "Recommended Opportunities",
    defaultAdsterraKey: ADSTERRA_EXACT_KEYS.nativeKey,
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_JOBS_NATIVE_KEY",
  },

  // Exams Portal Placements
  exams_listing_infeed: {
    placement: "exams_listing_infeed",
    module: "exams",
    format: "native",
    minHeight: 120,
    label: "Sponsored Notice",
    defaultAdsterraKey: ADSTERRA_EXACT_KEYS.nativeKey,
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_EXAMS_NATIVE_KEY",
  },
  exams_detail_middle: {
    placement: "exams_detail_middle",
    module: "exams",
    format: "banner",
    dimensions: {
      width: 728,
      height: 90,
      mobileWidth: 300,
      mobileHeight: 250,
    },
    minHeight: 90,
    label: "Advertisement",
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_EXAMS_BANNER_KEY",
  },

  // News Portal Placements
  news_feed_between: {
    placement: "news_feed_between",
    module: "news",
    format: "native",
    minHeight: 120,
    label: "Sponsored News",
    defaultAdsterraKey: ADSTERRA_EXACT_KEYS.nativeKey,
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_NEWS_NATIVE_KEY",
  },
  news_article_middle: {
    placement: "news_article_middle",
    module: "news",
    format: "banner",
    dimensions: {
      width: 728,
      height: 90,
      mobileWidth: 300,
      mobileHeight: 250,
    },
    minHeight: 90,
    label: "Advertisement",
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_NEWS_BANNER_KEY",
  },
  news_article_bottom: {
    placement: "news_article_bottom",
    module: "news",
    format: "native",
    minHeight: 140,
    label: "Recommended Reading",
    defaultAdsterraKey: ADSTERRA_EXACT_KEYS.nativeKey,
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_NEWS_NATIVE_KEY",
  },

  // 160x300 Desktop Sidebar Banner
  sidebar_banner_160x300: {
    placement: "sidebar_banner_160x300",
    module: "global",
    format: "banner",
    dimensions: {
      width: 160,
      height: 300,
    },
    minHeight: 300,
    label: "Advertisement",
    defaultAdsterraKey: ADSTERRA_EXACT_KEYS.banner160x300Key,
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_SIDEBAR_KEY",
  },

  // Homepage Native Banner
  homepage_native: {
    placement: "homepage_native",
    module: "home",
    format: "native",
    minHeight: 120,
    label: "Sponsored Notice",
    defaultAdsterraKey: ADSTERRA_EXACT_KEYS.nativeKey,
    adsterraKeyEnv: "NEXT_PUBLIC_ADSTERRA_NATIVE_KEY",
  },

  // Intentional Smartlink CTA Card
  smartlink_cta: {
    placement: "smartlink_cta",
    module: "global",
    format: "smartlink",
    minHeight: 80,
    label: "Sponsored Partner Resource",
  },

  // Social Bar Script Placement
  social_bar: {
    placement: "social_bar",
    module: "global",
    format: "social_bar",
    minHeight: 0,
    label: "Social Bar",
  },
};

/**
 * Resolves configuration for a specific ad placement.
 */
export function getAdPlacementConfig(placement: AdPlacement): AdPlacementConfig {
  return AD_PLACEMENTS[placement];
}

/**
 * Resolves the Adsterra key for a specific placement, falling back from
 * placement-specific env var to placement default, then global key.
 */
export function resolveAdsterraPlacementKey(config: AdPlacementConfig): string {
  if (config.adsterraKeyEnv && process.env[config.adsterraKeyEnv]) {
    return process.env[config.adsterraKeyEnv]!;
  }

  if (config.defaultAdsterraKey) {
    return config.defaultAdsterraKey;
  }

  if (config.format === "banner") {
    return process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY || ADSTERRA_EXACT_KEYS.banner160x300Key;
  }

  return process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY || ADSTERRA_EXACT_KEYS.nativeKey;
}
