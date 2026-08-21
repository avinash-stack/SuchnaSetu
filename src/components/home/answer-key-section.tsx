import Link from "next/link";
import { AnswerKeyItem } from "@/modules/home/dynamic-sections";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  KeyRound,
  ExternalLink,
  ArrowRight,
  FileCheck2,
  Calendar,
} from "lucide-react";

interface AnswerKeySectionProps {
  items: AnswerKeyItem[];
}

export function AnswerKeySection({ items }: AnswerKeySectionProps) {
  // CRITICAL REQUIREMENT: If there are no answer keys, hide the section entirely
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3" aria-labelledby="answer-key-heading">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
            <KeyRound className="h-4 w-4 text-teal-700" />
          </div>
          <div>
            <h2 id="answer-key-heading" className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>Official Answer Keys &amp; Response Sheets</span>
              <Badge variant="success" className="text-[10px] py-0 px-2 bg-teal-600 text-white font-bold">
                Declared
              </Badge>
            </h2>
          </div>
        </div>

        <Link
          href="/exams"
          className="text-xs font-semibold text-[#013089] hover:underline inline-flex items-center gap-1"
        >
          <span>View All Exams</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {/* Desktop & Tablet Table (Fixed Width - No Horizontal Scroll) */}
        <div className="hidden sm:block">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3 w-[22%]">Authority</th>
                <th className="py-2.5 px-3 w-[44%]">Exam Name &amp; Code</th>
                <th className="py-2.5 px-3 w-[16%]">Released Date</th>
                <th className="py-2.5 px-3 w-[18%] text-right">Official Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Authority */}
                  <td className="py-3 px-3 align-top">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[#013089] group-hover:underline truncate block">
                        {item.authorityAcronym}
                      </span>
                      {item.examCode && (
                        <span className="font-mono text-[10px] text-slate-500 font-semibold truncate">
                          {item.examCode}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-3 align-top">
                    <Link
                      href={item.slug}
                      className="font-bold text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 align-top">
                    <div className="flex items-center gap-1 text-slate-600 text-[11px] font-mono truncate">
                      <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                      <span>{formatDate(item.releasedAt)}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                    <a
                      href={item.answerKeyUrl}
                      target={item.answerKeyUrl.startsWith("http") ? "_blank" : undefined}
                      rel={item.answerKeyUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center font-bold rounded-md h-7 px-2.5 text-[11px] bg-teal-700 hover:bg-teal-800 text-white shadow-2xs transition-all gap-1"
                    >
                      <FileCheck2 className="h-3 w-3" />
                      <span>Answer Key</span>
                      {item.answerKeyUrl.startsWith("http") && <ExternalLink className="h-2.5 w-2.5" />}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked List View */}
        <div className="sm:hidden divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="p-3 space-y-2 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[11px] text-[#013089] bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100 truncate">
                  {item.authorityAcronym}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatDate(item.releasedAt)}
                </span>
              </div>

              <Link
                href={item.slug}
                className="block font-bold text-xs text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {item.title}
              </Link>

              <div className="pt-1 border-t border-slate-100 flex justify-end">
                <a
                  href={item.answerKeyUrl}
                  target={item.answerKeyUrl.startsWith("http") ? "_blank" : undefined}
                  rel={item.answerKeyUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 font-bold text-xs text-teal-700 hover:underline"
                >
                  <FileCheck2 className="h-3 w-3" />
                  <span>View Answer Key</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
