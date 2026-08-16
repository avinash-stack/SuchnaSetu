import Link from "next/link";
import { GovExamDetailed } from "../types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Building2,
  MapPin,
  Clock,
  Layers,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ExamCardProps {
  exam: GovExamDetailed;
}

export function ExamCard({ exam }: ExamCardProps) {
  const org = exam.organization;
  const stages = exam.stages || [];
  const importantDates = exam.important_dates || [];

  // Find next upcoming exam date or application end date
  const examStartDate = importantDates.find((d) => d.date_type === "exam_start");
  const appEndDate = importantDates.find((d) => d.date_type === "application_end");

  // Mode Display Formatter
  const formatMode = (mode: string) => {
    switch (mode) {
      case "online_cbt":
        return "Online Computer Based Test (CBT)";
      case "offline_omr":
        return "Offline OMR Sheet";
      case "pen_paper":
        return "Pen & Paper Conventional";
      case "hybrid":
        return "Hybrid (CBT + Written)";
      case "interview_only":
        return "Interview / Personality Test";
      default:
        return mode;
    }
  };

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden border border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md">
      {/* Featured Accent Strip */}
      {exam.is_featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 via-amber-500 to-brand-600" />
      )}

      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* Header Badges & Authority */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Building2 className="h-3.5 w-3.5 text-brand-600 flex-shrink-0" />
              <span>{org?.acronym ? `${org.acronym} • ${org.name}` : org?.name || "Official Commission"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {exam.is_featured && (
                <Badge variant="warning" className="gap-1 text-[10px] py-0 px-2">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Featured</span>
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] py-0 px-2 uppercase font-mono">
                {exam.exam_code || exam.frequency}
              </Badge>
            </div>
          </div>

          {/* Title */}
          <Link href={`/exams/${exam.slug}`} className="block group-hover:text-brand-700 transition-colors">
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 font-heading">
              {exam.title}
            </h3>
          </Link>

          {/* Short summary */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* Multi-stage & Mode Highlights */}
        <div className="rounded-lg bg-slate-50 p-3 space-y-2 text-xs border border-slate-100">
          <div className="flex items-center justify-between gap-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-slate-400" />
              <span>Stages:</span>
            </div>
            <span className="font-semibold text-slate-800">
              {stages.length > 0 ? `${stages.length} Stages Selection` : "Standard Evaluation"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Test Mode:</span>
            </div>
            <span className="font-semibold text-slate-800 truncate max-w-[170px]">
              {formatMode(exam.mode)}
            </span>
          </div>

          {exam.state_code && (
            <div className="flex items-center justify-between gap-2 text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Jurisdiction:</span>
              </div>
              <span className="font-semibold text-slate-800">
                {exam.state?.name || exam.state_code}
              </span>
            </div>
          )}
        </div>

        {/* Footer Dates & Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <div className="space-y-0.5">
            {examStartDate ? (
              <div className="flex items-center gap-1 text-slate-700 font-medium">
                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                <span>Exam: {formatDate(examStartDate.event_date)}</span>
              </div>
            ) : appEndDate ? (
              <div className="flex items-center gap-1 text-slate-700 font-medium">
                <Calendar className="h-3.5 w-3.5 text-amber-600" />
                <span>Last Date: {formatDate(appEndDate.event_date)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>Published: {formatDate(exam.published_at)}</span>
              </div>
            )}
          </div>

          <Link
            href={`/exams/${exam.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800 transition-colors group-hover:translate-x-0.5"
          >
            <span>View Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
