import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Checks if a hostname resolves to private / reserved / loopback IP address ranges
 * to prevent Server-Side Request Forgery (SSRF).
 */
function isPrivateHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower === "0.0.0.0" ||
    lower === "metadata.google.internal" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal")
  ) {
    return true;
  }

  // IPv4 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16
  const parts = lower.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 0) return true;
  }

  return false;
}

export async function HEAD(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const targetUrl = new URL(urlParam);
    if (isPrivateHost(targetUrl.hostname)) {
      return new NextResponse(null, { status: 403 });
    }
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json(
      { error: "Missing required 'url' parameter" },
      { status: 400 }
    );
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(urlParam);
  } catch {
    return NextResponse.json(
      { error: "Malformed or invalid target URL" },
      { status: 400 }
    );
  }

  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    return NextResponse.json(
      { error: "Unsupported protocol. Only HTTP and HTTPS URLs are permitted." },
      { status: 400 }
    );
  }

  if (isPrivateHost(targetUrl.hostname)) {
    return NextResponse.json(
      { error: "Access to private or local network resources is forbidden." },
      { status: 403 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SuchnaSetu-GovViewer/1.0",
        Accept: "application/pdf,*/*;q=0.8",
        Referer: `${targetUrl.protocol}//${targetUrl.hostname}/`,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Official portal returned HTTP ${response.status} (${response.statusText})`,
          targetUrl: targetUrl.toString(),
          status: response.status,
        },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    const arrayBuffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // Check if buffer starts with PDF magic bytes "%PDF" (0x25 0x50 0x44 0x46)
    const isPdfMagic =
      uint8.length >= 4 &&
      uint8[0] === 0x25 &&
      uint8[1] === 0x50 &&
      uint8[2] === 0x44 &&
      uint8[3] === 0x46;

    // If the remote server returned an HTML page (e.g. redirected to portal homepage, error page, or login page)
    if (!isPdfMagic) {
      return NextResponse.json(
        {
          error: "The official URL points to a website page or portal rather than a direct PDF document.",
          isWebPage: true,
          targetUrl: targetUrl.toString(),
          contentType,
        },
        { status: 422 }
      );
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="official_notification.pdf"',
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: any) {
    const isTimeout = err.name === "AbortError";
    return NextResponse.json(
      {
        error: isTimeout
          ? "Connection to official portal timed out"
          : `Network error reaching official server: ${err.message || "Unknown error"}`,
        targetUrl: targetUrl.toString(),
      },
      { status: 504 }
    );
  }
}
