/**
 * Data Quality, Validation & Diagnostic Suite for SuchnaSetu
 * Validates integrity of job notices, examination records, salary formats, and official URLs.
 */

export interface QualityIssue {
  severity: "critical" | "warning" | "info";
  field: string;
  message: string;
}

export interface DataQualityReport {
  isValid: boolean;
  score: number; // 0 to 100
  issues: QualityIssue[];
  metrics: {
    hasValidDates: boolean;
    hasValidPayScale: boolean;
    hasOfficialLink: boolean;
    hasEligibility: boolean;
    hasVacanciesBreakdown: boolean;
  };
}

/**
 * Validates a job notice record against civic data quality standards.
 */
export function auditJobRecordQuality(record: {
  title?: string;
  slug?: string;
  notification_number?: string;
  application_start_date?: string | null;
  application_end_date?: string | null;
  total_vacancies?: number;
  pay_scale_details?: string | null;
  official_notification_url?: string | null;
  official_apply_url?: string | null;
  summary?: string | null;
  vacancies?: any[];
  eligibility?: any;
}): DataQualityReport {
  const issues: QualityIssue[] = [];
  let score = 100;

  // 1. Mandatory Text Validation
  if (!record.title || record.title.trim().length < 5) {
    issues.push({
      severity: "critical",
      field: "title",
      message: "Title is missing or too short (minimum 5 characters required)",
    });
    score -= 25;
  }

  if (!record.notification_number || record.notification_number.trim().length === 0) {
    issues.push({
      severity: "warning",
      field: "notification_number",
      message: "Official advertisement / notification number is missing",
    });
    score -= 10;
  }

  // 2. Date Integrity Validation
  let hasValidDates = true;
  if (record.application_start_date && record.application_end_date) {
    const start = new Date(record.application_start_date).getTime();
    const end = new Date(record.application_end_date).getTime();
    if (isNaN(start) || isNaN(end)) {
      issues.push({
        severity: "critical",
        field: "dates",
        message: "Application dates are invalid ISO date strings",
      });
      hasValidDates = false;
      score -= 20;
    } else if (start > end) {
      issues.push({
        severity: "critical",
        field: "application_end_date",
        message: "Application closing date cannot be earlier than opening date",
      });
      hasValidDates = false;
      score -= 20;
    }
  } else if (!record.application_end_date) {
    issues.push({
      severity: "warning",
      field: "application_end_date",
      message: "Application closing date is missing",
    });
    score -= 10;
  }

  // 3. Official Links Integrity
  let hasOfficialLink = false;
  if (record.official_notification_url || record.official_apply_url) {
    const url = record.official_notification_url || record.official_apply_url || "";
    if (isValidHttpUrl(url)) {
      hasOfficialLink = true;
    } else {
      issues.push({
        severity: "critical",
        field: "official_notification_url",
        message: "Official URL is not a valid HTTP/HTTPS link",
      });
      score -= 15;
    }
  } else {
    issues.push({
      severity: "warning",
      field: "official_notification_url",
      message: "Neither official notification PDF nor apply URL provided",
    });
    score -= 15;
  }

  // 4. Pay Scale / Salary Formatting
  let hasValidPayScale = false;
  if (record.pay_scale_details && record.pay_scale_details.trim().length > 3) {
    hasValidPayScale = true;
  } else {
    issues.push({
      severity: "info",
      field: "pay_scale_details",
      message: "Pay scale information is vague or missing",
    });
    score -= 5;
  }

  // 5. Vacancies Breakdown
  let hasVacanciesBreakdown = false;
  if (record.vacancies && record.vacancies.length > 0) {
    hasVacanciesBreakdown = true;
  } else if (record.total_vacancies && record.total_vacancies > 0) {
    hasVacanciesBreakdown = true;
  } else {
    issues.push({
      severity: "warning",
      field: "total_vacancies",
      message: "Total vacancies is zero or unquantified",
    });
    score -= 10;
  }

  // 6. Eligibility Details
  let hasEligibility = false;
  if (
    record.eligibility &&
    (record.eligibility.education_qualification || record.eligibility.educationQualification)
  ) {
    hasEligibility = true;
  } else {
    issues.push({
      severity: "info",
      field: "eligibility",
      message: "Structured educational qualification criteria not specified",
    });
    score -= 5;
  }

  const finalScore = Math.max(0, score);
  return {
    isValid: issues.filter((i) => i.severity === "critical").length === 0,
    score: finalScore,
    issues,
    metrics: {
      hasValidDates,
      hasValidPayScale,
      hasOfficialLink,
      hasEligibility,
      hasVacanciesBreakdown,
    },
  };
}

/**
 * Validates whether a given string is a valid HTTP/HTTPS URL.
 */
export function isValidHttpUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitizes and normalizes user search inputs to prevent wildcard abuse or control character injection.
 */
export function sanitizeSearchQuery(query?: string): string {
  if (!query) return "";
  return query
    .replace(/[^\w\s\-\.\,\(\)]/gi, "") // Remove special characters that could affect regexes
    .trim()
    .slice(0, 100); // Limit maximum query length
}
