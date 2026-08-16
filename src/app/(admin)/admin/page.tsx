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
  Globe,
  ScrollText,
  PlusCircle,
  ShieldCheck,
  Activity,
  ArrowRight,
  Newspaper,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [jobsCountRes, bulletinsCountRes, orgsCountRes, recentLogsRes] = await Promise.all([
    supabase.from("gov_jobs").select("*", { count: "exact", head: true }),
    supabase.from("public_bulletins").select("*", { count: "exact", head: true }),
    supabase.from("organizations").select("*", { count: "exact", head: true }),
    supabase.from("audit_logs").select("*, admin_profiles(full_name, email)").order("created_at", { ascending: false }).limit(6),
  ]);

  const totalJobs = jobsCountRes.count || 0;
  const totalBulletins = bulletinsCountRes.count || 0;
  const totalOrgs = orgsCountRes.count || 0;
  const recentLogs = recentLogsRes.data || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading sm:text-3xl">
            Administrative Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish official notices, manage organizations, audit state changes, and configure modules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/jobs/new">
            <Button variant="brand" size="md" className="gap-1.5 text-xs font-semibold">
              <PlusCircle className="h-4 w-4" />
              <span>New Job Notice</span>
            </Button>
          </Link>

          <Link href="/admin/bulletins/new">
            <Button variant="outline" size="md" className="gap-1.5 text-xs font-semibold">
              <PlusCircle className="h-4 w-4 text-slate-600" />
              <span>New Bulletin</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Government Job Notices
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {totalJobs}
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link href="/admin/jobs" className="text-xs font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1">
                <span>Manage Notices</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Badge variant="success" className="text-[10px]">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Bulletins & Advisories
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {totalBulletins}
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Newspaper className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link href="/admin/bulletins" className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1">
                <span>Manage Bulletins</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Badge variant="brand" className="text-[10px]">News Desk</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Recruiting Authorities
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-heading">
                  {totalOrgs}
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <Link href="/admin/organizations" className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                <span>View Authorities</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Badge variant="outline" className="text-[10px]">Commissions</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Audit Trail */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-700" />
              <CardTitle className="text-base font-bold text-slate-900">
                Recent Administrative Actions
              </CardTitle>
            </div>
            <Link href="/admin/audit-logs">
              <Button variant="ghost" size="sm" className="text-xs text-brand-700">
                <span>View Full Audit Log</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription className="text-xs">
            Cryptographically recorded mutations and state changes across all platform entities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.length > 0 ? (
                recentLogs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs font-mono text-slate-500 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-900">
                      {log.admin_profiles?.full_name || log.admin_profiles?.email || "System"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-mono">
                      {log.entity_type}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-xs truncate font-mono">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
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
