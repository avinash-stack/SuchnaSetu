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

// Comprehensive Verified Directory of Non-PSC Official Career Gateways
const NON_PSC_GATEWAYS = {
  // Banking & Financial Bodies
  IBPS: { apply: 'https://ibpsonline.ibps.in', notif: 'https://www.ibps.in', site: 'https://www.ibps.in' },
  SBI: { apply: 'https://bank.sbi/web/careers/current-openings', notif: 'https://sbi.co.in/web/careers/current-openings', site: 'https://sbi.co.in' },
  RBI: { apply: 'https://opportunities.rbi.org.in', notif: 'https://opportunities.rbi.org.in/scripts/vacancies.aspx', site: 'https://rbi.org.in' },
  NABARD: { apply: 'https://www.nabard.org/careers-notices.aspx', notif: 'https://www.nabard.org/careers-notices.aspx', site: 'https://www.nabard.org' },
  SEBI: { apply: 'https://www.sebi.gov.in/sebiweb/other/career.jsp', notif: 'https://www.sebi.gov.in/sebiweb/other/career.jsp', site: 'https://www.sebi.gov.in' },
  LIC: { apply: 'https://licindia.in/careers', notif: 'https://licindia.in/careers', site: 'https://licindia.in' },
  NIACL: { apply: 'https://newindia.co.in/recruitment', notif: 'https://newindia.co.in/recruitment', site: 'https://newindia.co.in' },
  BOB: { apply: 'https://www.bankofbaroda.in/careers', notif: 'https://www.bankofbaroda.in/careers', site: 'https://www.bankofbaroda.in' },
  PNB: { apply: 'https://www.pnbindia.in/Recruitment.aspx', notif: 'https://www.pnbindia.in/Recruitment.aspx', site: 'https://www.pnbindia.in' },
  CANARA: { apply: 'https://canarabank.com/careers', notif: 'https://canarabank.com/careers', site: 'https://canarabank.com' },
  SIDBI: { apply: 'https://www.sidbi.in/en/careers', notif: 'https://www.sidbi.in/en/careers', site: 'https://www.sidbi.in' },

  // Defence, Police & Paramilitary
  DRDO: { apply: 'https://rac.gov.in', notif: 'https://www.drdo.gov.in/careers', site: 'https://drdo.gov.in' },
  ISRO: { apply: 'https://www.isro.gov.in/Careers.html', notif: 'https://www.isro.gov.in/Careers.html', site: 'https://www.isro.gov.in' },
  ARMY: { apply: 'https://joinindianarmy.nic.in', notif: 'https://joinindianarmy.nic.in', site: 'https://joinindianarmy.nic.in' },
  INDIANARMY: { apply: 'https://joinindianarmy.nic.in', notif: 'https://joinindianarmy.nic.in', site: 'https://joinindianarmy.nic.in' },
  NAVY: { apply: 'https://www.joinindiannavy.gov.in', notif: 'https://www.joinindiannavy.gov.in', site: 'https://www.joinindiannavy.gov.in' },
  INDIANNAVY: { apply: 'https://www.joinindiannavy.gov.in', notif: 'https://www.joinindiannavy.gov.in', site: 'https://www.joinindiannavy.gov.in' },
  IAF: { apply: 'https://agnipathvayu.cdac.in', notif: 'https://indianairforce.nic.in', site: 'https://indianairforce.nic.in' },
  INDIANAIRFORCE: { apply: 'https://agnipathvayu.cdac.in', notif: 'https://indianairforce.nic.in', site: 'https://indianairforce.nic.in' },
  ICG: { apply: 'https://joinindiancoastguard.cdac.in', notif: 'https://joinindiancoastguard.cdac.in', site: 'https://joinindiancoastguard.cdac.in' },
  COASTGUARD: { apply: 'https://joinindiancoastguard.cdac.in', notif: 'https://joinindiancoastguard.cdac.in', site: 'https://joinindiancoastguard.cdac.in' },
  BSF: { apply: 'https://rectt.bsf.gov.in', notif: 'https://rectt.bsf.gov.in', site: 'https://rectt.bsf.gov.in' },
  CISF: { apply: 'https://cisfrectt.cisf.gov.in', notif: 'https://cisfrectt.cisf.gov.in', site: 'https://cisfrectt.cisf.gov.in' },
  CRPF: { apply: 'https://rect.crpf.gov.in', notif: 'https://rect.crpf.gov.in', site: 'https://rect.crpf.gov.in' },
  ITBP: { apply: 'https://recruitment.itbpolice.nic.in', notif: 'https://recruitment.itbpolice.nic.in', site: 'https://recruitment.itbpolice.nic.in' },
  SSB: { apply: 'https://ssbrectt.gov.in', notif: 'https://ssbrectt.gov.in', site: 'https://ssbrectt.gov.in' },
  ASSAMRIFLES: { apply: 'https://www.assamrifles.gov.in', notif: 'https://www.assamrifles.gov.in', site: 'https://www.assamrifles.gov.in' },

  // Healthcare, Autonomous, Research & Education Bodies
  AIIMS: { apply: 'https://www.aiimsexams.ac.in', notif: 'https://www.aiimsexams.ac.in', site: 'https://www.aiimsexams.ac.in' },
  NTA: { apply: 'https://recruitment.nta.nic.in', notif: 'https://nta.ac.in/NoticeArchive', site: 'https://nta.ac.in' },
  KVS: { apply: 'https://kvsangathan.nic.in/employment-notice', notif: 'https://kvsangathan.nic.in/employment-notice', site: 'https://kvsangathan.nic.in' },
  NVS: { apply: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/', notif: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/', site: 'https://navodaya.gov.in' },
  CBSE: { apply: 'https://www.cbse.gov.in', notif: 'https://www.cbse.gov.in/cbsenew/recruitment.html', site: 'https://www.cbse.gov.in' },
  UGC: { apply: 'https://www.ugc.gov.in/job.aspx', notif: 'https://www.ugc.gov.in/job.aspx', site: 'https://www.ugc.gov.in' },
  CSIR: { apply: 'https://www.csir.res.in/career-opportunities/recruitment', notif: 'https://www.csir.res.in/career-opportunities/recruitment', site: 'https://www.csir.res.in' },
  ICAR: { apply: 'https://icar.org.in/career-opportunities', notif: 'https://icar.org.in/career-opportunities', site: 'https://icar.org.in' },
  ICMR: { apply: 'https://main.icmr.nic.in/career-opportunity', notif: 'https://main.icmr.nic.in/career-opportunity', site: 'https://main.icmr.nic.in' },
  BARC: { apply: 'https://recruit.barc.gov.in', notif: 'https://www.barc.gov.in/careers/', site: 'https://www.barc.gov.in' },
  BIS: { apply: 'https://www.services.bis.gov.in', notif: 'https://www.bis.gov.in/career/', site: 'https://www.bis.gov.in' },
  CDAC: { apply: 'https://www.cdac.in/index.aspx?id=job', notif: 'https://www.cdac.in/index.aspx?id=job', site: 'https://www.cdac.in' },
  ESIC: { apply: 'https://www.esic.gov.in/recruitments', notif: 'https://www.esic.gov.in/recruitments', site: 'https://esic.gov.in' },
  EPFO: { apply: 'https://www.epfindia.gov.in', notif: 'https://www.epfindia.gov.in', site: 'https://www.epfindia.gov.in' },
  INDIAPOST: { apply: 'https://indiapostgdsonline.gov.in', notif: 'https://www.indiapost.gov.in/VAS/Pages/Recruitment.aspx', site: 'https://www.indiapost.gov.in' },

  // High Courts & Judiciary
  SCI: { apply: 'https://www.sci.gov.in/recruitment/', notif: 'https://www.sci.gov.in/recruitment/', site: 'https://sci.gov.in' },
  PHC: { apply: 'https://patnahighcourt.gov.in/recruitment', notif: 'https://patnahighcourt.gov.in/recruitment', site: 'https://patnahighcourt.gov.in' },
  AHC: { apply: 'https://www.allahabadhighcourt.in/calendar/recruitment.html', notif: 'https://www.allahabadhighcourt.in/calendar/recruitment.html', site: 'https://www.allahabadhighcourt.in' },
  DHC: { apply: 'https://delhihighcourt.nic.in/open-positions', notif: 'https://delhihighcourt.nic.in/open-positions', site: 'https://delhihighcourt.nic.in' },
  HCRAJ: { apply: 'https://hcraj.nic.in/hcraj/recruitment.php', notif: 'https://hcraj.nic.in/hcraj/recruitment.php', site: 'https://hcraj.nic.in' },
  BHC: { apply: 'https://bombayhighcourt.nic.in/recruitment.php', notif: 'https://bombayhighcourt.nic.in/recruitment.php', site: 'https://bombayhighcourt.nic.in' },
  CHC: { apply: 'https://calcuttahighcourt.gov.in/Notice-Category/Recruitment', notif: 'https://calcuttahighcourt.gov.in/Notice-Category/Recruitment', site: 'https://calcuttahighcourt.gov.in' },
  MHC: { apply: 'https://www.mhc.tn.gov.in/recruitment/', notif: 'https://www.mhc.tn.gov.in/recruitment/', site: 'https://www.mhc.tn.gov.in' },
  MPHC: { apply: 'https://mphc.gov.in/recruitment-results', notif: 'https://mphc.gov.in/recruitment-results', site: 'https://mphc.gov.in' },
  PHHC: { apply: 'https://highcourtchd.gov.in/?trs=recruitment', notif: 'https://highcourtchd.gov.in/?trs=recruitment', site: 'https://highcourtchd.gov.in' },
  HCGUJ: { apply: 'https://gujarathighcourt.nic.in/current_openings', notif: 'https://gujarathighcourt.nic.in/current_openings', site: 'https://gujarathighcourt.nic.in' },

  // Central PSUs & Enterprises
  ONGC: { apply: 'https://ongcindia.com/web/eng/career', notif: 'https://ongcindia.com/web/eng/career', site: 'https://ongcindia.com' },
  IOCL: { apply: 'https://iocl.com/latest-job-opening', notif: 'https://iocl.com/latest-job-opening', site: 'https://iocl.com' },
  NTPC: { apply: 'https://careers.ntpc.co.in', notif: 'https://careers.ntpc.co.in', site: 'https://careers.ntpc.co.in' },
  BHEL: { apply: 'https://careers.bhel.in', notif: 'https://careers.bhel.in', site: 'https://careers.bhel.in' },
  SAIL: { apply: 'https://sail.co.in/en/careers', notif: 'https://sail.co.in/en/careers', site: 'https://sail.co.in' },
  GAIL: { apply: 'https://gailonline.com/CRApplyingGail.html', notif: 'https://gailonline.com/CRApplyingGail.html', site: 'https://gailonline.com' },
  CIL: { apply: 'https://www.coalindia.in/career-cil/', notif: 'https://www.coalindia.in/career-cil/', site: 'https://www.coalindia.in' },
  BPCL: { apply: 'https://www.bharatpetroleum.in/careers/careers.aspx', notif: 'https://www.bharatpetroleum.in/careers/careers.aspx', site: 'https://www.bharatpetroleum.in' },
  HPCL: { apply: 'https://www.hindustanpetroleum.com/job-openings', notif: 'https://www.hindustanpetroleum.com/job-openings', site: 'https://www.hindustanpetroleum.com' },
  BEL: { apply: 'https://bel-india.in/careers/', notif: 'https://bel-india.in/careers/', site: 'https://bel-india.in' },
  HAL: { apply: 'https://hal-india.co.in/Career_Home.aspx', notif: 'https://hal-india.co.in/Career_Home.aspx', site: 'https://hal-india.co.in' },
  POWERGRID: { apply: 'https://www.powergrid.in/job-opportunities', notif: 'https://www.powergrid.in/job-opportunities', site: 'https://www.powergrid.in' },
  NHPC: { apply: 'https://www.nhpcindia.com/career', notif: 'https://www.nhpcindia.com/career', site: 'https://www.nhpcindia.com' },
  FCI: { apply: 'https://www.fci.gov.in/current-vacancies', notif: 'https://www.fci.gov.in/current-vacancies', site: 'https://fci.gov.in' },
  AAI: { apply: 'https://www.aai.aero/en/careers/recruitment', notif: 'https://www.aai.aero/en/careers/recruitment', site: 'https://www.aai.aero' },
  BTL: { apply: 'https://www.bbjconst.com/career', notif: 'https://www.bbjconst.com/career', site: 'https://www.bbjconst.com' },

  // Autonomous, Research & Education Bodies
  NTA: { apply: 'https://recruitment.nta.nic.in', notif: 'https://nta.ac.in/NoticeArchive', site: 'https://nta.ac.in' },
  KVS: { apply: 'https://kvsangathan.nic.in/employment-notice', notif: 'https://kvsangathan.nic.in/employment-notice', site: 'https://kvsangathan.nic.in' },
  NVS: { apply: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/', notif: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/', site: 'https://navodaya.gov.in' },
  CBSE: { apply: 'https://www.cbse.gov.in', notif: 'https://www.cbse.gov.in/cbsenew/recruitment.html', site: 'https://www.cbse.gov.in' },
  UGC: { apply: 'https://www.ugc.gov.in/job.aspx', notif: 'https://www.ugc.gov.in/job.aspx', site: 'https://www.ugc.gov.in' },
  CSIR: { apply: 'https://www.csir.res.in/career-opportunities/recruitment', notif: 'https://www.csir.res.in/career-opportunities/recruitment', site: 'https://www.csir.res.in' },
  ICAR: { apply: 'https://icar.org.in/career-opportunities', notif: 'https://icar.org.in/career-opportunities', site: 'https://icar.org.in' },
  ICMR: { apply: 'https://main.icmr.nic.in/career-opportunity', notif: 'https://main.icmr.nic.in/career-opportunity', site: 'https://main.icmr.nic.in' },
  BARC: { apply: 'https://recruit.barc.gov.in', notif: 'https://www.barc.gov.in/careers/', site: 'https://www.barc.gov.in' },
  BIS: { apply: 'https://www.services.bis.gov.in', notif: 'https://www.bis.gov.in/career/', site: 'https://www.bis.gov.in' },
  CDAC: { apply: 'https://www.cdac.in/index.aspx?id=job', notif: 'https://www.cdac.in/index.aspx?id=job', site: 'https://www.cdac.in' },
  ESIC: { apply: 'https://www.esic.gov.in/recruitments', notif: 'https://www.esic.gov.in/recruitments', site: 'https://esic.gov.in' },
  EPFO: { apply: 'https://www.epfindia.gov.in/site_en/Recruitments.php', notif: 'https://www.epfindia.gov.in/site_en/Recruitments.php', site: 'https://www.epfindia.gov.in' },
  INDIAPOST: { apply: 'https://indiapostgdsonline.gov.in', notif: 'https://www.indiapost.gov.in/VAS/Pages/Recruitment.aspx', site: 'https://www.indiapost.gov.in' },
};

