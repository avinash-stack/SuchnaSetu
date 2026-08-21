import Link from "next/link";
import { SyllabusItem } from "@/modules/home/dynamic-sections";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ArrowRight,
  Award,
} from "lucide-react";

interface SyllabusSectionProps {
  items: SyllabusItem[];
}

export function SyllabusSection({ items }: SyllabusSectionProps) {
  // CRITICAL REQUIREMENT: If there are no syllabus items, hide the section entirely
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3" aria-labelledby="syllabus-heading">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
            <BookOpen className="h-4 w-4 text-blue-700" />
          </div>
          <div>
            <h2 id="syllabus-heading" className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>Exam Pattern &amp; Verified Syllabus</span>
              <Badge variant="navy" className="text-[10px] py-0 px-2 font-bold">
                Official Gazettes
              </Badge>
            </h2>
          </div>
        </div>

        <Link
          href="/exams"
          className="text-xs font-semibold text-[#013089] hover:underline inline-flex items-center gap-1"
        >
          <span>Browse All Exams</span>
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
                <th className="py-2.5 px-3 w-[44%]">Exam Name &amp; Syllabus</th>
                <th className="py-2.5 px-3 w-[18%]">Marking / Pattern</th>
                <th className="py-2.5 px-3 w-[16%] text-right">Action</th>
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
                        <span className="font-mono text-[10px] text-slate-500 font-semibold truncate block">
                          {item.examCode}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Exam Title & Syllabus snippet */}
                  <td className="py-3 px-3 align-top">
                    <Link
                      href={`${item.slug}#syllabus`}
                      className="font-bold text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-[10px] text-slate-500 line-clamp-1 font-mono">
                      {item.syllabusSummary}
                    </p>
                  </td>

                  {/* Marking / Pattern */}
                  <td className="py-3 px-3 align-top">
                    {item.markingScheme ? (
                      <div className="text-[10px] text-amber-800 flex items-center gap-1 font-semibold truncate">
                        <Award className="h-3 w-3 shrink-0 text-amber-600" />
                        <span className="truncate">{item.markingScheme}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Official Pattern</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                    <Link
                      href={`${item.slug}#syllabus`}
                      className="inline-flex items-center justify-center font-bold rounded-md h-7 px-2.5 text-[11px] text-[#013089] bg-brand-50/50 hover:bg-[#013089] hover:text-white border border-[#013089]/30 transition-all select-none gap-1"
                    >
                      <span>Syllabus</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
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
                {item.examCode && (
                  <span className="text-[10px] font-mono text-slate-500 truncate">
                    {item.examCode}
                  </span>
                )}
              </div>

              <Link
                href={`${item.slug}#syllabus`}
                className="block font-bold text-xs text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {item.title}
              </Link>

              <div className="pt-1 border-t border-slate-100 flex justify-end">
                <Link
                  href={`${item.slug}#syllabus`}
                  className="inline-flex items-center gap-1 font-bold text-xs text-[#013089] hover:underline"
                >
                  <span>View Full Syllabus</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
