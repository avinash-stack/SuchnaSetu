import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { SYSTEM_MODULES } from "@/lib/constants";
import { Settings, ShieldCheck, Database, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          System & Module Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Platform-wide settings, module routing, database connectivity, and security configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* System Health Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Database & RLS Health
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Database Engine</span>
              <span className="font-semibold text-slate-800">Supabase PostgreSQL 15+</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Row Level Security</span>
              <Badge variant="success" className="text-[10px]">
                Enforced (12 Tables)
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Master Taxonomies</span>
              <span className="font-semibold text-slate-800">36 States / 8 Categories</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Super Admin User</span>
              <span className="font-mono text-brand-700">admin@suchnasetu.in</span>
            </div>
          </CardContent>
        </Card>

        {/* Security & Access Policies Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Security & Access Policies
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Public Access</span>
              <Badge variant="default" className="text-[10px]">
                Anonymous Read (Zero Login)
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Admin Authentication</span>
              <Badge variant="brand" className="text-[10px]">
                Supabase SSR Cookies
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Edge Middleware Protection</span>
              <Badge variant="success" className="text-[10px]">
                Active on /admin/*
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Audit Trail Logging</span>
              <Badge variant="success" className="text-[10px]">
                Active (All Mutations)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Registry Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-slate-900">
            Platform Modules Architecture Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module Key</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Route Path</TableHead>
                <TableHead>Architecture Phase</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SYSTEM_MODULES.map((mod) => (
                <TableRow key={mod.key}>
                  <TableCell className="font-mono text-xs font-semibold">{mod.key}</TableCell>
                  <TableCell className="font-medium text-slate-900 text-xs">{mod.title}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{mod.href}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {mod.status === "active" ? "Phase 2 (Current)" : "Phase 3+"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={mod.status === "active" ? "success" : "default"} className="text-[10px]">
                      {mod.status === "active" ? "Implemented" : "Architecture Ready"}
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
