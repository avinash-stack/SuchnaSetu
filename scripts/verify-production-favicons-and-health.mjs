import https from "https";

const PROD_URL = "https://suchnasetu.in";

async function fetchLive(path) {
  return new Promise((resolve) => {
    https.get(`${PROD_URL}${path}`, (res) => {
      let data = "";
      if (res.headers["content-type"]?.includes("image") || res.headers["content-type"]?.includes("icon")) {
        let byteLength = 0;
        res.on("data", (chunk) => (byteLength += chunk.length));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            contentType: res.headers["content-type"],
            contentLength: byteLength,
            headers: res.headers,
          })
        );
      } else {
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            contentType: res.headers["content-type"],
            body: data,
            headers: res.headers,
          })
        );
      }
    }).on("error", (err) => resolve({ status: 500, error: err.message }));
  });
}

async function verifyProduction() {
  console.log("================================================================");
  console.log("SUCHNASETU LIVE PRODUCTION FAVICON & HEALTH VERIFICATION");
  console.log("================================================================\n");

  // 1. Check Favicon Assets
  console.log("--- 1. Testing Live Favicon & App Icon URLs ---");
  const iconUrls = [
    "/favicon.ico",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/favicon-48x48.png",
    "/apple-touch-icon.png",
    "/android-chrome-192x192.png",
    "/android-chrome-512x512.png",
    "/icon.png",
    "/site.webmanifest",
  ];

  for (const p of iconUrls) {
    const res = await fetchLive(p);
    const size = res.contentLength || res.body?.length || 0;
    const ok = res.status === 200 ? "✅" : "❌";
    console.log(`  ${ok} ${PROD_URL}${p.padEnd(30)} -> HTTP ${res.status} | Content-Type: ${res.contentType} | Size: ${size} bytes`);
  }

  // 2. Check HTML Meta/Icon Links in Server-Rendered HTML
  console.log("\n--- 2. Testing Live Server-Rendered HTML Icon References ---");
  const homeRes = await fetchLive("/");
  const html = homeRes.body || "";

  const iconMatches = html.match(/<link[^>]+rel="[^"]*(icon|apple-touch-icon|manifest)[^"]*"[^>]*>/gi) || [];
  console.log(`Found ${iconMatches.length} icon/manifest link tags in HTML:`);
  iconMatches.forEach((m) => console.log(`  - ${m}`));

  // 3. Check Live Health API
  console.log("\n--- 3. Testing Live API Health Route ---");
  const healthRes = await fetchLive("/api/health");
  console.log(`HTTP Status: ${healthRes.status}`);
  try {
    const healthJson = JSON.parse(healthRes.body);
    console.log("Health Payload:", JSON.stringify(healthJson, null, 2));
  } catch (e) {
    console.log("Raw Body:", healthRes.body?.slice(0, 300));
  }

  console.log("\n================================================================");
  console.log("PRODUCTION LIVE VERIFICATION COMPLETED");
  console.log("================================================================");
}

verifyProduction().catch(console.error);
