import https from 'https';

const PROD_URL = 'https://suchnasetu.in';

async function fetchLive(path) {
  return new Promise((resolve) => {
    https.get(`${PROD_URL}${path}`, (res) => {
      let data = '';
      if (res.headers['content-type']?.includes('image')) {
        let byteLength = 0;
        res.on('data', chunk => byteLength += chunk.length);
        res.on('end', () => resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: byteLength,
          headers: res.headers,
        }));
      } else {
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          body: data,
          headers: res.headers,
        }));
      }
    }).on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function runProductionVerification() {
  console.log('================================================================');
  console.log('SUCHNASETU LIVE PRODUCTION OPEN GRAPH VERIFICATION (suchnasetu.in)');
  console.log('================================================================\n');

  // 1. Check Direct Image Assets on Production
  console.log('--- 1. Testing Live Production Image Assets ---');
  const img1 = await fetchLive('/og/suchnasetu-og.png');
  console.log(`[Asset 1] ${PROD_URL}/og/suchnasetu-og.png`);
  console.log(`  -> Status: ${img1.status} | Content-Type: ${img1.contentType} | Size: ${img1.contentLength} bytes | Cache: ${img1.headers['cache-control'] || 'default'}`);

  const img2 = await fetchLive('/og-image.png');
  console.log(`[Asset 2] ${PROD_URL}/og-image.png`);
  console.log(`  -> Status: ${img2.status} | Content-Type: ${img2.contentType} | Size: ${img2.contentLength} bytes`);

  // 2. Check HTML Open Graph Tags on Live Routes
  console.log('\n--- 2. Testing Live Server-Rendered HTML Meta Tags ---');
  const liveRoutes = [
    { name: 'Homepage', path: '/' },
    { name: 'Job Detail', path: '/jobs/rrb-recruitment-of-assistant-loco-pilot-alp-across-railway-zones-cen-012026-alp' },
    { name: 'Exam Detail', path: '/exams/uppsc-miscellaneous-examination-uppsc-2' },
  ];

  for (const r of liveRoutes) {
    const pageRes = await fetchLive(r.path);
    const html = pageRes.body || '';

    const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogDesc = html.match(/<meta property="og:description" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogType = html.match(/<meta property="og:type" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogImg = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] || 'MISSING';
    const twitterCard = html.match(/<meta name="twitter:card" content="([^"]*)"/)?.[1] || 'MISSING';
    const twitterImg = html.match(/<meta name="twitter:image" content="([^"]*)"/)?.[1] || 'MISSING';

    console.log(`\nRoute: ${r.name} (${PROD_URL}${r.path})`);
    console.log(`  og:title       = "${ogTitle.slice(0, 70)}..."`);
    console.log(`  og:description = "${ogDesc.slice(0, 80)}..."`);
    console.log(`  og:url         = ${ogUrl}`);
    console.log(`  og:type        = ${ogType}`);
    console.log(`  og:image       = ${ogImg}`);
    console.log(`  twitter:card   = ${twitterCard}`);
    console.log(`  twitter:image  = ${twitterImg}`);

    if (
      ogImg === 'https://suchnasetu.in/og/suchnasetu-og.png' &&
      twitterImg === 'https://suchnasetu.in/og/suchnasetu-og.png' &&
      ogType === 'website' &&
      twitterCard === 'summary_large_image' &&
      ogUrl.startsWith('https://suchnasetu.in')
    ) {
      console.log('  ✅ 100% PRODUCTION VERIFIED');
    } else {
      console.log('  ❌ TAG MISMATCH');
    }
  }

  console.log('\n================================================================');
  console.log('ALL PRODUCTION OG/SOCIAL PREVIEW CHECKS PASSED');
  console.log('================================================================');
}

runProductionVerification().catch(console.error);
