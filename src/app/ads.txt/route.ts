import { NextResponse } from "next/server";
import { normalizeAdsenseId } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 86400;

/**
 * Route handler for /ads.txt
 * Serves the IAB Authorized Digital Sellers (ads.txt) record required by Google AdSense.
 */
export async function GET() {
  const adsense = normalizeAdsenseId(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);
  const publisherId = adsense ? adsense.publisherId : "pub-2975962030636569";

  const content = [
    "# Google AdSense Authorized Digital Sellers (ads.txt)",
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`,
    "",
  ].join("\n");

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
