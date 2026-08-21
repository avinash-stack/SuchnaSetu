import fs from 'fs';
import path from 'path';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const targetSources = [
  {
    name: 'Bihar Public Service Commission (BPSC)',
    url: 'https://bpsc.bihar.gov.in/',
    module: 'jobs',
    jurisdiction: 'state'
  },
  {
    name: 'Central Selection Board of Constable (CSBC Bihar)',
    url: 'https://csbc.bihar.gov.in/',
    module: 'jobs',
    jurisdiction: 'state'
  },
  {
    name: 'Rajasthan Public Service Commission (RPSC)',
    url: 'https://rpsc.rajasthan.gov.in/advertisements',
    module: 'jobs',
    jurisdiction: 'state'
  },
  {
    name: 'Uttar Pradesh Public Service Commission (UPPSC)',
    url: 'https://uppsc.up.nic.in/CandidatePages/Notifications.aspx',
    module: 'jobs',
    jurisdiction: 'state'
  },
  {
    name: 'Indian Space Research Organisation (ISRO ICRB)',
    url: 'https://www.isro.gov.in/Careers.html',
    module: 'jobs',
    jurisdiction: 'central'
  },
  {
    name: 'Employees State Insurance Corporation (ESIC)',
    url: 'https://www.esic.gov.in/recruitments',
    module: 'jobs',
    jurisdiction: 'central'
  },
  {
    name: 'Supreme Court of India (SCI)',
    url: 'https://sci.gov.in/recruitment',
    module: 'jobs',
    jurisdiction: 'central'
  },
  {
    name: 'UP Police Recruitment Board (UPPRPB)',
    url: 'https://uppbpb.gov.in/',
    module: 'jobs',
    jurisdiction: 'state'
  },
  {
    name: 'Department of Posts (India Post GDS)',
    url: 'https://indiapostgdsonline.gov.in/',
    module: 'jobs',
    jurisdiction: 'central'
  },
  {
    name: 'DRDO Recruitment & Assessment Centre (RAC)',
    url: 'https://rac.gov.in/',
    module: 'jobs',
    jurisdiction: 'central'
  }
];

async function probeUrl(url, headers = {}) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8,application/pdf',
        ...headers
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000)
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, url: res.url, contentType: res.headers.get('content-type') || '', body: text };
  } catch (err) {
    return { ok: false, status: 0, url, contentType: '', body: '', error: err.message };
  }
}

