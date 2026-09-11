/**
 * Core Advertising Types and Enums for SuchnaSetu
 */

export type AdProvider = "adsense" | "adsterra" | "none";

export type AdFormat = "banner" | "native" | "social_bar" | "smartlink";

export type AdPlacement =
  | "jobs_listing_infeed"
  | "jobs_detail_middle"
  | "jobs_detail_bottom"
  | "exams_listing_infeed"
  | "exams_detail_middle"
  | "news_feed_between"
  | "news_article_middle"
  | "news_article_bottom"
  | "sidebar_banner_160x300"
  | "homepage_native"
  | "smartlink_cta"
  | "social_bar";

export type AdModule = "jobs" | "exams" | "news" | "home" | "global";

export interface AdBannerDimensions {
  width: number;
  height: number;
  mobileWidth?: number;
  mobileHeight?: number;
}

export interface AdPlacementConfig {
  placement: AdPlacement;
  module: AdModule;
  format: AdFormat;
  dimensions?: AdBannerDimensions;
  minHeight: number; // For CLS prevention
  label?: string;
  adsterraKeyEnv?: string;
  defaultAdsterraKey?: string;
}

export interface AdsterraModuleToggles {
  jobs: boolean;
  exams: boolean;
  news: boolean;
}

export interface AdsterraGlobalConfig {
  enabled: boolean;
  bannerKey?: string;
  nativeKey?: string;
  modules: AdsterraModuleToggles;
}
