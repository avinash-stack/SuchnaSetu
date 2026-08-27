/**
 * Discovery Configuration Manager
 */

export interface DiscoveryConfig {
  isEnabled: boolean;
  maxConcurrency: number;
  perProviderTimeoutMs: number;
  totalRunTimeoutMs: number;
  autoPublishThreshold: number; // minimum confidence score (e.g. 80) to automatically publish
}

export function getDiscoveryConfig(): DiscoveryConfig {
  const isEnabled = process.env.DISCOVERY_ENABLED !== "false";
  const maxConcurrency = parseInt(process.env.DISCOVERY_MAX_CONCURRENCY || "3", 10);
  const perProviderTimeoutMs = parseInt(process.env.DISCOVERY_PROVIDER_TIMEOUT_MS || "12000", 10);
  const totalRunTimeoutMs = parseInt(process.env.DISCOVERY_TOTAL_TIMEOUT_MS || "180000", 10);
  const autoPublishThreshold = parseInt(process.env.DISCOVERY_AUTO_PUBLISH_THRESHOLD || "80", 10);

  return {
    isEnabled,
    maxConcurrency: isNaN(maxConcurrency) || maxConcurrency < 1 ? 3 : maxConcurrency,
    perProviderTimeoutMs: isNaN(perProviderTimeoutMs) || perProviderTimeoutMs < 2000 ? 12000 : perProviderTimeoutMs,
    totalRunTimeoutMs: isNaN(totalRunTimeoutMs) || totalRunTimeoutMs < 10000 ? 180000 : totalRunTimeoutMs,
    autoPublishThreshold: isNaN(autoPublishThreshold) ? 80 : autoPublishThreshold,
  };
}
