import { Database } from "@/types/database.types";
import { Organization, Category, StateUT, Department, Qualification } from "@/modules/core/types";

export type GovJob = Database["public"]["Tables"]["gov_jobs"]["Row"];
export type GovJobInsert = Database["public"]["Tables"]["gov_jobs"]["Insert"];
export type GovJobUpdate = Database["public"]["Tables"]["gov_jobs"]["Update"];

export type JobVacancy = Database["public"]["Tables"]["job_vacancies"]["Row"];
export type JobImportantDate = Database["public"]["Tables"]["job_important_dates"]["Row"];
export type JobEligibility = Database["public"]["Tables"]["job_eligibility"]["Row"];
export type JobOfficialDocument = Database["public"]["Tables"]["job_official_documents"]["Row"];

export interface GovJobDetailed extends GovJob {
  organization?: Organization | null;
  department?: Department | null;
  category?: Category | null;
  qualification?: Qualification | null;
  state?: StateUT | null;
  vacancies?: JobVacancy[];
  important_dates?: JobImportantDate[];
  eligibility?: JobEligibility | null;
  official_documents?: JobOfficialDocument[];
}

export interface JobFilterParams {
  categorySlug?: string;
  organizationSlug?: string;
  departmentSlug?: string;
  qualificationSlug?: string;
  stateCode?: string;
  employmentType?: string;
  isFeatured?: boolean;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
