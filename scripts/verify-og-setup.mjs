import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function fetchRoute(path) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${path}`, (res) => {
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

async function verifyOg() {
  console.log('================================================================');
  console.log('SUCHNASETU OPEN GRAPH & SOCIAL PREVIEW VERIFICATION');
  console.log('================================================================\n');

  // 1. Verify Image Assets
  console.log('--- 1. Direct Image Asset Accessibility ---');
  const imgRes1 = await fetchRoute('/og/suchnasetu-og.png');
  console.log(`[Asset 1] /og/suchnasetu-og.png -> Status: ${imgRes1.status} | Content-Type: ${imgRes1.contentType} | Size: ${imgRes1.contentLength} bytes`);

  const imgRes2 = await fetchRoute('/og-image.png');
  console.log(`[Asset 2] /og-image.png (Fallback) -> Status: ${imgRes2.status} | Content-Type: ${imgRes2.contentType} | Size: ${imgRes2.contentLength} bytes`);

  // 2. Verify HTML Metadata on Pages
  console.log('\n--- 2. HTML Meta Tag Inspections ---');
  const pagesToTest = [
    { name: 'Homepage', path: '/' },
    { name: 'Job Detail', path: '/jobs/rrb-recruitment-of-assistant-loco-pilot-alp-across-railway-zones-cen-012026-alp' },
    { name: 'Exam Detail', path: '/exams/uppsc-miscellaneous-examination-uppsc-2' },
  ];

  for (const p of pagesToTest) {
    const pageRes = await fetchRoute(p.path);
    const html = pageRes.body || '';

    const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogDesc = html.match(/<meta property="og:description" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogType = html.match(/<meta property="og:type" content="([^"]*)"/)?.[1] || 'MISSING';
    const ogImg = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] || 'MISSING';
    const twitterCard = html.match(/<meta name="twitter:card" content="([^"]*)"/)?.[1] || 'MISSING';
    const twitterImg = html.match(/<meta name="twitter:image" content="([^"]*)"/)?.[1] || 'MISSING';

    console.log(`\nPage: ${p.name} (${p.path})`);
    console.log(`  og:title       = "${ogTitle.slice(0, 70)}..."`);
    console.log(`  og:description = "${ogDesc.slice(0, 80)}..."`);
    console.log(`  og:url         = ${ogUrl}`);
    console.log(`  og:type        = ${ogType}`);
    console.log(`  og:image       = ${ogImg}`);
    console.log(`  twitter:card   = ${twitterCard}`);
    console.log(`  twitter:image  = ${twitterImg}`);

    if (ogImg.includes('https://suchnasetu.in/og/suchnasetu-og.png') && ogUrl && ogTitle !== 'MISSING') {
      console.log(`  ✅ Meta Tags Verified`);
    } else {
      console.log(`  ⚠️ Check meta tag format`);
    }
  }

  console.log('\n================================================================');
  console.log('OG VERIFICATION COMPLETE');
  console.log('================================================================');
}

verifyOg().catch(console.error);
