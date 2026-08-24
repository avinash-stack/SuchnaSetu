import { NextRequest, NextResponse } from "next/server";
import { executeAiEnhancedSearch } from "@/modules/ai/search/search-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query =
      searchParams.get("q") ||
      searchParams.get("search") ||
      searchParams.get("query") ||
      "";
    const moduleParam = (searchParams.get("module") || searchParams.get("type") || "all") as
      | "jobs"
      | "exams"
      | "all"
      | "bulletins";
    const stateParam = searchParams.get("state") || undefined;
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "12", 10);

    const result = await executeAiEnhancedSearch(query, {
      module: moduleParam,
      state: stateParam,
      page: isNaN(pageParam) ? 1 : pageParam,
      limitPerType: isNaN(limitParam) ? 12 : Math.min(limitParam, 30),
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("[Search API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Search Error",
        totalCount: 0,
        jobs: [],
        exams: [],
        bulletins: [],
      },
      { status: 500 }
    );
  }
}
