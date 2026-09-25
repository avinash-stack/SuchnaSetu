import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Automated Full Sync Endpoint Notice:
 * Data synchronization execution is permanently offloaded directly to GitHub Actions runners
 * (scripts/run-scheduled-sync.ts) to eliminate Vercel serverless compute and active CPU usage.
 */
export async function GET(request: NextRequest) {
  return handleOffloadedCron(request);
}

export async function POST(request: NextRequest) {
  return handleOffloadedCron(request);
}

async function handleOffloadedCron(_request: NextRequest) {
  return NextResponse.json(
    {
      success: true,
      message:
        "Full data synchronization has been migrated off Vercel serverless compute to GitHub Actions runner to preserve serverless compute quotas. Please execute via GitHub Actions (workflow_dispatch or scheduled workflow: .github/workflows/data-sync.yml).",
      executionMode: "github_actions_runner",
      runnerScript: "scripts/run-scheduled-sync.ts full",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
