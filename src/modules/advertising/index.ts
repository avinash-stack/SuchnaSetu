/**
 * SuchnaSetu Advertising Module
 * 
 * Provides isolated, feature-flagged advertising slots supporting
 * standard banners and native ads without impacting site performance,
 * SEO, translation, or Google AdSense.
 */

export * from "./types";
export * from "./config";
export { AdContainer } from "./components/ad-container";
export { AdsterraBanner } from "./components/adsterra-banner";
export { AdsterraNative } from "./components/adsterra-native";
export { AdsterraSocialBar } from "./components/adsterra-social-bar";
export { AdsterraSmartlinkCTA } from "./components/adsterra-smartlink-cta";
export { AdSlot } from "./components/ad-slot";
