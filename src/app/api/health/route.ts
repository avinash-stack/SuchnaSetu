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

  // Query Ingestion Registry stats
  const registeredAdapters = SourceAdapterRegistry.listAdapters();

  const isHealthy = dbStatus === "healthy";
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
        status: registeredAdapters.length > 0 ? "healthy" : "warning",
        registeredAdaptersCount: registeredAdapters.length,
      },
    },
    totalResponseTimeMs: Date.now() - startTime,
  };

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
