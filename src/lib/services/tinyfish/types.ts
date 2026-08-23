/**
 * TinyFish Service Types & Interfaces
 * Completely decoupled, optional third-party service integration.
 */

export interface TinyFishConfig {
  isEnabled: boolean;
  apiKey: string | null;
  baseUrl: string;
  timeoutMs: number;
}

export interface TinyFishConnectivityResult {
  enabled: boolean;
  hasKey: boolean;
  connected: boolean;
  statusCode?: number;
  latencyMs?: number;
  message: string;
  error?: string;
}

export interface TinyFishSearchOptions {
  limit?: number;
  country?: string;
  language?: string;
  timeoutMs?: number;
}

export interface TinyFishSearchItem {
  title: string;
  url: string;
  snippet?: string;
  publishedDate?: string;
  source?: string;
}

export interface TinyFishSearchResponse {
  success: boolean;
  query: string;
  totalResults: number;
  results: TinyFishSearchItem[];
  error?: string;
}

export interface TinyFishFetchOptions {
  format?: "markdown" | "json" | "html";
  timeoutMs?: number;
}

export interface TinyFishFetchResponse {
  success: boolean;
  url: string;
  content?: string;
  format?: string;
  statusCode?: number;
  error?: string;
}
