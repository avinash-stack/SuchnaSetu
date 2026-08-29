import { NextRequest, NextResponse } from "next/server";
import { runNewsIngestionPipeline } from "@/modules/news/services/ingestion-service";
import { revalidatePath } from "next/cache";

export const maxDuration = 60; // 60 seconds max runtime
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleNewsSync(request);
}

export async function POST(request: NextRequest) {
  return handleNewsSync(request);
}

async function handleNewsSync(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (cronSecret) {
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const apiKey = request.nextUrl.searchParams.get("key");
    const isAuthorized = bearerToken === cronSecret || apiKey === cronSecret || isVercelCron;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing CRON_SECRET authorization token." },
        { status: 401 }
      );
    }
  }

  try {
    const summary = await runNewsIngestionPipeline(3);

    if (summary.totalArticlesInserted > 0) {
      try {
        revalidatePath("/news");
        revalidatePath("/");
      } catch (revalErr) {
        console.warn("News revalidation warning:", revalErr);
      }
    }

    return NextResponse.json({
      success: true,
      executedAt: new Date().toISOString(),
      summary,
    });
  } catch (err: any) {
    console.error("[CRON SYNC-NEWS ERROR]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "News sync failed" },
      { status: 500 }
    );
  }
}
