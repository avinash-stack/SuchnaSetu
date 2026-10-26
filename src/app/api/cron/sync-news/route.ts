import { NextRequest, NextResponse } from "next/server";
import { dispatchGitHubSyncWorkflow, getGitHubDispatchToken } from "@/lib/github/dispatch";

export const dynamic = "force-dynamic";

/**
 * Automated News Sync Cron Endpoint:
 * Dispatches live news synchronization (news-sync.yml) to GitHub Actions runners.
 * RSS fetching and AI enrichment run entirely on GitHub Actions to preserve Cloudflare Worker CPU limits.
 */
export async function GET(request: NextRequest) {
  return handleNewsSyncCron(request);
}

export async function POST(request: NextRequest) {
  return handleNewsSyncCron(request);
}

async function handleNewsSyncCron(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const keyParam = request.nextUrl.searchParams.get("key") || request.nextUrl.searchParams.get("secret");

  // 1. Authenticate trigger
  if (cronSecret) {
    const isAuthorized = bearerToken === cronSecret || keyParam === cronSecret;
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid or missing cron secret." },
        { status: 401 }
      );
    }
  }

  // 2. Verify dispatch capability
  const token = getGitHubDispatchToken();
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Cron trigger authenticated, but GITHUB_DISPATCH_TOKEN is not configured on the server. Automated dispatch requires GITHUB_DISPATCH_TOKEN.",
        executionMode: "github_actions_runner",
      },
      { status: 503 }
    );
  }

  // 3. Dispatch news-sync workflow
  const dispatchResult = await dispatchGitHubSyncWorkflow({
    syncType: "news",
    reason: "Scheduled cron trigger: /api/cron/sync-news",
  });

  if (!dispatchResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: dispatchResult.error,
        executionMode: "github_actions_runner",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "News synchronization dispatched to GitHub Actions runner successfully.",
      executionMode: "github_actions_runner",
      workflow: dispatchResult.workflow,
      runUrl: dispatchResult.runUrl,
      timestamp: new Date().toISOString(),
    },
    { status: 202 }
  );
}
