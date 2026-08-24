import Link from "next/link";
import { ComingSoonItem } from "@/modules/home/dynamic-sections";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  Hourglass,
  ArrowRight,
  MapPin,
  Timer,
} from "lucide-react";

interface ComingSoonSectionProps {
  items: ComingSoonItem[];
}

export function ComingSoonSection({ items }: ComingSoonSectionProps) {
  // CRITICAL REQUIREMENT: If there are no items, hide the section entirely
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-labelledby="coming-soon-heading">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <Hourglass className="h-4.5 w-4.5 text-amber-700" />
          </div>
          <div>
            <h2 id="coming-soon-heading" className="text-lg sm:text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>Upcoming Government Recruitment Applications</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500 text-white">
                Advance Notices
              </span>
            </h2>
          </div>
        </div>

        <Link
          href="/jobs"
          className="text-xs sm:text-sm font-semibold text-[#013089] hover:underline inline-flex items-center gap-1"
        >
          <span>View All Openings</span>
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
                <th className="py-3.5 px-4 w-[42%]">Recruitment Title</th>
                <th className="py-3.5 px-4 w-[18%]">Opening Date</th>
                <th className="py-3.5 px-4 w-[20%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/90 transition-colors group">
                  {/* Organization */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm sm:text-[15px] text-[#013089] group-hover:underline truncate block">
                        {item.authorityAcronym}
                      </span>
                      {item.stateCode ? (
                        <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{item.stateCode}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">All India</span>
                      )}
                    </div>
                  </td>

                  {/* Title & Countdown */}
                  <td className="py-4 px-4 align-top">
                    <Link
                      href={item.slug}
                      className="font-bold text-[15px] sm:text-base text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2 block"
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-bold text-amber-700 inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                        <Timer className="h-3 w-3" />
                        <span>Starts in {item.daysRemaining} {item.daysRemaining === 1 ? "day" : "days"}</span>
                      </span>
                      {item.totalVacancies && item.totalVacancies > 0 && (
                        <span className="text-slate-600 font-mono font-medium">
                          ({formatNumber(item.totalVacancies)} Vacancies)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-slate-900 font-mono text-xs sm:text-[13px] truncate">
                      {formatDate(item.expectedStartDate)}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <Link
                      href={item.slug}
                      className="inline-flex items-center justify-center font-bold rounded-lg h-8 px-3.5 text-xs sm:text-[13px] text-[#013089] bg-[#013089]/10 hover:bg-[#013089] hover:text-white border border-[#013089]/20 transition-all select-none gap-1.5 shadow-2xs"
                    >
                      <span>Notice</span>
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
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                  Starts in {item.daysRemaining}d
                </span>
              </div>

              <Link
                href={item.slug}
                className="block font-bold text-[15px] text-slate-900 hover:text-[#013089] transition-colors leading-snug line-clamp-2"
              >
                {item.title}
              </Link>

              <div className="flex items-center justify-between text-xs pt-2 text-slate-500 border-t border-slate-100">
                <span>Opens: {formatDate(item.expectedStartDate)}</span>

                <Link
                  href={item.slug}
                  className="inline-flex items-center gap-1 font-bold text-xs text-[#013089] hover:underline"
                >
                  <span>Advance Notice</span>
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
