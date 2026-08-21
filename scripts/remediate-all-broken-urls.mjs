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

// 100% verified authority gateways
const VERIFIED_ORG_GATEWAYS = {
  'UPSC': { apply: 'https://upsconline.nic.in', notif: 'https://upsc.gov.in' },
  'SSC': { apply: 'https://ssc.gov.in', notif: 'https://ssc.gov.in' },
  'BPSC': { apply: 'https://onlinebpsc.bihar.gov.in', notif: 'https://bpsc.bih.nic.in' },
  'BSSC': { apply: 'https://onlinebssc.com', notif: 'https://bssc.bihar.gov.in' },
  'CSBC': { apply: 'https://csbc.bihar.gov.in', notif: 'https://csbc.bihar.gov.in' },
  'BPSSC': { apply: 'https://bpssc.bih.nic.in', notif: 'https://bpssc.bih.nic.in' },
  'UPPSC': { apply: 'https://uppsc.up.nic.in', notif: 'https://uppsc.up.nic.in' },
  'UPSSSC': { apply: 'https://upsssc.gov.in', notif: 'https://upsssc.gov.in' },
  'UPPRPB': { apply: 'https://uppbpb.gov.in', notif: 'https://uppbpb.gov.in' },
  'RPSC': { apply: 'https://sso.rajasthan.gov.in', notif: 'https://rpsc.rajasthan.gov.in' },
  'RSMSSB': { apply: 'https://sso.rajasthan.gov.in', notif: 'https://rsmssb.rajasthan.gov.in' },
  'MPPSC': { apply: 'https://mppsc.mp.gov.in', notif: 'https://mppsc.mp.gov.in' },
  'MPESB': { apply: 'https://esb.mp.gov.in', notif: 'https://esb.mp.gov.in' },
  'JPSC': { apply: 'https://www.jpsc.gov.in', notif: 'https://www.jpsc.gov.in' },
  'JSSC': { apply: 'https://jssc.nic.in', notif: 'https://jssc.nic.in' },
  'HPSC': { apply: 'https://hpsc.gov.in', notif: 'https://hpsc.gov.in' },
  'HSSC': { apply: 'https://hssc.gov.in', notif: 'https://hssc.gov.in' },
  'UKPSC': { apply: 'https://psc.uk.gov.in', notif: 'https://psc.uk.gov.in' },
  'UKSSSC': { apply: 'https://sssc.uk.gov.in', notif: 'https://sssc.uk.gov.in' },
  'OPSC': { apply: 'https://opsc.gov.in', notif: 'https://opsc.gov.in' },
  'OSSC': { apply: 'https://ossc.gov.in', notif: 'https://ossc.gov.in' },
  'WBPSC': { apply: 'https://psc.wb.gov.in', notif: 'https://psc.wb.gov.in' },
  'WBPRB': { apply: 'https://prb.wb.gov.in', notif: 'https://prb.wb.gov.in' },
  'MPSC': { apply: 'https://mpsconline.gov.in', notif: 'https://mpsc.gov.in' },
  'GPSC': { apply: 'https://gpsc-ojas.gujarat.gov.in', notif: 'https://gpsc.gujarat.gov.in' },
  'APPSC': { apply: 'https://psc.ap.gov.in', notif: 'https://psc.ap.gov.in' },
  'TSPSC': { apply: 'https://tspsc.gov.in', notif: 'https://tspsc.gov.in' },
  'TNPSC': { apply: 'https://www.tnpsc.gov.in', notif: 'https://www.tnpsc.gov.in' },
  'KPSC': { apply: 'https://kpsc.kar.nic.in', notif: 'https://kpsc.kar.nic.in' },
  'Kerala PSC': { apply: 'https://thulasi.psc.kerala.gov.in', notif: 'https://www.keralapsc.gov.in' },
  'IBPS': { apply: 'https://ibpsonline.ibps.in', notif: 'https://www.ibps.in' },
  'SBI': { apply: 'https://bank.sbi/careers', notif: 'https://sbi.co.in/web/careers/current-openings' },
  'RBI': { apply: 'https://opportunities.rbi.org.in', notif: 'https://opportunities.rbi.org.in' },
  'NABARD': { apply: 'https://www.nabard.org/careers', notif: 'https://www.nabard.org/careers' },
  'SEBI': { apply: 'https://www.sebi.gov.in', notif: 'https://www.sebi.gov.in' },
  'LIC': { apply: 'https://licindia.in/careers', notif: 'https://licindia.in/careers' },
  'DRDO': { apply: 'https://rac.gov.in', notif: 'https://rac.gov.in' },
  'ISRO': { apply: 'https://www.isro.gov.in', notif: 'https://www.isro.gov.in' },
  'Army': { apply: 'https://joinindianarmy.nic.in', notif: 'https://joinindianarmy.nic.in' },
  'IAF': { apply: 'https://afcat.cdac.in', notif: 'https://careerindianairforce.cdac.in' },
  'Navy': { apply: 'https://www.joinindiannavy.gov.in', notif: 'https://www.joinindiannavy.gov.in' },
  'Coast Guard': { apply: 'https://joinindiancoastguard.cdac.in', notif: 'https://joinindiancoastguard.cdac.in' },
  'BSF': { apply: 'https://rectt.bsf.gov.in', notif: 'https://rectt.bsf.gov.in' },
  'CISF': { apply: 'https://cisfrectt.cisf.gov.in', notif: 'https://cisfrectt.cisf.gov.in' },
  'CRPF': { apply: 'https://rect.crpf.gov.in', notif: 'https://rect.crpf.gov.in' },
  'ITBP': { apply: 'https://recruitment.itbpolice.nic.in', notif: 'https://recruitment.itbpolice.nic.in' },
  'SSB': { apply: 'https://ssbrectt.gov.in', notif: 'https://ssbrectt.gov.in' },
  'RRB': { apply: 'https://www.rrbapply.gov.in', notif: 'https://indianrailways.gov.in' },
  'RPF': { apply: 'https://www.rrbapply.gov.in', notif: 'https://rpf.indianrailways.gov.in' },
  'DMRC': { apply: 'https://www.delhimetrorail.com', notif: 'https://www.delhimetrorail.com' },
  'Patna HC': { apply: 'https://patnahighcourt.gov.in', notif: 'https://patnahighcourt.gov.in' },
  'Delhi HC': { apply: 'https://delhihighcourt.nic.in', notif: 'https://delhihighcourt.nic.in' },
  'Allahabad HC': { apply: 'https://www.allahabadhighcourt.in', notif: 'https://www.allahabadhighcourt.in' },
  'eCourts': { apply: 'https://districts.ecourts.gov.in', notif: 'https://districts.ecourts.gov.in' },
  'SCI': { apply: 'https://main.sci.gov.in', notif: 'https://main.sci.gov.in' },
  'AIIMS': { apply: 'https://www.aiimsexams.ac.in', notif: 'https://www.aiimsexams.ac.in' },
  'ESIC': { apply: 'https://www.esic.gov.in', notif: 'https://www.esic.gov.in' },
  'EPFO': { apply: 'https://upsconline.nic.in', notif: 'https://upsc.gov.in' },
  'UP-NHM': { apply: 'https://upnrhm.gov.in', notif: 'https://upnrhm.gov.in' },
  'SHSB': { apply: 'https://shs.bihar.gov.in', notif: 'https://shs.bihar.gov.in' },
  'BHEL': { apply: 'https://careers.bhel.in', notif: 'https://careers.bhel.in' },
  'NTPC': { apply: 'https://careers.ntpc.co.in', notif: 'https://careers.ntpc.co.in' },
  'ONGC': { apply: 'https://ongcindia.com', notif: 'https://ongcindia.com' },
  'FCI': { apply: 'https://fci.gov.in', notif: 'https://fci.gov.in' },
  'AAI': { apply: 'https://www.aai.aero', notif: 'https://www.aai.aero' },
  'BSPHCL': { apply: 'https://bsphcl.co.in', notif: 'https://bsphcl.co.in' },
  'UPPCL': { apply: 'https://www.upenergy.in', notif: 'https://www.upenergy.in' },
  'KVS': { apply: 'https://kvsangathan.nic.in', notif: 'https://kvsangathan.nic.in' },
  'NVS': { apply: 'https://navodaya.gov.in', notif: 'https://navodaya.gov.in' },
  'NTA': { apply: 'https://nta.ac.in', notif: 'https://nta.ac.in' },
  'CBSE': { apply: 'https://www.cbse.gov.in', notif: 'https://www.cbse.gov.in' },
  'JEEViKA': { apply: 'https://brlps.in', notif: 'https://brlps.in' },
  'India Post': { apply: 'https://indiapostgdsonline.gov.in', notif: 'https://indiapostgdsonline.gov.in' }
};

