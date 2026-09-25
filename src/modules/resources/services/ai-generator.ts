import { getAiConfig } from "@/modules/ai/config";
import { GeneratedResourcePayload, ResourceFaq } from "../types";
import { DiscoveredTopicContext } from "./topic-discovery";

export interface GenerateResourceResult {
  success: boolean;
  resource?: GeneratedResourcePayload;
  error?: string;
  durationMs?: number;
}

const RESOURCE_JSON_SCHEMA = {
  name: "career_resource_article",
  schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Authoritative, search-optimized title in English" },
      title_hi: { type: "string", description: "Clear, natural Hindi translation of the title" },
      slug: { type: "string", description: "SEO-friendly lowercase hyphenated slug" },
      category_slug: { type: "string", description: "Category slug matching one of the predefined categories" },
      excerpt: { type: "string", description: "2-3 sentence engaging summary for search meta description and preview card" },
      excerpt_hi: { type: "string", description: "Hindi translation of the excerpt" },
      content: {
        type: "string",
        description: "Comprehensive in-depth article in Markdown format (>1200 words) with H2/H3 headings, markdown tables, step-by-step study timelines, and official tips",
      },
      content_hi: {
        type: "string",
        description: "Summary and key highlights in Hindi for Hindi readers (>300 words in Markdown)",
      },
      tags: {
        type: "array",
        items: { type: "string" },
        description: "4-6 relevant tags (e.g. UPSC, SSC, Study Plan, Salary)",
      },
      faqs: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
            question_hi: { type: "string" },
            answer_hi: { type: "string" },
          },
          required: ["question", "answer"],
        },
        description: "4 to 6 authentic high-intent candidate FAQs suitable for Google FAQPage schema",
      },
      reading_time_minutes: { type: "integer", description: "Estimated reading time in minutes (typically 6-10)" },
    },
    required: ["title", "title_hi", "slug", "category_slug", "excerpt", "excerpt_hi", "content", "tags", "faqs"],
  },
};

export async function generateCareerResource(topic: DiscoveredTopicContext): Promise<GenerateResourceResult> {
  const aiConfig = getAiConfig();
  const startTime = Date.now();

  if (!aiConfig.apiKey) {
    return {
      success: false,
      error: "GROQ_API_KEY is not configured in environment variables.",
    };
  }

  const systemPrompt = `You are a Senior Public Sector Examination Analyst and Career Director for SuchnaSetu, India's verified public notice and career portal.
Your mission is to produce authoritative, comprehensive, deeply researched, and completely truthful career guidance articles for Indian government job aspirants (Sarkari Naukri).

STRICT FACTUAL GROUNDING RULES:
1. Pay Scales: Adhere strictly to the 7th Central Pay Commission (CPC) Pay Matrix (Level 1 to Level 14), with accurate Basic Pay, DA (>50%), HRA slabs (30%/20%/10% for X/Y/Z cities), and NPS deductions.
2. Selection Processes: Accurately delineate official stages (Prelims/Tier-1, Mains/Tier-2, CBAT/Psycho, Physical Standard Test, Document Verification).
3. Eligibility: State verified age limits, relaxation rules (OBC +3 yrs, SC/ST +5 yrs, PwBD +10 yrs), and educational qualification criteria.
4. Structure & Depth: Produce exhaustive, highly actionable content (>1,200 words in English Markdown). Use Markdown tables, bulleted lists, study routines, and timeline checklists.
5. Tone: Authoritative, empathetic, highly structured, professional, and practical. No generic AI fluff.

You MUST respond strictly with a valid JSON object matching the requested schema. Do NOT include conversational preamble or markdown backticks outside the JSON.`;

  const userPrompt = `Write an in-depth Career Guidance Resource on:
Target Topic: "${topic.suggestedTitle}"
Target Sector / Organization: ${topic.organization} (${topic.targetExamOrJob})
Category Slug: ${topic.categorySlug}
Proposed Slug: ${topic.suggestedSlug}
Grounding Context: ${JSON.stringify(topic.groundingFacts)}

Include:
1. In-depth analysis of syllabus / preparation / eligibility / pay reality.
2. Formatted Markdown table comparing stages, marks, or salary.
3. Month-by-month study roadmap or step-by-step checklist.
4. 4 to 6 candidate FAQs with clear, concrete answers in both English and Hindi.
5. High-quality Hindi summary and translated title.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout for deep generation

    const response = await fetch(aiConfig.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiConfig.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "SuchnaSetu-CareerResourceGenerator/1.0",
      },
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_object",
        },
        temperature: 0.3, // Lower temperature for factual accuracy
        max_completion_tokens: 4096,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Groq API responded with status ${response.status}: ${errText.slice(0, 300)}`,
        durationMs: Date.now() - startTime,
      };
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return {
        success: false,
        error: "Empty completion returned from Groq.",
        durationMs: Date.now() - startTime,
      };
    }

    let parsed: GeneratedResourcePayload;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr: any) {
      return {
        success: false,
        error: `Failed to parse Groq JSON response: ${parseErr.message}`,
        durationMs: Date.now() - startTime,
      };
    }

    // Quality Gate: Ensure minimum length and structural integrity
    if (!parsed.content || parsed.content.length < 500) {
      return {
        success: false,
        error: "Generated article did not meet the minimum word count threshold (>500 characters).",
        durationMs: Date.now() - startTime,
      };
    }

    // Ensure slug is clean
    parsed.slug = (parsed.slug || topic.suggestedSlug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Ensure category_slug is valid
    parsed.category_slug = parsed.category_slug || topic.categorySlug;

    // Normalize faqs & tags
    if (!Array.isArray(parsed.faqs)) {
      parsed.faqs = (parsed as any).faq || (parsed as any).frequently_asked_questions || [];
    }
    if (!Array.isArray(parsed.tags)) {
      parsed.tags = (parsed as any).keywords || ["Career Guidance", "Preparation Strategy"];
    }

    // Calculate reading time if missing
    if (!parsed.reading_time_minutes || parsed.reading_time_minutes < 1) {
      const words = parsed.content.split(/\s+/).length;
      parsed.reading_time_minutes = Math.max(3, Math.ceil(words / 200));
    }

    return {
      success: true,
      resource: parsed,
      durationMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Network or runtime error during AI generation: ${err.message}`,
      durationMs: Date.now() - startTime,
    };
  }
}
