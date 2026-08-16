import { ExamImportantDate } from "../types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Award,
  Key,
  Edit3,
} from "lucide-react";

interface ExamTimelineProps {
  dates: ExamImportantDate[];
}

export function ExamTimeline({ dates }: ExamTimelineProps) {
  if (!dates || dates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
        No official timeline milestones published yet for this examination.
      </div>
    );
  }

  const now = new Date();

  // Helper for icons based on event type
  const getEventIcon = (type: string, isPast: boolean) => {
    if (isPast) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }
    switch (type) {
      case "notification_release":
        return <FileCheck className="h-4 w-4 text-blue-600" />;
      case "application_start":
      case "application_end":
        return <Edit3 className="h-4 w-4 text-brand-600" />;
      case "admit_card_release":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "exam_start":
      case "exam_end":
        return <Calendar className="h-4 w-4 text-indigo-600" />;
      case "answer_key_release":
        return <Key className="h-4 w-4 text-purple-600" />;
      case "result_declaration":
        return <Award className="h-4 w-4 text-emerald-600" />;
      default:
        return <Calendar className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {dates.map((item, idx) => {
        const itemDate = new Date(item.event_date);
        const isPast = itemDate < now && !item.is_tentative;

        return (
          <div key={item.id || idx} className="relative group">
            {/* Dot Indicator */}
            <div
              className={`absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white ${
                isPast
                  ? "border-emerald-500 text-emerald-600"
                  : item.is_tentative
                  ? "border-amber-400 text-amber-500"
                  : "border-brand-600 text-brand-600"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  isPast
                    ? "bg-emerald-500"
                    : item.is_tentative
                    ? "bg-amber-400"
                    : "bg-brand-600"
                }`}
              />
            </div>

            {/* Content Box */}
            <div
              className={`rounded-xl border p-4 transition-all ${
                isPast
                  ? "border-slate-200 bg-slate-50/50"
                  : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getEventIcon(item.date_type, isPast)}
                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    {item.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {item.is_tentative && (
                    <Badge variant="warning" className="text-[10px] py-0 px-2">
                      Tentative Date
                    </Badge>
                  )}
                  {isPast ? (
                    <Badge variant="success" className="text-[10px] py-0 px-2">
                      Concluded
                    </Badge>
                  ) : (
                    <Badge variant="brand" className="text-[10px] py-0 px-2">
                      Upcoming
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDate(item.event_date)}</span>
                </span>
                {item.event_time && (
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{item.event_time}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
