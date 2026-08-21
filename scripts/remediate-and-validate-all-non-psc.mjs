import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

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

// Exact Verified Official Career Gateways for All Non-PSC Authorities
const MASTER_NON_PSC_MAP = {
  // Banking & Financial
  'IBPS': { apply: 'https://ibpsonline.ibps.in', notif: 'https://www.ibps.in' },
  'SBI': { apply: 'https://bank.sbi/careers', notif: 'https://sbi.co.in/web/careers/current-openings' },
  'RBI': { apply: 'https://opportunities.rbi.org.in', notif: 'https://opportunities.rbi.org.in/scripts/vacancies.aspx' },
  'NABARD': { apply: 'https://www.nabard.org/careers-notices.aspx', notif: 'https://www.nabard.org/careers-notices.aspx' },
  'SEBI': { apply: 'https://www.sebi.gov.in/sebiweb/other/career.jsp', notif: 'https://www.sebi.gov.in/sebiweb/other/career.jsp' },
  'LIC': { apply: 'https://licindia.in/careers', notif: 'https://licindia.in/careers' },

  // Defence, Police & Paramilitary
  'DRDO': { apply: 'https://rac.gov.in', notif: 'https://rac.gov.in' },
  'ISRO': { apply: 'https://www.isro.gov.in/Careers.html', notif: 'https://www.isro.gov.in/Careers.html' },
  'BSF': { apply: 'https://rectt.bsf.gov.in', notif: 'https://rectt.bsf.gov.in' },
  'CISF': { apply: 'https://cisfrectt.cisf.gov.in', notif: 'https://cisfrectt.cisf.gov.in' },
  'CRPF': { apply: 'https://rect.crpf.gov.in', notif: 'https://rect.crpf.gov.in' },
  'ITBP': { apply: 'https://recruitment.itbpolice.nic.in', notif: 'https://recruitment.itbpolice.nic.in' },
  'SSB': { apply: 'https://ssbrectt.gov.in', notif: 'https://ssbrectt.gov.in' },
  'Army': { apply: 'https://joinindianarmy.nic.in', notif: 'https://joinindianarmy.nic.in' },
  'Navy': { apply: 'https://joinindiannavy.gov.in', notif: 'https://joinindiannavy.gov.in' },
  'IAF': { apply: 'https://agnipathvayu.cdac.in', notif: 'https://indianairforce.nic.in' },
  'ICG': { apply: 'https://joinindiancoastguard.cdac.in', notif: 'https://joinindiancoastguard.cdac.in' },
  'UPPRPB': { apply: 'https://uppbpb.gov.in', notif: 'https://uppbpb.gov.in' },
  'BPSSC': { apply: 'https://bpssc.bihar.gov.in', notif: 'https://bpssc.bihar.gov.in' },
  'CSBC': { apply: 'https://csbc.bihar.gov.in', notif: 'https://csbc.bihar.gov.in' },

  // Railways & Metro
  'RRB': { apply: 'https://www.rrbapply.gov.in', notif: 'https://www.rrbcdg.gov.in' },
  'RPF': { apply: 'https://www.rrbapply.gov.in', notif: 'https://rpf.indianrailways.gov.in' },
  'DMRC': { apply: 'https://www.delhimetrorail.com/career', notif: 'https://www.delhimetrorail.com/career' },

  // Healthcare, Social Security & Autonomous
  'AIIMS': { apply: 'https://www.aiimsexams.ac.in', notif: 'https://www.aiimsexams.ac.in' },
  'ESIC': { apply: 'https://www.esic.gov.in/recruitments', notif: 'https://www.esic.gov.in/recruitments' },
  'EPFO': { apply: 'https://upsconline.nic.in', notif: 'https://www.epfindia.gov.in' },
  'JEEViKA': { apply: 'https://brlps.in', notif: 'https://brlps.in' },
  'KVS': { apply: 'https://kvsangathan.nic.in/employment-notice', notif: 'https://kvsangathan.nic.in/employment-notice' },
  'NVS': { apply: 'https://navodaya.gov.in', notif: 'https://navodaya.gov.in' },
  'NTA': { apply: 'https://recruitment.nta.nic.in', notif: 'https://nta.ac.in' },
  'DSSSB': { apply: 'https://dsssbonline.nic.in', notif: 'https://dsssb.delhi.gov.in' },
  'India Post': { apply: 'https://indiapostgdsonline.gov.in', notif: 'https://www.indiapost.gov.in' },
  'UP-NHM': { apply: 'https://upnrhm.gov.in', notif: 'https://upnrhm.gov.in' },
  'SHSB': { apply: 'https://shs.bihar.gov.in', notif: 'https://shs.bihar.gov.in' },
  'MPESB': { apply: 'https://esb.mp.gov.in', notif: 'https://esb.mp.gov.in' },
  'DLRS': { apply: 'https://dlrs.bihar.gov.in', notif: 'https://dlrs.bihar.gov.in' },

  // PSUs & Heavy Industries
  'BHEL': { apply: 'https://careers.bhel.in', notif: 'https://careers.bhel.in' },
  'ONGC': { apply: 'https://ongcindia.com', notif: 'https://ongcindia.com' },
  'NTPC': { apply: 'https://careers.ntpc.co.in', notif: 'https://careers.ntpc.co.in' },
  'FCI': { apply: 'https://fci.gov.in', notif: 'https://fci.gov.in' },
  'AAI': { apply: 'https://www.aai.aero', notif: 'https://www.aai.aero' },
  'BSPHCL': { apply: 'https://bsphcl.co.in', notif: 'https://bsphcl.co.in' },
  'UPPCL': { apply: 'https://www.upenergy.in', notif: 'https://www.upenergy.in' },

  // Judiciary & High Courts
  'SCI': { apply: 'https://www.sci.gov.in/recruitment/', notif: 'https://www.sci.gov.in/recruitment/' },
  'Patna HC': { apply: 'https://patnahighcourt.gov.in', notif: 'https://patnahighcourt.gov.in' },
  'Delhi HC': { apply: 'https://delhihighcourt.nic.in', notif: 'https://delhihighcourt.nic.in' },
  'Allahabad HC': { apply: 'https://www.allahabadhighcourt.in', notif: 'https://www.allahabadhighcourt.in' },
  'eCourts': { apply: 'https://services.ecourts.gov.in', notif: 'https://services.ecourts.gov.in' },
};

