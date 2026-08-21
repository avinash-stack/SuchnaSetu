// Use native Node.js global fetch


const SOURCES_TO_DIAGNOSE = [
  {
    name: "SSC (Staff Selection Commission) [Central 1]",
    orgSlug: "ssc",
    baseUrl: "https://ssc.gov.in",
    recruitmentPath: "/notices",
    candidatePortal: "https://ssc.gov.in/login",
    altPaths: [
      "/",
      "/api/notices",
      "/api/v1/notices",
      "/candidate-portal",
      "/portal-backend/api/notices"
    ]
  },
  {
    name: "UPSC (Union Public Service Commission) [Central 2]",
    orgSlug: "upsc",
    baseUrl: "https://upsc.gov.in",
    recruitmentPath: "/recruitment/recruitment-advertisement",
    candidatePortal: "https://upsconline.nic.in",
    altPaths: [
      "/examinations/active-exams",
      "/recruitment/all-recruitment-advertisements",
      "/recruitment"
    ]
  },
  {
    name: "BPSC (Bihar Public Service Commission) [State 1]",
    orgSlug: "bpsc",
    baseUrl: "https://bpsc.bih.nic.in",
    recruitmentPath: "/notices",
    candidatePortal: "https://onlinebpsc.bihar.gov.in",
    altPaths: [
      "",
      "/",
      "/index.html",
      "/Advt/"
    ]
  },
  {
    name: "UPPSC (Uttar Pradesh Public Service Commission) [State 2]",
    orgSlug: "uppsc",
    baseUrl: "https://uppsc.up.nic.in",
    recruitmentPath: "/all-notifications",
    candidatePortal: "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx",
    altPaths: [
      "/CandidatePages/Notifications.aspx",
      "/",
      "/Default.aspx"
    ]
  },
  {
    name: "CSBC Bihar Police (Central Selection Board of Constable) [Major Source 1]",
    orgSlug: "csbc",
    baseUrl: "https://csbc.bihar.gov.in",
    recruitmentPath: "/notices",
    candidatePortal: "https://csbc.bihar.gov.in/Advt/AdvtList.aspx",
    altPaths: [
      "/",
      "/Advt/AdvtList.aspx",
      "/index.html"
    ]
  },
  {
    name: "IBPS (Institute of Banking Personnel Selection) [Major Source 2]",
    orgSlug: "ibps",
    baseUrl: "https://www.ibps.in",
    recruitmentPath: "/careers",
    candidatePortal: "https://ibpsonline.ibps.in",
    altPaths: [
      "/",
      "/crp-po-mt-xiv/",
      "/crp-clerk-xiv/"
    ]
  }
];

async function probeUrl(targetUrl) {
  const redirectChain = [];
  let currentUrl = targetUrl;
  let finalResponse = null;
  let error = null;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/json',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(12000)
    });

    finalResponse = res;
    currentUrl = res.url;
  } catch (err) {
    error = err;
  }

  return { targetUrl, finalUrl: currentUrl, response: finalResponse, error };
}

