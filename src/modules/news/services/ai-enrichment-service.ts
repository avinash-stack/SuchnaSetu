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

import { ArticleContentExtractor } from "./article-content-extractor";
import { NewsContentSynthesizer } from "./content-synthesizer";

export async function enrichNewsArticleWithAi(
  payload: NormalizedNewsPayload
): Promise<EnrichedNewsMetadata> {
  const fallbackCategory = (payload.categorySlug || "india").toLowerCase();

  // Ensure source content sent to AI is strictly cleaned of any web chrome
  const cleanedSourceContent = ArticleContentExtractor.cleanArticleText(payload.content);
  const cleanSummary =
    ArticleContentExtractor.sanitizeParagraph(payload.summary) ||
    payload.summary.replace(/<[^>]*>/g, "").trim();

  // Build fallback synthesized content if AI is skipped or unavailable
  const fallbackSynthesis = NewsContentSynthesizer.synthesizeFromCleanSummary(
    payload.title,
    cleanSummary,
    payload.author || undefined
  );

  const defaultMetadata: EnrichedNewsMetadata = {
    summary: cleanSummary,
    content: cleanedSourceContent || fallbackSynthesis.paragraphs.join("\n\n"),
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

  // Feed only factual, clean text into the AI
  const factualSourceContext = cleanedSourceContent
    ? cleanedSourceContent.slice(0, 3500)
    : cleanSummary;

  const prompt = `You are a professional, factual news editor for SuchnaSetu. Process this verified factual report and generate an original, objective news report along with taxonomy metadata:

Title: ${payload.title}
Source: ${payload.author || "News Desk"}
Factual Source Context:
${factualSourceContext}

Strict Editorial Directives:
1. "summary": A crisp 2-sentence factual executive summary of what happened.
2. "content": Write an original, multi-paragraph factual news article (3 to 4 distinct paragraphs separated by double newlines \\n\\n) based STRICTLY on the real news details provided:
   - Paragraph 1: The core announcement or event, key authorities/individuals involved, and primary context.
   - Paragraph 2: Specific figures, numbers, dates, locations, and operational decisions mentioned in the story.
   - Paragraph 3: Background context, affected citizens/stakeholders, and implications.
   - DO NOT invent, assume, or hallucinate any facts.
   - DO NOT copy sentences verbatim from the source (write original journalistic sentences).
   - NEVER include website UI, subscription/paywall text, login prompts, comments, or promotional filler.
   - Preserve all specific names, dates, numbers, and locations accurately.
3. "category_slug": Must be exactly one of: india, states, education, governance, business, technology, politics, world, health, sports, entertainment.
4. "state_code": 2-letter state code if state-specific (e.g. BR, UP, MH, DL, TN, KA, WB, PB, RJ, MP, GJ, KL) or null.
5. "tags": 3 to 5 relevant topic tags.

Respond with a single raw JSON object matching:
{
  "summary": "Crisp 2-sentence factual summary",
  "content": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3",
  "category_slug": "india",
  "subcategory": "specific topic",
  "state_code": null,
  "tags": ["Tag1", "Tag2", "Tag3"],
  "organizations": ["Org1", "Org2"],
  "importance": "breaking | high | standard"
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://suchnasetu.in",
        "X-Title": "SuchnaSetu News AI Intelligence",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional factual news classifier and editor. Return only a valid JSON object without markdown fences.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[News AI Enrichment HTTP ${res.status}] using fallback metadata`);
      return defaultMetadata;
    }

    const data = await res.json();
    const rawAiResponse = data.choices?.[0]?.message?.content;
    if (!rawAiResponse) {
      return defaultMetadata;
    }

    const parsed = JSON.parse(rawAiResponse);

    // Validate and sanitize AI-generated content & summary
    const validatedSummary =
      ArticleContentExtractor.sanitizeParagraph(parsed.summary) || defaultMetadata.summary;
    const validatedContent =
      ArticleContentExtractor.cleanArticleText(parsed.content) || defaultMetadata.content;

    const categorySlug = ALLOWED_CATEGORIES.includes(parsed.category_slug?.toLowerCase())
      ? parsed.category_slug.toLowerCase()
      : defaultMetadata.categorySlug;

    return {
      summary: validatedSummary,
      content: validatedContent,
      categorySlug,
      subcategory: parsed.subcategory || null,
      stateCode: parsed.state_code || defaultMetadata.stateCode,
      tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : defaultMetadata.tags,
      entities: {
        organizations: Array.isArray(parsed.organizations) ? parsed.organizations : [],
      },
      importance: ["breaking", "high", "standard"].includes(parsed.importance)
        ? parsed.importance
        : "standard",
      aiStatus: "enriched",
      aiModel: model,
    };
  } catch (err: any) {
    console.warn(`[News AI Enrichment Warning]: ${err.message}, using safe synthesized content`);
    return defaultMetadata;
  }
}
