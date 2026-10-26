import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { dispatchGitHubSyncWorkflow } from "@/lib/github/dispatch";

export const dynamic = "force-dynamic";

const VALID_SYNC_TYPES = ["full", "news", "jobs", "exams", "resources", "source"] as const;

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user and verify active administrator profile
    const admin = await getCurrentAdminProfile();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active administrator permissions required." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const syncType = (body.type || "news").toLowerCase();
    const sourceId = body.sourceId?.trim() || undefined;
    const reason = body.reason || `Manual trigger by admin: ${admin.email || admin.id}`;

    // 2. Validate sync type
    if (!VALID_SYNC_TYPES.includes(syncType as any)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid sync type "${syncType}". Supported types: ${VALID_SYNC_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 3. If source-specific sync, validate source existence and status
    if (syncType === "source") {
      if (!sourceId) {
        return NextResponse.json(
          { success: false, error: "Missing required 'sourceId' parameter for source-targeted sync." },
          { status: 400 }
        );
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sourceId);
      let sourceQuery = (supabase.from("import_sources") as any)
        .select("id, code, name, is_enabled");

      if (isUuid) {
        sourceQuery = sourceQuery.eq("id", sourceId);
      } else {
        sourceQuery = sourceQuery.eq("code", sourceId);
      }

      const { data: source, error: sourceErr } = await sourceQuery.maybeSingle();

      if (sourceErr || !source) {
        return NextResponse.json(
          { success: false, error: `Import source "${sourceId}" was not found.` },
          { status: 404 }
        );
      }

      if (!source.is_enabled) {
        return NextResponse.json(
          { success: false, error: `Import source "${source.name}" is currently disabled.` },
          { status: 400 }
        );
      }
    }

    // 4. Concurrency Guard: Check for active running jobs within safe execution window (35m)
    const cutoffTime = new Date(Date.now() - 35 * 60 * 1000).toISOString();
    const { data: activeJobs } = await (supabase.from("import_jobs") as any)
      .select("id, started_at, import_sources(name, code)")
      .eq("status", "running")
      .gt("created_at", cutoffTime)
      .limit(1);

    if (activeJobs && activeJobs.length > 0 && (syncType === "full" || syncType === "jobs" || syncType === "exams")) {
      const activeJob = activeJobs[0];
      return NextResponse.json(
        {
          success: false,
          error: `A synchronization run is currently active on GitHub Actions (Job: ${activeJob.id}). Wait for completion before launching another full sync.`,
          activeJobId: activeJob.id,
        },
        { status: 409 }
      );
    }

    // 5. Dispatch workflow execution to GitHub Actions runner
    const dispatchResult = await dispatchGitHubSyncWorkflow({
      syncType: syncType as any,
      sourceId,
      reason,
    });

    if (!dispatchResult.success) {
      const statusCode = dispatchResult.error?.includes("GITHUB_DISPATCH_TOKEN") ? 503 : 502;
      return NextResponse.json(
        {
          success: false,
          error: dispatchResult.error,
          executionMode: "github_actions_runner",
        },
        { status: statusCode }
      );
    }

    // 6. Record admin audit log
    try {
      await (supabase.from("audit_logs") as any).insert({
        admin_id: admin.id,
        action: "DISPATCH_GITHUB_SYNC",
        entity_type: "workflows",
        entity_id: dispatchResult.workflow,
        metadata: {
          syncType,
          sourceId,
          reason,
          runUrl: dispatchResult.runUrl,
        },
      });
    } catch (auditErr) {
      console.warn("Audit log warning on sync dispatch:", auditErr);
    }

    return NextResponse.json({
      success: true,
      type: syncType,
      executionMode: "github_actions_runner",
      workflow: dispatchResult.workflow,
      runUrl: dispatchResult.runUrl,
      message: dispatchResult.message,
      dispatchedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[ADMIN TRIGGER SYNC ERROR]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Manual sync trigger failed" },
      { status: 500 }
    );
  }
}
