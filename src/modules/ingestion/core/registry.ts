import { SourceAdapter } from "../interfaces/adapter.interface";
import { DataNormalizer } from "../interfaces/normalizer.interface";
import { MockBenchmarkSourceAdapter, MockBenchmarkDataNormalizer } from "../adapters/mock-test.adapter";
import { UpscSourceAdapter } from "../adapters/upsc.adapter";
import { UpscDataNormalizer } from "../adapters/upsc.normalizer";
import { GOV_JOB_SOURCES_CONFIG } from "../adapters/sources.config";
import { StandardGovJobSourceAdapter, StandardGovJobDataNormalizer } from "../adapters/standard-gov-job.adapter";

/**
 * Thread-safe plugin registry for data source adapters and normalizers.
 * Facilitates the Open-Closed Principle (OCP): new sources register as plugins
 * without requiring any modifications to the core pipeline or orchestrator.
 */
export class SourceAdapterRegistry {
  private static initialized = false;
  private static adapters: Map<string, SourceAdapter> = new Map();
  private static normalizers: Map<string, DataNormalizer> = new Map();

  /**
   * Lazy-initializes built-in canonical adapters and normalizers.
   */
  private static ensureInitialized(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Register built-in benchmark & production adapters
    this.register(new MockBenchmarkSourceAdapter(), new MockBenchmarkDataNormalizer());
    this.register(new UpscSourceAdapter(), new UpscDataNormalizer());

    // Register 28 National & State Public Service Commission adapters
    for (const config of GOV_JOB_SOURCES_CONFIG) {
      this.register(
        new StandardGovJobSourceAdapter(config),
        new StandardGovJobDataNormalizer(config)
      );
    }
  }

  /**
   * Registers a source adapter and its paired normalizer.
   */
  public static register(adapter: SourceAdapter, normalizer?: DataNormalizer): void {
    this.adapters.set(adapter.key, adapter);

    if (normalizer) {
      this.normalizers.set(adapter.key, normalizer);
    }
  }

  /**
   * Retrieves a registered adapter by its unique key.
   */
  public static getAdapter(key: string): SourceAdapter | undefined {
    this.ensureInitialized();
    return this.adapters.get(key);
  }

  /**
   * Retrieves a registered normalizer by adapter key.
   */
  public static getNormalizer(key: string): DataNormalizer | undefined {
    this.ensureInitialized();
    return this.normalizers.get(key);
  }

  /**
   * Lists all currently registered adapter keys and metadata.
   */
  public static listAdapters(): Array<{ key: string; name: string; targetModule: string }> {
    this.ensureInitialized();
    return Array.from(this.adapters.values()).map((a) => ({
      key: a.key,
      name: a.name,
      targetModule: a.targetModule,
    }));
  }

  /**
   * Clears all registered adapters (primarily used in test suites).
   */
  public static clear(): void {
    this.adapters.clear();
    this.normalizers.clear();
    this.initialized = false;
  }
}
