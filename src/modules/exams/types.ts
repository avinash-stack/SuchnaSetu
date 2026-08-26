import { Database } from "@/types/database.types";
import { Organization, Category, StateUT, Department, Qualification } from "@/modules/core/types";
import { GovJob } from "@/modules/jobs/types";

export type GovExam = Database["public"]["Tables"]["gov_exams"]["Row"];
export type GovExamInsert = Database["public"]["Tables"]["gov_exams"]["Insert"];
export type GovExamUpdate = Database["public"]["Tables"]["gov_exams"]["Update"];

export type ExamStage = Database["public"]["Tables"]["exam_stages"]["Row"];
export type ExamSchedule = Database["public"]["Tables"]["exam_schedules"]["Row"];
export type ExamEligibility = Database["public"]["Tables"]["exam_eligibility"]["Row"];
export type ExamImportantDate = Database["public"]["Tables"]["exam_important_dates"]["Row"];
export type ExamCenter = Database["public"]["Tables"]["exam_centers"]["Row"];
export type ExamOfficialDocument = Database["public"]["Tables"]["exam_official_documents"]["Row"];

export interface GovExamDetailed extends GovExam {
  organization?: Organization | null;
  department?: Department | null;
  category?: Category | null;
  state?: StateUT | null;
  related_job?: GovJob | null;
  stages?: ExamStage[];
  schedules?: ExamSchedule[];
  eligibility?: (ExamEligibility & { min_qualification?: Qualification | null }) | null;
  important_dates?: ExamImportantDate[];
  centers?: ExamCenter[];
  official_documents?: ExamOfficialDocument[];
  eligibility_summary?: string | null;
  translations?: any[];
  related_exams?: any[];
  related_jobs?: any[];
  related_bulletins?: any[];
  related_news?: any[];
}

export interface ExamFilterParams {
  categorySlug?: string;
  organizationSlug?: string;
  stateCode?: string;
  mode?: string;
  frequency?: string;
  qualificationSlug?: string;
  isFeatured?: boolean;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
