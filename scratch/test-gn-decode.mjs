async function testGoogleNewsDecoding(articleUrl) {
  const res = await fetch(articleUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  const html = await res.text();

  // Pattern 1: data-n-au attribute
  const dataMatch = html.match(/data-n-au="([^"]+)"/);
  if (dataMatch) {
    console.log("data-n-au URL:", dataMatch[1]);
  }

  // Pattern 2: Batched redirect or jscontroller links
  const aLinks = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>/g)];
  for (const m of aLinks) {
    if (!m[1].includes("google.com") && m[1].startsWith("http")) {
      console.log("Found direct link:", m[1]);
    }
  }

  // Pattern 3: Look for publisher URL inside JS execution arrays
  const jsUrls = [...html.matchAll(/"(https?:\/\/[^"]+)"/g)]
    .map((m) => m[1])
    .filter(
      (u) =>
        !u.includes("google") &&
        !u.includes("gstatic") &&
        !u.includes("schema.org") &&
        !u.includes("w3.org")
    );

  console.log("JS URLs found:", jsUrls.slice(0, 5));
}

const testUrl = "https://news.google.com/rss/articles/CBMimwFBVV95cUxOQVJtMXE0V0RLQV9oT0VEaTB2RVplcTRabk5wUTRVWEZDbHphLThNWWFxZTg3SS14MnlPZDEtNERvWDdWS0kzV1duUzI3WGRZSUg1WFFzdXBfT0lIUlBvTzNFbkR3UG9pRGZlc3pPek5OU3NmanpuRm5qTmJpSk9aT29ZSTJGS0E2RnNIa1Q3ZnRZTFVkbW1hVVMyZw?oc=5";
testGoogleNewsDecoding(testUrl);
