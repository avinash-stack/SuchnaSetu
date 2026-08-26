"use client";

import * as React from "react";
import Link from "next/link";
import { NewsArticleDetailed } from "../types/article";
import { NewsSourceBadge } from "./news-source-badge";
import { RelatedNewsStrip } from "./related-news-strip";
import { formatDate } from "@/lib/utils";
import { detectArticleLanguage } from "../services/translation-service";
import {
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Building2,
  GraduationCap,
  Languages,
  Check,
  FileText,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsArticleViewProps {
  article: NewsArticleDetailed;
  lang?: "en" | "hi";
  isTranslated?: boolean;
  originalLang?: "en" | "hi";
}

export function NewsArticleView({
  article,
  lang = "en",
  isTranslated = false,
  originalLang = "en",
}: NewsArticleViewProps) {
  const [copied, setCopied] = React.useState(false);

  const isHindi = lang === "hi";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEducationOrGov =
    article.category_slug === "education" || article.category_slug === "governance";

  // Build key highlights / takeaway bullets from summary or content
  const keyHighlights = React.useMemo(() => {
    if (!article.summary) return [];
    // Split sentences into key takeaway bullets
    const sentences = article.summary
      .split(/(?<=[.!?।])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);
    return sentences.length > 1 ? sentences : [article.summary];
  }, [article.summary]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-7 font-sans">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
        <Link href={`/news${lang === "hi" ? "?lang=hi" : ""}`} className="hover:text-[#013089] transition-colors">
          {isHindi ? "समाचार मुख्य पृष्ठ" : "News Home"}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link
          href={`/news/category/${article.category_slug}${lang === "hi" ? "?lang=hi" : ""}`}
          className="hover:text-[#013089] transition-colors uppercase font-bold text-[#013089]"
        >
          {article.category?.name || article.category_slug}
        </Link>
        {article.state_code && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link
              href={`/news/state/${article.state_code.toLowerCase()}${lang === "hi" ? "?lang=hi" : ""}`}
              className="hover:text-[#013089] transition-colors"
            >
              {article.state_code}
            </Link>
          </>
        )}
      </nav>

      {/* 2. Article Header */}
      <header className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs uppercase tracking-wider text-[#013089] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {article.category?.name || article.category_slug}
            </span>
            {article.importance === "breaking" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                <Sparkles className="h-3 w-3" />
                {isHindi ? "ताज़ा ख़बर" : "BREAKING"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switch for Article */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 text-xs">
              <Link
                href={`/news/${article.slug}`}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  !isHindi
                    ? "bg-white text-[#013089] shadow-2xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                English
              </Link>
              <Link
                href={`/news/${article.slug}?lang=hi`}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  isHindi
                    ? "bg-[#013089] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                हिंदी
              </Link>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-xs h-8 gap-1.5 rounded-lg text-slate-600"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? (isHindi ? "कॉपी किया गया" : "Copied") : (isHindi ? "शेयर" : "Share")}</span>
            </Button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight font-heading">
          {article.title}
        </h1>

        {/* Metadata Strip */}
        <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-slate-500 pt-1 border-t border-slate-100/80">
          <div className="flex items-center gap-3 flex-wrap">
            <NewsSourceBadge name={article.source_name} sourceUrl={article.source_url} />

            {article.author && (
              <span className="font-medium text-slate-600">
                By <span className="text-slate-800 font-semibold">{article.author}</span>
              </span>
            )}

            <div className="flex items-center gap-1 font-mono text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>

          {/* Translation attribution indicator */}
          <div className="flex items-center gap-1.5 text-slate-500">
            <Languages className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-medium">
              {isTranslated
                ? isHindi
                  ? "अंग्रेजी से अनूदित (Translated from English)"
                  : "Translated from Hindi"
                : isHindi
                ? "मूल भाषा: हिंदी"
                : "Original: English"}
            </span>
          </div>
        </div>
      </header>

      {/* 3. Executive Summary / Highlights Box */}
      <div className="rounded-2xl border border-blue-200/90 bg-blue-50/50 p-5 sm:p-6 space-y-3 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#013089]">
          <Sparkles className="h-4 w-4 text-[#FE8D01]" />
          <span>{isHindi ? "मुख्य तथ्य एवं आधिकारिक सारांश" : "Executive Summary & Key Takeaways"}</span>
        </div>
        <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed font-sans">
          {article.summary}
        </p>
      </div>

      {/* 4. Full Structured News Report */}
      <div className="space-y-4 text-slate-800 leading-relaxed text-base sm:text-lg">
        {article.content ? (
          <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-4">
            {article.content.split("\n\n").map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="leading-relaxed">
              {article.summary}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? "यह सूचना आधिकारिक सार्वजनिक विज्ञप्ति एवं सत्यापित राष्ट्रीय स्रोतों के आधार पर संकलित की गई है। संबंधित प्राधिकरण द्वारा जारी विस्तृत अधिसूचना एवं नियमों का संदर्भ नीचे दिया गया है।"
                : "This public news report is compiled and verified from official government releases and established national news desks. For complete circulars and guidelines, refer to the verified official source below."}
            </p>
          </div>
        )}
      </div>

      {/* 5. Key Highlights Breakdown List */}
      {keyHighlights.length > 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3 shadow-2xs">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-700">
            <BookmarkCheck className="h-4 w-4 text-[#013089]" />
            <span>{isHindi ? "महत्वपूर्ण बिंदु" : "Important Points"}</span>
          </div>
          <ul className="space-y-2">
            {keyHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="h-5 w-5 rounded-full bg-blue-50 text-[#013089] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Official Source Attribution & Reference Link (Clean Footer Reference, not Primary Read Action) */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? "मूल आधिकारिक स्रोत एवं संदर्भ" : "Original Source Attribution & Reference"}
            </span>
            <p className="text-sm font-bold text-slate-900">
              {article.source_name}
            </p>
          </div>

          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#013089] border border-slate-300 font-bold text-xs shadow-2xs transition-all w-full sm:w-auto"
          >
            <span>{isHindi ? "मूल स्रोत का संदर्भ देखें" : "View Original Source Reference"}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="text-[11.5px] text-slate-500 leading-relaxed">
          {isHindi
            ? "सूचना सेतु पर प्रकाशित समाचार स्वतंत्र विश्लेषण एवं आधिकारिक सार्वजनिक सूचनाओं पर आधारित है। कॉपीराइट एवं मूल सामग्री संबंधित प्रकाशक / प्राधिकरण के अधीन है।"
            : "SuchnaSetu provides verified structured summaries and public reporting for citizens. Copyright and primary publication remain with the original issuing authority or news desk."}
        </p>
      </div>

      {/* 7. Contextual Recruitment & Exam Links */}
      {isEducationOrGov && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 uppercase tracking-wider">
              <GraduationCap className="h-4 w-4 text-[#FE8D01]" />
              <span>{isHindi ? "संबंधित भर्ती एवं परीक्षा सूचनाएं" : "Related Recruitment & Exam Opportunities"}</span>
            </div>
            <p className="text-xs text-amber-800">
              {isHindi
                ? "क्या आप नवीनतम सरकारी नौकरी, परीक्षा तिथियां अथवा एडमिट कार्ड खोज रहे हैं?"
                : "Explore active government recruitment notices, exam schedules, and admit cards."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/exams"
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-slate-800 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              {isHindi ? "परीक्षाएं" : "Exams"}
            </Link>
            <Link
              href="/jobs"
              className="px-3.5 py-1.5 rounded-lg bg-[#013089] text-white text-xs font-bold hover:bg-[#01246d] transition-colors"
            >
              {isHindi ? "सरकारी नौकरियां →" : "Govt Jobs →"}
            </Link>
          </div>
        </div>
      )}

      {/* 8. Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <span className="text-xs font-bold text-slate-400 mr-1">
            {isHindi ? "टैग्स:" : "Tags:"}
          </span>
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/news/search?q=${encodeURIComponent(tag)}${lang === "hi" ? "&lang=hi" : ""}`}
              className="text-[11.5px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* 9. Related News Section */}
      {article.related_articles && article.related_articles.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <RelatedNewsStrip articles={article.related_articles} />
        </div>
      )}
    </article>
  );
}
