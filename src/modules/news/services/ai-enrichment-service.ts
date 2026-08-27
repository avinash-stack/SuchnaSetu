import { getAiConfig } from "@/modules/ai/config";
import { NewsImportance, NewsAiStatus } from "../types/article";
import { NormalizedNewsPayload } from "../adapters/base-adapter";

export interface EnrichedNewsMetadata {
  summary: string;
  content?: string | null;
  categorySlug: string;
  subcategory?: string | null;
  stateCode?: string | null;
  tags: string[];
  entities: {
    organizations?: string[];
    persons?: string[];
    locations?: string[];
    schemes?: string[];
  };
  importance: NewsImportance;
  aiStatus: NewsAiStatus;
  aiModel?: string | null;
}

const ALLOWED_CATEGORIES = [
  "india",
  "states",
  "education",
  "governance",
  "business",
  "technology",
  "politics",
  "world",
  "health",
  "sports",
  "entertainment",
];

export async function enrichNewsArticleWithAi(
  payload: NormalizedNewsPayload
): Promise<EnrichedNewsMetadata> {
  const fallbackCategory = (payload.categorySlug || "india").toLowerCase();
  const defaultMetadata: EnrichedNewsMetadata = {
    summary: payload.summary,
    content: payload.content || null,
    categorySlug: ALLOWED_CATEGORIES.includes(fallbackCategory) ? fallbackCategory : "india",
    subcategory: null,
    stateCode: payload.stateCode || null,
    tags: payload.tags && payload.tags.length > 0 ? payload.tags.slice(0, 5) : ["India News"],
    entities: {},
    importance: "standard",
    aiStatus: "skipped",
    aiModel: null,
  };

  const config = getAiConfig();
  if (!config.isEnabled || !config.apiKey) {
    return defaultMetadata;
  }

  const model = process.env.NEWS_AI_MODEL || config.searchModel || "google/gemini-2.5-flash";

  const prompt = `You are an official Indian News intelligence reporter for SuchnaSetu. Analyze this news item and produce a structured, comprehensive news report along with metadata:
Title: ${payload.title}
Text: ${payload.summary} ${payload.content ? payload.content.slice(0, 800) : ""}

Strict Reporting Guidelines:
1. Generate an informative, factual multi-paragraph article body (at least 3-4 paragraphs) covering:
   - What Happened: The core announcement or event.
   - Key Details: Specific facts, figures, dates, quotas, and participating authorities.
   - Important Context & Significance: Why this update matters to students, jobseekers, or citizens.
2. DO NOT invent facts. Strictly preserve names, numbers, dates, and official terms.
3. Allowed categories (must be exactly one of): india, states, education, governance, business, technology, politics, world, health, sports, entertainment.

Respond with a single raw JSON object matching:
{
  "summary": "Crisp 2-sentence objective factual summary in English",
  "content": "Full multi-paragraph structured article text with paragraphs separated by double newlines",
  "category_slug": "one of the allowed category slugs",
  "subcategory": "specific topic",
  "state_code": "2-letter state code if state-specific (e.g. BR, UP, MH, DL) or null",
  "tags": ["3 to 5 relevant tags"],
  "organizations": ["mentioned organizations (e.g. UPSC, UGC, ISRO, High Court)"],
  "importance": "breaking | high | standard"
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://suchnasetu.in",
        "X-Title": "SuchnaSetu News AI Classifier",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a news classification engine. Return only a valid JSON object without markdown fences.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 450,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[News AI Enrichment HTTP ${res.status}] using fallback`);
      return defaultMetadata;
    }

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content?.trim();
    if (!rawContent) return defaultMetadata;

    const parsed = JSON.parse(rawContent);

    const category = (parsed.category_slug || "").toLowerCase();
    const validCategory = ALLOWED_CATEGORIES.includes(category) ? category : defaultMetadata.categorySlug;

    return {
      summary: parsed.summary || payload.summary,
      content: parsed.content || payload.content || null,
      categorySlug: validCategory,
      subcategory: parsed.subcategory || null,
      stateCode: parsed.state_code || payload.stateCode || null,
      tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : defaultMetadata.tags,
      entities: {
        organizations: Array.isArray(parsed.organizations) ? parsed.organizations : [],
      },
      importance: (["breaking", "high", "standard"].includes(parsed.importance)
        ? parsed.importance
        : "standard") as NewsImportance,
      aiStatus: "enriched",
      aiModel: model,
    };
  } catch {
    clearTimeout(timeoutId);
    return defaultMetadata;
  }
}
