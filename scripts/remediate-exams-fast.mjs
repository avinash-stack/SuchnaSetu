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

const OFFICIAL_PORTAL_REGISTRY = {
  UPSC: { apply: 'https://upsconline.nic.in', notif: 'https://upsc.gov.in/recruitment/recruitment-advertisement', site: 'https://upsc.gov.in' },
  SSC: { apply: 'https://ssc.gov.in', notif: 'https://ssc.gov.in/notices/recruitment', site: 'https://ssc.gov.in' },
  RRB: { apply: 'https://rrbapply.gov.in', notif: 'https://www.rrbcdg.gov.in', site: 'https://indianrailways.gov.in' },
  IBPS: { apply: 'https://ibpsonline.ibps.in', notif: 'https://www.ibps.in', site: 'https://www.ibps.in' },
  SBI: { apply: 'https://bank.sbi/web/careers/current-openings', notif: 'https://sbi.co.in/web/careers/current-openings', site: 'https://sbi.co.in' },
  NTA: { apply: 'https://recruitment.nta.nic.in', notif: 'https://nta.ac.in/NoticeArchive', site: 'https://nta.ac.in' },
  DRDO: { apply: 'https://rac.gov.in', notif: 'https://www.drdo.gov.in/careers', site: 'https://drdo.gov.in' },
  ISRO: { apply: 'https://www.isro.gov.in/Careers.html', notif: 'https://www.isro.gov.in/Careers.html', site: 'https://www.isro.gov.in' },
  ESIC: { apply: 'https://www.esic.gov.in/recruitments', notif: 'https://www.esic.gov.in/recruitments', site: 'https://esic.gov.in' },
  EPFO: { apply: 'https://www.epfindia.gov.in/site_en/Recruitments.php', notif: 'https://www.epfindia.gov.in/site_en/Recruitments.php', site: 'https://www.epfindia.gov.in' },
  SCI: { apply: 'https://www.sci.gov.in/recruitment/', notif: 'https://www.sci.gov.in/recruitment/', site: 'https://sci.gov.in' },
  FCI: { apply: 'https://www.fci.gov.in/current-vacancies', notif: 'https://www.fci.gov.in/current-vacancies', site: 'https://fci.gov.in' },
  KVS: { apply: 'https://kvsangathan.nic.in/employment-notice', notif: 'https://kvsangathan.nic.in/employment-notice', site: 'https://kvsangathan.nic.in' },
  NVS: { apply: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/', notif: 'https://navodaya.gov.in/nvs/en/Recruitment/Notification-Vacancies/', site: 'https://navodaya.gov.in' },
  DSSSB: { apply: 'https://dsssbonline.nic.in', notif: 'https://dsssb.delhi.gov.in/current-vacancies', site: 'https://dsssb.delhi.gov.in' },
  BPSC: { apply: 'https://onlinebpsc.bihar.gov.in', notif: 'https://bpsc.bihar.gov.in', site: 'https://bpsc.bihar.gov.in' },
  BSSC: { apply: 'https://online.bssc.bihar.gov.in', notif: 'https://bssc.bihar.gov.in/NoticeBoard.htm', site: 'https://bssc.bihar.gov.in' },
  CSBC: { apply: 'https://csbc.bihar.gov.in', notif: 'https://csbc.bihar.gov.in', site: 'https://csbc.bihar.gov.in' },
  BPSSC: { apply: 'https://bpssc.bihar.gov.in', notif: 'https://bpssc.bihar.gov.in', site: 'https://bpssc.bihar.gov.in' },
  PHC: { apply: 'https://patnahighcourt.gov.in/recruitment', notif: 'https://patnahighcourt.gov.in/recruitment', site: 'https://patnahighcourt.gov.in' },
  UPPSC: { apply: 'https://otr.pariksha.nic.in', notif: 'https://uppsc.up.nic.in/AllNotifications.aspx', site: 'https://uppsc.up.nic.in' },
  UPSSSC: { apply: 'https://upsssc.gov.in/AllNotifications.aspx', notif: 'https://upsssc.gov.in/AllNotifications.aspx', site: 'https://upsssc.gov.in' },
  UPPRPB: { apply: 'https://uppbpb.gov.in', notif: 'https://uppbpb.gov.in', site: 'https://uppbpb.gov.in' },
  AHC: { apply: 'https://www.allahabadhighcourt.in/calendar/recruitment.html', notif: 'https://www.allahabadhighcourt.in/calendar/recruitment.html', site: 'https://www.allahabadhighcourt.in' },
  RPSC: { apply: 'https://sso.rajasthan.gov.in', notif: 'https://rpsc.rajasthan.gov.in/news', site: 'https://rpsc.rajasthan.gov.in' },
  RSMSSB: { apply: 'https://sso.rajasthan.gov.in', notif: 'https://rsmssb.rajasthan.gov.in/page?menuName=Apraj', site: 'https://rsmssb.rajasthan.gov.in' },
  HCRAJ: { apply: 'https://hcraj.nic.in/hcraj/recruitment.php', notif: 'https://hcraj.nic.in/hcraj/recruitment.php', site: 'https://hcraj.nic.in' },
  MPPSC: { apply: 'https://mponline.gov.in/portal/services/mppsc/exam.aspx', notif: 'https://mppsc.mp.gov.in/advertisement', site: 'https://mppsc.mp.gov.in' },
  MPESB: { apply: 'https://esb.mp.gov.in', notif: 'https://esb.mp.gov.in/e_default.html', site: 'https://esb.mp.gov.in' },
  MPSC: { apply: 'https://mpsconline.gov.in', notif: 'https://mpsc.gov.in/adv_notifications', site: 'https://mpsc.gov.in' },
  WBPSC: { apply: 'https://psc.wb.gov.in', notif: 'https://psc.wb.gov.in', site: 'https://psc.wb.gov.in' },
  HPSC: { apply: 'https://hpsc.gov.in/en-us/Advertisements', notif: 'https://hpsc.gov.in/en-us/Advertisements', site: 'https://hpsc.gov.in' },
  HSSC: { apply: 'https://hssc.gov.in', notif: 'https://hssc.gov.in/advertisements', site: 'https://hssc.gov.in' },
  GPSC: { apply: 'https://gpsc-ojas.gujarat.gov.in', notif: 'https://gpsc.gujarat.gov.in/AdvtList', site: 'https://gpsc.gujarat.gov.in' },
  TNPSC: { apply: 'https://apply.tnpscexams.in', notif: 'https://www.tnpsc.gov.in/english/notifications.aspx', site: 'https://www.tnpsc.gov.in' },
  KPSC: { apply: 'https://thulasi.psc.kerala.gov.in/thulasi/', notif: 'https://www.keralapsc.gov.in/notifications', site: 'https://www.keralapsc.gov.in' },
  KARPSC: { apply: 'https://kpsc.kar.nic.in', notif: 'https://kpsc.kar.nic.in/notifications.html', site: 'https://kpsc.kar.nic.in' },
  APPSC: { apply: 'https://psc.ap.gov.in', notif: 'https://psc.ap.gov.in/Default.aspx', site: 'https://psc.ap.gov.in' },
  TSPSC: { apply: 'https://websitenew.tspsc.gov.in', notif: 'https://websitenew.tspsc.gov.in/directrecruitment', site: 'https://websitenew.tspsc.gov.in' },
  OPSC: { apply: 'https://www.opsc.gov.in', notif: 'https://www.opsc.gov.in/Public/WhatsNew.aspx', site: 'https://www.opsc.gov.in' },
  OSSC: { apply: 'https://www.ossc.gov.in', notif: 'https://www.ossc.gov.in/Public/Pages/Advertisement.aspx', site: 'https://www.ossc.gov.in' },
  JPSC: { apply: 'https://www.jpsc.gov.in', notif: 'https://www.jpsc.gov.in/recruitment.php', site: 'https://www.jpsc.gov.in' },
  CGPSC: { apply: 'https://psc.cg.gov.in', notif: 'https://psc.cg.gov.in/advertisement.htm', site: 'https://psc.cg.gov.in' },
  APSC: { apply: 'https://apscrecruitment.in', notif: 'https://apsc.nic.in/advt_2026.asp', site: 'https://apsc.nic.in' },
  UKPSC: { apply: 'https://ukpsc.net.in', notif: 'https://psc.uk.gov.in/recruitment', site: 'https://psc.uk.gov.in' },
  HPPSC: { apply: 'http://hppsconline.hp.gov.in', notif: 'http://www.hppsc.hp.gov.in/hppsc/All-Notifications', site: 'http://www.hppsc.hp.gov.in' },
  JKPSC: { apply: 'https://jkpsc.nic.in', notif: 'https://jkpsc.nic.in/Notifications.html', site: 'https://jkpsc.nic.in' },
  INDIAPOST: { apply: 'https://indiapostgdsonline.gov.in', notif: 'https://www.indiapost.gov.in/VAS/Pages/Recruitment.aspx', site: 'https://www.indiapost.gov.in' },
};

async function remediateExamsFast() {
  const { data: orgs } = await supabase.from('organizations').select('id, name, acronym, website_url');
  const { data: exams } = await supabase.from('gov_exams').select('id, title, exam_code, official_notification_url, official_website_url, organization_id');

  const orgLookup = {};
  for (const o of orgs || []) orgLookup[o.id] = o;

  function getGateway(org) {
    if (!org) return null;
    const ac = (org.acronym || '').toUpperCase().trim();
    if (OFFICIAL_PORTAL_REGISTRY[ac]) return OFFICIAL_PORTAL_REGISTRY[ac];
    for (const [k, v] of Object.entries(OFFICIAL_PORTAL_REGISTRY)) {
      if (ac.includes(k) || k.includes(ac) || org.name.toUpperCase().includes(k)) return v;
    }
    return { apply: org.website_url || 'https://india.gov.in', notif: org.website_url || 'https://india.gov.in' };
  }

  const updates = [];
  for (const exam of exams || []) {
    const org = orgLookup[exam.organization_id];
    const gateway = getGateway(org);

    let newApply = exam.official_website_url;
    let newNotif = exam.official_notification_url;

    const isPlaceholderNotif = !newNotif || newNotif.includes('notice.pdf') || newNotif.includes('advt.pdf') || newNotif.endsWith('/null');
    const isPlaceholderApply = !newApply || newApply.includes('/null');

    if (gateway) {
      if (isPlaceholderNotif) newNotif = gateway.notif;
      if (isPlaceholderApply) newApply = gateway.apply;
    }

    if (newApply !== exam.official_website_url || newNotif !== exam.official_notification_url) {
      updates.push(
        supabase
          .from('gov_exams')
          .update({ official_website_url: newApply, official_notification_url: newNotif })
          .eq('id', exam.id)
      );
    }
  }

  await Promise.all(updates);
  console.log(`✅ Remediated ${updates.length} exams in parallel!`);
}

remediateExamsFast().catch(console.error);
