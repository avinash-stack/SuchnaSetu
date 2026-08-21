import https from 'https';

const testUrls = [
  'https://bpsc.bihar.gov.in/',
  'https://www.ibps.in/',
  'https://indiapostgdsonline.gov.in/',
  'https://bssc.bihar.gov.in/',
  'https://shs.bihar.gov.in/',
  'https://upsssc.gov.in/',
  'https://rsmssb.rajasthan.gov.in/',
  'https://esb.mp.gov.in/'
];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const agent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
});

async function testTlsProbe() {
  console.log('Testing probe with rejectUnauthorized: false...');
  for (const url of testUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        // @ts-ignore
        agent,
        signal: AbortSignal.timeout(8000)
      });
      console.log(`[HTTP ${res.status}] ${url} (${res.headers.get('content-type')})`);
    } catch (err) {
      console.log(`[ERR] ${url} -> ${err.message}`);
    }
  }
}

testTlsProbe();
