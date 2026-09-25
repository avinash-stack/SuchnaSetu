import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Automated News Sync Endpoint Notice:
 * News synchronization execution is permanently offloaded directly to GitHub Actions runners
 * (scripts/run-scheduled-sync.ts news) to eliminate Vercel serverless compute and active CPU usage.
 */
export async function GET(request: NextRequest) {
  return handleOffloadedNewsCron(request);
}

export async function POST(request: NextRequest) {
  return handleOffloadedNewsCron(request);
}

async function handleOffloadedNewsCron(_request: NextRequest) {
  return NextResponse.json(
    {
      success: true,
      message:
        "News synchronization has been migrated off Vercel serverless compute to GitHub Actions runner to preserve serverless compute quotas. Please execute via GitHub Actions (workflow_dispatch or scheduled workflow: .github/workflows/news-sync.yml).",
      executionMode: "github_actions_runner",
      runnerScript: "scripts/run-scheduled-sync.ts news",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
