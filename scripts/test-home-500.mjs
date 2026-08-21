process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testHome() {
  try {
    const res = await fetch('http://localhost:3000/', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body length: ${text.length}`);
    if (res.status !== 200) {
      console.log('Body preview:', text.slice(0, 500));
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testHome().catch(console.error);