async function runRealTrace() {
  console.log('='.repeat(100));
  console.log('STEP 1 — TRACE 10 REAL LIVE OFFICIAL RECRUITMENTS');
  console.log('='.repeat(100));

  const traces = [];

  for (const src of targetSources) {
    console.log(`\n>>> Probing: ${src.name} (${src.url})`);
    const probe = await probeUrl(src.url);

    const trace = {
      sourceName: src.name,
      sourceUrl: src.url,
      fetchedOk: probe.ok,
      httpStatus: probe.status,
      htmlSize: probe.body.length,
      recruitmentDiscovered: false,
      rawSampleTitle: '',
      rawSampleDate: '',
      rawSamplePdf: '',
      rawSampleApply: '',
      resolvedPdfUrl: '',
      resolvedApplyUrl: '',
      pdfReachable: false,
      applyReachable: false,
      firstFailureStage: 'NONE',
      errorDetails: ''
    };

    if (!probe.ok) {
      trace.firstFailureStage = 'FETCH';
      trace.errorDetails = probe.error || `HTTP ${probe.status}`;
      traces.push(trace);
      console.log(`  ❌ FETCH FAILED: ${trace.errorDetails}`);
      continue;
    }

    const html = probe.body;
    const landedUrl = probe.url;

    // Discover PDF notice links & title from HTML
    const pdfRegex = /<a\s+[^>]*href=["']([^"']+\.pdf[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const items = [];

    while ((match = pdfRegex.exec(html)) !== null) {
      const href = match[1].trim();
      const rawText = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (rawText.length > 10 && !/download|click here|view|pdf/i.test(rawText)) {
        items.push({ href, title: rawText });
      } else if (href.includes('/') && href.split('/').pop().length > 5) {
        items.push({ href, title: rawText || href.split('/').pop().replace(/\.pdf/i, '') });
      }
    }

    // Also look for table rows with td links
    if (items.length === 0) {
      const rowMatches = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
      for (const r of rowMatches) {
        const row = r[1];
        if (row.includes('<th')) continue;
        const hrefMatch = row.match(/href=["']([^"']+)["']/i);
        const textContent = row.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (hrefMatch && textContent.length > 15) {
          items.push({ href: hrefMatch[1], title: textContent.substring(0, 120) });
        }
      }
    }

    if (items.length === 0) {
      trace.firstFailureStage = 'DISCOVERY';
      trace.errorDetails = 'No recruitment rows or PDF notice links discovered in HTML stream';
      traces.push(trace);
      console.log(`  ❌ DISCOVERY FAILED: ${trace.errorDetails}`);
      continue;
    }

    trace.recruitmentDiscovered = true;
    const sample = items[0];
    trace.rawSampleTitle = sample.title;
    trace.rawSamplePdf = sample.href;

    // Resolve URL
    try {
      const resolved = new URL(sample.href, landedUrl).toString();
      trace.resolvedPdfUrl = resolved;
    } catch {
      trace.resolvedPdfUrl = sample.href;
    }

    // Check PDF reachability (HEAD or GET first 1KB)
    try {
      const pdfCheck = await fetch(trace.resolvedPdfUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Range': 'bytes=0-1024'
        },
        signal: AbortSignal.timeout(6000)
      });
      trace.pdfReachable = pdfCheck.ok || pdfCheck.status === 206;
    } catch (pdfErr) {
      trace.pdfReachable = false;
      trace.errorDetails = `PDF probe failed: ${pdfErr.message}`;
    }

    traces.push(trace);
    console.log(`  ✓ Discovered ${items.length} items`);
    console.log(`  • Sample Title: ${trace.rawSampleTitle.substring(0, 80)}`);
    console.log(`  • Resolved PDF: ${trace.resolvedPdfUrl}`);
    console.log(`  • PDF Reachable: ${trace.pdfReachable ? 'YES' : 'NO'}`);
  }

  // Print Step 1 trace table
  console.log('\n' + '='.repeat(100));
  console.log('REAL LIVE RECRUITMENTS TRACE REPORT');
  console.log('='.repeat(100));

  for (let i = 0; i < traces.length; i++) {
    const t = traces[i];
    console.log(`\n[${i + 1}] Source: ${t.sourceName}`);
    console.log(`    Official URL:       ${t.sourceUrl}`);
    console.log(`    Fetched OK:         ${t.fetchedOk ? 'YES (HTTP ' + t.httpStatus + ', ' + Math.round(t.htmlSize/1024) + ' KB)' : 'NO'}`);
    console.log(`    Recruitment Discovered: ${t.recruitmentDiscovered ? 'YES' : 'NO'}`);
    console.log(`    Title Extracted:    ${t.rawSampleTitle ? t.rawSampleTitle.substring(0, 75) : 'NONE'}`);
    console.log(`    PDF URL Extracted:  ${t.rawSamplePdf || 'NONE'}`);
    console.log(`    PDF Resolved:       ${t.resolvedPdfUrl || 'NONE'}`);
    console.log(`    PDF Validated/Live: ${t.pdfReachable ? 'YES (HTTP 200/206)' : 'NO'}`);
    console.log(`    First Failure:      ${t.firstFailureStage}`);
    if (t.errorDetails) console.log(`    Error Details:      ${t.errorDetails}`);
  }
}

runRealTrace().catch(console.error);
