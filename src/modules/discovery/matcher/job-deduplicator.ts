import { createAdminClient } from "@/lib/supabase/admin";
import { DuplicateMatchResult, DiscoveredCandidateNotice } from "../types";
import { slugify } from "@/lib/utils";

export class JobDeduplicator {
  /**
   * Matches candidate against existing gov_jobs records using multiple cryptographic and semantic signals.
   */
  static async checkDuplicate(candidate: {
    officialNotificationUrl?: string | null;
    officialApplyUrl?: string | null;
    notificationNumber?: string | null;
    organizationId?: string | null;
    title: string;
  }): Promise<DuplicateMatchResult> {
    const supabase = createAdminClient();

    // Signal 1: Exact Official Notification URL Match
    if (candidate.officialNotificationUrl) {
      const { data: urlMatch } = await (supabase.from("gov_jobs") as any)
        .select("id, slug, title")
        .eq("official_notification_url", candidate.officialNotificationUrl.trim())
        .maybeSingle();

      if (urlMatch) {
        return {
          isDuplicate: true,
          matchType: "exact_url",
          existingJobId: urlMatch.id,
          existingSlug: urlMatch.slug,
          confidenceScore: 100,
        };
      }
    }

    // Signal 2: Exact Official Apply URL Match
    if (candidate.officialApplyUrl) {
      const { data: applyMatch } = await (supabase.from("gov_jobs") as any)
        .select("id, slug, title")
        .eq("official_apply_url", candidate.officialApplyUrl.trim())
        .maybeSingle();

      if (applyMatch) {
        return {
          isDuplicate: true,
          matchType: "exact_url",
          existingJobId: applyMatch.id,
          existingSlug: applyMatch.slug,
          confidenceScore: 98,
        };
      }
    }

    // Signal 3: Exact Notification Number + Organization Match
    if (candidate.notificationNumber && candidate.organizationId) {
      const { data: notifMatch } = await (supabase.from("gov_jobs") as any)
        .select("id, slug, title")
        .eq("organization_id", candidate.organizationId)
        .eq("notification_number", candidate.notificationNumber.trim())
        .maybeSingle();

      if (notifMatch) {
        return {
          isDuplicate: true,
          matchType: "exact_notification_number",
          existingJobId: notifMatch.id,
          existingSlug: notifMatch.slug,
          confidenceScore: 95,
        };
      }
    }

    // Signal 4: Exact / Normalized Slug Match
    const generatedSlug = slugify(candidate.title);
    const { data: slugMatch } = await (supabase.from("gov_jobs") as any)
      .select("id, slug, title")
      .eq("slug", generatedSlug)
      .maybeSingle();

    if (slugMatch) {
      return {
        isDuplicate: true,
        matchType: "fuzzy_title_org_year",
        existingJobId: slugMatch.id,
        existingSlug: slugMatch.slug,
        confidenceScore: 90,
      };
    }

    // No duplicate found
    return {
      isDuplicate: false,
      matchType: "none",
      confidenceScore: 0,
    };
  }
}
