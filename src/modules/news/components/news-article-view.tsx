"use client";

import * as React from "react";
import Link from "next/link";
import { NewsArticleDetailed } from "../types/article";
import { NewsSourceBadge } from "./news-source-badge";
import { RelatedNewsStrip } from "./related-news-strip";
import { formatDate } from "@/lib/utils";
import { NewsContentSynthesizer } from "../services/content-synthesizer";
import {
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  CheckCircle2,
  GraduationCap,
  Languages,
  FileText,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingUp,
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

  // Synthesize rich, structured, factual news report
  const report = React.useMemo(() => {
    return NewsContentSynthesizer.synthesizeReport(article, lang);
  }, [article, lang]);

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap" aria-label="Breadcrumb">
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
              className="hover:text-[#013089] transition-colors uppercase font-semibold"
            >
              {article.state_code}
            </Link>
          </>
        )}
      </nav>

      {/* 2. Article Header */}
      <header className="space-y-4 border-b border-slate-200/90 pb-6">
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
        <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-slate-500 pt-1 border-t border-slate-100">
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

      {/* 3. Section 1: Executive Summary */}
      <section className="rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 p-5 sm:p-6 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#013089]">
          <Sparkles className="h-4 w-4 text-[#FE8D01]" />
          <span>{isHindi ? "1. कार्यकारी सारांश एवं मुख्य बिंदु" : "1. Executive Summary"}</span>
        </div>
        <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed font-sans">
          {report.executiveSummary}
        </p>
      </section>

      {/* 4. Section 2: What Happened */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <FileText className="h-4.5 w-4.5 text-[#013089]" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
            {isHindi ? "2. क्या हुआ / मुख्य घटनाक्रम" : "2. What Happened"}
          </h2>
        </div>
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
          {report.whatHappened}
        </p>
      </section>

      {/* 5. Section 3: Key Details Breakdown */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
            {isHindi ? "3. मुख्य विवरण एवं महत्वपूर्ण तथ्य" : "3. Key Details & Specifications"}
          </h2>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 space-y-3 shadow-2xs">
          <ul className="space-y-3">
            {report.keyDetails.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-3 text-base text-slate-800">
                <span className="h-6 w-6 rounded-full bg-blue-100/80 text-[#013089] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Section 4: Important Context & Background */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Info className="h-4.5 w-4.5 text-[#013089]" />
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
            {isHindi ? "4. महत्वपूर्ण संदर्भ एवं पृष्ठभूमि" : "4. Important Context & Background"}
          </h2>
        </div>
        <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
          {report.importantContext}
        </p>
      </section>

      {/* 7. Section 5: Why It Matters / What It Means */}
      {report.whyItMatters && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <TrendingUp className="h-4.5 w-4.5 text-[#FE8D01]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
              {isHindi ? "5. इसका क्या महत्व है / सार्वजनिक प्रभाव" : "5. What It Means / Why It Matters"}
            </h2>
          </div>
          <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-5 sm:p-6">
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed">
              {report.whyItMatters}
            </p>
          </div>
        </section>
      )}

      {/* 8. Section 6: Official Source Attribution & Reference Link (Clean Footer Reference) */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? "6. स्रोत एवं आधिकारिक संदर्भ" : "6. Source & Publication Details"}
            </span>
            <p className="text-base font-bold text-slate-900">
              {article.source_name}
            </p>
            <p className="text-xs text-slate-500">
              {isHindi ? "प्रकाशन तिथि:" : "Published:"} {formatDate(article.published_at)}
            </p>
          </div>

          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#013089] border border-slate-300 font-bold text-xs shadow-2xs transition-all w-full sm:w-auto"
          >
            <span>{isHindi ? "मूल आधिकारिक स्रोत देखें" : "View Original Source Document"}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-200/70">
          {isHindi
            ? "सूचना सेतु पर प्रस्तुत समाचार आधिकारिक सार्वजनिक विज्ञप्तियों के आधार पर संकलित किया जाता है। मूल सामग्री के सर्वाधिकार संबंधित प्राधिकरण अथवा समाचार संस्था के पास सुरक्षित हैं।"
            : "SuchnaSetu provides verified structured reporting based on official public records and circulars. Primary publication and copyright remain with the issuing authority."}
        </p>
      </section>

      {/* 9. Contextual Recruitment & Exam Links */}
      {isEducationOrGov && (
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#013089] uppercase tracking-wider">
              <GraduationCap className="h-4 w-4 text-[#FE8D01]" />
              <span>{isHindi ? "संबंधित भर्ती एवं परीक्षा सूचनाएं" : "Related Recruitment & Exam Opportunities"}</span>
            </div>
            <p className="text-xs text-slate-700">
              {isHindi
                ? "क्या आप नवीनतम सरकारी नौकरी, परीक्षा तिथियां अथवा प्रवेश पत्र खोज रहे हैं?"
                : "Explore active government recruitment notices, exam schedules, and admit cards."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/exams"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
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

      {/* 10. Tags */}
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

      {/* 11. Related News Section */}
      {article.related_articles && article.related_articles.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <RelatedNewsStrip articles={article.related_articles} />
        </div>
      )}
    </article>
  );
}
