import { createAdminClient } from "@/lib/supabase/admin";
import {
  DiscoveredCandidateNotice,
  VerifiedRecruitmentNotice,
  DiscoveryRunReport,
  RecruitmentDiscoveryProvider,
} from "./types";
import { getDiscoveryConfig } from "./config";
import { OfficialDomainVerifier } from "./verifier/domain-verifier";
import { NoticeExtractor } from "./extractor/notice-extractor";
import { JobDeduplicator } from "./matcher/job-deduplicator";
import { SearchDiscoveryProvider } from "./providers/search.provider";

export class DiscoveryService {
  private providers: RecruitmentDiscoveryProvider[] = [
    new SearchDiscoveryProvider(),
  ];

  private orgCache = new Map<string, string>();
  private catCache = new Map<string, string>();

  private async getOrganizationId(supabase: any, slug?: string): Promise<string> {
    const key = slug || "__default__";
    if (this.orgCache.has(key)) return this.orgCache.get(key)!;

    if (slug) {
      const { data: org } = await (supabase.from("organizations") as any)
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (org?.id) {
        this.orgCache.set(key, org.id);
        return org.id;
      }
    }

    if (this.orgCache.has("__default__")) return this.orgCache.get("__default__")!;
    const { data: defaultOrg } = await (supabase.from("organizations") as any).select("id").limit(1).single();
    const defaultId = defaultOrg?.id || "";
    this.orgCache.set("__default__", defaultId);
    if (slug) this.orgCache.set(slug, defaultId);
    return defaultId;
  }

  private async getCategoryId(supabase: any, slug?: string): Promise<string> {
    const key = slug || "__default__";
    if (this.catCache.has(key)) return this.catCache.get(key)!;

    if (slug) {
      const { data: cat } = await (supabase.from("categories") as any)
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (cat?.id) {
        this.catCache.set(key, cat.id);
        return cat.id;
      }
    }

    if (this.catCache.has("__default__")) return this.catCache.get("__default__")!;
    const { data: defaultCat } = await (supabase.from("categories") as any).select("id").limit(1).single();
    const defaultId = defaultCat?.id || "";
    this.catCache.set("__default__", defaultId);
    if (slug) this.catCache.set(slug, defaultId);
    return defaultId;
  }

