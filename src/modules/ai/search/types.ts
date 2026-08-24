import { GovJobDetailed } from "@/modules/jobs/types";
import { GovExamDetailed } from "@/modules/exams/types";
import { PublicBulletinDetailed } from "@/modules/bulletins/types";

/**
 * Strict JSON Schema representation of user search intent.
 */
export interface StructuredSearchIntent {
  module: "jobs" | "exams" | "all" | "bulletins";
  query: string | null;
  state: string | null; // e.g. "Bihar", "Uttar Pradesh", "UP", "BR"
  state_code: string | null; // e.g. "BR", "UP"
  qualification: string[] | null; // e.g. ["10th", "12th", "Graduate", "BTech", "B.Ed"]
  category: string | null; // e.g. "Defence", "Police", "Banking", "Teaching", "Engineering", "Railway", "UPSC"
  employment_type: string | null; // e.g. "permanent", "contract", "apprenticeship"
  status: "active" | "all" | "upcoming" | "closing_soon" | "concluded" | null;
  application_open: boolean | null;
  gender: "female" | "male" | "all" | null;
  salary_min: number | null;
  salary_max: number | null;
  deadline_before: string | null;
  sort: "relevance" | "latest" | "deadline" | "salary";
}

/**
 * Result match explanation grounded purely in authentic record data.
 */
export interface ResultMatchExplanation {
  matchedKeywords: string[];
  matchedState?: string | null;
  matchedQualification?: string | null;
  matchedSalary?: string | null;
  isApplicationOpen?: boolean;
  reasons: string[];
}

/**
 * Enhanced Search Response
 */
export interface AiEnhancedSearchResult {
  query: string;
  isAiAssisted: boolean;
  modelUsed?: string;
  fallbackReason?: string;
  intent?: StructuredSearchIntent;
  executionTimeMs: number;
  totalCount: number;
  counts: {
    jobs: number;
    exams: number;
    bulletins: number;
  };
  jobs: Array<GovJobDetailed & { matchExplanation?: ResultMatchExplanation }>;
  exams: Array<GovExamDetailed & { matchExplanation?: ResultMatchExplanation }>;
  bulletins: Array<PublicBulletinDetailed & { matchExplanation?: ResultMatchExplanation }>;
}
