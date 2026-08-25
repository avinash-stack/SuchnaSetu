"use client";

import * as React from "react";
import Link from "next/link";
import { ResultItem } from "@/modules/results/service";
import { useLanguage } from "@/lib/i18n/context";
import { resolveLocalizedItem } from "@/lib/i18n/localize";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FileCheck2, ExternalLink, Calendar } from "lucide-react";

interface ResultTableProps {
  items: ResultItem[];
}

export function ResultTable({ items }: ResultTableProps) {
  const { language, t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200 text-xs sm:text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-[46%]">Authority &amp; Recruitment Result</th>
              <th className="py-3.5 px-4 w-[20%]">State / Jurisdiction</th>
              <th className="py-3.5 px-4 w-[16%]">Status</th>
              <th className="py-3.5 px-4 w-[18%] text-right">Official Document</th>
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
                        href={`/jobs/${item.slug}`}
                        className="text-sm sm:text-base font-bold text-[#013089] hover:underline block leading-snug"
                      >
                        {item.title}
                      </Link>
                      {item.published_at && (
                        <p className="text-xs text-slate-400 font-mono">
                          Published: {formatDate(item.published_at)}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 align-middle text-xs sm:text-sm font-semibold text-slate-700">
                    {item.state_code || "National (Central)"}
                  </td>

                  <td className="py-4 px-4 align-middle">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      {t("common.declared")}
                    </span>
                  </td>

                  <td className="py-4 px-4 align-middle text-right">
                    {item.result_url ? (
                      <a
                        href={item.result_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>{t("common.gazette")}</span>
                      </a>
                    ) : (
                      <Link
                        href={`/jobs/${item.slug}`}
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
