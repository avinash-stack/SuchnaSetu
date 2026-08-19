import { GovJobDetailed, JobFilterParams } from "@/modules/jobs/types";
import { GovExamDetailed, ExamFilterParams } from "@/modules/exams/types";
import { PublicBulletinDetailed, BulletinFilterParams } from "@/modules/bulletins/types";

export type SearchContentType = "all" | "jobs" | "exams" | "news";

export interface ParsedSearchQuery {
  rawQuery: string;
  cleanQuery: string;
  tokens: string[];
  contentTokens: string[];
  matchedStateCodes: string[];
  matchedOrgKeywords: string[];
  matchedCategorySlugs: string[];
  isJobIntent: boolean;
  isExamIntent: boolean;
  isNewsIntent: boolean;
}

export interface GlobalSearchResult {
  query: string;
  totalCount: number;
  counts: {
    jobs: number;
    exams: number;
    bulletins: number;
  };
  jobs: GovJobDetailed[];
  exams: GovExamDetailed[];
  bulletins: PublicBulletinDetailed[];
}

export interface ScoredItem<T> {
  item: T;
  score: number;
}
