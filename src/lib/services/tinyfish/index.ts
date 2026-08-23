/**
 * TinyFish Service Module Entrypoint
 * Completely isolated, optional, and detachable service module.
 * Default behavior remains 100% untouched when TINYFISH_ENABLED=false.
 */

export * from "./types";
export { getTinyFishConfig, isTinyFishEnabled } from "./config";
export { TinyFishClient, tinyFishClient } from "./client";
