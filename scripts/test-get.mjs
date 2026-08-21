const testUrls = [
  'https://sso.rajasthan.gov.in',
  'https://uppsc.up.nic.in',
  'https://rpsc.rajasthan.gov.in',
  'https://dsssbonline.nic.in',
  'https://patnahighcourt.gov.in',
  'https://bpsc.bihar.gov.in',
  'https://upsconline.nic.in',
];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testGet() {
  for (const u of testUrls) {
    try {
      const c = new AbortController();
      const tid = setTimeout(() => c.abort(), 6000);
      const res = await fetch(u, {
        method: 'GET',
        signal: c.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      clearTimeout(tid);
      console.log(`GET ${res.status} | ${u}`);
    } catch (e) {
      console.log(`GET FAIL (${e.message}) | ${u}`);
    }
  }
}

testGet().catch(console.error);
