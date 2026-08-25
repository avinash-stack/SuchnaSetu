"use client";

import * as React from "react";
import Link from "next/link";
import { NewsArticleDetailed } from "../types/article";
import { NewsSourceBadge } from "./news-source-badge";
import { RelatedNewsStrip } from "./related-news-strip";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedNewsArticle } from "../utils/localize";
import {
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  CheckCircle2,
  Bookmark,
  Building2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsArticleViewProps {
  article: NewsArticleDetailed;
}

export function NewsArticleView({ article: rawArticle }: NewsArticleViewProps) {
  const { language } = useLanguage();
  const article = resolveLocalizedNewsArticle(rawArticle, language);
  const [copied, setCopied] = React.useState(false);

  const isHindi = language === "hi";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEducationOrGov =
    article.category_slug === "education" || article.category_slug === "governance";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
        <Link href="/news" className="hover:text-[#013089] transition-colors">
          {isHindi ? "समाचार होम" : "News Home"}
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <Link
          href={`/news/category/${article.category_slug}`}
          className="hover:text-[#013089] transition-colors uppercase font-bold text-[#013089]"
        >
          {article.category?.name || article.category_slug}
        </Link>
        {article.state_code && (
          <>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link
              href={`/news/state/${article.state_code.toLowerCase()}`}
              className="hover:text-[#013089] transition-colors"
            >
              {article.state_code}
            </Link>
          </>
        )}
      </nav>

      {/* 2. Article Header */}
      <header className="space-y-4 border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-[#013089] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {article.category?.name || article.category_slug}
            </span>
            {article.importance === "breaking" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                <Sparkles className="h-3 w-3" />
                BREAKING
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
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

        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight font-heading">
          {article.title}
        </h1>

        {/* Metadata Strip */}
        <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-slate-500 pt-1">
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
        </div>
      </header>

      {/* 3. AI Key Summary & Takeaway Box */}
      <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 sm:p-5 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#013089]">
          <Sparkles className="h-4 w-4 text-[#FE8D01]" />
          <span>{isHindi ? "मुख्य तथ्य एवं सारांश" : "Executive Summary & Key Facts"}</span>
        </div>
        <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed">
          {article.summary}
        </p>
      </div>

      {/* 4. Main Body Content / Reference Facts */}
      {article.content && (
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 py-2">
          <p>{article.content}</p>
        </div>
      )}

      {/* 5. Mandatory Publisher Attribution & Direct Source Link */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? "आधिकारिक स्रोत एवं प्रकाशक" : "Original Source & Attribution"}
            </span>
            <p className="text-sm font-bold text-slate-900">
              {article.source_name}
            </p>
          </div>

          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#013089] hover:bg-[#01246d] text-white font-bold text-xs shadow-xs transition-all"
          >
            <span>{isHindi ? "मूल आधिकारिक विज्ञप्ति देखें" : "Read Full Official Release"}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <p className="text-[11.5px] text-slate-500 leading-relaxed">
          {isHindi
            ? "यह समाचार सारांश सार्वजनिक सूचना के उद्देश्य से संकलित किया गया है। संपूर्ण और विस्तृत विवरण हेतु मूल प्रकाशक के आधिकारिक पोर्टल पर जाएं।"
            : "SuchnaSetu provides verified public reporting and structured digests. For full legal and operational details, please consult the issuing authority directly."}
        </p>
      </div>

      {/* 6. Contextual Recruitment Gateway (Loosely Coupled via Public Links) */}
      {isEducationOrGov && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900 uppercase tracking-wider">
              <GraduationCap className="h-4 w-4 text-[#FE8D01]" />
              <span>{isHindi ? "संबंधित भर्ती एवं परीक्षा सूचनाएं" : "Related Recruitment & Exam Updates"}</span>
            </div>
            <p className="text-xs text-amber-800">
              {isHindi
                ? "क्या आप सरकारी नौकरी, परीक्षा तिथियां अथवा एडमिट कार्ड खोज रहे हैं?"
                : "Looking for active government vacancies, examination schedules, or admit cards?"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/exams"
              className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-slate-800 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              Exams
            </Link>
            <Link
              href="/jobs"
              className="px-3.5 py-1.5 rounded-lg bg-[#013089] text-white text-xs font-bold hover:bg-[#01246d] transition-colors"
            >
              Govt Jobs →
            </Link>
          </div>
        </div>
      )}

      {/* 7. Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-2">
          <span className="text-xs font-bold text-slate-400 mr-1">
            {isHindi ? "टैग्स:" : "Tags:"}
          </span>
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/news/search?q=${encodeURIComponent(tag)}`}
              className="text-[11.5px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* 8. Related News Strip */}
      {article.related_articles && article.related_articles.length > 0 && (
        <RelatedNewsStrip articles={article.related_articles} />
      )}
    </div>
  );
}