async function remediateAllNonPsc() {
  console.log('Fetching all organizations, jobs, and exams...');
  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, slug, type, jurisdiction, website_url');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, official_notification_url, official_apply_url, organization_id');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, official_notification_url, official_website_url, organization_id');

  const orgMap = {};
  for (const o of orgs || []) orgMap[o.id] = o;

  function findGateway(org) {
    if (!org) return null;
    const ac = (org.acronym || '').toUpperCase().trim();
    const nm = (org.name || '').toUpperCase().trim();

    if (NON_PSC_GATEWAYS[ac]) return NON_PSC_GATEWAYS[ac];

    for (const [k, v] of Object.entries(NON_PSC_GATEWAYS)) {
      if (ac.includes(k) || k.includes(ac) || nm.includes(k) || org.slug?.toUpperCase().includes(k)) {
        return v;
      }
    }

    return {
      apply: org.website_url || 'https://india.gov.in',
      notif: org.website_url || 'https://india.gov.in',
      site: org.website_url || 'https://india.gov.in'
    };
  }

  // Update jobs
  console.log('Remediating Non-PSC Jobs in parallel chunks...');
  const jobUpdates = [];
  for (const j of jobs || []) {
    const org = orgMap[j.organization_id];
    const gw = findGateway(org);

    let newApply = j.official_apply_url;
    let newNotif = j.official_notification_url;

    const isBrokenNotif = !newNotif ||
      newNotif.includes('.pdf') ||
      newNotif.includes('/null') ||
      newNotif.includes('undefined') ||
      newNotif.includes('isac.gov.in');

    const isBrokenApply = !newApply ||
      newApply.includes('/null') ||
      newApply.includes('undefined') ||
      newApply.includes('.pdf') ||
      newApply.includes('isac.gov.in');

    if (gw) {
      if (isBrokenNotif) newNotif = gw.notif;
      if (isBrokenApply) newApply = gw.apply;
    }

    if (newApply !== j.official_apply_url || newNotif !== j.official_notification_url) {
      jobUpdates.push(
        supabase
          .from('gov_jobs')
          .update({ official_apply_url: newApply, official_notification_url: newNotif })
          .eq('id', j.id)
      );
    }
  }

  await Promise.all(jobUpdates);
  console.log(`✅ Remediated ${jobUpdates.length} Jobs!`);

  // Update exams
  console.log('Remediating Non-PSC Exams in parallel chunks...');
  const examUpdates = [];
  for (const e of exams || []) {
    const org = orgMap[e.organization_id];
    const gw = findGateway(org);

    let newApply = e.official_website_url;
    let newNotif = e.official_notification_url;

    const isBrokenNotif = !newNotif ||
      newNotif.includes('.pdf') ||
      newNotif.includes('/null') ||
      newNotif.includes('undefined') ||
      newNotif.includes('isac.gov.in');

    const isBrokenApply = !newApply ||
      newApply.includes('/null') ||
      newApply.includes('undefined') ||
      newApply.includes('isac.gov.in');

    if (gw) {
      if (isBrokenNotif) newNotif = gw.notif;
      if (isBrokenApply) newApply = gw.apply;
    }

    if (newApply !== e.official_website_url || newNotif !== e.official_notification_url) {
      examUpdates.push(
        supabase
          .from('gov_exams')
          .update({ official_website_url: newApply, official_notification_url: newNotif })
          .eq('id', e.id)
      );
    }
  }

  await Promise.all(examUpdates);
  console.log(`✅ Remediated ${examUpdates.length} Exams!`);
}

remediateAllNonPsc().catch(console.error);
