import Link from "next/link";
import { getAdminBulletins } from "@/modules/bulletins/service";
import { AdminBulletinActions } from "@/modules/bulletins/components/admin-bulletin-actions";
import { BULLETIN_CATEGORIES } from "@/modules/bulletins/index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import {
  Newspaper,
  PlusCircle,
  Flame,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import { AdminSearchInput } from "@/components/shared/admin-search-input";

interface AdminBulletinsPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminBulletinsPage({ searchParams }: AdminBulletinsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const currentCategory = params.category || "all";
  const currentStatus = params.status || "all";

  const { bulletins, total, totalPages } = await getAdminBulletins({
    category: currentCategory,
    status: currentStatus,
    search: params.search,
    page: currentPage,
    limit: 15,
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Government News &amp; Bulletins Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish weekly Employment News (Rozgar Samachar) digests, candidate protest statements, court stay orders, and official press releases.
          </p>
        </div>

        <Link href="/admin/bulletins/new">
          <Button variant="brand" size="md" className="gap-2 font-semibold">
            <PlusCircle className="h-4 w-4" />
            <span>Publish New Bulletin</span>
          </Button>
        </Link>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href={`/admin/bulletins${params.search ? `?search=${encodeURIComponent(params.search)}` : ""}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              currentCategory === "all"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Categories
          </Link>

          {BULLETIN_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/admin/bulletins?category=${cat.key}${
                params.search ? `&search=${encodeURIComponent(params.search)}` : ""
              }`}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                currentCategory === cat.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat.badge}
            </Link>
          ))}
        </div>

        {/* Right: Search Input & Count Indicator */}
        <div className="flex items-center gap-3">
          <AdminSearchInput
            placeholder="Search news, summary..."
            className="w-full sm:w-64"
          />
          <div className="text-xs text-slate-500 font-medium shrink-0">
            Total: <span className="font-bold text-slate-800">{total}</span> bulletins
          </div>
        </div>
      </div>

      {/* Bulletins Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Headline / Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bulletins.length > 0 ? (
                bulletins.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="max-w-md">
                      <div className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {b.title}
                      </div>
                      {b.is_breaking && (
                        <Badge variant="danger" className="gap-1 text-[9px] mt-1">
                          <Flame className="h-2.5 w-2.5" />
                          <span>Breaking Ticker</span>
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge variant="brand" className="text-[10px] font-medium">
                        {b.category.replace("_", " ")}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600">
                      {b.source_name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={b.status === "published" ? "success" : b.status === "draft" ? "warning" : "default"}
                        className="text-[10px]"
                      >
                        {b.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600">
                      {formatDate(b.published_at)}
                    </TableCell>

                    <TableCell className="text-right">
                      <AdminBulletinActions
                        bulletinId={b.id}
                        slug={b.slug}
                        currentStatus={b.status}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                    No bulletins found. Click &quot;Publish New Bulletin&quot; above to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="text-xs text-slate-500">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/bulletins?page=${currentPage - 1}&category=${currentCategory}${
                  params.search ? `&search=${encodeURIComponent(params.search)}` : ""
                }`}
              >
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </Link>
            )}

            {currentPage < totalPages && (
              <Link
                href={`/admin/bulletins?page=${currentPage + 1}&category=${currentCategory}${
                  params.search ? `&search=${encodeURIComponent(params.search)}` : ""
                }`}
              >
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
