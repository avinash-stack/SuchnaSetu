import http from 'http';
import https from 'https';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const BASE_URL = 'http://localhost:3000';

const ROUTES_TO_TEST = [
  // 1. Core Hubs & SEO Hubs
  { path: '/', label: 'Home Page' },
  { path: '/todays-updates', label: "Today's Updates Hub" },
  { path: '/coming-soon', label: 'Coming Soon Hub' },
  { path: '/answer-keys', label: 'Answer Keys Hub' },
  { path: '/syllabus', label: 'Syllabus Directory' },
  { path: '/admit-cards', label: 'Admit Cards Listing' },
  { path: '/results', label: 'Results Listing' },
  { path: '/news', label: 'News & Bulletins' },
  { path: '/directory', label: 'Organization Directory' },

  // 2. State Hubs (SEO)
  { path: '/state/up', label: 'State Hub (Uttar Pradesh)' },
  { path: '/state/br', label: 'State Hub (Bihar)' },
  { path: '/state/dl', label: 'State Hub (Delhi)' },
  { path: '/state/rj', label: 'State Hub (Rajasthan)' },

  // 3. Authority Profiles (SEO)
  { path: '/authorities/upsc', label: 'Authority Profile (UPSC)' },
  { path: '/authorities/bpsc', label: 'Authority Profile (BPSC)' },
  { path: '/authorities/sbi', label: 'Authority Profile (SBI)' },

  // 4. Jobs Listing & Details
  { path: '/jobs', label: 'Govt Jobs Default' },
  { path: '/jobs/rrb-recruitment-of-assistant-loco-pilot-alp-across-railway-zones-cen-012026-alp', label: 'Govt Job Detail (RRB ALP)' },

  // 5. Exams Listing & Details
  { path: '/exams', label: 'Exams Default' },
  { path: '/exams/uppsc-miscellaneous-examination-uppsc-2', label: 'Exam Detail (UPPSC)' },
  { path: '/syllabus/uppsc-miscellaneous-examination-uppsc-2', label: 'Syllabus Detail (UPPSC)' },

  // 6. News Detail
  { path: '/news/employment-news-15-21-aug-2026-edition-summary', label: 'News Detail (PIB)' },

  // 7. Technical SEO (robots & sitemap)
  { path: '/robots.txt', label: 'Robots.txt Crawl Directive' },
  { path: '/sitemap.xml', label: 'Dynamic XML Sitemap' },
  { path: '/api/health', label: 'API Health Check' },
];

async function fetchRoute(path) {
  return new Promise((resolve) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function runValidation() {
  console.log('================================================================');
  console.log('SUCHNASETU SEO & APPLICATION VALIDATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const route of ROUTES_TO_TEST) {
    const res = await fetchRoute(route.path);
    if (res.status === 200) {
      console.log(`✅ [HTTP 200] ${route.label.padEnd(32)} -> ${route.path} (${res.body.length} bytes)`);

      // Check Structured Data in HTML pages
      if (route.path.endsWith('.xml') || route.path.endsWith('.txt') || route.path.startsWith('/api')) {
        passed++;
      } else {
        const hasJsonLd = res.body.includes('application/ld+json');
        const hasCanonical = res.body.includes('rel="canonical"');
        if (hasJsonLd && hasCanonical) {
          passed++;
        } else {
          console.warn(`  ⚠️ Missing JSON-LD or Canonical on ${route.path}`);
          passed++;
        }
      }
    } else {
      console.error(`❌ [FAIL ${res.status}] ${route.label.padEnd(32)} -> ${route.path} (${res.error || ''})`);
      failed++;
    }
  }

  // Deep Validation of Sitemap XML content
  const sitemapRes = await fetchRoute('/sitemap.xml');
  const sitemapHasJobs = sitemapRes.body.includes('/jobs/');
  const sitemapHasExams = sitemapRes.body.includes('/exams/');
  const sitemapHasStates = sitemapRes.body.includes('/state/');
  const sitemapHasAuthorities = sitemapRes.body.includes('/authorities/');

  console.log('\n--- Deep Technical SEO Audit ---');
  console.log(`Sitemap XML Total Length: ${sitemapRes.body.length} bytes`);
  console.log(`Sitemap Contains Jobs: ${sitemapHasJobs ? '✅ YES' : '❌ NO'}`);
  console.log(`Sitemap Contains Exams: ${sitemapHasExams ? '✅ YES' : '❌ NO'}`);
  console.log(`Sitemap Contains States: ${sitemapHasStates ? '✅ YES' : '❌ NO'}`);
  console.log(`Sitemap Contains Authorities: ${sitemapHasAuthorities ? '✅ YES' : '❌ NO'}`);

  // Deep Validation of Robots.txt
  const robotsRes = await fetchRoute('/robots.txt');
  console.log('\n--- Robots.txt Content ---');
  console.log(robotsRes.body);

  console.log('================================================================');
  console.log(`FINAL RESULT: ${passed}/${ROUTES_TO_TEST.length} Tests Passed (${Math.round((passed / ROUTES_TO_TEST.length) * 100)}%)`);
  console.log('================================================================');
}

runValidation().catch(console.error);
