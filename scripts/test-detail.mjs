process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testDetail() {
  const url = 'http://localhost:3000/jobs/upsc-specialist-grade-iii-assistant-professor-nephrology-cardiology-neurology-082026';
  try {
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(text.slice(0, 800));
  } catch (err) {
    console.error(err);
  }
}

testDetail().catch(console.error);
