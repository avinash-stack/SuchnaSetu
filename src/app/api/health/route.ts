import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { SourceAdapterRegistry } from "@/modules/ingestion/core/registry";

export const dynamic = "force-dynamic";

const START_TIME = Date.now();

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "unreachable";
  let dbLatencyMs = 0;
  let errorDetails: string | undefined;

  try {
    const supabase = createPublicClient();
    const dbStart = Date.now();
    const { data, error } = await (supabase.from("organizations") as any).select("id").limit(1);
    dbLatencyMs = Date.now() - dbStart;

    if (error) {
      dbStatus = "degraded";
      errorDetails = error.message;
    } else {
      dbStatus = "healthy";
    }
  } catch (err: any) {
    dbStatus = "error";
    errorDetails = err?.message || "Failed to query database";
  }

  // Query Ingestion Registry stats & validate enabled sources
  const registeredAdapters = SourceAdapterRegistry.listAdapters();
  const registeredKeySet = new Set(registeredAdapters.map((a) => a.key));

  let totalEnabledSources = 0;
  const missingAdapters: Array<{ sourceCode: string; sourceName: string; adapterKey: string }> = [];

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const adminSupabase = createAdminClient();
    const { data: enabledSources } = await (adminSupabase.from("import_sources") as any)
      .select("id, code, name, adapter_key, is_enabled")
      .eq("is_enabled", true);

    if (enabledSources) {
      totalEnabledSources = enabledSources.length;
      for (const src of enabledSources) {
        const adapter = SourceAdapterRegistry.getAdapter(src.adapter_key);
        if (!adapter) {
          missingAdapters.push({
            sourceCode: src.code,
            sourceName: src.name,
            adapterKey: src.adapter_key,
          });
        }
      }
    }
  } catch (ingestionCheckErr) {
    console.warn("Health check: failed to query import_sources for adapter validation:", ingestionCheckErr);
  }

  const isIngestionHealthy = missingAdapters.length === 0 && registeredAdapters.length > 0;
  const isHealthy = dbStatus === "healthy" && isIngestionHealthy;
  const status = isHealthy ? "healthy" : "degraded";

  const responsePayload = {
    status,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        ...(errorDetails ? { error: errorDetails } : {}),
      },
      ingestionEngine: {
        status: isIngestionHealthy ? "healthy" : "warning",
        totalEnabledSources,
        registeredAdaptersCount: registeredAdapters.length,
        missingAdaptersCount: missingAdapters.length,
        ...(missingAdapters.length > 0 ? { missingAdapters } : {}),
      },
    },
    totalResponseTimeMs: Date.now() - startTime,
  };

  return NextResponse.json(responsePayload, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
