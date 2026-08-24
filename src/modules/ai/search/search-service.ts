import { getAiConfig } from "../config";
import { callOpenRouterStructuredIntent } from "../openrouter-client";
import { executeStructuredSearch } from "./search-intent";
import { explainJobMatch, explainExamMatch } from "./match-explainer";
import { AiEnhancedSearchResult, StructuredSearchIntent } from "./types";
import { searchGlobal, searchJobs, searchExams } from "@/modules/search/service";
import { parseSearchQuery } from "@/modules/search/query-parser";

/**
 * Universal Search Service with Fail-Safe OpenRouter AI Query Understanding.
 *
 * Architecture:
 * 1. Checks if AI search is enabled (OPENROUTER_API_KEY + AI_SEARCH_ENABLED=true).
 * 2. If enabled, calls OpenRouter with structured JSON schema intent parsing.
 * 3. Executes targeted database queries using structured filters.
 * 4. If AI is disabled or fails (timeout, rate limit, invalid response), automatically falls back to keyword/filter search.
 * 5. Decorates results with authentic grounded match explanations.
 * 6. Never throws or crashes if AI is unavailable.
 */
export async function executeAiEnhancedSearch(
  rawQuery: string,
  options: {
    module?: "jobs" | "exams" | "all" | "bulletins";
    state?: string;
    limitPerType?: number;
    page?: number;
  } = {}
): Promise<AiEnhancedSearchResult> {
  const startTime = Date.now();
  const targetModule = options.module || "all";
  const cleanQuery = (rawQuery || "").trim();

  if (!cleanQuery) {
    return {
      query: "",
      isAiAssisted: false,
      executionTimeMs: 0,
      totalCount: 0,
      counts: { jobs: 0, exams: 0, bulletins: 0 },
      jobs: [],
      exams: [],
      bulletins: [],
    };
  }

  const aiConfig = getAiConfig();
  let intent: StructuredSearchIntent | null = null;
  let isAiAssisted = false;
  let fallbackReason: string | undefined = undefined;

  // Step 1: Attempt AI query parsing if enabled
  if (aiConfig.isEnabled) {
    try {
      const { intent: parsedIntent, error } = await callOpenRouterStructuredIntent(
        cleanQuery,
        targetModule
      );
      if (parsedIntent) {
        intent = parsedIntent;
        isAiAssisted = true;
      } else {
        fallbackReason = error || "PARSING_FAILED";
      }
    } catch (err: any) {
      fallbackReason = err.message || "UNEXPECTED_AI_ERROR";
      console.warn("[AI Search Fallback Triggered]:", fallbackReason);
    }
  } else {
    fallbackReason = !aiConfig.apiKey ? "API_KEY_MISSING" : "AI_SEARCH_DISABLED";
  }

  // Step 2: Execute Search (Structured Intent vs Fallback Database Search)
  let jobs: any[] = [];
  let exams: any[] = [];
  let bulletins: any[] = [];
  let counts = { jobs: 0, exams: 0, bulletins: 0 };

  if (isAiAssisted && intent) {
    try {
      const res = await executeStructuredSearch(intent, {
        limitPerType: options.limitPerType || 12,
        page: options.page || 1,
      });
      jobs = res.jobs;
      exams = res.exams;
      bulletins = res.bulletins;
      counts = res.counts;
    } catch (searchErr) {
      console.warn("[Structured Search Execution Error, falling back to standard search]:", searchErr);
      isAiAssisted = false;
      fallbackReason = "STRUCTURED_QUERY_FAILED";
    }
  }

  // Fallback to standard database search if AI was not used or yielded 0 results on a generic query
  if (!isAiAssisted || (jobs.length === 0 && exams.length === 0 && bulletins.length === 0)) {
    const standardRes = await searchGlobal(cleanQuery, {
      limitPerType: options.limitPerType || 12,
      page: options.page || 1,
    });
    jobs = standardRes.jobs;
    exams = standardRes.exams;
    bulletins = standardRes.bulletins;
    counts = standardRes.counts;
  }

  // Step 3: Decorate Results with Authentic Match Explanations
  const parsedKeywords = parseSearchQuery(cleanQuery).contentTokens;

  const decoratedJobs = jobs.map((job) => ({
    ...job,
    matchExplanation: explainJobMatch(job, intent || undefined, parsedKeywords),
  }));

  const decoratedExams = exams.map((exam) => ({
    ...exam,
    matchExplanation: explainExamMatch(exam, intent || undefined, parsedKeywords),
  }));

  const decoratedBulletins = bulletins.map((b) => ({
    ...b,
    matchExplanation: {
      matchedKeywords: parsedKeywords.filter((k) =>
        `${b.title} ${b.summary || ""}`.toLowerCase().includes(k.toLowerCase())
      ),
      reasons: ["Verified employment news digest"],
    },
  }));

  const totalCount = counts.jobs + counts.exams + counts.bulletins;
  const executionTimeMs = Date.now() - startTime;

  return {
    query: cleanQuery,
    isAiAssisted,
    modelUsed: isAiAssisted ? aiConfig.searchModel : undefined,
    fallbackReason,
    intent: intent || undefined,
    executionTimeMs,
    totalCount,
    counts,
    jobs: decoratedJobs,
    exams: decoratedExams,
    bulletins: decoratedBulletins,
  };
}
