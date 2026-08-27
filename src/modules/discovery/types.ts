/**
 * Types & Interfaces for SuchnaSetu Recruitment Notification Discovery Layer.
 */

export type CandidateNoticeStatus = "candidate" | "verified" | "published" | "rejected" | "expired";

export type EmploymentType = "permanent" | "contract" | "deputation" | "apprenticeship";

export interface DiscoveredCandidateNotice {
  id?: string;
  sourceProvider: string; // e.g. "search_discovery_provider", "feed_provider"
  title: string;
  organizationName?: string;
  organizationSlug?: string;
  notificationNumber?: string | null;
  postNames?: string[];
  totalVacancies?: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  payScaleDetails?: string | null;
  applicationStartDate?: Date | string | null;
  applicationEndDate?: Date | string | null;
  officialNotificationUrl?: string | null;
  officialApplyUrl?: string | null;
  sourceUrl: string;
  rawText?: string | null;
  discoveredAt: Date;
  metadata?: Record<string, any>;
}

export interface VerificationResult {
  isOfficial: boolean;
  confidenceScore: number; // 0 to 100
  domain: string;
  domainType: "central_gov" | "state_gov" | "psu" | "autonomous" | "unverified_third_party";
  reason: string;
  normalizedOfficialUrl?: string | null;
  normalizedApplyUrl?: string | null;
}

export interface DuplicateMatchResult {
  isDuplicate: boolean;
  matchType?: "exact_url" | "exact_notification_number" | "fuzzy_title_org_year" | "none";
  existingJobId?: string;
  existingSlug?: string;
  confidenceScore: number;
}

export interface VerifiedRecruitmentNotice {
  candidate: DiscoveredCandidateNotice;
  verification: VerificationResult;
  deduplication: DuplicateMatchResult;
  status: CandidateNoticeStatus;
  normalizedJob: {
    title: string;
    slug: string;
    notificationNumber?: string | null;
    organizationSlug: string;
    organizationName: string;
    categorySlug: string;
    stateCode?: string | null;
    employmentType: EmploymentType;
    totalVacancies: number;
    salaryMin?: number | null;
    salaryMax?: number | null;
    payScaleDetails?: string | null;
    officialNotificationUrl: string;
    officialApplyUrl?: string | null;
    summary?: string | null;
    applicationStartDate?: Date | string | null;
    applicationEndDate?: Date | string | null;
    vacancies?: Array<{
      postName: string;
      postCode?: string;
      totalPosts: number;
      payLevel?: string;
    }>;
    importantDates?: Array<{
      eventName: string;
      eventDate: Date;
      isTentative?: boolean;
    }>;
    eligibilities?: Array<{
      qualificationText: string;
      ageMin?: number;
      ageMax?: number;
    }>;
  };
}

export interface DiscoveryRunReport {
  runId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  providersExecuted: string[];
  queriesExecuted: number;
  candidatesFound: number;
  officialSourcesVerified: number;
  candidatesRejected: number;
  duplicatesDetected: number;
  newJobsCreated: number;
  existingJobsUpdated: number;
  providerFailures: Array<{ provider: string; error: string }>;
  results: Array<{
    title: string;
    organization: string;
    provider: string;
    status: CandidateNoticeStatus;
    confidenceScore: number;
    officialDomain: string;
    jobId?: string;
    reason?: string;
  }>;
}

export interface RecruitmentDiscoveryProvider {
  readonly name: string;
  readonly isEnabled: boolean;
  discover(queries: string[], options?: { maxResultsPerQuery?: number }): Promise<DiscoveredCandidateNotice[]>;
}
