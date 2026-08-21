import { Database, Json } from "@/types/database.types";

export type ImportSource = Database["public"]["Tables"]["import_sources"]["Row"];
export type ImportSourceInsert = Database["public"]["Tables"]["import_sources"]["Insert"];
export type ImportSourceUpdate = Database["public"]["Tables"]["import_sources"]["Update"];

export type ImportJob = Database["public"]["Tables"]["import_jobs"]["Row"];
export type ImportJobInsert = Database["public"]["Tables"]["import_jobs"]["Insert"];
export type ImportJobUpdate = Database["public"]["Tables"]["import_jobs"]["Update"];

export type ImportRawPayload = Database["public"]["Tables"]["import_raw_payloads"]["Row"];
export type ImportLog = Database["public"]["Tables"]["import_logs"]["Row"];
export type ImportEntityHash = Database["public"]["Tables"]["import_entity_hashes"]["Row"];

export type IngestionLogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type IngestionJobStatus = "pending" | "running" | "completed" | "failed" | "cancelled" | "retrying";
export type TriggerType = "manual" | "scheduled" | "webhook" | "retry";

export type IngestionErrorCategory =
  | "transient_network"
  | "rate_limited"
  | "schema_drift"
  | "validation_error"
  | "authentication_error"
  | "timeout"
  | "fatal";

export type ChangeActionType = "INSERT" | "UPDATE" | "SKIP" | "REJECT";

export interface ChangeDetectionResult {
  action: ChangeActionType;
  naturalKey: string;
  contentHash: string;
  rawHash: string;
  existingEntityId?: string | null;
  reason?: string;
}

export interface IngestionStats {
  totalExtracted: number;
  totalNormalized: number;
  totalInserted: number;
  totalUpdated: number;
  totalSkipped: number;
  totalFailed: number;
}

export interface RawItem<TPayload = any> {
  externalId?: string;
  rawPayload: TPayload;
  contentType?: string;
  extractedAt?: Date;
}

export interface ExtractionResult<TPayload = any> {
  items: RawItem<TPayload>[];
  cursor?: string | null;
  hasMore?: boolean;
  metadata?: Record<string, any>;
}

export interface NormalizationResult<TNormalizedEntity = any> {
  success: boolean;
  naturalKey: string;
  data?: TNormalizedEntity;
  errors?: string[];
}

/**
 * Canonical target domain models produced by normalizers
 */
export interface NormalizedJobNotice {
  title: string;
  slug?: string;
  notificationNumber?: string;
  organizationSlug: string;
  departmentSlug?: string;
  categorySlug: string;
  qualificationSlug?: string;
  stateCode?: string;
  employmentType: "permanent" | "contract" | "deputation" | "apprenticeship";
  totalVacancies: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  payScaleDetails?: string;
  officialNotificationUrl?: string | null;
  officialApplyUrl?: string | null;
  summary?: string;
  applicationStartDate?: Date | null;
  applicationEndDate?: Date | null;
  vacancies?: Array<{
    postName: string;
    postCode?: string;
    totalPosts: number;
    urPosts?: number;
    ewsPosts?: number;
    obcPosts?: number;
    scPosts?: number;
    stPosts?: number;
    pwdPosts?: number;
    payLevel?: string;
  }>;
  importantDates?: Array<{
    eventName: string;
    eventDate?: Date | null;
    eventDateText?: string;
    isTentative?: boolean;
    displayOrder?: number;
  }>;
  eligibility?: {
    minAge?: number | null;
    maxAge?: number | null;
    ageCalculationDate?: string | null;
    ageRelaxationDetails?: string;
    educationQualification: string;
    experienceDetails?: string;
    selectionProcess?: string;
    applicationFeeDetails?: any;
  };
  officialDocuments?: Array<{
    documentType: "full_notification" | "short_notice" | "corrigendum" | "syllabus" | "admit_card_notice" | "result_notice";
    title: string;
    fileUrl: string;
    publishedDate?: string;
  }>;
}

export interface NormalizedBulletinNotice {
  title: string;
  slug?: string;
  category: "employment_news" | "student_advisory" | "legal_update" | "press_release";
  organizationSlug?: string;
  summary: string;
  content?: string;
  sourceUrl: string;
  sourceName: string;
  isBreaking?: boolean;
  publishedAt?: Date;
}
