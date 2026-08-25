import { createAdminClient } from "@/lib/supabase/admin";
import { LanguageCode, SUPPORTED_LANGUAGES } from "@/lib/i18n/config";
import { getAiConfig } from "@/modules/ai/config";
import { TranslationInputItem, TranslatedOutputItem, TranslationBatchResult } from "./types";

/**
 * Prompt builder for Indic recruitment content translation
 */
function buildTranslationPrompt(items: TranslationInputItem[], targetLang: LanguageCode): string {
  const langName = SUPPORTED_LANGUAGES[targetLang]?.name || "Hindi";
  
  return `You are an expert Indian official government recruitment terminology translator.
Translate the following array of government recruitment/exam notices from English into ${langName} (${targetLang}).

STRICT RULES:
1. Output ONLY a valid JSON array of objects with the exact schema.
2. PRESERVE non-translatable tokens EXACTLY as they are:
   - Organization acronyms: UPSC, SSC, RRB, BSSC, UPSSSC, IBPS, NTA, High Court, IIT, AIIMS, DRDO, ISRO.
   - Notification/Advt numbers (e.g. Advt No. 04/2026, CEN 01/2026).
   - Numerical figures, monetary amounts (e.g. ₹44,900, 10,000 vacancies), and dates (e.g. 15 Oct 2026).
   - Official URLs, emails, portal domain names.
3. Use formal, authentic administrative terminology suitable for Indian gazettes and employment portals:
   - "Recruitment" -> "भर्ती"
   - "Vacancies" -> "रिक्तियां"
   - "Application Deadline" -> "आवेदन की अंतिम तिथि"
   - "Eligibility" -> "पात्रता एवं योग्यता"
   - "Selection Process" -> "चयन प्रक्रिया"
   - "Admit Card" -> "प्रवेश पत्र"
   - "Result" -> "परीक्षा परिणाम"
   - "Answer Key" -> "उत्तर कुंजी"

Input Items to Translate:
${JSON.stringify(items, null, 2)}

Required Output JSON Schema:
[
  {
    "id": "string",
    "title": "string (translated title)",
    "post_name": "string or null",
    "qualification_summary": "string or null",
    "age_limit_summary": "string or null",
    "pay_scale_summary": "string or null",
    "selection_process": "string or null",
    "description": "string or null",
    "summary": "string or null",
    "short_title": "string or null",
    "eligibility_summary": "string or null",
    "meta_title": "string or null",
    "meta_description": "string or null"
  }
]`;
}

/**
 * Translates a batch of items into the target language using OpenRouter / Gemini
 */
export async function translateContentBatch(
  items: TranslationInputItem[],
  targetLang: LanguageCode
): Promise<TranslatedOutputItem[]> {
  if (!items || items.length === 0 || targetLang === "en") {
    return [];
  }

  const config = getAiConfig();
  if (!config.apiKey) {
    console.warn("[Translation Service] OpenRouter API key missing. Skipping dynamic AI translation.");
    return [];
  }

  const prompt = buildTranslationPrompt(items, targetLang);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s safety timeout

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "HTTP-Referer": "https://suchnasetu.in",
        "X-Title": "SuchnaSetu Translation Engine",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.searchModel || "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional multilingual translator specialized in official government notifications and civic gazettes. Output ONLY a valid JSON array of objects.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 3500,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      console.warn(`[Translation Service HTTP ${response.status}]:`, errBody);
      return [];
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || "";
    if (!rawContent) return [];

    const firstBracket = rawContent.indexOf("[");
    const lastBracket = rawContent.lastIndexOf("]");
    if (firstBracket === -1 || lastBracket === -1) return [];

    const jsonStr = rawContent.slice(firstBracket, lastBracket + 1);
    const parsed = JSON.parse(jsonStr) as any[];

    return parsed.map((item) => ({
      id: item.id,
      language_code: targetLang,
      title: item.title,
      post_name: item.post_name || null,
      qualification_summary: item.qualification_summary || null,
      age_limit_summary: item.age_limit_summary || null,
      pay_scale_summary: item.pay_scale_summary || null,
      selection_process: item.selection_process || null,
      description: item.description || null,
      summary: item.summary || null,
      short_title: item.short_title || null,
      eligibility_summary: item.eligibility_summary || null,
      meta_title: item.meta_title || null,
      meta_description: item.meta_description || null,
    }));
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`[Translation Service Error (${targetLang})]:`, err.message || err);
    return [];
  }
}

/**
 * Persists translated output items directly into Supabase translation tables
 */
export async function persistTranslations(
  translations: TranslatedOutputItem[],
  type: "job" | "exam" | "bulletin"
): Promise<TranslationBatchResult> {
  const result: TranslationBatchResult = {
    total: translations.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  if (translations.length === 0) return result;

  const supabase = createAdminClient() as any;

  for (const item of translations) {
    try {
      if (type === "job") {
        const { error } = await supabase.from("gov_job_translations").upsert(
          {
            job_id: item.id,
            language_code: item.language_code,
            title: item.title,
            post_name: item.post_name,
            qualification_summary: item.qualification_summary,
            age_limit_summary: item.age_limit_summary,
            pay_scale_summary: item.pay_scale_summary,
            selection_process: item.selection_process,
            description: item.description,
            meta_title: item.meta_title,
            meta_description: item.meta_description,
            is_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "job_id,language_code" }
        );

        if (error) throw error;
        result.successful++;
      } else if (type === "exam") {
        const { error } = await supabase.from("gov_exam_translations").upsert(
          {
            exam_id: item.id,
            language_code: item.language_code,
            title: item.title,
            short_title: item.short_title,
            description: item.description,
            eligibility_summary: item.eligibility_summary,
            meta_title: item.meta_title,
            meta_description: item.meta_description,
            is_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "exam_id,language_code" }
        );

        if (error) throw error;
        result.successful++;
      } else if (type === "bulletin") {
        const { error } = await supabase.from("bulletin_translations").upsert(
          {
            bulletin_id: item.id,
            language_code: item.language_code,
            title: item.title,
            summary: item.summary,
            content: item.content,
            meta_title: item.meta_title,
            meta_description: item.meta_description,
            is_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "bulletin_id,language_code" }
        );

        if (error) throw error;
        result.successful++;
      }
    } catch (err: any) {
      result.failed++;
      result.errors.push(`Item ${item.id} (${item.language_code}): ${err.message}`);
    }
  }

  return result;
}