  /**
   * Runs the full recruitment discovery and verification pipeline.
   */
  async runDiscovery(queries: string[] = []): Promise<DiscoveryRunReport> {
    const startTime = Date.now();
    const startedAt = new Date().toISOString();
    const config = getDiscoveryConfig();
    const supabase = createAdminClient();

    const activeProviders = this.providers.filter((p) => p.isEnabled);
    const providerFailures: Array<{ provider: string; error: string }> = [];
    const allDiscovered: DiscoveredCandidateNotice[] = [];

    // Default queries if none provided
    const targetQueries = queries.length > 0 ? queries : [
      "RFCL recruitment 2026",
      "Engineers India Limited EIL recruitment 2026",
      "NIC recruitment 2026",
      "AAI recruitment 2026",
      "India Post recruitment 2026",
      "Income Tax Department recruitment 2026",
      "Income Tax Pune sports quota recruitment 2026",
      "central govt recruitment 2026 notification",
      "PSU recruitment 2026 apply online",
    ];

    // 1. Execute Discovery Across Active Providers with Bounded Concurrency
    for (const provider of activeProviders) {
      try {
        const results = await provider.discover(targetQueries);
        allDiscovered.push(...results);
      } catch (err: any) {
        providerFailures.push({
          provider: provider.name,
          error: err?.message || String(err),
        });
      }
    }

    let candidatesFound = allDiscovered.length;
    let officialSourcesVerified = 0;
    let candidatesRejected = 0;
    let duplicatesDetected = 0;
    let newJobsCreated = 0;
    let existingJobsUpdated = 0;

    const reportResults: DiscoveryRunReport["results"] = [];

    // 2. Process, Verify, Deduplicate, and Persist Candidates
    for (const candidate of allDiscovered) {
      // Step A: Domain Provenance Verification Gate
      const verification = OfficialDomainVerifier.verifyCandidate(candidate);

      if (!verification.isOfficial) {
        candidatesRejected++;
        reportResults.push({
          title: candidate.title,
          organization: candidate.organizationName || "Unknown",
          provider: candidate.sourceProvider,
          status: "rejected",
          confidenceScore: verification.confidenceScore,
          officialDomain: verification.domain,
          reason: verification.reason,
        });
        continue;
      }

      officialSourcesVerified++;

      // Step B: Resolve Organization & Category
      const orgId = await this.getOrganizationId(supabase, candidate.organizationSlug);
      const catId = await this.getCategoryId(supabase, "psu-jobs");

      // Step C: Multi-Signal Duplicate Detection
      const deduplication = await JobDeduplicator.checkDuplicate({
        officialNotificationUrl: verification.normalizedOfficialUrl || candidate.officialNotificationUrl,
        officialApplyUrl: candidate.officialApplyUrl,
        notificationNumber: candidate.notificationNumber,
        organizationId: orgId,
        title: candidate.title,
      });

      // Step D: Normalization & Structured Extraction
      const verifiedNotice = NoticeExtractor.buildVerifiedNotice(
        candidate,
        verification,
        deduplication
      );

      const jobData: any = {
        title: verifiedNotice.normalizedJob.title,
        slug: verifiedNotice.normalizedJob.slug,
        notification_number: verifiedNotice.normalizedJob.notificationNumber || null,
        organization_id: orgId,
        category_id: catId,
        state_code: verifiedNotice.normalizedJob.stateCode || null,
        employment_type: verifiedNotice.normalizedJob.employmentType,
        total_vacancies: verifiedNotice.normalizedJob.totalVacancies,
        salary_min: verifiedNotice.normalizedJob.salaryMin || null,
        salary_max: verifiedNotice.normalizedJob.salaryMax || null,
        pay_scale_details: verifiedNotice.normalizedJob.payScaleDetails || null,
        official_notification_url: verifiedNotice.normalizedJob.officialNotificationUrl,
        official_apply_url: verifiedNotice.normalizedJob.officialApplyUrl || null,
        status: verifiedNotice.status === "published" ? "published" : "draft",
        published_at: new Date().toISOString(),
        summary: verifiedNotice.normalizedJob.summary,
      };

      let targetJobId: string | undefined;

      if (deduplication.isDuplicate && deduplication.existingJobId) {
        duplicatesDetected++;
        existingJobsUpdated++;
        targetJobId = deduplication.existingJobId;
        // Merge & update missing fields into existing job
        await (supabase.from("gov_jobs") as any).update(jobData).eq("id", targetJobId);
      } else {
        // Create new recruitment notice
        const { data: inserted, error: insertError } = await (supabase.from("gov_jobs") as any)
          .insert(jobData)
          .select("id")
          .single();

        if (insertError) {
          console.warn("[DISCOVERY PERSIST NOTICE] Insert error:", insertError.message);
          continue;
        }

        targetJobId = inserted.id;
        newJobsCreated++;
      }

      // Step E: Sync Sub-entities (Vacancies)
      if (targetJobId && verifiedNotice.normalizedJob.vacancies && verifiedNotice.normalizedJob.vacancies.length > 0) {
        await (supabase.from("job_vacancies") as any).delete().eq("job_id", targetJobId);
        const vacanciesToInsert = verifiedNotice.normalizedJob.vacancies.map((v) => ({
          job_id: targetJobId as string,
          post_name: v.postName,
          total_posts: v.totalPosts,
          pay_level: v.payLevel || null,
        }));
        await (supabase.from("job_vacancies") as any).insert(vacanciesToInsert);
      }

      reportResults.push({
        title: verifiedNotice.normalizedJob.title,
        organization: verifiedNotice.normalizedJob.organizationName,
        provider: candidate.sourceProvider,
        status: verifiedNotice.status,
        confidenceScore: verification.confidenceScore,
        officialDomain: verification.domain,
        jobId: targetJobId,
        reason: deduplication.isDuplicate ? `Updated existing duplicate (matched ${deduplication.matchType})` : `New verified notice published`,
      });
    }

    const completedAt = new Date().toISOString();
    const durationMs = Date.now() - startTime;

    return {
      runId: `disc-${Date.now()}`,
      startedAt,
      completedAt,
      durationMs,
      providersExecuted: activeProviders.map((p) => p.name),
      queriesExecuted: targetQueries.length,
      candidatesFound,
      officialSourcesVerified,
      candidatesRejected,
      duplicatesDetected,
      newJobsCreated,
      existingJobsUpdated,
      providerFailures,
      results: reportResults,
    };
  }
}
