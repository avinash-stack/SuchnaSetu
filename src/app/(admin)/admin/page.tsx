import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Calendar,
  Newspaper,
  PlusCircle,
  Activity,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [jobsCountRes, examsCountRes, bulletinsCountRes, sourcesRes, recentLogsRes] =
    await Promise.all([
      supabase.from("gov_jobs").select("*", { count: "exact", head: true }),
      supabase.from("gov_exams").select("*", { count: "exact", head: true }),
      supabase.from("public_bulletins").select("*", { count: "exact", head: true }),
      supabase.from("import_sources").select("id, is_enabled"),
      supabase
        .from("audit_logs")
        .select("*, admin_profiles(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const totalJobs = jobsCountRes.count || 0;
  const totalExams = examsCountRes.count || 0;
  const totalBulletins = bulletinsCountRes.count || 0;
  const allSources = sourcesRes.data || [];
  const activeSourcesCount = allSources.filter((s: any) => s.is_enabled).length;
  const totalSourcesCount = allSources.length;
  const recentLogs = recentLogsRes.data || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading sm:text-3xl">
              Administrative Overview
            </h1>
            <Badge variant="success" className="gap-1 text-[11px] font-semibold py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Healthy</span>
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish official notices, manage multi-stage exams, monitor 28 automated ingestion pipelines, and audit system mutations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/jobs/new">
            <Button variant="brand" size="md" className="gap-1.5 text-xs font-semibold shadow-xs">
              <PlusCircle className="h-4 w-4" />
              <span>New Job Notice</span>
            </Button>
          </Link>

          <Link href="/admin/exams/new">
            <Button variant="outline" size="md" className="gap-1.5 text-xs font-semibold shadow-xs">
              <PlusCircle className="h-4 w-4 text-slate-600" />
              <span>New Examination</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row (4 Columns) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Jobs Card */}
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Government Jobs
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {totalJobs}
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link
                href="/admin/jobs"
                className="text-xs font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <span>Manage Notices</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Badge variant="success" className="text-[10px]">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Exams Card */}
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Exams & Notifications
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {totalExams}
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link
                href="/admin/exams"
                className="text-xs font-medium text-purple-700 hover:text-purple-800 flex items-center gap-1"
              >
                <span>Manage Exams & Notices</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Badge variant="brand" className="text-[10px]">
                Multi-Stage
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Bulletins Card */}
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Bulletins & News
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {totalBulletins}
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Newspaper className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link
                href="/admin/bulletins"
                className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>News Desk</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Badge variant="warning" className="text-[10px]">
                Advisories
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Ingestion Pipelines Card */}
        <Card className="shadow-xs border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ingestion Feeds
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {activeSourcesCount} / {totalSourcesCount}
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <RefreshCw className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link
                href="/admin/sources"
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Sources Hub</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Badge variant="success" className="text-[10px]">
                28 Sources
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Audit Trail */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-slate-700" />
              <CardTitle className="text-base font-bold text-slate-900 font-heading">
                Recent Administrative Mutations & Ingestion Audits
              </CardTitle>
            </div>
            <Link href="/admin/audit-logs">
              <Button variant="ghost" size="sm" className="text-xs text-brand-700 font-semibold">
                <span>View Full Audit Log</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Immutable log of state changes, publications, and ingestion pipeline synchronizations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Summary / Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.length > 0 ? (
                recentLogs.map((log: any) => (
                  <TableRow key={log.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-xs font-mono text-slate-500 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-900">
                      {log.admin_profiles?.full_name || log.admin_profiles?.email || "System / Ingestion"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono bg-slate-50">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-mono">
                      {log.entity_type}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 max-w-xs truncate">
                      {log.changes_summary || (log.metadata ? JSON.stringify(log.metadata) : "—")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                    No recent administrative logs recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
