import { NextRequest, NextResponse } from "next/server";
import { runNewsIngestionPipeline } from "@/modules/news/services/ingestion-service";

export const maxDuration = 60; // 60 seconds max runtime
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runNewsIngestionPipeline(3);
    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "News sync failed" },
      { status: 500 }
    );
  }
}
