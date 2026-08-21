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

// Comprehensive Official Commission Gateways (Exact authentic portals matching FreeJobAlert standard)
const OFFICIAL_PORTAL_REGISTRY = {
  // Central & National Recruiting Bodies
  UPSC: {
    apply: 'https://upsconline.nic.in',
    notif: 'https://upsc.gov.in/recruitment/recruitment-advertisement',
    admit: 'https://upsconline.nic.in/eadmitcard/',
    site: 'https://upsc.gov.in'
  },
  SSC: {
    apply: 'https://ssc.gov.in',
    notif: 'https://ssc.gov.in/notices/recruitment',
    admit: 'https://ssc.gov.in',
    site: 'https://ssc.gov.in'
  },
  RRB: {
    apply: 'https://rrbapply.gov.in',
    notif: 'https://www.rrbcdg.gov.in',
    admit: 'https://rrbapply.gov.in',
    site: 'https://indianrailways.gov.in'
  },
  IBPS: {
    apply: 'https://ibpsonline.ibps.in',
    notif: 'https://www.ibps.in',
    admit: 'https://ibpsonline.ibps.in',
    site: 'https://www.ibps.in'
  },
  SBI: {
    apply: 'https://bank.sbi/web/careers/current-openings',
    notif: 'https://sbi.co.in/web/careers/current-openings',
    admit: 'https://bank.sbi/web/careers/current-openings',
    site: 'https://sbi.co.in'
  },
  NTA: {
    apply: 'https://recruitment.nta.nic.in',
    notif: 'https://nta.ac.in/NoticeArchive',
    admit: 'https://recruitment.nta.nic.in',
    site: 'https://nta.ac.in'
  },
  DRDO: {
    apply: 'https://rac.gov.in',
    notif: 'https://www.drdo.gov.in/careers',
    admit: 'https://rac.gov.in',
    site: 'https://drdo.gov.in'
  },
  ISRO: {
    apply: 'https://www.isro.gov.in/Careers.html',
    notif: 'https://www.isro.gov.in/Careers.html',
    admit: 'https://www.isro.gov.in/Careers.html',
    site: 'https://www.isro.gov.in'
  },
  ESIC: {
    apply: 'https://www.esic.gov.in/recruitments',
    notif: 'https://www.esic.gov.in/recruitments',
    admit: 'https://www.esic.gov.in/recruitments',
    site: 'https://esic.gov.in'
  },
  EPFO: {
    apply: 'https://www.epfindia.gov.in/site_en/Recruitments.php',
    notif: 'https://www.epfindia.gov.in/site_en/Recruitments.php',
    admit: 'https://www.epfindia.gov.in/site_en/Recruitments.php',
    site: 'https://www.epfindia.gov.in'
  },
  SCI: {
    apply: 'https://www.sci.gov.in/recruitment/',
    notif: 'https://www.sci.gov.in/recruitment/',
    admit: 'https://www.sci.gov.in/recruitment/',
    site: 'https://sci.gov.in'
  },
  FCI: {
    apply: 'https://www.fci.gov.in/current-vacancies',
    notif: 'https://www.fci.gov.in/current-vacancies',
    admit: 'https://www.fci.gov.in/current-vacancies',
    site: 'https://fci.gov.in'
  },
  KVS: {
    apply: 'https://kvsangathan.nic.in/employment-notice',
    notif: 'https://kvsangathan.nic.in/employment-notice',
    admit: 'https://kvsangathan.nic.in/employment-notice',
    site: 'https://kvsangathan.nic.in'
  },
  NVS: {
    apply: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/',
    notif: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/',
    admit: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/',
    site: 'https://navodaya.gov.in'
  },
  CBSE: {
    apply: 'https://www.cbse.gov.in',
    notif: 'https://www.cbse.gov.in/cbsenew/recruitment.html',
    admit: 'https://www.cbse.gov.in',
    site: 'https://www.cbse.gov.in'
  },
  DSSSB: {
    apply: 'https://dsssbonline.nic.in',
    notif: 'https://dsssb.delhi.gov.in/current-vacancies',
    admit: 'https://dsssbonline.nic.in',
    site: 'https://dsssb.delhi.gov.in'
  },

  // State Commissions: Bihar
  BPSC: {
    apply: 'https://onlinebpsc.bihar.gov.in',
    notif: 'https://bpsc.bihar.gov.in',
    admit: 'https://onlinebpsc.bihar.gov.in',
    site: 'https://bpsc.bihar.gov.in'
  },
  BSSC: {
    apply: 'https://online.bssc.bihar.gov.in',
    notif: 'https://bssc.bihar.gov.in/NoticeBoard.htm',
    admit: 'https://online.bssc.bihar.gov.in',
    site: 'https://bssc.bihar.gov.in'
  },
  CSBC: {
    apply: 'https://csbc.bihar.gov.in',
    notif: 'https://csbc.bihar.gov.in',
    admit: 'https://csbc.bihar.gov.in',
    site: 'https://csbc.bihar.gov.in'
  },
  BPSSC: {
    apply: 'https://bpssc.bihar.gov.in',
    notif: 'https://bpssc.bihar.gov.in',
    admit: 'https://bpssc.bihar.gov.in',
    site: 'https://bpssc.bihar.gov.in'
  },
  PHC: {
    apply: 'https://patnahighcourt.gov.in/recruitment',
    notif: 'https://patnahighcourt.gov.in/recruitment',
    admit: 'https://patnahighcourt.gov.in/recruitment',
    site: 'https://patnahighcourt.gov.in'
  },
  BTESC: {
    apply: 'https://btsc.bihar.gov.in',
    notif: 'https://btsc.bihar.gov.in',
    admit: 'https://btsc.bihar.gov.in',
    site: 'https://btsc.bihar.gov.in'
  },

  // State Commissions: Uttar Pradesh
  UPPSC: {
    apply: 'https://otr.pariksha.nic.in',
    notif: 'https://uppsc.up.nic.in/AllNotifications.aspx',
    admit: 'https://uppsc.up.nic.in',
    site: 'https://uppsc.up.nic.in'
  },
  UPSSSC: {
    apply: 'https://upsssc.gov.in/AllNotifications.aspx',
    notif: 'https://upsssc.gov.in/AllNotifications.aspx',
    admit: 'https://upsssc.gov.in',
    site: 'https://upsssc.gov.in'
  },
  UPPRPB: {
    apply: 'https://uppbpb.gov.in',
    notif: 'https://uppbpb.gov.in',
    admit: 'https://uppbpb.gov.in',
    site: 'https://uppbpb.gov.in'
  },
  AHC: {
    apply: 'https://www.allahabadhighcourt.in/calendar/recruitment.html',
    notif: 'https://www.allahabadhighcourt.in/calendar/recruitment.html',
    admit: 'https://www.allahabadhighcourt.in/calendar/recruitment.html',
    site: 'https://www.allahabadhighcourt.in'
  },

  // State Commissions: Rajasthan
  RPSC: {
    apply: 'https://sso.rajasthan.gov.in',
    notif: 'https://rpsc.rajasthan.gov.in/news',
    admit: 'https://sso.rajasthan.gov.in',
    site: 'https://rpsc.rajasthan.gov.in'
  },
  RSMSSB: {
    apply: 'https://sso.rajasthan.gov.in',
    notif: 'https://rsmssb.rajasthan.gov.in/page?menuName=Apraj',
    admit: 'https://sso.rajasthan.gov.in',
    site: 'https://rsmssb.rajasthan.gov.in'
  },
  HCRAJ: {
    apply: 'https://hcraj.nic.in/hcraj/recruitment.php',
    notif: 'https://hcraj.nic.in/hcraj/recruitment.php',
    admit: 'https://hcraj.nic.in/hcraj/recruitment.php',
    site: 'https://hcraj.nic.in'
  },

  // State Commissions: Madhya Pradesh
  MPPSC: {
    apply: 'https://mponline.gov.in/portal/services/mppsc/exam.aspx',
    notif: 'https://mppsc.mp.gov.in/advertisement',
    admit: 'https://mppsc.mp.gov.in',
    site: 'https://mppsc.mp.gov.in'
  },
  MPESB: {
    apply: 'https://esb.mp.gov.in',
    notif: 'https://esb.mp.gov.in/e_default.html',
    admit: 'https://esb.mp.gov.in',
    site: 'https://esb.mp.gov.in'
  },
  MPHC: {
    apply: 'https://mphc.gov.in/recruitment-results',
    notif: 'https://mphc.gov.in/recruitment-results',
    admit: 'https://mphc.gov.in/recruitment-results',
    site: 'https://mphc.gov.in'
  },

  // State Commissions: Maharashtra
  MPSC: {
    apply: 'https://mpsconline.gov.in',
    notif: 'https://mpsc.gov.in/adv_notifications',
    admit: 'https://mpsconline.gov.in',
    site: 'https://mpsc.gov.in'
  },

  // State Commissions: West Bengal
  WBPSC: {
    apply: 'https://psc.wb.gov.in',
    notif: 'https://psc.wb.gov.in',
    admit: 'https://psc.wb.gov.in',
    site: 'https://psc.wb.gov.in'
  },
  WBPRB: {
    apply: 'https://prb.wb.gov.in',
    notif: 'https://prb.wb.gov.in',
    admit: 'https://prb.wb.gov.in',
    site: 'https://prb.wb.gov.in'
  },

  // State Commissions: Haryana & Punjab
  HPSC: {
    apply: 'https://hpsc.gov.in/en-us/Advertisements',
    notif: 'https://hpsc.gov.in/en-us/Advertisements',
    admit: 'https://hpsc.gov.in',
    site: 'https://hpsc.gov.in'
  },
  HSSC: {
    apply: 'https://hssc.gov.in',
    notif: 'https://hssc.gov.in/advertisements',
    admit: 'https://hssc.gov.in',
    site: 'https://hssc.gov.in'
  },
  PPSC: {
    apply: 'https://ppsc.gov.in',
    notif: 'https://ppsc.gov.in/openadv.aspx',
    admit: 'https://ppsc.gov.in',
    site: 'https://ppsc.gov.in'
  },

  // State Commissions: Gujarat
  GPSC: {
    apply: 'https://gpsc-ojas.gujarat.gov.in',
    notif: 'https://gpsc.gujarat.gov.in/AdvtList',
    admit: 'https://gpsc-ojas.gujarat.gov.in',
    site: 'https://gpsc.gujarat.gov.in'
  },
  GSSSB: {
    apply: 'https://ojas.gujarat.gov.in',
    notif: 'https://gsssb.gujarat.gov.in',
    admit: 'https://ojas.gujarat.gov.in',
    site: 'https://gsssb.gujarat.gov.in'
  },

  // State Commissions: Tamil Nadu, Kerala, Karnataka, Andhra & Telangana
  TNPSC: {
    apply: 'https://apply.tnpscexams.in',
    notif: 'https://www.tnpsc.gov.in/english/notifications.aspx',
    admit: 'https://apply.tnpscexams.in',
    site: 'https://www.tnpsc.gov.in'
  },
  KPSC: {
    apply: 'https://thulasi.psc.kerala.gov.in/thulasi/',
    notif: 'https://www.keralapsc.gov.in/notifications',
    admit: 'https://thulasi.psc.kerala.gov.in',
    site: 'https://www.keralapsc.gov.in'
  },
  KARPSC: {
    apply: 'https://kpsc.kar.nic.in',
    notif: 'https://kpsc.kar.nic.in/notifications.html',
    admit: 'https://kpsc.kar.nic.in',
    site: 'https://kpsc.kar.nic.in'
  },
  APPSC: {
    apply: 'https://psc.ap.gov.in',
    notif: 'https://psc.ap.gov.in/Default.aspx',
    admit: 'https://psc.ap.gov.in',
    site: 'https://psc.ap.gov.in'
  },
  TSPSC: {
    apply: 'https://websitenew.tspsc.gov.in',
    notif: 'https://websitenew.tspsc.gov.in/directrecruitment',
    admit: 'https://websitenew.tspsc.gov.in',
    site: 'https://websitenew.tspsc.gov.in'
  },

  // State Commissions: Odisha, Jharkhand, Chhattisgarh, Assam
  OPSC: {
    apply: 'https://www.opsc.gov.in',
    notif: 'https://www.opsc.gov.in/Public/WhatsNew.aspx',
    admit: 'https://www.opsc.gov.in',
    site: 'https://www.opsc.gov.in'
  },
  OSSC: {
    apply: 'https://www.ossc.gov.in',
    notif: 'https://www.ossc.gov.in/Public/Pages/Advertisement.aspx',
    admit: 'https://www.ossc.gov.in',
    site: 'https://www.ossc.gov.in'
  },
  JPSC: {
    apply: 'https://www.jpsc.gov.in',
    notif: 'https://www.jpsc.gov.in/recruitment.php',
    admit: 'https://www.jpsc.gov.in',
    site: 'https://www.jpsc.gov.in'
  },
  JSSC: {
    apply: 'https://jssc.nic.in/notices/advertisements',
    notif: 'https://jssc.nic.in/notices/advertisements',
    admit: 'https://jssc.nic.in',
    site: 'https://jssc.nic.in'
  },
  CGPSC: {
    apply: 'https://psc.cg.gov.in',
    notif: 'https://psc.cg.gov.in/advertisement.htm',
    admit: 'https://psc.cg.gov.in',
    site: 'https://psc.cg.gov.in'
  },
  APSC: {
    apply: 'https://apscrecruitment.in',
    notif: 'https://apsc.nic.in/advt_2026.asp',
    admit: 'https://apscrecruitment.in',
    site: 'https://apsc.nic.in'
  },

  // State Commissions: Uttarakhand, Himachal Pradesh, Jammu & Kashmir
  UKPSC: {
    apply: 'https://ukpsc.net.in',
    notif: 'https://psc.uk.gov.in/recruitment',
    admit: 'https://ukpsc.net.in',
    site: 'https://psc.uk.gov.in'
  },
  HPPSC: {
    apply: 'http://hppsconline.hp.gov.in/HPPSC/ApplicantRegistration.aspx',
    notif: 'http://www.hppsc.hp.gov.in/hppsc/All-Notifications',
    admit: 'http://hppsconline.hp.gov.in',
    site: 'http://www.hppsc.hp.gov.in'
  },
  JKPSC: {
    apply: 'https://jkpsc.nic.in',
    notif: 'https://jkpsc.nic.in/Notifications.html',
    admit: 'https://jkpsc.nic.in',
    site: 'https://jkpsc.nic.in'
  },
  JKSSB: {
    apply: 'https://jkssb.nic.in',
    notif: 'https://jkssb.nic.in/Pages/Applicant/Advertisement.aspx',
    admit: 'https://jkssb.nic.in',
    site: 'https://jkssb.nic.in'
  },

  // Postal & Defence Services
  INDIAPOST: {
    apply: 'https://indiapostgdsonline.gov.in',
    notif: 'https://www.indiapost.gov.in/VAS/Pages/Recruitment.aspx',
    admit: 'https://indiapostgdsonline.gov.in',
    site: 'https://www.indiapost.gov.in'
  },
  INDIANARMY: {
    apply: 'https://joinindianarmy.nic.in',
    notif: 'https://joinindianarmy.nic.in',
    admit: 'https://joinindianarmy.nic.in',
    site: 'https://joinindianarmy.nic.in'
  },
  INDIANNAVY: {
    apply: 'https://www.joinindiannavy.gov.in',
    notif: 'https://www.joinindiannavy.gov.in',
    admit: 'https://www.joinindiannavy.gov.in',
    site: 'https://www.joinindiannavy.gov.in'
  },
  INDIANAIRFORCE: {
    apply: 'https://agnipathvayu.cdac.in',
    notif: 'https://careerindianairforce.cdac.in',
    admit: 'https://agnipathvayu.cdac.in',
    site: 'https://careerindianairforce.cdac.in'
  },
};

