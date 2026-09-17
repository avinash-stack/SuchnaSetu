import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * Lightweight on-demand cache revalidation endpoint.
 * Called by GitHub Actions after background ingestion completes.
 * Runtime: <100ms (does NOT execute any scraping or ingestion).
 */
export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

async function handleRevalidate(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const keyParam = request.nextUrl.searchParams.get("key") || request.nextUrl.searchParams.get("secret");

  if (cronSecret) {
    const isAuthorized = bearerToken === cronSecret || keyParam === cronSecret;
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing revalidation secret." },
        { status: 401 }
      );
    }
  }

  const pathParam = request.nextUrl.searchParams.get("path");
  const revalidatedPaths: string[] = [];

  try {
    if (pathParam) {
      revalidatePath(pathParam);
      revalidatedPaths.push(pathParam);
    } else {
      // Revalidate primary public landing and aggregator feeds
      const defaultPaths = ["/", "/jobs", "/exams", "/news", "/sitemap.xml"];
      for (const p of defaultPaths) {
        revalidatePath(p);
        revalidatedPaths.push(p);
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[REVALIDATE ERROR]:", err);
    return NextResponse.json(
      { revalidated: false, error: err.message || "Failed to revalidate paths" },
      { status: 500 }
    );
  }
}
