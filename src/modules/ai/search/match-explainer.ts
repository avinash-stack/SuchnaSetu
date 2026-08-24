import { GovJobDetailed } from "@/modules/jobs/types";
import { GovExamDetailed } from "@/modules/exams/types";
import { PublicBulletinDetailed } from "@/modules/bulletins/types";
import { StructuredSearchIntent, ResultMatchExplanation } from "./types";
import { formatINR } from "@/lib/utils";

/**
 * Builds grounded match explanation strictly from authentic record fields.
 * NEVER fabricates explanations.
 */
export function explainJobMatch(
  job: GovJobDetailed,
  intent?: StructuredSearchIntent,
  rawTokens: string[] = []
): ResultMatchExplanation {
  const reasons: string[] = [];
  const matchedKeywords: string[] = [];

  // 1. State match
  if (intent?.state || intent?.state_code) {
    const jobState = (job.state?.name || job.state_code || "").toLowerCase();
    const intentState = (intent.state || intent.state_code || "").toLowerCase();
    if (jobState && (jobState.includes(intentState) || intentState.includes(jobState))) {
      reasons.push(`State: ${job.state?.name || job.state_code?.toUpperCase()}`);
    }
  }

  // 2. Qualification match
  if (intent?.qualification && intent.qualification.length > 0) {
    const qualSummary = (
      job.qualification_summary ||
      job.qualification?.name ||
      job.eligibility?.education_qualification ||
      ""
    ).toLowerCase();

    for (const q of intent.qualification) {
      if (qualSummary.includes(q.toLowerCase())) {
        reasons.push(`Qualification: ${q}`);
        break;
      }
    }
  }

  // 3. Application Open
  const isOpen =
    job.application_end_date &&
    new Date(job.application_end_date).getTime() > Date.now();
  if (isOpen) {
    reasons.push("Application currently open");
  }

  // 4. Salary match
  if (intent?.salary_min && (job.salary_min || job.salary_max)) {
    const maxSalary = job.salary_max || job.salary_min || 0;
    if (maxSalary >= intent.salary_min) {
      reasons.push(`Salary up to ${formatINR(maxSalary)}/month`);
    }
  }

  // 5. Category match
  if (intent?.category && job.category?.name) {
    const catLower = job.category.name.toLowerCase();
    if (catLower.includes(intent.category.toLowerCase())) {
      reasons.push(`Category: ${job.category.name}`);
    }
  }

  // 6. Keywords match
  for (const token of rawTokens) {
    if (token.length >= 3) {
      const fullText = `${job.title} ${job.organization?.name || ""} ${job.organization?.acronym || ""}`.toLowerCase();
      if (fullText.includes(token.toLowerCase()) && !matchedKeywords.includes(token)) {
        matchedKeywords.push(token);
      }
    }
  }

  if (reasons.length === 0 && matchedKeywords.length > 0) {
    reasons.push(`Matches keyword: "${matchedKeywords.slice(0, 2).join(", ")}"`);
  }

  return {
    matchedKeywords,
    matchedState: job.state?.name || job.state_code,
    matchedQualification: job.qualification?.name || job.qualification_summary,
    matchedSalary: job.salary_min || job.salary_max ? formatINR(job.salary_max || job.salary_min) : undefined,
    isApplicationOpen: Boolean(isOpen),
    reasons: reasons.slice(0, 4),
  };
}

/**
 * Builds grounded match explanation for GovExam records.
 */
export function explainExamMatch(
  exam: GovExamDetailed,
  intent?: StructuredSearchIntent,
  rawTokens: string[] = []
): ResultMatchExplanation {
  const reasons: string[] = [];
  const matchedKeywords: string[] = [];

  // 1. State match
  if (intent?.state || intent?.state_code) {
    const examState = (exam.state?.name || exam.state_code || "").toLowerCase();
    const intentState = (intent.state || intent.state_code || "").toLowerCase();
    if (examState && (examState.includes(intentState) || intentState.includes(examState))) {
      reasons.push(`State: ${exam.state?.name || exam.state_code?.toUpperCase()}`);
    }
  }

  // 2. Organization match
  if (intent?.query) {
    const orgAcronym = (exam.organization?.acronym || "").toLowerCase();
    const orgName = (exam.organization?.name || "").toLowerCase();
    if (orgAcronym.includes(intent.query.toLowerCase()) || orgName.includes(intent.query.toLowerCase())) {
      reasons.push(`Authority: ${exam.organization?.acronym || exam.organization?.name}`);
    }
  }

  // 3. Mode match
  if (exam.mode) {
    reasons.push(`Mode: ${exam.mode.replace("_", " ").toUpperCase()}`);
  }

  // 4. Status / Timeline
  if (exam.status === "scheduled" || exam.status === "ongoing" || exam.status === "published") {
    reasons.push("Official schedule active");
  }

  // 5. Keywords match
  for (const token of rawTokens) {
    if (token.length >= 3) {
      const fullText = `${exam.title} ${exam.organization?.name || ""} ${exam.organization?.acronym || ""}`.toLowerCase();
      if (fullText.includes(token.toLowerCase()) && !matchedKeywords.includes(token)) {
        matchedKeywords.push(token);
      }
    }
  }

  if (reasons.length === 0 && matchedKeywords.length > 0) {
    reasons.push(`Matches: "${matchedKeywords.slice(0, 2).join(", ")}"`);
  }

  return {
    matchedKeywords,
    matchedState: exam.state?.name || exam.state_code,
    reasons: reasons.slice(0, 4),
  };
}
