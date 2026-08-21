import { execSync } from 'child_process';
import fs from 'fs';
import http from 'http';

const TARGET_PAGES = [
  { name: 'Homepage', url: 'http://localhost:3000/' },
  { name: 'Jobs Listing', url: 'http://localhost:3000/jobs' },
  { name: 'Exams Listing', url: 'http://localhost:3000/exams' },
  { name: 'Job Detail', url: 'http://localhost:3000/jobs/rrb-recruitment-of-assistant-loco-pilot-alp-across-railway-zones-cen-012026-alp' },
  { name: 'Exam Detail', url: 'http://localhost:3000/exams/uppsc-miscellaneous-examination-uppsc-2' },
];

async function measureTtfb(url) {
  return new Promise((resolve) => {
    const start = performance.now();
    http.get(url, (res) => {
      let ttfb = performance.now() - start;
      let bodySize = 0;
      res.on('data', chunk => bodySize += chunk.length);
      res.on('end', () => {
        resolve({
          ttfbMs: Math.round(ttfb),
          totalTimeMs: Math.round(performance.now() - start),
          bodyBytes: bodySize,
          statusCode: res.statusCode,
        });
      });
    }).on('error', (err) => resolve({ ttfbMs: 0, totalTimeMs: 0, bodyBytes: 0, error: err.message }));
  });
}

async function runAudit() {
  console.log('================================================================');
  console.log('SUCHNASETU LIGHTHOUSE & WEB VITALS PERFORMANCE AUDIT');
  console.log('================================================================\n');

  const results = [];

  for (const page of TARGET_PAGES) {
    console.log(`Analyzing: ${page.name} (${page.url})...`);

    // 1. Measure TTFB & Server response
    const ttfbInfo = await measureTtfb(page.url);

    // 2. Run Lighthouse in headless mode and output JSON
    const reportPath = `/tmp/lighthouse-${Date.now()}.json`;
    try {
      execSync(
        `npx lighthouse "${page.url}" --output=json --output-path="${reportPath}" --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance --preset=desktop --throttling-method=provided --quiet`,
        { stdio: 'pipe', timeout: 60000 }
      );

      const lhr = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      fs.unlinkSync(reportPath);

      const perfScore = Math.round((lhr.categories.performance?.score || 0) * 100);
      const fcp = lhr.audits['first-contentful-paint']?.numericValue || 0;
      const lcp = lhr.audits['largest-contentful-paint']?.numericValue || 0;
      const tbt = lhr.audits['total-blocking-time']?.numericValue || 0;
      const cls = lhr.audits['cumulative-layout-shift']?.numericValue || 0;
      const speedIndex = lhr.audits['speed-index']?.numericValue || 0;

      // Extract network resource breakdown
      const resourceItems = lhr.audits['resource-summary']?.details?.items || [];
      let totalJsBytes = 0;
      let totalCssBytes = 0;
      let totalImgBytes = 0;
      let totalRequests = 0;

      resourceItems.forEach(item => {
        if (item.resourceType === 'script') totalJsBytes = item.transferSize || item.size || 0;
        if (item.resourceType === 'stylesheet') totalCssBytes = item.transferSize || item.size || 0;
        if (item.resourceType === 'image') totalImgBytes = item.transferSize || item.size || 0;
        if (item.resourceType === 'total') totalRequests = item.requestCount || 0;
      });

      const metrics = {
        name: page.name,
        url: page.url,
        score: perfScore,
        fcpMs: Math.round(fcp),
        lcpMs: Math.round(lcp),
        tbtMs: Math.round(tbt),
        cls: parseFloat(cls.toFixed(3)),
        speedIndexMs: Math.round(speedIndex),
        ttfbMs: ttfbInfo.ttfbMs,
        totalJsKb: Math.round(totalJsBytes / 1024),
        totalCssKb: Math.round(totalCssBytes / 1024),
        totalImgKb: Math.round(totalImgBytes / 1024),
        totalRequests,
      };

      results.push(metrics);
      console.log(`  -> Performance Score: ${perfScore}/100 | LCP: ${metrics.lcpMs}ms | FCP: ${metrics.fcpMs}ms | TBT: ${metrics.tbtMs}ms | CLS: ${metrics.cls} | TTFB: ${metrics.ttfbMs}ms`);
    } catch (err) {
      console.error(`  ❌ Lighthouse run failed for ${page.name}:`, err.message);
      results.push({
        name: page.name,
        url: page.url,
        score: 0,
        fcpMs: 0,
        lcpMs: 0,
        tbtMs: 0,
        cls: 0,
        speedIndexMs: 0,
        ttfbMs: ttfbInfo.ttfbMs,
        error: err.message,
      });
    }
  }

  console.log('\n================================================================');
  console.log('PERFORMANCE AUDIT SUMMARY TABLE');
  console.log('================================================================\n');
  console.table(results.map(r => ({
    Page: r.name,
    Score: `${r.score}/100`,
    'LCP (s)': (r.lcpMs / 1000).toFixed(2) + 's',
    'FCP (s)': (r.fcpMs / 1000).toFixed(2) + 's',
    'TBT (ms)': `${r.tbtMs}ms`,
    CLS: r.cls,
    'TTFB (ms)': `${r.ttfbMs}ms`,
    'JS (KB)': `${r.totalJsKb} KB`,
    Requests: r.totalRequests,
  })));

  fs.writeFileSync('scripts/lighthouse-baseline.json', JSON.stringify(results, null, 2));
  console.log('\nBaseline report saved to scripts/lighthouse-baseline.json');
}

runAudit().catch(console.error);