async function diagnose() {
  console.log('='.repeat(90));
  console.log('REAL LIVE NETWORK & EXTRACTION DIAGNOSIS (OFFICIAL SOURCES)');
  console.log('='.repeat(90));

  for (const src of SOURCES_TO_DIAGNOSE) {
    console.log(`\n\n--------------------------------------------------------------------------------`);
    console.log(`SOURCE: ${src.name}`);
    console.log(`Configured Base URL: ${src.baseUrl}`);
    console.log(`Configured Recruitment Path: ${src.recruitmentPath}`);
    console.log(`Configured Target: ${src.baseUrl}${src.recruitmentPath}`);
    console.log(`--------------------------------------------------------------------------------`);

    // 1. Probe the configured recruitment path
    const configuredTarget = `${src.baseUrl}${src.recruitmentPath}`;
    const targetProbe = await probeUrl(configuredTarget);

    if (targetProbe.error) {
      console.log(`❌ FETCH FAILED for configured path: ${configuredTarget}`);
      console.log(`   Error: ${targetProbe.error.name} - ${targetProbe.error.message}`);
    } else {
      const res = targetProbe.response;
      console.log(`Configured URL HTTP Status: ${res.status} ${res.statusText}`);
      console.log(`Final Landed URL: ${targetProbe.finalUrl}`);
      console.log(`Redirected: ${targetProbe.finalUrl !== configuredTarget ? 'YES -> ' + targetProbe.finalUrl : 'NO'}`);
      console.log(`Content-Type: ${res.headers.get('content-type')}`);
      console.log(`Server Header: ${res.headers.get('server') || 'N/A'}`);
      
      const body = await res.text();
      console.log(`Response Size: ${body.length} bytes`);
      
      // Analyze body
      const isHtml = body.includes('<html') || body.includes('<!DOCTYPE') || body.includes('<HTML');
      const isJson = (res.headers.get('content-type') || '').includes('json') || (body.startsWith('{') || body.startsWith('['));
      const isSpa = body.includes('<app-root') || body.includes('id="root"') || body.includes('id="__next"') || (body.includes('<script') && body.length < 5000 && !body.includes('<table'));
      
      console.log(`Is HTML: ${isHtml}`);
      console.log(`Is JSON: ${isJson}`);
      console.log(`Is SPA (Single Page App / Client-rendered): ${isSpa}`);

      // Link Discovery Analysis
      const aTagMatches = [...body.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis)];
      const pdfMatches = aTagMatches.filter(m => m[1].toLowerCase().includes('.pdf'));
      const applyMatches = aTagMatches.filter(m => m[1].toLowerCase().includes('apply') || m[2].toLowerCase().includes('apply') || m[1].toLowerCase().includes('registration') || m[2].toLowerCase().includes('registration'));
      const tableMatches = [...body.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];
      const trMatches = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];

      console.log(`\nExtraction Analysis on Configured Path:`);
      console.log(`  - <table> elements found: ${tableMatches.length}`);
      console.log(`  - <tr> elements found: ${trMatches.length}`);
      console.log(`  - Total <a> links found: ${aTagMatches.length}`);
      console.log(`  - PDF links found: ${pdfMatches.length}`);
      console.log(`  - Apply links found: ${applyMatches.length}`);

      if (pdfMatches.length > 0) {
        console.log(`  Sample PDF Links:`);
        pdfMatches.slice(0, 3).forEach(p => {
          console.log(`    * [${p[2].replace(/<[^>]*>/g, '').trim().substring(0, 50)}] -> ${p[1]}`);
        });
      }

      if (applyMatches.length > 0) {
        console.log(`  Sample Apply Links:`);
        applyMatches.slice(0, 3).forEach(a => {
          console.log(`    * [${a[2].replace(/<[^>]*>/g, '').trim().substring(0, 50)}] -> ${a[1]}`);
        });
      }
    }

    // 2. Probe alternate paths / actual portals
    console.log(`\nProbing Alternative Paths for ${src.name}:`);
    for (const alt of src.altPaths) {
      const altUrl = `${src.baseUrl}${alt}`;
      const altProbe = await probeUrl(altUrl);
      if (altProbe.error) {
        console.log(`  ❌ ${altUrl} -> ERROR: ${altProbe.error.message}`);
      } else {
        const altRes = altProbe.response;
        const altBody = await altRes.text();
        const pdfCount = (altBody.match(/\.pdf/gi) || []).length;
        const trCount = (altBody.match(/<tr/gi) || []).length;
        console.log(`  ✅ ${altUrl} -> HTTP ${altRes.status} | Size: ${altBody.length}b | Final: ${altProbe.finalUrl} | TRs: ${trCount} | .pdf refs: ${pdfCount}`);
      }
    }
  }
}

diagnose().catch(console.error);
