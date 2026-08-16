import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Building2, ExternalLink, Globe } from "lucide-react";

export default async function AdminOrganizationsPage() {
  const supabase = await createClient();
  const { data: orgs } = await supabase
    .from("organizations")
    .select("*, states_uts(*)")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Organizations & Commissions Registry
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Master registry of recruiting authorities, commissions (UPSC, SSC, State PSCs), ministries, and public enterprises.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization Name</TableHead>
                <TableHead>Acronym</TableHead>
                <TableHead>Jurisdiction</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Official Website</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(orgs || []).map((org: any) => (
                <TableRow key={org.id}>
                  <TableCell className="font-semibold text-slate-900 text-sm">
                    {org.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="brand" className="font-mono text-xs">
                      {org.acronym || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs uppercase font-medium text-slate-600">
                    {org.jurisdiction}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {org.states_uts ? org.states_uts.name : "Central"}
                  </TableCell>
                  <TableCell>
                    {org.website_url ? (
                      <a
                        href={org.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-700 hover:underline"
                      >
                        <span>{org.website_url.replace(/^https?:\/\//, "")}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={org.is_active ? "success" : "default"} className="text-[10px]">
                      {org.is_active ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
