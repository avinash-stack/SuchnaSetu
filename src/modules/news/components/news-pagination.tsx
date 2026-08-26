"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentLimit: number;
  lang?: "en" | "hi";
}

export function NewsPagination({
  currentPage,
  totalPages,
  totalItems,
  currentLimit,
  lang = "en",
}: NewsPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isHindi = lang === "hi";

  const createPageUrl = (page: number, limit = currentLimit) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (lang && lang !== "en") {
      params.set("lang", lang);
    }
    return `${pathname}?${params.toString()}`;
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("page", "1");
    params.set("limit", newLimit.toString());
    if (lang && lang !== "en") {
      params.set("lang", lang);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Generate compact page range (e.g. 1 ... 4 5 6 ... 10)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Number of pages to show around current page

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const visiblePages = getVisiblePages();

  const startItem = totalItems > 0 ? (currentPage - 1) * currentLimit + 1 : 0;
  const endItem = Math.min(currentPage * currentLimit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-slate-200 text-xs text-slate-600">
      {/* 1. Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-700">
          {isHindi ? "प्रति पृष्ठ लेख:" : "Articles per page:"}
        </span>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {[20, 50, 100].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleLimitChange(size)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                currentLimit === size
                  ? "bg-[#013089] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Showing Summary Range */}
      <div className="text-slate-500 font-medium">
        {isHindi ? (
          <>
            कुल <span className="font-bold text-slate-800">{totalItems}</span> में से{" "}
            <span className="font-bold text-slate-800">{startItem}–{endItem}</span> समाचार
          </>
        ) : (
          <>
            Showing <span className="font-bold text-slate-800">{startItem}–{endItem}</span> of{" "}
            <span className="font-bold text-slate-800">{totalItems}</span> articles
          </>
        )}
      </div>

      {/* 3. Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex items-center gap-1" aria-label="News Pagination">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{isHindi ? "पिछला" : "Previous"}</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100/60 text-slate-300 font-bold cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{isHindi ? "पिछला" : "Previous"}</span>
            </span>
          )}

          {/* Compact Page Number Buttons */}
          <div className="flex items-center gap-1">
            {visiblePages.map((page, idx) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1 text-slate-400 font-bold">
                    …
                  </span>
                );
              }

              const pageNum = Number(page);
              const isActive = pageNum === currentPage;

              return (
                <Link
                  key={`page-${pageNum}`}
                  href={createPageUrl(pageNum)}
                  className={`h-8 w-8 inline-flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#013089] text-white shadow-2xs"
                      : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-colors"
            >
              <span className="hidden sm:inline">{isHindi ? "अगला" : "Next"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-100/60 text-slate-300 font-bold cursor-not-allowed">
              <span className="hidden sm:inline">{isHindi ? "अगला" : "Next"}</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
