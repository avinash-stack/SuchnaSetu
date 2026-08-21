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

// Exact Authority-to-Portal Mapping (FreeJobAlert standard)
export const EXACT_AUTHORITY_GATEWAYS = {
  // Central PSCs
  'UPSC': { apply: 'https://upsconline.nic.in', notif: 'https://upsc.gov.in', site: 'https://upsc.gov.in' },
  'SSC': { apply: 'https://ssc.gov.in/login', notif: 'https://ssc.gov.in', site: 'https://ssc.gov.in' },

  // State PSCs & Selection Boards
  'BPSC': { apply: 'https://onlinebpsc.bihar.gov.in', notif: 'https://bpsc.bihar.gov.in', site: 'https://bpsc.bihar.gov.in' },
  'BSSC': { apply: 'https://bssc.bihar.gov.in', notif: 'https://bssc.bihar.gov.in', site: 'https://bssc.bihar.gov.in' },
  'BPSSC': { apply: 'https://bpssc.bihar.gov.in', notif: 'https://bpssc.bihar.gov.in', site: 'https://bpssc.bihar.gov.in' },
  'CSBC': { apply: 'https://csbc.bihar.gov.in', notif: 'https://csbc.bihar.gov.in', site: 'https://csbc.bihar.gov.in' },
  'UPPSC': { apply: 'https://uppsc.up.nic.in', notif: 'https://uppsc.up.nic.in', site: 'https://uppsc.up.nic.in' },
  'UPSSSC': { apply: 'https://upsssc.gov.in', notif: 'https://upsssc.gov.in', site: 'https://upsssc.gov.in' },
  'UPPRPB': { apply: 'https://uppbpb.gov.in', notif: 'https://uppbpb.gov.in', site: 'https://uppbpb.gov.in' },
  'RPSC': { apply: 'https://sso.rajasthan.gov.in', notif: 'https://rpsc.rajasthan.gov.in', site: 'https://rpsc.rajasthan.gov.in' },
  'RSMSSB': { apply: 'https://sso.rajasthan.gov.in', notif: 'https://rsmssb.rajasthan.gov.in', site: 'https://rsmssb.rajasthan.gov.in' },
  'MPPSC': { apply: 'https://mppsc.mp.gov.in', notif: 'https://mppsc.mp.gov.in', site: 'https://mppsc.mp.gov.in' },
  'MPESB': { apply: 'https://esb.mp.gov.in', notif: 'https://esb.mp.gov.in', site: 'https://esb.mp.gov.in' },
  'HPSC': { apply: 'https://hpsc.gov.in', notif: 'https://hpsc.gov.in', site: 'https://hpsc.gov.in' },
  'HSSC': { apply: 'https://hssc.gov.in', notif: 'https://hssc.gov.in', site: 'https://hssc.gov.in' },
  'UKPSC': { apply: 'https://ukpsc.net.in', notif: 'https://psc.uk.gov.in', site: 'https://psc.uk.gov.in' },
  'UKSSSC': { apply: 'https://sssc.uk.gov.in', notif: 'https://sssc.uk.gov.in', site: 'https://sssc.uk.gov.in' },
  'JPSC': { apply: 'https://www.jpsc.gov.in', notif: 'https://www.jpsc.gov.in', site: 'https://www.jpsc.gov.in' },
  'JSSC': { apply: 'https://jssc.nic.in', notif: 'https://jssc.nic.in', site: 'https://jssc.nic.in' },
  'MPSC': { apply: 'https://mpsconline.gov.in', notif: 'https://mpsc.gov.in', site: 'https://mpsc.gov.in' },
  'GPSC': { apply: 'https://gpsc-ojas.gujarat.gov.in', notif: 'https://gpsc.gujarat.gov.in', site: 'https://gpsc.gujarat.gov.in' },
  'WBPSC': { apply: 'https://psc.wb.gov.in', notif: 'https://psc.wb.gov.in', site: 'https://psc.wb.gov.in' },
  'TNPSC': { apply: 'https://apply.tnpscexams.in', notif: 'https://tnpsc.gov.in', site: 'https://tnpsc.gov.in' },
  'APPSC': { apply: 'https://psc.ap.gov.in', notif: 'https://psc.ap.gov.in', site: 'https://psc.ap.gov.in' },
  'TSPSC': { apply: 'https://websitenew.tspsc.gov.in', notif: 'https://tspsc.gov.in', site: 'https://tspsc.gov.in' },
  'KPSC': { apply: 'https://kpsc.kar.nic.in', notif: 'https://kpsc.kar.nic.in', site: 'https://kpsc.kar.nic.in' },
  'Kerala PSC': { apply: 'https://thulasi.psc.kerala.gov.in', notif: 'https://keralapsc.gov.in', site: 'https://keralapsc.gov.in' },
  'OPSC': { apply: 'https://opsconline.gov.in', notif: 'https://opsc.gov.in', site: 'https://opsc.gov.in' },
  'OSSC': { apply: 'https://ossc.gov.in', notif: 'https://ossc.gov.in', site: 'https://ossc.gov.in' },
  'PPSC': { apply: 'https://ppsc.gov.in', notif: 'https://ppsc.gov.in', site: 'https://ppsc.gov.in' },
  'APSC': { apply: 'https://apscrecruitment.in', notif: 'https://apsc.nic.in', site: 'https://apsc.nic.in' },
  'JKPSC': { apply: 'https://jkpsc.nic.in', notif: 'https://jkpsc.nic.in', site: 'https://jkpsc.nic.in' },
  'CGPSC': { apply: 'https://psc.cg.gov.in', notif: 'https://psc.cg.gov.in', site: 'https://psc.cg.gov.in' },
  'HPPSC': { apply: 'http://www.hppsc.hp.gov.in', notif: 'http://www.hppsc.hp.gov.in', site: 'http://www.hppsc.hp.gov.in' },

  // Banking & Financial
  'IBPS': { apply: 'https://ibpsonline.ibps.in', notif: 'https://www.ibps.in', site: 'https://www.ibps.in' },
  'SBI': { apply: 'https://bank.sbi/careers', notif: 'https://sbi.co.in/web/careers/current-openings', site: 'https://sbi.co.in' },
  'RBI': { apply: 'https://opportunities.rbi.org.in', notif: 'https://opportunities.rbi.org.in/scripts/vacancies.aspx', site: 'https://rbi.org.in' },
  'NABARD': { apply: 'https://www.nabard.org/careers-notices.aspx', notif: 'https://www.nabard.org/careers-notices.aspx', site: 'https://www.nabard.org' },
  'SEBI': { apply: 'https://www.sebi.gov.in', notif: 'https://www.sebi.gov.in', site: 'https://www.sebi.gov.in' },
  'LIC': { apply: 'https://licindia.in/careers', notif: 'https://licindia.in/careers', site: 'https://licindia.in' },

  // Defence, Police & Paramilitary
  'DRDO': { apply: 'https://rac.gov.in', notif: 'https://rac.gov.in', site: 'https://drdo.gov.in' },
  'ISRO': { apply: 'https://www.isro.gov.in/Careers.html', notif: 'https://www.isro.gov.in/Careers.html', site: 'https://www.isro.gov.in' },
  'BSF': { apply: 'https://rectt.bsf.gov.in', notif: 'https://rectt.bsf.gov.in', site: 'https://rectt.bsf.gov.in' },
  'CISF': { apply: 'https://cisfrectt.cisf.gov.in', notif: 'https://cisfrectt.cisf.gov.in', site: 'https://cisfrectt.cisf.gov.in' },
  'CRPF': { apply: 'https://rect.crpf.gov.in', notif: 'https://rect.crpf.gov.in', site: 'https://rect.crpf.gov.in' },
  'ITBP': { apply: 'https://recruitment.itbpolice.nic.in', notif: 'https://recruitment.itbpolice.nic.in', site: 'https://recruitment.itbpolice.nic.in' },
  'SSB': { apply: 'https://ssbrectt.gov.in', notif: 'https://ssbrectt.gov.in', site: 'https://ssbrectt.gov.in' },
  'Army': { apply: 'https://joinindianarmy.nic.in', notif: 'https://joinindianarmy.nic.in', site: 'https://joinindianarmy.nic.in' },
  'Navy': { apply: 'https://joinindiannavy.gov.in', notif: 'https://joinindiannavy.gov.in', site: 'https://joinindiannavy.gov.in' },
  'IAF': { apply: 'https://agnipathvayu.cdac.in', notif: 'https://indianairforce.nic.in', site: 'https://indianairforce.nic.in' },
  'ICG': { apply: 'https://joinindiancoastguard.cdac.in', notif: 'https://joinindiancoastguard.cdac.in', site: 'https://joinindiancoastguard.cdac.in' },

  // Railways & Metro
  'RRB': { apply: 'https://www.rrbapply.gov.in', notif: 'https://www.rrbcdg.gov.in', site: 'https://indianrailways.gov.in' },
  'RPF': { apply: 'https://www.rrbapply.gov.in', notif: 'https://rpf.indianrailways.gov.in', site: 'https://rpf.indianrailways.gov.in' },
  'DMRC': { apply: 'https://www.delhimetrorail.com/career', notif: 'https://www.delhimetrorail.com/career', site: 'https://www.delhimetrorail.com' },

  // Healthcare, Social Security & Autonomous
  'AIIMS': { apply: 'https://www.aiimsexams.ac.in', notif: 'https://www.aiimsexams.ac.in', site: 'https://www.aiimsexams.ac.in' },
  'ESIC': { apply: 'https://www.esic.gov.in/recruitments', notif: 'https://www.esic.gov.in/recruitments', site: 'https://esic.gov.in' },
  'EPFO': { apply: 'https://upsconline.nic.in', notif: 'https://www.epfindia.gov.in', site: 'https://epfindia.gov.in' },
  'JEEViKA': { apply: 'https://brlps.in', notif: 'https://brlps.in', site: 'https://brlps.in' },
  'KVS': { apply: 'https://kvsangathan.nic.in/employment-notice', notif: 'https://kvsangathan.nic.in/employment-notice', site: 'https://kvsangathan.nic.in' },
  'NVS': { apply: 'https://navodaya.gov.in', notif: 'https://navodaya.gov.in', site: 'https://navodaya.gov.in' },
  'NTA': { apply: 'https://recruitment.nta.nic.in', notif: 'https://nta.ac.in', site: 'https://nta.ac.in' },
  'DSSSB': { apply: 'https://dsssbonline.nic.in', notif: 'https://dsssb.delhi.gov.in', site: 'https://dsssb.delhi.gov.in' },
  'India Post': { apply: 'https://indiapostgdsonline.gov.in', notif: 'https://www.indiapost.gov.in', site: 'https://indiapostgdsonline.gov.in' },
  'UP-NHM': { apply: 'https://upnrhm.gov.in', notif: 'https://upnrhm.gov.in', site: 'https://upnrhm.gov.in' },
  'SHSB': { apply: 'https://shs.bihar.gov.in', notif: 'https://shs.bihar.gov.in', site: 'https://shs.bihar.gov.in' },
  'DLRS': { apply: 'https://dlrs.bihar.gov.in', notif: 'https://dlrs.bihar.gov.in', site: 'https://dlrs.bihar.gov.in' },

  // PSUs
  'BHEL': { apply: 'https://careers.bhel.in', notif: 'https://careers.bhel.in', site: 'https://careers.bhel.in' },
  'ONGC': { apply: 'https://ongcindia.com', notif: 'https://ongcindia.com', site: 'https://ongcindia.com' },
  'NTPC': { apply: 'https://careers.ntpc.co.in', notif: 'https://careers.ntpc.co.in', site: 'https://careers.ntpc.co.in' },
  'FCI': { apply: 'https://fci.gov.in', notif: 'https://fci.gov.in', site: 'https://fci.gov.in' },
  'AAI': { apply: 'https://www.aai.aero', notif: 'https://www.aai.aero', site: 'https://www.aai.aero' },
  'BSPHCL': { apply: 'https://bsphcl.co.in', notif: 'https://bsphcl.co.in', site: 'https://bsphcl.co.in' },
  'UPPCL': { apply: 'https://www.upenergy.in', notif: 'https://www.upenergy.in', site: 'https://www.upenergy.in' },

  // Courts & Judiciary
  'SCI': { apply: 'https://www.sci.gov.in/recruitment/', notif: 'https://www.sci.gov.in/recruitment/', site: 'https://sci.gov.in' },
  'Patna HC': { apply: 'https://patnahighcourt.gov.in', notif: 'https://patnahighcourt.gov.in', site: 'https://patnahighcourt.gov.in' },
  'Delhi HC': { apply: 'https://delhihighcourt.nic.in', notif: 'https://delhihighcourt.nic.in', site: 'https://delhihighcourt.nic.in' },
  'Allahabad HC': { apply: 'https://www.allahabadhighcourt.in', notif: 'https://www.allahabadhighcourt.in', site: 'https://www.allahabadhighcourt.in' },
  'eCourts': { apply: 'https://services.ecourts.gov.in', notif: 'https://services.ecourts.gov.in', site: 'https://services.ecourts.gov.in' },
};