async function remediateAllLinks() {
  console.log('Fetching organizations, jobs, and exams from DB...');
  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, website_url');
  const { data: jobs } = await supabase.from('gov_jobs').select('id, title, notification_number, official_notification_url, official_apply_url, organization_id');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, exam_code, official_notification_url, official_website_url, organization_id');

  const orgLookup = {};
  for (const o of orgs || []) {
    orgLookup[o.id] = o;
  }

  function getGateway(org) {
    if (!org) return null;
    const ac = (org.acronym || '').toUpperCase().trim();
    if (OFFICIAL_PORTAL_REGISTRY[ac]) return OFFICIAL_PORTAL_REGISTRY[ac];

    // Try matching partial acronym or name
    for (const [key, val] of Object.entries(OFFICIAL_PORTAL_REGISTRY)) {
      if (ac.includes(key) || key.includes(ac) || org.name.toUpperCase().includes(key)) {
        return val;
      }
    }

    return {
      apply: org.website_url || 'https://india.gov.in',
      notif: org.website_url || 'https://india.gov.in',
      admit: org.website_url || 'https://india.gov.in',
      site: org.website_url || 'https://india.gov.in'
    };
  }

  // 1. Remediate Jobs
  console.log(`\nRemediating ${jobs?.length} Government Jobs...`);
  let jobsUpdated = 0;

  for (const job of jobs || []) {
    const org = orgLookup[job.organization_id];
    const gateway = getGateway(org);

    let newApply = job.official_apply_url;
    let newNotif = job.official_notification_url;

    // Check if notification URL is placeholder/404
    const isPlaceholderNotif = !newNotif ||
      newNotif.includes('notice.pdf') ||
      newNotif.includes('advt.pdf') ||
      newNotif.includes('CRPD_PO_2026') ||
      newNotif.includes('ALP.pdf') ||
      newNotif.includes('Scientist_B') ||
      newNotif.endsWith('/null') ||
      newNotif.endsWith('/undefined');

    // Check if apply URL is placeholder or broken
    const isPlaceholderApply = !newApply ||
      newApply.includes('/undefined') ||
      newApply.includes('/null') ||
      newApply.endsWith('.pdf');

    if (gateway) {
      if (isPlaceholderNotif) {
        newNotif = gateway.notif;
      }
      if (isPlaceholderApply) {
        newApply = gateway.apply;
      }
    }

    if (newApply !== job.official_apply_url || newNotif !== job.official_notification_url) {
      await supabase
        .from('gov_jobs')
        .update({
          official_apply_url: newApply,
          official_notification_url: newNotif,
        })
        .eq('id', job.id);
      jobsUpdated++;
    }
  }

  console.log(`✅ Remediated ${jobsUpdated} job links.`);

  // 2. Remediate Exams
  console.log(`\nRemediating ${exams?.length} Government Exams...`);
  let examsUpdated = 0;

  for (const exam of exams || []) {
    const org = orgLookup[exam.organization_id];
    const gateway = getGateway(org);

    let newApply = exam.official_website_url;
    let newNotif = exam.official_notification_url;

    const isPlaceholderNotif = !newNotif ||
      newNotif.includes('notice.pdf') ||
      newNotif.includes('advt.pdf') ||
      newNotif.endsWith('/null') ||
      newNotif.endsWith('/undefined');

    const isPlaceholderApply = !newApply ||
      newApply.includes('/undefined') ||
      newApply.includes('/null');

    if (gateway) {
      if (isPlaceholderNotif) {
        newNotif = gateway.notif;
      }
      if (isPlaceholderApply) {
        newApply = gateway.apply;
      }
    }

    if (newApply !== exam.official_website_url || newNotif !== exam.official_notification_url) {
      await supabase
        .from('gov_exams')
        .update({
          official_website_url: newApply,
          official_notification_url: newNotif,
        })
        .eq('id', exam.id);
      examsUpdated++;
    }
  }

  console.log(`✅ Remediated ${examsUpdated} exam links.`);
}

remediateAllLinks().catch(console.error);
