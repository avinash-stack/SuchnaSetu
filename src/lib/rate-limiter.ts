/**
 * Lightweight, in-memory sliding window rate limiter.
 * Edge-compatible with zero external dependencies (Redis/database not required for edge middleware).
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  const windowExpiry = 60 * 1000; // 1 minute
  for (const [key, record] of rateLimitStore.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowExpiry);
    if (record.timestamps.length === 0) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTimeMs: number;
}

/**
 * Checks and records a request against rate limit thresholds.
 * @param identifier Client IP, API token, or session identifier
 * @param limit Maximum requests allowed in the window (default: 60)
 * @param windowMs Window duration in milliseconds (default: 60,000 ms / 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(identifier) || { timestamps: [] };

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetTimeMs = windowMs - (now - oldestTimestamp);

    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTimeMs: Math.max(0, resetTimeMs),
    };
  }

  // Record this request
  record.timestamps.push(now);
  rateLimitStore.set(identifier, record);

  return {
    allowed: true,
    limit,
    remaining: limit - record.timestamps.length,
    resetTimeMs: windowMs,
  };
}
