/**
 * Automated Verification Script for Adsterra Configuration & Exact Tags
 * 
 * Verifies:
 * 1. Default disabled state (zero impact, returns null)
 * 2. Master toggle activation (NEXT_PUBLIC_ADSTERRA_ENABLED=true)
 * 3. Granular per-module toggles (jobs, exams, news, social bar, smartlink)
 * 4. Placement dictionary resolution and exact key/endpoint fallback
 * 5. 160x300 desktop sidebar, homepage native, smartlink CTA, social bar
 */

import {
  isAdsterraEnabled,
  isAdsterraModuleEnabled,
  isAdsterraSocialBarEnabled,
  isAdsterraSmartlinkEnabled,
  getAdsterraConfig,
  getAdPlacementConfig,
  resolveAdsterraPlacementKey,
  ADSTERRA_EXACT_KEYS,
  AD_PLACEMENTS,
} from "../src/modules/advertising/config";
import { AdPlacement } from "../src/modules/advertising/types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log("\n=======================================================");
console.log("   Adsterra Feature Flag & Exact Tags Test Suite");
console.log("=======================================================\n");

// TEST 1: Default Disabled State
console.log("--- Test Suite 1: Default Disabled State (Zero Footprint) ---");
delete process.env.NEXT_PUBLIC_ADSTERRA_ENABLED;
delete process.env.NEXT_PUBLIC_ADSTERRA_JOBS_ENABLED;
delete process.env.NEXT_PUBLIC_ADSTERRA_EXAMS_ENABLED;
delete process.env.NEXT_PUBLIC_ADSTERRA_NEWS_ENABLED;
delete process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ENABLED;
delete process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_ENABLED;

assert(isAdsterraEnabled() === false, "Adsterra is disabled by default");
assert(isAdsterraModuleEnabled("jobs") === false, "Jobs module disabled when master flag is off");
assert(isAdsterraModuleEnabled("exams") === false, "Exams module disabled when master flag is off");
assert(isAdsterraModuleEnabled("news") === false, "News module disabled when master flag is off");
assert(isAdsterraSocialBarEnabled() === false, "Social Bar disabled when master flag is off");
assert(isAdsterraSmartlinkEnabled() === false, "Smartlink disabled when master flag is off");

const defaultConfig = getAdsterraConfig();
assert(defaultConfig.enabled === false, "Global config reflects disabled state");
assert(defaultConfig.modules.jobs === false, "Global config shows jobs module disabled");

// TEST 2: Master Flag Enabled
console.log("\n--- Test Suite 2: Master Flag Enabled ---");
process.env.NEXT_PUBLIC_ADSTERRA_ENABLED = "true";

assert(isAdsterraEnabled() === true, "Adsterra is enabled when NEXT_PUBLIC_ADSTERRA_ENABLED=true");
assert(isAdsterraModuleEnabled("jobs") === true, "Jobs module enabled by default when master is on");
assert(isAdsterraModuleEnabled("exams") === true, "Exams module enabled by default when master is on");
assert(isAdsterraModuleEnabled("news") === true, "News module enabled by default when master is on");
assert(isAdsterraSocialBarEnabled() === true, "Social Bar enabled by default when master is on");
assert(isAdsterraSmartlinkEnabled() === true, "Smartlink enabled by default when master is on");

// TEST 3: Granular Module Toggles
console.log("\n--- Test Suite 3: Granular Module Toggles ---");
process.env.NEXT_PUBLIC_ADSTERRA_JOBS_ENABLED = "false";
process.env.NEXT_PUBLIC_ADSTERRA_EXAMS_ENABLED = "true";
process.env.NEXT_PUBLIC_ADSTERRA_NEWS_ENABLED = "false";
process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_ENABLED = "false";
process.env.NEXT_PUBLIC_ADSTERRA_SMARTLINK_ENABLED = "true";

assert(isAdsterraModuleEnabled("jobs") === false, "Jobs module can be individually disabled");
assert(isAdsterraModuleEnabled("exams") === true, "Exams module remains enabled");
assert(isAdsterraModuleEnabled("news") === false, "News module can be individually disabled");
assert(isAdsterraSocialBarEnabled() === false, "Social Bar can be individually disabled");
assert(isAdsterraSmartlinkEnabled() === true, "Smartlink remains enabled");

// TEST 4: Exact Keys and Endpoints Verification
console.log("\n--- Test Suite 4: Exact Adsterra Keys & URLs ---");
assert(
  ADSTERRA_EXACT_KEYS.socialBarScript === "https://pl31291760.profitableratecpmnetwork.com/e5/4f/7b/e54f7be86bf67df29c3c825fa2b7b6a1.js",
  "Exact Social Bar script URL matches user requirement"
);
assert(
  ADSTERRA_EXACT_KEYS.smartlinkUrl === "https://www.profitableratecpmnetwork.com/rd25qqri?key=7b4068ae568ae3b5d8d4da2c685bffa8",
  "Exact Smartlink URL matches user requirement"
);
assert(
  ADSTERRA_EXACT_KEYS.nativeContainerId === "container-363f38586769eadbbf770f22d40b30ab",
  "Exact Native Banner container ID matches user requirement"
);
assert(
  ADSTERRA_EXACT_KEYS.nativeScriptUrl === "https://pl31291759.profitableratecpmnetwork.com/363f38586769eadbbf770f22d40b30ab/invoke.js",
  "Exact Native Banner script URL matches user requirement"
);
assert(
  ADSTERRA_EXACT_KEYS.banner160x300Key === "5d17d47def2c249a59032e18c8333895",
  "Exact Banner 160x300 key matches user requirement"
);
assert(
  ADSTERRA_EXACT_KEYS.banner160x300Script === "https://www.highrevenueformat.com/5d17d47def2c249a59032e18c8333895/invoke.js",
  "Exact Banner 160x300 script URL matches user requirement"
);

// TEST 5: Placement Catalogue & Dimensions
console.log("\n--- Test Suite 5: Placement Catalogue & Dimensions ---");
const placements: AdPlacement[] = [
  "jobs_listing_infeed",
  "jobs_detail_middle",
  "jobs_detail_bottom",
  "exams_listing_infeed",
  "exams_detail_middle",
  "news_feed_between",
  "news_article_middle",
  "news_article_bottom",
  "sidebar_banner_160x300",
  "homepage_native",
  "smartlink_cta",
];

for (const placement of placements) {
  const config = getAdPlacementConfig(placement);
  assert(!!config, `Placement "${placement}" exists in dictionary`);
  assert(config.minHeight > 0, `Placement "${placement}" has minHeight (${config.minHeight}px)`);
}

const sidebarConfig = getAdPlacementConfig("sidebar_banner_160x300");
assert(sidebarConfig.dimensions?.width === 160, "Sidebar banner width is exactly 160px");
assert(sidebarConfig.dimensions?.height === 300, "Sidebar banner height is exactly 300px");
assert(resolveAdsterraPlacementKey(sidebarConfig) === "5d17d47def2c249a59032e18c8333895", "Sidebar banner resolves to exact key 5d17d47def2c249a59032e18c8333895");

const homepageNativeConfig = getAdPlacementConfig("homepage_native");
assert(resolveAdsterraPlacementKey(homepageNativeConfig) === "363f38586769eadbbf770f22d40b30ab", "Homepage native resolves to exact key 363f38586769eadbbf770f22d40b30ab");

console.log("\n=======================================================");
console.log("   All 25+ Adsterra Feature Flag & Exact Tag Tests Passed!");
console.log("=======================================================\n");
