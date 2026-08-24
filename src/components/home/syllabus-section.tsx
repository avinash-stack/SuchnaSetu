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
    <section className="space-y-4" aria-labelledby="syllabus-heading">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-800">
            <BookOpen className="h-4.5 w-4.5 text-blue-700" />
          </div>
          <div>
            <h2 id="syllabus-heading" className="text-lg sm:text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>Exam Pattern &amp; Official Syllabus</span>
              <Badge variant="navy" className="text-xs py-0.5 px-2.5 font-bold">
                Official Gazettes
              </Badge>
            </h2>
          </div>
        </div>

        <Link
          href="/exams"
          className="text-xs sm:text-sm font-semibold text-[#013089] hover:underline inline-flex items-center gap-1"
        >
          <span>Browse All Exams</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Desktop & Tablet Table */}
        <div className="hidden sm:block">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/90 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-700">
                <th className="py-3.5 px-4 w-[20%]">Authority</th>
                <th className="py-3.5 px-4 w-[42%]">Exam Name &amp; Syllabus</th>
                <th className="py-3.5 px-4 w-[18%]">Marking / Pattern</th>
                <th className="py-3.5 px-4 w-[20%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/90 transition-colors group">
                  {/* Authority */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm sm:text-[15px] text-[#013089] group-hover:underline truncate block">
                        {item.authorityAcronym}
                      </span>
                      {item.examCode && (
                        <span className="font-mono text-xs text-slate-500 font-semibold truncate block">
                          {item.examCode}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Exam Title & Syllabus snippet */}
                  <td className="py-4 px-4 align-top">
                    <Link
                      href={`${item.slug}#syllabus`}
                      className="font-bold text-[15px] sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1.5 text-xs text-slate-600 line-clamp-1 leading-relaxed">
                      {item.syllabusSummary}
                    </p>
                  </td>

                  {/* Marking / Pattern */}
                  <td className="py-4 px-4 align-top">
                    {item.markingScheme ? (
                      <div className="text-xs text-amber-800 flex items-center gap-1.5 font-semibold truncate">
                        <Award className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                        <span className="truncate">{item.markingScheme}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Standard Pattern</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <Link
                      href={`${item.slug}#syllabus`}
                      className="inline-flex items-center justify-center font-bold rounded-lg h-8 px-3.5 text-xs sm:text-[13px] text-[#013089] bg-[#013089]/10 hover:bg-[#013089] hover:text-white border border-[#013089]/20 transition-all select-none gap-1.5 shadow-2xs"
                    >
                      <span>Syllabus</span>
                      <ArrowRight className="h-3.5 w-3.5" />
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
            <div key={item.id} className="p-4 space-y-2.5 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-[#013089] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 truncate">
                  {item.authorityAcronym}
                </span>
                {item.examCode && (
                  <span className="text-xs font-mono text-slate-600 truncate font-semibold">
                    {item.examCode}
                  </span>
                )}
              </div>

              <Link
                href={`${item.slug}#syllabus`}
                className="block font-bold text-[15px] text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {item.title}
              </Link>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Link
                  href={`${item.slug}#syllabus`}
                  className="inline-flex items-center gap-1 font-bold text-xs text-[#013089] hover:underline"
                >
                  <span>View Full Syllabus</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
