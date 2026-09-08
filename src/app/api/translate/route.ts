import { NextRequest, NextResponse } from "next/server";
import { getPublicJobBySlug } from "@/modules/jobs/service";
import { resolveArticleBySlug } from "@/modules/news/services/news-query-service";
import {
  translateJobNotice,
  translateNewsArticle,
  translateTextWithGoogle,
} from "@/modules/translation/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, slug, targetLang = "hi", text } = body;

    if (targetLang !== "hi" && targetLang !== "en") {
      return NextResponse.json(
        { error: "Unsupported target language. Supported: 'en', 'hi'" },
        { status: 400 }
      );
    }

    // 1. Job Notice Translation
    if (type === "job") {
      const lookup = slug || id;
      if (!lookup) {
        return NextResponse.json({ error: "Missing job slug or id" }, { status: 400 });
      }

      const job = await getPublicJobBySlug(lookup);
      if (!job) {
        return NextResponse.json({ error: "Job notice not found" }, { status: 404 });
      }

      const result = await translateJobNotice(job, targetLang);
      return NextResponse.json({
        success: true,
        type: "job",
        targetLang,
        isTranslated: result.isTranslated,
        translation: result.translation,
      });
    }

    // 2. News Article Translation
    if (type === "news") {
      const lookup = slug || id;
      if (!lookup) {
        return NextResponse.json({ error: "Missing news slug or id" }, { status: 400 });
      }

      const resolved = await resolveArticleBySlug(lookup);
      if (resolved.type !== "found" || !resolved.article) {
        return NextResponse.json({ error: "News article not found" }, { status: 404 });
      }

      const result = await translateNewsArticle(resolved.article, targetLang);
      return NextResponse.json({
        success: true,
        type: "news",
        targetLang,
        isTranslated: result.isTranslated,
        translation: result.translation,
      });
    }

    // 3. Arbitrary Text Translation
    if (type === "text") {
      if (!text || typeof text !== "string") {
        return NextResponse.json({ error: "Missing or invalid text" }, { status: 400 });
      }

      const translated = await translateTextWithGoogle(text, targetLang);
      return NextResponse.json({
        success: true,
        type: "text",
        targetLang,
        original: text,
        translated,
      });
    }

    return NextResponse.json({ error: "Invalid type parameter. Allowed: 'job', 'news', 'text'" }, { status: 400 });
  } catch (err: any) {
    console.error("[API /api/translate Error]:", err);
    return NextResponse.json(
      { error: "Internal translation error", message: err.message },
      { status: 500 }
    );
  }
}
