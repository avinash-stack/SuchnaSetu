/**
 * GitHub Actions Workflow Dispatch Service
 * 
 * Safely dispatches long-running ingestion pipelines to GitHub Actions runners.
 * Execution runs entirely in GitHub's containerized infrastructure, completely
 * bypassing Cloudflare Worker execution limits (50ms CPU, subrequest quotas).
 */

export interface WorkflowDispatchOptions {
  syncType: "full" | "news" | "jobs" | "exams" | "resources" | "source";
  sourceId?: string;
  reason?: string;
}

export interface WorkflowDispatchResult {
  success: boolean;
  workflow: string;
  executionMode: "github_actions_runner";
  message: string;
  runUrl?: string;
  error?: string;
}

const ALLOWED_SYNC_TYPES = ["full", "news", "jobs", "exams", "resources", "source"] as const;

export function getGitHubDispatchToken(): string | null {
  return (
    process.env.GITHUB_DISPATCH_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GH_PAT ||
    null
  );
}

export function getGitHubRepository(): string {
  return process.env.GITHUB_REPOSITORY || "avinash-stack/SuchnaSetu";
}

/**
 * Dispatches the appropriate ingestion workflow via GitHub Actions REST API.
 */
export async function dispatchGitHubSyncWorkflow(
  options: WorkflowDispatchOptions
): Promise<WorkflowDispatchResult> {
  const token = getGitHubDispatchToken();
  const repo = getGitHubRepository();

  if (!token) {
    return {
      success: false,
      workflow: options.syncType === "news" ? "news-sync.yml" : "data-sync.yml",
      executionMode: "github_actions_runner",
      message: "GitHub dispatch token not configured on server",
      error:
        "GITHUB_DISPATCH_TOKEN is not configured on the server. Please add GITHUB_DISPATCH_TOKEN to repository / Cloudflare Worker secrets.",
    };
  }

  // Validate syncType
  if (!ALLOWED_SYNC_TYPES.includes(options.syncType as any)) {
    return {
      success: false,
      workflow: "data-sync.yml",
      executionMode: "github_actions_runner",
      message: `Invalid syncType: ${options.syncType}`,
      error: `syncType must be one of: ${ALLOWED_SYNC_TYPES.join(", ")}`,
    };
  }

  // If source-specific sync, validate sourceId is provided
  if (options.syncType === "source" && (!options.sourceId || options.sourceId.trim() === "")) {
    return {
      success: false,
      workflow: "data-sync.yml",
      executionMode: "github_actions_runner",
      message: "Missing source identifier",
      error: "sourceId is required when syncType is 'source'",
    };
  }

  // Route to the appropriate workflow file
  const workflowFile = options.syncType === "news" ? "news-sync.yml" : "data-sync.yml";
  const dispatchUrl = `https://api.github.com/repos/${repo}/actions/workflows/${workflowFile}/dispatches`;

  const inputs: Record<string, string> = {
    reason: options.reason || `Admin manual trigger: ${options.syncType}`,
  };

  if (workflowFile === "data-sync.yml") {
    inputs.sync_type = options.syncType;
    if (options.sourceId) {
      inputs.source_id = options.sourceId;
    }
  }

  try {
    const response = await fetch(dispatchUrl, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "SuchnaSetu-Admin-Dispatcher/1.0",
      },
      body: JSON.stringify({
        ref: "main",
        inputs,
      }),
    });

    if (response.status === 204) {
      // 204 No Content indicates success
      const runUrl = `https://github.com/${repo}/actions/workflows/${workflowFile}`;
      return {
        success: true,
        workflow: workflowFile,
        executionMode: "github_actions_runner",
        message: `Successfully dispatched ${options.syncType} sync to GitHub Actions runner. Execution runs independently off Cloudflare Workers.`,
        runUrl,
      };
    }

    const errorBody = await response.text().catch(() => "");
    let errorMessage = `GitHub API returned HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.message) errorMessage = `${errorMessage}: ${parsed.message}`;
    } catch {
      if (errorBody) errorMessage = `${errorMessage}: ${errorBody}`;
    }

    return {
      success: false,
      workflow: workflowFile,
      executionMode: "github_actions_runner",
      message: "GitHub Actions workflow dispatch request rejected",
      error: errorMessage,
    };
  } catch (err: any) {
    return {
      success: false,
      workflow: workflowFile,
      executionMode: "github_actions_runner",
      message: "Failed to connect to GitHub Actions API",
      error: err?.message || "Network error dispatching workflow",
    };
  }
}
