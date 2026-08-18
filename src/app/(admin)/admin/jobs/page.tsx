import Link from "next/link";
import { getAdminJobs } from "@/modules/jobs/service";
import { AdminJobActions } from "@/modules/jobs/components/admin-job-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import { AdminSearchInput } from "@/components/shared/admin-search-input";

interface AdminJobsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminJobsPage({ searchParams }: AdminJobsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const currentStatus = params.status || "all";

  const { jobs, total, totalPages } = await getAdminJobs({
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
            Government Jobs Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, verify, publish, soft-delete, and audit structured official recruitment notices.
          </p>
        </div>

        <Link href="/admin/jobs/new">
          <Button variant="brand" size="md" className="gap-2 font-semibold">
            <PlusCircle className="h-4 w-4" />
            <span>Create New Job Notice</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { label: "All Notices", value: "all" },
            { label: "Published", value: "published" },
            { label: "Drafts", value: "draft" },
            { label: "Archived", value: "archived" },
            { label: "Trash", value: "trash" },
          ].map((tab) => {
            const isActive = currentStatus === tab.value;
            return (
              <Link
                key={tab.value}
                href={`/admin/jobs?status=${tab.value}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Search Input & Count Indicator */}
        <div className="flex items-center gap-3">
          <AdminSearchInput
            placeholder="Search title, notice no..."
            className="w-full sm:w-64"
          />
          <div className="text-xs text-slate-500 font-medium shrink-0">
            Total: <span className="font-bold text-slate-800">{total}</span> records
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Notice Title</TableHead>
                <TableHead>Organization / Dept</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Vacancies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job.id} className={job.deleted_at ? "bg-red-50/30" : undefined}>
                    <TableCell className="max-w-md">
                      <div className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {job.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        {job.notification_number && (
                          <span className="font-mono">Ref: {job.notification_number}</span>
                        )}
                        {job.category && (
                          <>
                            <span>•</span>
                            <span>{job.category.name}</span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <Badge variant="outline" className="text-xs font-semibold">
                          {job.organization?.acronym || job.organization?.name || "Govt"}
                        </Badge>
                        {job.department && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {job.department.name}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600">
                      {job.qualification ? (
                        <span className="font-medium text-slate-800">{job.qualification.name}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>

                    <TableCell className="font-bold text-emerald-700 text-xs">
                      {formatNumber(job.total_vacancies)} Posts
                    </TableCell>

                    <TableCell>
                      {job.deleted_at ? (
                        <Badge variant="danger" className="text-[10px]">
                          In Trash
                        </Badge>
                      ) : job.status === "published" ? (
                        <Badge variant="success" className="text-[10px]">
                          Published
                        </Badge>
                      ) : job.status === "draft" ? (
                        <Badge variant="warning" className="text-[10px]">
                          Draft
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-[10px]">
                          Archived
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600">
                      {formatDate(job.application_end_date)}
                    </TableCell>

                    <TableCell className="text-right">
                      <AdminJobActions
                        jobId={job.id}
                        slug={job.slug}
                        currentStatus={job.status}
                        isDeleted={Boolean(job.deleted_at)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No government job notices found in this view.
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
                href={`/admin/jobs?page=${currentPage - 1}&status=${currentStatus}${
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
                href={`/admin/jobs?page=${currentPage + 1}&status=${currentStatus}${
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
