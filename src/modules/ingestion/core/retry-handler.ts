import { IngestionErrorCategory } from "../types";

export interface RetryPolicy {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  initialDelayMs: 2000,
  maxDelayMs: 60000,
  backoffFactor: 2,
};

export class IngestionError extends Error {
  readonly category: IngestionErrorCategory;
  readonly isRetryable: boolean;
  readonly metadata?: Record<string, any>;

  constructor(
    message: string,
    category: IngestionErrorCategory,
    isRetryable: boolean = false,
    metadata?: Record<string, any>
  ) {
    super(message);
    this.name = "IngestionError";
    this.category = category;
    this.isRetryable = isRetryable;
    this.metadata = metadata;
  }
}

/**
 * Classifies an unknown error into a structured IngestionError category.
 */
export function classifyError(error: any): IngestionError {
  if (error instanceof IngestionError) return error;

  const msg = (error?.message || String(error)).toLowerCase();

  // Transient network / connection errors
  if (
    msg.includes("econnrefused") ||
    msg.includes("econnreset") ||
    msg.includes("etimedout") ||
    msg.includes("socket hang up") ||
    msg.includes("fetch failed")
  ) {
    return new IngestionError(error?.message || "Transient network connection failure", "transient_network", true);
  }

  // HTTP 429 Rate Limit
  if (msg.includes("429") || msg.includes("rate limit") || msg.includes("too many requests")) {
    return new IngestionError(error?.message || "Source rate limit exceeded", "rate_limited", true);
  }

  // Schema drift / validation failures
  if (msg.includes("validation") || msg.includes("zod") || msg.includes("unexpected token")) {
    return new IngestionError(error?.message || "Payload validation error or schema drift", "validation_error", false);
  }

  // Authentication failures
  if (msg.includes("401") || msg.includes("403") || msg.includes("unauthorized") || msg.includes("forbidden")) {
    return new IngestionError(error?.message || "Source authentication or permission failure", "authentication_error", false);
  }

  return new IngestionError(error?.message || "Unexpected ingestion execution error", "fatal", false);
}

/**
 * Calculates exponential backoff delay in milliseconds with jitter.
 */
export function calculateBackoffDelay(retryAttempt: number, policy: RetryPolicy = DEFAULT_RETRY_POLICY): number {
  const exponentialDelay = policy.initialDelayMs * Math.pow(policy.backoffFactor, retryAttempt);
  const cappedDelay = Math.min(exponentialDelay, policy.maxDelayMs);
  // Add 10-20% random jitter to prevent thundering herd
  const jitter = cappedDelay * 0.1 * Math.random();
  return Math.round(cappedDelay + jitter);
}
