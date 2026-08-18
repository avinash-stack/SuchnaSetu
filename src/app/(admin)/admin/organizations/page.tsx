import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Building2, ExternalLink, Globe } from "lucide-react";
import { AdminSearchInput } from "@/components/shared/admin-search-input";

interface AdminOrganizationsPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function AdminOrganizationsPage({ searchParams }: AdminOrganizationsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("organizations")
    .select("*, states_uts(*)")
    .order("name", { ascending: true });

  if (params.search && params.search.trim()) {
    const cleanTerm = params.search.replace(/[,()]/g, " ").trim();
    if (cleanTerm) {
      const term = `%${cleanTerm}%`;
      query = query.or(`name.ilike.${term},acronym.ilike.${term},jurisdiction.ilike.${term}`);
    }
  }

  const { data: orgs } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Organizations &amp; Commissions Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master registry of recruiting authorities, commissions (UPSC, SSC, State PSCs), ministries, and public enterprises.
          </p>
        </div>

        <AdminSearchInput
          placeholder="Search authority, acronym..."
          className="w-full sm:w-64"
        />
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
              {(orgs || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">
                    No organizations found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                (orgs || []).map((org: any) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
