import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ScrollText, ShieldCheck } from "lucide-react";

export default async function AdminAuditLogsPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*, admin_profiles(full_name, email, role)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable cryptographic log of editorial modifications, status transitions, and publications.
          </p>
        </div>
        <Badge variant="brand" className="text-xs">
          Last 50 Events
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Admin User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Metadata / Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(logs || []).length > 0 ? (
                logs?.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-800">
                      {log.admin_profiles?.full_name || log.admin_profiles?.email || "System"}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {log.admin_profiles?.role || "admin"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px] font-bold">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 font-mono">
                      {log.entity_type}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 max-w-xs truncate font-mono">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                    No audit log records found. Actions performed by administrators will appear here automatically.
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
