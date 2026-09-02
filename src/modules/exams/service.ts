import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { isUuid } from "@/lib/utils";
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
  const cleanSlug = decodeURIComponent(slug).trim();

  let { data, error } = await supabase
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
    .eq("slug", cleanSlug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  // Fallback: only if cleanSlug is a valid UUID, allow ID lookup
  if (!data && isUuid(cleanSlug)) {
    const byIdRes = await supabase
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
      .eq("id", cleanSlug)
      .eq("status", "published")
      .is("deleted_at", null)
      .maybeSingle();

    if (byIdRes.data) data = byIdRes.data;
  }

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

  // Fetch contextual related entities in parallel for rich internal linking
  const examFilters: string[] = [];
  if (detailed.organization_id && isUuid(detailed.organization_id)) {
    examFilters.push(`organization_id.eq.${detailed.organization_id}`);
  }

  const jobFilters: string[] = [];
  if (detailed.organization_id && isUuid(detailed.organization_id)) {
    jobFilters.push(`organization_id.eq.${detailed.organization_id}`);
  }
  if (detailed.category_id && isUuid(detailed.category_id)) {
    jobFilters.push(`category_id.eq.${detailed.category_id}`);
  }

  const bulletinFilters: string[] = [];
  if (detailed.organization_id && isUuid(detailed.organization_id)) {
    bulletinFilters.push(`organization_id.eq.${detailed.organization_id}`);
  }
  if (detailed.related_job_id && isUuid(detailed.related_job_id)) {
    bulletinFilters.push(`related_job_id.eq.${detailed.related_job_id}`);
  }

  const [relatedExamsRes, relatedJobsRes, relatedBulletinsRes, relatedNewsRes] = await Promise.all([
    examFilters.length > 0 && isUuid(detailed.id)
      ? supabase
          .from("gov_exams")
          .select("id, title, slug, mode, exam_code, published_at, organization:organizations(name, acronym)")
          .eq("status", "published")
          .is("deleted_at", null)
          .neq("id", detailed.id)
          .or(examFilters.join(","))
          .order("published_at", { ascending: false })
          .limit(4)
      : Promise.resolve({ data: [] }),
    jobFilters.length > 0
      ? supabase
          .from("gov_jobs")
          .select("id, title, slug, total_vacancies, application_end_date, state_code, pay_scale_details, organization:organizations(name, acronym)")
          .eq("status", "published")
          .is("deleted_at", null)
          .or(jobFilters.join(","))
          .order("published_at", { ascending: false })
          .limit(4)
      : Promise.resolve({ data: [] }),
    bulletinFilters.length > 0
      ? supabase
          .from("public_bulletins")
          .select("id, title, slug, category, summary, source_url, source_name, published_at")
          .eq("status", "published")
          .or(bulletinFilters.join(","))
          .order("published_at", { ascending: false })
          .limit(4)
      : Promise.resolve({ data: [] }),
    supabase
      .from("news_articles")
      .select("id, title, slug, summary, source_name, source_url, published_at, category_slug")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  detailed.related_exams = (relatedExamsRes.data || []) as any[];
  detailed.related_jobs = (relatedJobsRes.data || []) as any[];
  detailed.related_bulletins = (relatedBulletinsRes.data || []) as any[];
  detailed.related_news = (relatedNewsRes.data || []) as any[];

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
  const cleanId = decodeURIComponent(id).trim();

  let query = supabase
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
    );

  if (isUuid(cleanId)) {
    query = query.eq("id", cleanId);
  } else {
    query = query.eq("slug", cleanId);
  }

  const { data, error } = await query.maybeSingle();

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
