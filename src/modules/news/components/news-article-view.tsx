"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsArticleDetailed } from "../types/article";
import { NewsSourceBadge } from "./news-source-badge";
import { RelatedNewsStrip } from "./related-news-strip";
import { formatDate, formatNumber } from "@/lib/utils";
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
  Building2,
  Calendar,
  Users,
  ArrowRight,
  BookOpen,
  Layers,
  FileCheck,
  Info,
  ShieldCheck,
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

  // Generate complete, flowing full news report
  const report = React.useMemo(() => {
    return NewsContentSynthesizer.generateFullArticleBody(article, lang);
  }, [article, lang]);

  const relatedJobs = article.related_jobs || [];
  const relatedExams = article.related_exams || [];

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans text-slate-800">
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
                  ? "Google Translate द्वारा अनूदित"
                  : "Translated via Google Translate"
                : isHindi
                ? "मूल भाषा: हिंदी"
                : "Original: English"}
            </span>
          </div>
        </div>
      </header>

      {/* 2.5 AI-Generated Featured News Image (Story-Specific) */}
      {article.image_url && (
        <figure className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100 relative group aspect-[16/9] w-full">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 850px"
            className="object-cover transition-transform duration-500 group-hover:scale-102"
          />
          <figcaption className="sr-only">{article.title}</figcaption>
          <div className="absolute bottom-3 right-3 rounded-md bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-slate-200 tracking-wide pointer-events-none shadow-xs">
            {isHindi ? "दृश्य प्रस्तुति" : "Visual Coverage"}
          </div>
        </figure>
      )}

      {/* 3. AI Summary at Top */}
      <section className="rounded-2xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-5 sm:p-6 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#013089]">
          <Sparkles className="h-4 w-4 text-[#FE8D01]" />
          <span>{isHindi ? "AI त्वरित सारांश एवं मुख्य बिंदु" : "AI Synopsis & Key Briefing"}</span>
        </div>
        <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed font-sans">
          {report.summary}
        </p>
      </section>

      {/* 4. Executive Key Highlights (3-5 Bullet Points) */}
      {report.keyHighlights.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{isHindi ? "मुख्य बिंदु एवं महत्वपूर्ण तथ्य" : "Key Highlights & Official Takeaways"}</span>
          </div>
          <ul className="space-y-2.5">
            {report.keyHighlights.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[15px] sm:text-base text-slate-800 leading-relaxed">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mt-0.5">
                  ✓
                </span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. Complete Article Content (In-Depth Journalistic Flowing Paragraphs) */}
      <section className="space-y-6 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
          <BookOpen className="h-4 w-4 text-[#013089]" />
          <span>{isHindi ? "विस्तृत समाचार एवं नीतिगत विवरण" : "Comprehensive News & Policy Report"}</span>
        </div>

        <div className="space-y-5 text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
          {report.paragraphs.map((para, idx) => (
            <p key={idx} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* 6. Actionable Takeaways & Next Steps for Citizens / Aspirants */}
      {report.actionableTakeaways.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
            <Info className="h-4 w-4 text-amber-600" />
            <span>{isHindi ? "अभ्यर्थियों एवं नागरिकों के लिए महत्वपूर्ण निर्देश" : "Actionable Steps for Aspirants & Citizens"}</span>
          </div>
          <ul className="space-y-2">
            {report.actionableTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-amber-950 leading-relaxed">
                <span className="text-amber-600 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 7. Official Details Table */}
      {report.officialOverview.length > 0 && (
        <section className="rounded-xl border border-slate-200 overflow-hidden bg-white">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-[#013089]" />
            <span>{isHindi ? "आधिकारिक सूचना सार" : "Official Notice Specification"}</span>
          </div>
          <table className="w-full text-xs sm:text-sm text-slate-800">
            <tbody className="divide-y divide-slate-100">
              {report.officialOverview.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <th scope="row" className="py-2.5 px-4 font-semibold text-slate-500 w-1/3 text-left bg-slate-50/40">
                    {row.label}
                  </th>
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* 8. CONTEXTUAL RECRUITMENTS & EXAMINATIONS (INTERNAL DISCOVERY HUB) */}
      {(relatedJobs.length > 0 || relatedExams.length > 0) && (
        <section className="rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/40 to-slate-50/80 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 font-bold text-sm text-[#013089]">
              <GraduationCap className="h-5 w-5 text-[#FE8D01]" />
              <span>{isHindi ? "संबंधित सरकारी नौकरियां एवं आगामी परीक्षाएं" : "Connected Government Jobs & Upcoming Exams"}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {isHindi ? "सूचना सेतु पर सक्रिय अवसर" : "Active on SuchnaSetu"}
            </span>
          </div>

          {/* Related Jobs Grid */}
          {relatedJobs.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#013089]" />
                <span>{isHindi ? "सक्रिय भर्ती सूचनाएं (Govt Jobs)" : "Active Recruitment Notices (Govt Jobs)"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#013089] hover:shadow-xs transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#013089] truncate">
                        {job.organization?.acronym || job.organization?.name || "Govt Recruitment"}
                      </div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#013089] line-clamp-2 leading-snug">
                        {job.title}
                      </h4>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{job.total_vacancies ? `${formatNumber(job.total_vacancies)} Posts` : "Govt Post"}</span>
                      <span className="font-bold text-[#013089] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Details <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Exams Grid */}
          {relatedExams.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#013089]" />
                <span>{isHindi ? "संबद्ध परीक्षा समय-सारणी एवं सिलेबस" : "Linked Exam Schedules & Syllabus"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedExams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/exams/${exam.slug}`}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#013089] hover:shadow-xs transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-[#013089] truncate">
                        {exam.organization?.acronym || exam.organization?.name || "Exam Board"}
                      </div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#013089] line-clamp-2 leading-snug">
                        {exam.title}
                      </h4>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="capitalize">{exam.mode ? exam.mode.replace("_", " ") : "Written / CBT"}</span>
                      <span className="font-bold text-[#013089] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Syllabus <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 9. Tags */}
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

      {/* 10. Related News Section */}
      {article.related_articles && article.related_articles.length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <RelatedNewsStrip articles={article.related_articles} />
        </div>
      )}

      {/* 11. Secondary Source Attribution & Provenance Reference */}
      <footer className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600 space-y-2 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-slate-800">
              {isHindi ? "आधिकारिक स्रोत संदर्भ: " : "Official Source Attribution: "}
              <span className="font-bold text-slate-900">{article.source_name}</span>
            </span>
          </div>

          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#013089] hover:underline"
            >
              <span>{isHindi ? "मूल स्रोत यूआरएल देखें" : "View Publisher Source Link"}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200/60 pt-2">
          {isHindi
            ? "सूचना सेतु पर प्रस्तुत विवरण आधिकारिक सार्वजनिक सूचनाओं एवं गजट विज्ञप्तियों के आधार पर संकलित किया गया है। प्राथमिक कॉपीराइट संबंधित प्राधिकरण के पास सुरक्षित है।"
            : "SuchnaSetu provides verified civic and public policy reports based on official notices. Primary publication and copyright remain with the respective government authority or publisher."}
        </p>
      </footer>
    </article>
  );
}
