import { SourceAdapterRegistry } from "./core/registry";
import { MockBenchmarkSourceAdapter, MockBenchmarkDataNormalizer } from "./adapters/mock-test.adapter";
import { UpscSourceAdapter } from "./adapters/upsc.adapter";
import { UpscDataNormalizer } from "./adapters/upsc.normalizer";

// Auto-register benchmark reference adapter for testing and verification
SourceAdapterRegistry.register(
  new MockBenchmarkSourceAdapter(),
  new MockBenchmarkDataNormalizer()
);

// Auto-register production UPSC Source Adapter & Normalizer
SourceAdapterRegistry.register(
  new UpscSourceAdapter(),
  new UpscDataNormalizer()
);

export * from "./types";
export * from "./interfaces/adapter.interface";
export * from "./interfaces/normalizer.interface";
export * from "./interfaces/change-detector.interface";
export * from "./interfaces/queue.interface";
export * from "./interfaces/scheduler.interface";
export * from "./core/hasher";
export * from "./core/retry-handler";
export * from "./core/change-detector";
export * from "./core/registry";
export * from "./core/queue-memory";
export * from "./core/pipeline";
export * from "./adapters/base.adapter";
export * from "./adapters/mock-test.adapter";
export * from "./adapters/upsc.adapter";
export * from "./adapters/upsc.normalizer";
export * from "./service";
export * from "./actions";
