import { getTinyFishConfig } from "./config";
import {
  TinyFishConnectivityResult,
  TinyFishSearchOptions,
  TinyFishSearchResponse,
  TinyFishFetchOptions,
  TinyFishFetchResponse,
} from "./types";

/**
 * Isolated client for optional TinyFish API integrations.
 * Fail-safe architecture: methods never throw unhandled exceptions to callers.
 */
export class TinyFishClient {
  /**
   * Tests network connectivity and API authentication with TinyFish service.
   * Safe for admin diagnostic dashboards or operational health checks.
   */
  async testConnectivity(): Promise<TinyFishConnectivityResult> {
    const config = getTinyFishConfig();

    if (!config.isEnabled) {
      return {
        enabled: false,
        hasKey: Boolean(config.apiKey),
        connected: false,
        message: "TinyFish is disabled (TINYFISH_ENABLED=false). Core system operates independently.",
      };
    }

    if (!config.apiKey) {
      return {
        enabled: true,
        hasKey: false,
        connected: false,
        message: "TinyFish is enabled but TINYFISH_API_KEY is not configured.",
      };
    }

    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

      // Probe TinyFish API status / search endpoint with an empty or ping query
      const probeUrl = `${config.baseUrl}/api/v1/health`;
      const response = await fetch(probeUrl, {
        method: "GET",
        headers: {
          "X-API-Key": config.apiKey,
          Accept: "application/json",
          "User-Agent": "SuchnaSetu-Diagnostic/1.0",
        },
        signal: controller.signal,
      }).catch(async () => {
        // Fallback probe to search endpoint if /health isn't exposed
        return await fetch(`https://api.search.tinyfish.ai?query=test`, {
          method: "GET",
          headers: {
            "X-API-Key": config.apiKey!,
            Accept: "application/json",
          },
          signal: controller.signal,
        });
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (response.ok || response.status === 200 || response.status === 404) {
        return {
          enabled: true,
          hasKey: true,
          connected: true,
          statusCode: response.status,
          latencyMs,
          message: `TinyFish service reachable (HTTP ${response.status}) in ${latencyMs}ms.`,
        };
      }

      if (response.status === 401 || response.status === 403) {
        return {
          enabled: true,
          hasKey: true,
          connected: false,
          statusCode: response.status,
          latencyMs,
          message: `Authentication failed (HTTP ${response.status}). Check TINYFISH_API_KEY.`,
          error: "UNAUTHORIZED",
        };
      }

      return {
        enabled: true,
        hasKey: true,
        connected: false,
        statusCode: response.status,
        latencyMs,
        message: `TinyFish returned status ${response.status}.`,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return {
        enabled: true,
        hasKey: true,
        connected: false,
        latencyMs,
        message: `Network error reaching TinyFish: ${err?.name === "AbortError" ? "Timeout" : err?.message || "Connection failed"}`,
        error: err?.message,
      };
    }
  }

  /**
   * Optional Search abstraction using TinyFish Search API.
   * Returns an empty result set if disabled or on any failure.
   */
  async search(query: string, options: TinyFishSearchOptions = {}): Promise<TinyFishSearchResponse> {
    const config = getTinyFishConfig();

    if (!config.isEnabled || !config.apiKey || !query?.trim()) {
      return {
        success: false,
        query,
        totalResults: 0,
        results: [],
        error: !config.isEnabled ? "SERVICE_DISABLED" : "MISSING_CONFIGURATION",
      };
    }

    try {
      const timeoutMs = options.timeoutMs || config.timeoutMs;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const params = new URLSearchParams({
        query: query.trim(),
        ...(options.limit ? { limit: String(options.limit) } : {}),
        ...(options.country ? { country: options.country } : {}),
        ...(options.language ? { lang: options.language } : {}),
      });

      const response = await fetch(`https://api.search.tinyfish.ai?${params.toString()}`, {
        method: "GET",
        headers: {
          "X-API-Key": config.apiKey,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          query,
          totalResults: 0,
          results: [],
          error: `HTTP_${response.status}`,
        };
      }

      const data = await response.json();
      const rawResults = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []);

      const results = rawResults.map((item: any) => ({
        title: item.title || "",
        url: item.url || item.link || "",
        snippet: item.snippet || item.description || "",
        publishedDate: item.publishedDate || item.date || undefined,
        source: item.source || undefined,
      }));

      return {
        success: true,
        query,
        totalResults: results.length,
        results,
      };
    } catch (err: any) {
      // Fail safely without propagating error
      return {
        success: false,
        query,
        totalResults: 0,
        results: [],
        error: err?.name === "AbortError" ? "TIMEOUT" : err?.message || "SEARCH_FAILED",
      };
    }
  }

  /**
   * Optional Page Fetch / Markdown extraction using TinyFish Fetch API.
   */
  async fetchPage(url: string, options: TinyFishFetchOptions = {}): Promise<TinyFishFetchResponse> {
    const config = getTinyFishConfig();

    if (!config.isEnabled || !config.apiKey || !url?.trim()) {
      return {
        success: false,
        url,
        error: !config.isEnabled ? "SERVICE_DISABLED" : "MISSING_CONFIGURATION",
      };
    }

    try {
      const timeoutMs = options.timeoutMs || config.timeoutMs;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(`${config.baseUrl}/api/v1/fetch`, {
        method: "POST",
        headers: {
          "X-API-Key": config.apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          url,
          format: options.format || "markdown",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          url,
          statusCode: response.status,
          error: `HTTP_${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        url,
        statusCode: response.status,
        content: data?.content || data?.markdown || data?.html || "",
        format: options.format || "markdown",
      };
    } catch (err: any) {
      return {
        success: false,
        url,
        error: err?.name === "AbortError" ? "TIMEOUT" : err?.message || "FETCH_FAILED",
      };
    }
  }
}

export const tinyFishClient = new TinyFishClient();
