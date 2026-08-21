import { createClient } from "@/lib/supabase/server";

export interface AdmitCardItem {
  id: string;
  title: string;
  slug: string;
  type: "exam" | "job";
  code?: string | null;
  organization?: {
    name: string;
    acronym?: string | null;
    state_code?: string | null;
    jurisdiction?: string | null;
  } | null;
  state_code?: string | null;
  exam_date?: string | null;
  admit_card_url: string;
  notification_url?: string | null;
  published_at?: string | null;
  status: string;
}

export interface GetAdmitCardsParams {
  search?: string;
  stateCode?: string;
  limit?: number;
  page?: number;
}

export async function getPublicAdmitCards(params: GetAdmitCardsParams = {}): Promise<{
  admitCards: AdmitCardItem[];
  total: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const limit = params.limit || 20;
  const page = params.page || 1;
  const offset = (page - 1) * limit;

  // Query verified exams with official candidate links
  let examQuery = supabase
    .from("gov_exams")
    .select("id, title, slug, exam_code, official_website_url, official_notification_url, published_at, status, state_code, organizations(name, acronym, state_code, jurisdiction)", { count: "exact" })
    .eq("status", "published");

  if (params.stateCode) {
    examQuery = examQuery.eq("state_code", params.stateCode);
  }

  if (params.search) {
    examQuery = examQuery.ilike("title", `%${params.search}%`);
  }

  const { data: exams, count: examCount } = await examQuery
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const total = examCount || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  const admitCards: AdmitCardItem[] = (exams || []).map((exam: any) => ({
    id: exam.id,
    title: exam.title,
    slug: exam.slug,
    type: "exam",
    code: exam.exam_code,
    organization: exam.organizations,
    state_code: exam.state_code,
    exam_date: null,
    admit_card_url: exam.official_website_url || exam.official_notification_url,
    notification_url: exam.official_notification_url,
    published_at: exam.published_at,
    status: "Active / Released",
  }));

  return {
    admitCards,
    total,
    totalPages,
  };
}
