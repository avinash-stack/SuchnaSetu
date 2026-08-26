import * as React from "react";
import Link from "next/link";
import { Languages } from "lucide-react";

interface NewsLanguageFilterProps {
  currentLang?: "en" | "hi";
  pathname?: string;
  searchParams?: Record<string, string | undefined>;
}

export function NewsLanguageFilter({
  currentLang = "en",
  pathname = "/news",
  searchParams = {},
}: NewsLanguageFilterProps) {
  const createLangUrl = (lang: "en" | "hi") => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && key !== "lang") {
        params.set(key, val);
      }
    });
    if (lang === "hi") {
      params.set("lang", "hi");
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const isHindi = currentLang === "hi";

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5 font-bold text-slate-700">
        <Languages className="h-3.5 w-3.5 text-[#013089]" />
        <span>{isHindi ? "भाषा:" : "Language:"}</span>
      </div>

      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100/70 p-0.5">
        <Link
          href={createLangUrl("en")}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
            !isHindi
              ? "bg-white text-[#013089] shadow-2xs border border-slate-200/60"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          English
        </Link>
        <Link
          href={createLangUrl("hi")}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
            isHindi
              ? "bg-[#013089] text-white shadow-2xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          हिंदी
        </Link>
      </div>
    </div>
  );
}