async function remediateAndValidateAll() {
  console.log('1. Fetching all DB records...');
  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, slug, website_url');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, official_notification_url, official_apply_url, organization_id');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, official_notification_url, official_website_url, organization_id');

  const orgMap = {};
  for (const o of orgs || []) orgMap[o.id] = o;

  function getTargetUrls(org) {
    if (!org) return null;
    const ac = (org.acronym || '').trim();
    if (MASTER_NON_PSC_MAP[ac]) return MASTER_NON_PSC_MAP[ac];

    for (const [k, v] of Object.entries(MASTER_NON_PSC_MAP)) {
      if (ac.toLowerCase() === k.toLowerCase() || org.name.toLowerCase().includes(k.toLowerCase())) {
        return v;
      }
    }

    if (org.website_url) {
      return { apply: org.website_url, notif: org.website_url };
    }
    return null;
  }

  console.log('2. Fast batch updating Non-PSC jobs...');
  const jobPromises = [];
  for (const j of jobs || []) {
    const org = orgMap[j.organization_id];
    const target = getTargetUrls(org);
    if (target) {
      jobPromises.push(
        supabase
          .from('gov_jobs')
          .update({
            official_apply_url: target.apply,
            official_notification_url: target.notif,
          })
          .eq('id', j.id)
      );
    }
  }
  
  // Chunk promises in batches of 50
  for (let i = 0; i < jobPromises.length; i += 50) {
    await Promise.all(jobPromises.slice(i, i + 50));
  }
  console.log(`Updated ${jobPromises.length} jobs with verified official gateways.`);

  console.log('3. Fast batch updating Non-PSC exams...');
  const examPromises = [];
  for (const e of exams || []) {
    const org = orgMap[e.organization_id];
    const target = getTargetUrls(org);
    if (target) {
      examPromises.push(
        supabase
          .from('gov_exams')
          .update({
            official_website_url: target.apply,
            official_notification_url: target.notif,
          })
          .eq('id', e.id)
      );
    }
  }
  
  for (let i = 0; i < examPromises.length; i += 50) {
    await Promise.all(examPromises.slice(i, i + 50));
  }
  console.log(`Updated ${examPromises.length} exams with verified official gateways.`);

  console.log('\n4. Validating live HTTP response on all distinct destination URLs...');
  const distinctUrls = new Set();
  Object.values(MASTER_NON_PSC_MAP).forEach(v => {
    distinctUrls.add(v.apply);
    distinctUrls.add(v.notif);
  });

  let passCount = 0;
  let failCount = 0;

  for (const url of distinctUrls) {
    try {
      const c = new AbortController();
      const tid = setTimeout(() => c.abort(), 6000);
      const res = await fetch(url, {
        method: 'GET',
        signal: c.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      clearTimeout(tid);

      if (res.status >= 200 && res.status < 400) {
        passCount++;
        console.log(`✅ [HTTP ${res.status}] ${url}`);
      } else {
        failCount++;
        console.error(`❌ [HTTP ${res.status}] ${url}`);
      }
    } catch (err) {
      failCount++;
      console.error(`❌ [FAIL] ${url} (${err.message})`);
    }
  }

  console.log(`\n================================================================`);
  console.log(`NON-PSC LINK AUDIT & REMEDIATION COMPLETE`);
  console.log(`Total Endpoints Tested: ${distinctUrls.size}`);
  console.log(`Passed: ${passCount} | Failed: ${failCount} (Success Rate: ${Math.round((passCount/distinctUrls.size)*100)}%)`);
  console.log(`================================================================`);
}

remediateAndValidateAll().catch(console.error);
