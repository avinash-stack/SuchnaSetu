export interface SystemHealthMetrics {
  database: {
    status: "healthy" | "degraded" | "error";
    latencyMs: number;
    totalOrganizations: number;
    totalJobs: number;
    totalExams: number;
    totalBulletins: number;
  };
  ingestion: {
    totalPipelines: number;
    activePipelines: number;
    runningJobsCount: number;
    failedJobsCount: number;
    totalExtractedAllTime: number;
    totalInsertedAllTime: number;
    nextScheduledSync?: {
      formattedIST: string;
      timeRemaining: string;
      dateUTC: string;
    };
  };
  environment: {
    nodeEnv: string;
    hasSupabaseUrl: boolean;
    hasServiceKey: boolean;
    hasAdsenseId: boolean;
    hasGoogleSearchConsole: boolean;
  };
}

export interface SourceHealthRecord {
  id: string;
  code: string;
  name: string;
  targetModule: string;
  isEnabled: boolean;
  lastSuccessfulSync: string | null;
  lastFailedSync: string | null;
  nextScheduledSync: string;
  currentStatus: "healthy" | "warning" | "error" | "syncing" | "disabled";
  consecutiveFailures: number;
  lastErrorMessage?: string | null;
}

export interface DataQualityAuditResult {
  score: number; // 0-100
  totalAudited: number;
  passedRecords: number;
  issuesCount: {
    critical: number;
    warning: number;
    info: number;
  };
  breakdown: {
    brokenUrls: Array<{ id: string; title: string; url: string; reason: string }>;
    invalidDates: Array<{ id: string; title: string; issue: string }>;
    missingQualifications: Array<{ id: string; title: string }>;
    zeroVacancies: Array<{ id: string; title: string }>;
    expiredPublishedNotices: Array<{ id: string; title: string; endDate: string }>;
    missingSeoMeta: Array<{ id: string; title: string }>;
  };
}

export interface SeoDiagnosticResult {
  indexedPagesEstimate: number;
  sitemapStatus: "healthy" | "degraded" | "error";
  sitemapUrl: string;
  robotsTxtStatus: "valid" | "warning";
  structuredDataCoveragePercent: number;
  canonicalUrlCompliancePercent: number;
  openGraphCompliancePercent: number;
}

export interface OperationalAlert {
  id: string;
  level: "critical" | "warning" | "info";
  title: string;
  message: string;
  source?: string;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface OperationalReportSummary {
  daily: {
    date: string;
    jobsIngested: number;
    examsIngested: number;
    syncErrors: number;
    activeSources: number;
  };
  weekly: {
    period: string;
    totalJobsProcessed: number;
    duplicateSkippedRate: number;
    topActiveSources: Array<{ name: string; count: number }>;
  };
  monthly: {
    month: string;
    newNoticesPublished: number;
    totalPipelineRuns: number;
    averagePipelineDurationSec: number;
  };
}

export interface AnalyticsConfig {
  gaMeasurementId?: string;
  gscVerificationToken?: string;
  adsensePublisherId?: string;
  clarityProjectId?: string;
}
