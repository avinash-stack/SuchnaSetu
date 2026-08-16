import { createAdminClient } from "@/lib/supabase/admin";
import { ImportSource, ImportJob, ImportLog, ImportRawPayload } from "./types";

/**
 * Fetch all registered import sources with associated authority metadata.
 */
export async function getImportSources(): Promise<ImportSource[]> {
  const supabase = createAdminClient();

  const { data, error } = await (supabase.from("import_sources") as any)
    .select("*, organizations(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching import sources:", error);
    return [];
  }

  return (data || []) as ImportSource[];
}

/**
 * Fetch import execution jobs with pagination and status filters.
 */
export async function getImportJobs(params: {
  sourceId?: string;
  status?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  jobs: ImportJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const supabase = createAdminClient();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 15));
  const offset = (page - 1) * limit;

  let query = (supabase.from("import_jobs") as any)
    .select("*, import_sources(*)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.sourceId) {
    query = query.eq("source_id", params.sourceId);
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching import jobs:", error);
    return { jobs: [], total: 0, page, limit, totalPages: 0 };
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    jobs: (data || []) as ImportJob[],
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch granular step-by-step logs for a specific import job.
 */
export async function getImportLogsByJobId(jobId: string): Promise<ImportLog[]> {
  const supabase = createAdminClient();

  const { data, error } = await (supabase.from("import_logs") as any)
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching import logs:", error);
    return [];
  }

  return (data || []) as ImportLog[];
}
