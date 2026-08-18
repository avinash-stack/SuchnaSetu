import Link from "next/link";
import { getAdminExams } from "@/modules/exams/service";
import { AdminExamActions } from "@/modules/exams/components/admin-exam-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  PlusCircle,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { AdminSearchInput } from "@/components/shared/admin-search-input";

interface AdminExamsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminExamsPage({ searchParams }: AdminExamsPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10) || 1;
  const currentStatus = params.status || "all";

  const { exams, total, totalPages } = await getAdminExams({
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
            Exams & Notifications Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish standardized examination calendars, syllabus summaries, pattern guidelines, and important date cycles.
          </p>
        </div>

        <Link href="/admin/exams/new">
          <Button variant="brand" size="md" className="gap-2 font-semibold">
            <PlusCircle className="h-4 w-4" />
            <span>Create New Exam Notice</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { label: "All Exams", value: "all" },
            { label: "Published", value: "published" },
            { label: "Drafts", value: "draft" },
            { label: "Archived", value: "archived" },
            { label: "Trash", value: "trash" },
          ].map((tab) => {
            const isActive = currentStatus === tab.value;
            return (
              <Link
                key={tab.value}
                href={`/admin/exams?status=${tab.value}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
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
            placeholder="Search exam title, code..."
            className="w-full sm:w-64"
          />
          <div className="text-xs text-slate-500 font-medium shrink-0">
            Total: <span className="font-bold text-slate-800">{total}</span> records
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Examination Title & Authority</TableHead>
                <TableHead className="text-center">Mode & Code</TableHead>
                <TableHead className="text-center">Stages</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Published / Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-xs text-slate-500">
                    No examination records found matching this status or filter.
                  </TableCell>
                </TableRow>
              ) : (
                exams.map((exam: any) => {
                  const org = exam.organization;
                  const stages = exam.stages || [];
                  const isDeleted = Boolean(exam.deleted_at);

                  return (
                    <TableRow key={exam.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/exams/${exam.id}/edit`}
                              className="font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                            >
                              {exam.title}
                            </Link>
                            {exam.is_featured && (
                              <Badge variant="warning" className="text-[10px] py-0 px-1.5">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-brand-700">
                              {org?.acronym || org?.name || "Official Authority"}
                            </span>
                            {exam.department?.name && (
                              <>
                                <span>•</span>
                                <span>{exam.department.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="space-y-0.5 text-xs">
                          <span className="font-mono text-slate-600 font-medium">
                            {exam.exam_code || exam.frequency}
                          </span>
                          <div className="text-[11px] text-slate-400 capitalize">
                            {exam.mode.replace("_", " ")}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs font-semibold">
                          {stages.length} Stages
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        {isDeleted ? (
                          <Badge variant="danger">Trash</Badge>
                        ) : exam.status === "published" ? (
                          <Badge variant="success">Published</Badge>
                        ) : exam.status === "draft" ? (
                          <Badge variant="warning">Draft</Badge>
                        ) : (
                          <Badge variant="outline">{exam.status}</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-center text-xs text-slate-500">
                        {formatDate(exam.published_at || exam.updated_at)}
                      </TableCell>

                      <TableCell className="text-right">
                        <AdminExamActions exam={exam} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="text-xs text-slate-500">
            Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/exams?page=${currentPage - 1}${
                  currentStatus ? `&status=${currentStatus}` : ""
                }${params.search ? `&search=${params.search}` : ""}`}
              >
                <Button variant="outline" size="sm" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </Link>
            )}

            {currentPage < totalPages && (
              <Link
                href={`/admin/exams?page=${currentPage + 1}${
                  currentStatus ? `&status=${currentStatus}` : ""
                }${params.search ? `&search=${params.search}` : ""}`}
              >
                <Button variant="outline" size="sm" className="gap-1">
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
