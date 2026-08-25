"use client";

import * as React from "react";
import Link from "next/link";
import { AdmitCardItem } from "@/modules/admit-cards/service";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedItem } from "@/lib/i18n/localize";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Calendar } from "lucide-react";

interface AdmitCardTableProps {
  items: AdmitCardItem[];
}

export function AdmitCardTable({ items }: AdmitCardTableProps) {
  const { language, t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-[46%]">Authority &amp; Examination</th>
              <th className="py-3.5 px-4 w-[20%]">State / Jurisdiction</th>
              <th className="py-3.5 px-4 w-[16%]">Status</th>
              <th className="py-3.5 px-4 w-[18%] text-right">Official Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {items.map((rawItem) => {
              const item = resolveLocalizedItem(rawItem, language);
              const orgName = item.organization?.acronym || item.organization?.name || "Official Body";
              return (
                <tr key={item.id} className="hover:bg-slate-50/90 transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="brand" className="text-xs font-bold py-0.5 px-2 bg-[#013089] text-white">
                          {orgName}
                        </Badge>
                        {item.code && (
                          <span className="font-mono text-xs text-slate-500 font-semibold">
                            {item.code}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/exams/${item.slug}`}
                        className="text-sm sm:text-base font-bold text-[#013089] hover:underline block leading-snug"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle text-xs sm:text-sm font-semibold text-slate-700">
                    {item.state_code || "National (Central)"}
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                        {t("portal.tab_admit")}
                      </span>
                      {item.published_at && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.published_at)}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle text-right">
                    {item.admit_card_url ? (
                      <a
                        href={item.admit_card_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FE8D01] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#e07c00] transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>{t("common.download")}</span>
                      </a>
                    ) : (
                      <Link
                        href={`/exams/${item.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        <span>{t("common.view_details")}</span>
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
