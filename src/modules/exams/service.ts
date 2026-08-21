import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { GovExam, GovExamDetailed, ExamFilterParams } from "./types";
import { Category, Organization, StateUT, Department, Qualification } from "@/modules/core/types";

import { searchExams } from "@/modules/search/service";
import { parseSearchQuery } from "@/modules/search/query-parser";

/**
 * Fetches published examinations with multi-faceted filtering, search, and pagination.
 * Uses the common search engine for intelligent tokenization, taxonomy matching, and ranking.
 */
export async function getPublicExams(params: ExamFilterParams = {}) {
  return searchExams(params);
}

/**
 * Internal uncached fetcher for single exam by slug.
 */
const fetchExamBySlugUncached = async (slug: string): Promise<GovExamDetailed | null> => {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      state:states_uts(*),
      related_job:gov_jobs(*),
      stages:exam_stages(*),
      schedules:exam_schedules(*),
      eligibility:exam_eligibility(*, min_qualification:qualifications(*)),
      important_dates:exam_important_dates(*),
      centers:exam_centers(*),
      official_documents:exam_official_documents(*),
      translations:gov_exam_translations(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    return null;
  }

  const detailed = data as unknown as GovExamDetailed;

  // Sort stages by stage_order
  if (detailed.stages) {
    detailed.stages.sort((a, b) => a.stage_order - b.stage_order);
  }

  // Sort important dates by event_date
  if (detailed.important_dates) {
    detailed.important_dates.sort((a, b) => {
      if (a.display_order !== b.display_order) return a.display_order - b.display_order;
      return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
    });
  }

  // Sort schedules by exam_date and start_time
  if (detailed.schedules) {
    detailed.schedules.sort((a, b) => {
      const dateDiff = new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return (a.start_time || "").localeCompare(b.start_time || "");
    });
  }

  return detailed;
};

/**
 * Fetches a single public examination by slug with all nested relations.
 * Wrapped with React.cache() and Next.js unstable_cache for instant rendering.
 */
export const getPublicExamBySlug = cache(async (slug: string): Promise<GovExamDetailed | null> => {
  return unstable_cache(
    async () => fetchExamBySlugUncached(slug),
    [`exam-by-slug-${slug}`],
    { revalidate: 300, tags: [`exam-${slug}`, "exams"] }
  )();
});

/**
 * Fetches related exams from the same organization or category.
 */
export async function getRelatedExams(organizationId: string, currentExamId: string, limit = 4) {
  const supabase = createPublicClient();

  const { data } = await supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(*),
      stages:exam_stages(*)
    `
    )
    .eq("organization_id", organizationId)
    .eq("status", "published")
    .is("deleted_at", null)
    .neq("id", currentExamId)
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data as unknown as GovExamDetailed[]) || [];
}

/**
 * Fetches master taxonomies required for filters and examination forms.
 * Cached for high-speed navigation.
 */
export const getExamTaxonomies = unstable_cache(
  async () => {
    const supabase = createPublicClient();

    const [categoriesRes, orgsRes, deptsRes, qualsRes, statesRes, jobsRes] = await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
      supabase.from("organizations").select("*").eq("is_active", true).order("name"),
      supabase.from("departments").select("*").eq("is_active", true).order("name"),
      supabase.from("qualifications").select("*").eq("is_active", true).order("display_order"),
      supabase.from("states_uts").select("*").eq("is_active", true).order("name"),
      supabase.from("gov_jobs").select("id, title, slug, organization_id").is("deleted_at", null).order("title"),
    ]);

    return {
      categories: (categoriesRes.data as Category[]) || [],
      organizations: (orgsRes.data as Organization[]) || [],
      departments: (deptsRes.data as Department[]) || [],
      qualifications: (qualsRes.data as Qualification[]) || [],
      states: (statesRes.data as StateUT[]) || [],
      jobs: jobsRes.data || [],
    };
  },
  ["exam-taxonomies-catalog"],
  { revalidate: 300, tags: ["taxonomies"] }
);

/**
 * Fetches exams for administrative console with status filters, search, and soft delete tabs.
 */
export async function getAdminExams(
  params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const supabase = await createClient();
  const page = params.page || 1;
  const limit = params.limit || 15;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(name, acronym),
      department:departments(name, acronym),
      stages:exam_stages(id, stage_name, status)
    `,
      { count: "exact" }
    );

  if (params.status === "trash") {
    query = query.not("deleted_at", "is", null);
  } else {
    query = query.is("deleted_at", null);
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }
  }

  if (params.search && params.search.trim()) {
    const parsed = parseSearchQuery(params.search);
    const orClauses: string[] = [];
    if (parsed.cleanQuery) {
      orClauses.push(`title.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`short_title.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`exam_code.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`slug.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`description.ilike.%${parsed.cleanQuery}%`);
    }
    for (const token of parsed.contentTokens) {
      orClauses.push(`title.ilike.%${token}%`);
      orClauses.push(`short_title.ilike.%${token}%`);
      orClauses.push(`exam_code.ilike.%${token}%`);
      orClauses.push(`slug.ilike.%${token}%`);
      orClauses.push(`description.ilike.%${token}%`);
    }
    const unique = Array.from(new Set(orClauses)).filter(Boolean);
    if (unique.length > 0) {
      query = query.or(unique.join(","));
    }
  }

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching admin exams:", error);
    return { exams: [], total: 0, totalPages: 0 };
  }

  return {
    exams: data || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Fetches a single exam for editing in the administrative console.
 */
export async function getAdminExamById(id: string): Promise<GovExamDetailed | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gov_exams")
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      state:states_uts(*),
      related_job:gov_jobs(*),
      stages:exam_stages(*),
      schedules:exam_schedules(*),
      eligibility:exam_eligibility(*, min_qualification:qualifications(*)),
      important_dates:exam_important_dates(*),
      centers:exam_centers(*),
      official_documents:exam_official_documents(*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const detailed = data as unknown as GovExamDetailed;

  if (detailed.stages) {
    detailed.stages.sort((a, b) => a.stage_order - b.stage_order);
  }
  if (detailed.important_dates) {
    detailed.important_dates.sort((a, b) => a.display_order - b.display_order);
  }

  return detailed;
}