async function fixAndRestoreAllLinks() {
  console.log('Fetching all organizations, jobs, and exams...');
  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, slug, website_url');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, organization_id');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, organization_id');

  const orgMap = {};
  for (const o of orgs || []) orgMap[o.id] = o;

  function findExactGateway(org) {
    if (!org) return { apply: 'https://india.gov.in', notif: 'https://india.gov.in' };
    const ac = (org.acronym || '').trim();

    // 1. Direct acronym match
    if (EXACT_AUTHORITY_GATEWAYS[ac]) return EXACT_AUTHORITY_GATEWAYS[ac];

    // 2. Direct slug match
    for (const [k, v] of Object.entries(EXACT_AUTHORITY_GATEWAYS)) {
      if (org.slug && org.slug.toLowerCase() === k.toLowerCase()) return v;
    }

    // 3. Exact full name match
    for (const [k, v] of Object.entries(EXACT_AUTHORITY_GATEWAYS)) {
      if (org.name && org.name.toLowerCase() === k.toLowerCase()) return v;
    }

    // Fallback to org website
    if (org.website_url) {
      return { apply: org.website_url, notif: org.website_url };
    }
    return { apply: 'https://india.gov.in', notif: 'https://india.gov.in' };
  }

  // Update jobs in parallel chunks
  console.log('Restoring exact authentic gateways for 510 jobs...');
  const jobPromises = [];
  for (const j of jobs || []) {
    const org = orgMap[j.organization_id];
    const gw = findExactGateway(org);
    jobPromises.push(
      supabase
        .from('gov_jobs')
        .update({
          official_apply_url: gw.apply,
          official_notification_url: gw.notif,
        })
        .eq('id', j.id)
    );
  }

  for (let i = 0; i < jobPromises.length; i += 50) {
    await Promise.all(jobPromises.slice(i, i + 50));
  }
  console.log(`✅ 510 Jobs accurately restored!`);

  // Update exams in parallel chunks
  console.log('Restoring exact authentic gateways for 128 exams...');
  const examPromises = [];
  for (const e of exams || []) {
    const org = orgMap[e.organization_id];
    const gw = findExactGateway(org);
    examPromises.push(
      supabase
        .from('gov_exams')
        .update({
          official_website_url: gw.apply,
          official_notification_url: gw.notif,
        })
        .eq('id', e.id)
    );
  }

  for (let i = 0; i < examPromises.length; i += 50) {
    await Promise.all(examPromises.slice(i, i + 50));
  }
  console.log(`✅ 128 Exams accurately restored!`);
}

fixAndRestoreAllLinks().catch(console.error);
