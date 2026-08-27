import { RecruitmentDiscoveryProvider, DiscoveredCandidateNotice } from "../types";

export abstract class BaseDiscoveryProvider implements RecruitmentDiscoveryProvider {
  abstract readonly name: string;
  abstract readonly isEnabled: boolean;

  abstract executeDiscovery(
    queries: string[],
    options?: { maxResultsPerQuery?: number }
  ): Promise<DiscoveredCandidateNotice[]>;

  /**
   * Executes discovery with strict timeout shielding and error containment.
   */
  async discover(
    queries: string[],
    options?: { maxResultsPerQuery?: number }
  ): Promise<DiscoveredCandidateNotice[]> {
    if (!this.isEnabled) {
      return [];
    }

    const timeoutMs = 15000; // 15s per-provider maximum budget

    try {
      const timeoutPromise = new Promise<DiscoveredCandidateNotice[]>((_, reject) =>
        setTimeout(() => reject(new Error(`Discovery provider ${this.name} timed out after ${timeoutMs}ms`)), timeoutMs)
      );

      const discoveryPromise = this.executeDiscovery(queries, options);
      return await Promise.race([discoveryPromise, timeoutPromise]);
    } catch (err: any) {
      console.warn(`[DISCOVERY PROVIDER WARNING] Provider "${this.name}" failed or timed out:`, err?.message || err);
      return [];
    }
  }
}
