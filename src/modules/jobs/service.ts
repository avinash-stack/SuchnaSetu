import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { GovJob, GovJobDetailed, JobFilterParams, JobVacancy, JobImportantDate, JobEligibility, JobOfficialDocument } from "./types";
import { GovJobInput } from "./schemas";
import { Organization, Category, StateUT, Department, Qualification } from "@/modules/core/types";
import { slugify } from "@/lib/utils";

import { searchJobs } from "@/modules/search/service";
import { parseSearchQuery } from "@/modules/search/query-parser";

/**
 * Fetch published government job notices with multi-faceted filtering for public views.
 * Uses the common search engine for intelligent tokenization, taxonomy matching, and ranking.
 */
export async function getPublicJobs(params: JobFilterParams = {}): Promise<{
  jobs: GovJobDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  return searchJobs(params);
}

/**
 * Internal cached fetcher for a single job by slug.
 */
const fetchJobBySlugUncached = async (slug: string): Promise<GovJobDetailed | null> => {
  const supabase = createPublicClient();

  const { data: job, error } = await (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*),
      vacancies:job_vacancies(*),
      important_dates:job_important_dates(*),
      eligibility:job_eligibility(*),
      official_documents:job_official_documents(*),
      translations:gov_job_translations(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (error || !job) {
    return null;
  }

  const rawJob = job as any;

  // Fetch contextual related entities in parallel for rich internal linking
  const jobFilters: string[] = [];
  if (rawJob.organization_id) jobFilters.push(`organization_id.eq.${rawJob.organization_id}`);
  if (rawJob.category_id) jobFilters.push(`category_id.eq.${rawJob.category_id}`);

  const examFilters: string[] = [`related_job_id.eq.${rawJob.id}`];
  if (rawJob.organization_id) examFilters.push(`organization_id.eq.${rawJob.organization_id}`);

  const [relatedJobsRes, relatedExamsRes, relatedBulletinsRes, relatedNewsRes] = await Promise.all([
    jobFilters.length > 0
      ? supabase
          .from("gov_jobs")
          .select("id, title, slug, total_vacancies, application_end_date, state_code, pay_scale_details, organization:organizations(name, acronym)")
          .eq("status", "published")
          .is("deleted_at", null)
          .neq("id", rawJob.id)
          .or(jobFilters.join(","))
          .order("published_at", { ascending: false })
          .limit(4)
      : Promise.resolve({ data: [] }),
    examFilters.length > 0
      ? supabase
          .from("gov_exams")
          .select("id, title, slug, mode, exam_code, published_at, organization:organizations(name, acronym)")
          .eq("status", "published")
          .is("deleted_at", null)
          .or(examFilters.join(","))
          .order("published_at", { ascending: false })
          .limit(4)
      : Promise.resolve({ data: [] }),
    examFilters.length > 0
      ? supabase
          .from("public_bulletins")
          .select("id, title, slug, category, summary, source_url, source_name, published_at")
          .eq("status", "published")
          .or(examFilters.join(","))
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

  const detailedJob: GovJobDetailed = {
    ...rawJob,
    vacancies: (rawJob.vacancies || []) as JobVacancy[],
    important_dates: ((rawJob.important_dates || []) as JobImportantDate[]).sort(
      (a: JobImportantDate, b: JobImportantDate) => a.display_order - b.display_order
    ),
    eligibility: Array.isArray(rawJob.eligibility) ? rawJob.eligibility[0] : (rawJob.eligibility as JobEligibility),
    official_documents: (rawJob.official_documents || []) as JobOfficialDocument[],
    translations: (rawJob.translations || []) as any[],
    related_jobs: (relatedJobsRes.data || []) as any[],
    related_exams: (relatedExamsRes.data || []) as any[],
    related_bulletins: (relatedBulletinsRes.data || []) as any[],
    related_news: (relatedNewsRes.data || []) as any[],
  };

  return detailedJob;
};

/**
 * Fetch a single published job notice with all associated sub-tables by unique slug.
 * Wrapped with React.cache() and Next.js unstable_cache for instant rendering.
 */
export const getPublicJobBySlug = cache(async (slug: string): Promise<GovJobDetailed | null> => {
  return unstable_cache(
    async () => fetchJobBySlugUncached(slug),
    [`job-by-slug-${slug}`],
    { revalidate: 300, tags: [`job-${slug}`, "jobs"] }
  )();
});

/**
 * Fetch active taxonomies (categories, organizations, departments, qualifications, states) for filter sidebars and forms.
 * Cached with unstable_cache for high-speed instant navigation.
 */
export const getJobTaxonomies = unstable_cache(
  async (): Promise<{
    categories: Category[];
    organizations: Organization[];
    departments: Department[];
    qualifications: Qualification[];
    states: StateUT[];
  }> => {
    const supabase = createPublicClient();

    const [categoriesRes, organizationsRes, departmentsRes, qualificationsRes, statesRes] = await Promise.all([
      supabase.from("categories").select("*").eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("organizations").select("*").eq("is_active", true).order("name", { ascending: true }),
      (supabase.from("departments") as any).select("*").eq("is_active", true).order("name", { ascending: true }),
      (supabase.from("qualifications") as any).select("*").eq("is_active", true).order("display_order", { ascending: true }),
      supabase.from("states_uts").select("*").eq("is_active", true).order("name", { ascending: true }),
    ]);

    return {
      categories: (categoriesRes.data || []) as Category[],
      organizations: (organizationsRes.data || []) as Organization[],
      departments: (departmentsRes.data || []) as Department[],
      qualifications: (qualificationsRes.data || []) as Qualification[],
      states: (statesRes.data || []) as StateUT[],
    };
  },
  ["job-taxonomies-catalog"],
  { revalidate: 300, tags: ["taxonomies"] }
);

/**
 * Fetch all jobs for Admin management console (including draft, archived, and soft-deleted/trash).
 */
export async function getAdminJobs(params: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  jobs: GovJobDetailed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 15));
  const offset = (page - 1) * limit;

  let query = (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

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
      orClauses.push(`notification_number.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`summary.ilike.%${parsed.cleanQuery}%`);
      orClauses.push(`slug.ilike.%${parsed.cleanQuery}%`);
    }
    for (const token of parsed.contentTokens) {
      orClauses.push(`title.ilike.%${token}%`);
      orClauses.push(`notification_number.ilike.%${token}%`);
      orClauses.push(`summary.ilike.%${token}%`);
      orClauses.push(`slug.ilike.%${token}%`);
    }
    const unique = Array.from(new Set(orClauses)).filter(Boolean);
    if (unique.length > 0) {
      query = query.or(unique.join(","));
    }
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching admin jobs:", error);
    return { jobs: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    jobs: (data || []) as GovJobDetailed[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch a single job by ID for Admin editing.
 */
export async function getAdminJobById(id: string): Promise<GovJobDetailed | null> {
  const supabase = await createClient();

  const { data: job, error } = await (supabase.from("gov_jobs") as any)
    .select(
      `
      *,
      organization:organizations(*),
      department:departments(*),
      category:categories(*),
      qualification:qualifications(*),
      state:states_uts(*),
      vacancies:job_vacancies(*),
      important_dates:job_important_dates(*),
      eligibility:job_eligibility(*),
      official_documents:job_official_documents(*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !job) {
    return null;
  }

  const rawJob = job as any;
  return {
    ...rawJob,
    vacancies: (rawJob.vacancies || []) as JobVacancy[],
    important_dates: ((rawJob.important_dates || []) as JobImportantDate[]).sort(
      (a: JobImportantDate, b: JobImportantDate) => a.display_order - b.display_order
    ),
    eligibility: Array.isArray(rawJob.eligibility) ? rawJob.eligibility[0] : (rawJob.eligibility as JobEligibility),
    official_documents: (rawJob.official_documents || []) as JobOfficialDocument[],
  } as GovJobDetailed;
}
