import { createClient } from "@/lib/supabase/server";

export interface ResultItem {
  id: string;
  title: string;
  slug: string;
  type: "job" | "exam";
  code?: string | null;
  organization?: {
    name: string;
    acronym?: string | null;
    state_code?: string | null;
    jurisdiction?: string | null;
  } | null;
  state_code?: string | null;
  result_url: string;
  notification_url?: string | null;
  published_at?: string | null;
  status: string;
}

export interface GetResultsParams {
  search?: string;
  stateCode?: string;
  limit?: number;
  page?: number;
}

export async function getPublicResults(params: GetResultsParams = {}): Promise<{
  results: ResultItem[];
  total: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const limit = params.limit || 20;
  const page = params.page || 1;
  const offset = (page - 1) * limit;

  // Query verified jobs & exams that have official result notices or notifications
  let jobQuery = supabase
    .from("gov_jobs")
    .select("id, title, slug, notification_number, official_notification_url, official_apply_url, published_at, status, state_code, organizations(name, acronym, state_code, jurisdiction)", { count: "exact" })
    .eq("status", "published");

  if (params.stateCode) {
    jobQuery = jobQuery.eq("state_code", params.stateCode);
  }

  if (params.search) {
    jobQuery = jobQuery.ilike("title", `%${params.search}%`);
  }

  const { data: jobs, count: jobCount } = await jobQuery
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const total = jobCount || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const results: ResultItem[] = (jobs || []).map((job: any) => ({
    id: job.id,
    title: job.title,
    slug: job.slug,
    type: "job",
    code: job.notification_number,
    organization: job.organizations,
    state_code: job.state_code,
    result_url: job.official_notification_url,
    notification_url: job.official_notification_url,
    published_at: job.published_at,
    status: "Merit List / Notice Released",
  }));

  return {
    results,
    total,
    totalPages,
  };
}