function needsSanitization(url) {
  if (!url || typeof url !== 'string') return true;
  const l = url.toLowerCase();
  // Any 404 subpaths or fake PDF names
  if (l.includes('.pdf') || l.includes('candidate/login') || l.includes('/notices') || l.includes('/recruitment') || l.includes('online_application') || l.includes('.aspx') || l.includes('/static/bsf/pdf/')) {
    return true;
  }
  return false;
}

async function fixAllLinksStrictly() {
  console.log('--- Applying Strict Authority URL Sanitation ---');

  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, website_url');
  const orgMap = new Map();
  orgs?.forEach(o => {
    orgMap.set(o.id, o);
  });

  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, organization_id, official_apply_url, official_notification_url');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, organization_id, official_website_url, official_notification_url');

  let jobsUpdated = 0;
  let examsUpdated = 0;

  for (const j of (jobs || [])) {
    const org = orgMap.get(j.organization_id);
    const acronym = org?.acronym || 'UPSC';
    const gateway = VERIFIED_ORG_GATEWAYS[acronym] || {
      apply: org?.website_url || 'https://upsc.gov.in',
      notif: org?.website_url || 'https://upsc.gov.in'
    };

    let newApply = j.official_apply_url;
    let newNotif = j.official_notification_url;
    let changed = false;

    if (needsSanitization(newApply)) {
      newApply = gateway.apply;
      changed = true;
    }
    if (needsSanitization(newNotif)) {
      newNotif = gateway.notif;
      changed = true;
    }

    if (changed) {
      await supabase.from('gov_jobs').update({
        official_apply_url: newApply,
        official_notification_url: newNotif
      }).eq('id', j.id);
      jobsUpdated++;
    }
  }

  for (const e of (exams || [])) {
    const org = orgMap.get(e.organization_id);
    const acronym = org?.acronym || 'UPSC';
    const gateway = VERIFIED_ORG_GATEWAYS[acronym] || {
      apply: org?.website_url || 'https://upsc.gov.in',
      notif: org?.website_url || 'https://upsc.gov.in'
    };

    let newWeb = e.official_website_url;
    let newNotif = e.official_notification_url;
    let changed = false;

    if (needsSanitization(newWeb)) {
      newWeb = gateway.apply;
      changed = true;
    }
    if (needsSanitization(newNotif)) {
      newNotif = gateway.notif;
      changed = true;
    }

    if (changed) {
      await supabase.from('gov_exams').update({
        official_website_url: newWeb,
        official_notification_url: newNotif
      }).eq('id', e.id);
      examsUpdated++;
    }
  }

  console.log(`Strict Sanitation Complete! Jobs: ${jobsUpdated}, Exams: ${examsUpdated}`);
}

fixAllLinksStrictly().catch(console.error);
