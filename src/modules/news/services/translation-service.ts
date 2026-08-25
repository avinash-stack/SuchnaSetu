import { createAdminClient } from "@/lib/supabase/admin";
import { getAiConfig } from "@/modules/ai/config";
import { NewsArticle, NewsTranslation } from "../types/article";

export async function translateAndCacheNewsArticle(
  article: NewsArticle,
  targetLang: "hi" | "bn" | "as" | "or" | "pa" = "hi"
): Promise<NewsTranslation | null> {
  const config = getAiConfig();
  if (!config.isEnabled || !config.apiKey) return null;

  const model = process.env.NEWS_AI_MODEL || config.searchModel || "google/gemini-2.5-flash";

  const prompt = `Translate this Indian news story headline and summary into ${targetLang === "hi" ? "Hindi" : targetLang}:
Title: ${article.title}
Summary: ${article.summary}

Rules:
- Maintain journalistic accuracy.
- Keep proper nouns, abbreviations (PIB, ISRO, RBI, UPSC, etc.), and dates intact.
- Return JSON with keys: "title", "summary".`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://suchnasetu.in",
        "X-Title": "SuchnaSetu News Translator",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a professional Hindi news translator. Output JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || "{}");

    if (!parsed.title || !parsed.summary) return null;

    const supabase = createAdminClient();
    const { data: saved, error } = await (supabase as any)
      .from("news_translations")
      .upsert(
        {
          article_id: article.id,
          language_code: targetLang,
          title: parsed.title,
          summary: parsed.summary,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "article_id,language_code" }
      )
      .select("*")
      .single();

    if (error) return null;
    return saved as NewsTranslation;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}
