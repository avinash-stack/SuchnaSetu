async function runVerification() {
  console.log("================================================================================");
  console.log("       VERIFYING IMAGE OPTIMIZATIONS & VERCEL TRANSFORMATION ELIMINATION         ");
  console.log("================================================================================\n");

  const baseUrl = "http://localhost:3005";
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 1: News Detail Page — Direct Serving of AI-Generated Image & OG Image
  // ---------------------------------------------------------------------------
  console.log("[TEST 1]: News Article Detail Page");
  const detailSlug = "union-cabinet-approves-modernization-of-national-career-service-portal";
  const detailRes = await fetch(`${baseUrl}/news/${detailSlug}`);
  const detailHtml = await detailRes.text();

  assert(detailRes.status === 200, `Article loaded with HTTP 200`);

  // Verify AI Visual Representation badge
  const hasAiBadge = detailHtml.includes("AI Visual Representation") || detailHtml.includes("AI दृश्य प्रस्तुति");
  assert(hasAiBadge, `AI Visual Representation badge is displayed`);

  // Verify aspect ratio container
  const has169Container = detailHtml.includes("aspect-[16/9]") || detailHtml.includes("aspect-video");
  assert(has169Container, `Image is contained in a responsive 16:9 container`);

  // Extract featured image src
  const figureSection = detailHtml.slice(detailHtml.indexOf("<figure"), detailHtml.indexOf("</figure>") + 9);
  const imgTagMatch = figureSection.match(/<img[^>]*src="([^"]+)"[^>]*>/i);
  assert(imgTagMatch !== null, `Featured <img> element is rendered inside <figure>`);

  if (imgTagMatch) {
    const imgSrc = imgTagMatch[1];
    console.log(`  • Detail image src: ${imgSrc.slice(0, 100)}...`);

    // Verify it is served DIRECTLY and NOT via /_next/image
    const usesNextImageProxy = imgSrc.includes("/_next/image");
    assert(!usesNextImageProxy, `Featured image is served DIRECTLY without /_next/image transformation!`);

    const isDirectCdn = imgSrc.startsWith("https://image.pollinations.ai") || imgSrc.includes("supabase.co");
    assert(isDirectCdn, `Featured image src points directly to origin CDN`);

    // Verify 960x540 optimized dimensions in URL
    const hasOptimizedDimensions = imgSrc.includes("width=960") && imgSrc.includes("height=540");
    assert(hasOptimizedDimensions, `Image requested in optimized 960x540 (16:9) dimensions (~70KB vs ~500KB)`);
  }

  // Verify OpenGraph image tag in <head>
  const ogImageMatch = detailHtml.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
                        detailHtml.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
  assert(ogImageMatch !== null, `OpenGraph og:image meta tag is present for social sharing`);
  if (ogImageMatch) {
    console.log(`  • og:image content: ${ogImageMatch[1].slice(0, 100)}...`);
    assert(ogImageMatch[1].startsWith("https://"), `og:image is a valid absolute HTTPS URL`);
    assert(!ogImageMatch[1].includes("/_next/image"), `og:image does not use /_next/image proxy`);
  }

  console.log("");

  // ---------------------------------------------------------------------------
  // TEST 2: News Portal Listing — Direct Serving of Thumbnails
  // ---------------------------------------------------------------------------
  console.log("[TEST 2]: News Listing Portal (/news)");
  const listRes = await fetch(`${baseUrl}/news`);
  const listHtml = await listRes.text();

  assert(listRes.status === 200, `News feed loaded with HTTP 200`);

  // Find thumbnail img tags
  const thumbnailMatches = [...listHtml.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/gi)];
  const newsThumbnails = thumbnailMatches.filter(m => m[1].includes("pollinations.ai") || m[1].includes("news-images"));

  console.log(`  • Found ${newsThumbnails.length} news thumbnail <img> tags on listing`);
  assert(newsThumbnails.length > 0, `Listing renders article thumbnail images`);

  let anyThumbnailUsesNextImage = false;
  let allThumbnailsHaveLazy = true;

  for (const match of newsThumbnails) {
    const fullTag = match[0];
    const src = match[1];
    if (src.includes("/_next/image")) {
      anyThumbnailUsesNextImage = true;
    }
    if (!fullTag.includes('loading="lazy"')) {
      allThumbnailsHaveLazy = false;
    }
  }

  assert(!anyThumbnailUsesNextImage, `All news thumbnails are served DIRECTLY without /_next/image transformations!`);
  assert(allThumbnailsHaveLazy, `All non-critical news thumbnails have loading="lazy" for fast offscreen loading`);

  console.log("");

  // ---------------------------------------------------------------------------
  // TEST 3: Brand Logo on Jobs and Exams Pages — Direct Static Serving
  // ---------------------------------------------------------------------------
  console.log("[TEST 3]: Brand Logo Serving on Jobs (/jobs) and Exams (/exams)");
  for (const pagePath of ["/jobs", "/exams"]) {
    const pageRes = await fetch(`${baseUrl}${pagePath}`);
    const pageHtml = await pageRes.text();

    assert(pageRes.status === 200, `${pagePath} loaded with HTTP 200`);

    // Check header logo
    const logoMatch = pageHtml.match(/<img[^>]*alt="SuchnaSetu Logo"[^>]*src="([^"]+)"/i) ||
                      pageHtml.match(/<img[^>]*src="([^"]+)"[^>]*alt="SuchnaSetu Logo"/i);

    assert(logoMatch !== null, `${pagePath} renders brand logo`);
    if (logoMatch) {
      const logoSrc = logoMatch[1];
      console.log(`  • ${pagePath} logo src: ${logoSrc}`);
      assert(logoSrc === "/brand/logo-icon.png", `${pagePath} logo uses direct static asset path /brand/logo-icon.png`);
      assert(!logoSrc.includes("/_next/image"), `${pagePath} logo does NOT route through /_next/image!`);
    }
  }

  console.log("");

  // ---------------------------------------------------------------------------
  // TEST 4: Static File Header and Cache Verification
  // ---------------------------------------------------------------------------
  console.log("[TEST 4]: Static Asset Caching & Optimization");
  const logoRes = await fetch(`${baseUrl}/brand/logo-icon.png`);
  assert(logoRes.status === 200, `/brand/logo-icon.png responds with HTTP 200`);

  const logoLength = parseInt(logoRes.headers.get("content-length") || "0", 10);
  console.log(`  • Pre-optimized logo-icon.png file size: ${(logoLength / 1024).toFixed(1)} KB`);
  assert(logoLength > 0 && logoLength < 25 * 1024, `Logo icon is pre-optimized under 25 KB (was 139 KB)`);

  const cacheControl = logoRes.headers.get("cache-control") || "";
  console.log(`  • Cache-Control: ${cacheControl}`);

  console.log("\n================================================================================");
  console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error("Verification crashed:", err);
  process.exit(1);
});
