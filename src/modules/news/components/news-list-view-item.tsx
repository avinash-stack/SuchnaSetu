import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "../types/article";
import { NewsSourceBadge } from "./news-source-badge";
import { formatDate } from "@/lib/utils";
import { Clock, Tag, Sparkles, Languages } from "lucide-react";
import { detectArticleLanguage } from "../utils/language";
import { resolveLocalizedNewsArticle } from "../utils/localize";

interface NewsListViewItemProps {
  article: NewsArticle;
  lang?: "en" | "hi";
}

export function NewsListViewItem({ article: rawArticle, lang = "en" }: NewsListViewItemProps) {
  const article = resolveLocalizedNewsArticle(rawArticle, lang);
  const originalLang = detectArticleLanguage(rawArticle.title + " " + rawArticle.summary);
  const isTranslated = lang !== originalLang && article.title !== rawArticle.title;

  const isHindi = lang === "hi";
  const detailHref = lang === "hi" ? `/news/${article.slug}?lang=hi` : `/news/${article.slug}`;

  return (
    <article className="group relative rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row gap-4 items-start">
      {/* Optional Thumbnail Image */}
      {article.image_url && (
        <div className="relative h-24 w-full sm:w-36 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, 144px"
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Main News Content */}
      <div className="flex-1 min-w-0 space-y-2 w-full">
        {/* Top Header Strip: Category + Importance + Language */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/news/category/${article.category_slug}${lang === "hi" ? "?lang=hi" : ""}`}
              className="font-bold text-[11px] uppercase tracking-wider text-[#013089] bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200/60 transition-colors"
            >
              {article.category_slug}
            </Link>

            {article.importance === "breaking" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold bg-red-600 text-white animate-pulse">
                <Sparkles className="h-3 w-3" />
                {isHindi ? "ताज़ा ख़बर" : "BREAKING"}
              </span>
            )}

            {article.state_code && (
              <Link
                href={`/news/state/${article.state_code.toLowerCase()}${lang === "hi" ? "?lang=hi" : ""}`}
                className="font-semibold text-[10.5px] text-slate-500 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors"
              >
                {article.state_code}
              </Link>
            )}
          </div>

          {/* Language / Translation Badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <Languages className="h-3 w-3 text-slate-400" />
            <span>
              {isTranslated
                ? isHindi
                  ? "अंग्रेजी से अनूदित"
                  : "Translated from Hindi"
                : originalLang === "hi"
                ? "हिंदी"
                : "English"}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-[#013089] transition-colors font-heading">
          <Link href={detailHref} className="focus:outline-none focus:underline">
            {article.title}
          </Link>
        </h3>

        {/* Short Summary / Excerpt (1-2 lines) */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-sans">
          {article.summary}
        </p>

        {/* Metadata Footer Strip: Source + Date + Tags */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 text-[11.5px] text-slate-500 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <NewsSourceBadge name={article.source_name} sourceUrl={article.source_url} />

            <div className="flex items-center gap-1 font-mono text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{formatDate(article.published_at)}</span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 flex-wrap">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
                >
                  <Tag className="h-2.5 w-2.5 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
