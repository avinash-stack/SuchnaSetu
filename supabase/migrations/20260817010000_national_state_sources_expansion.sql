-- =============================================================================
-- SuchnaSetu Migration: National & State Sources Expansion (28 Sources)
-- Seeds Organizations, Ingestion Pipelines (import_sources), and Official Portals (official_sources)
-- =============================================================================

-- =============================================================================
-- 1. Upsert Master Organizations (18 National + 10 State PSCs)
-- =============================================================================
INSERT INTO organizations (name, acronym, slug, type, jurisdiction, state_code, website_url, is_active) VALUES
-- National Sources (Priority 1)
('Staff Selection Commission', 'SSC', 'ssc', 'commission', 'central', 'DL', 'https://ssc.gov.in', true),
('Railway Recruitment Boards', 'RRB', 'rrb', 'commission', 'central', 'DL', 'https://indianrailways.gov.in', true),
('Institute of Banking Personnel Selection', 'IBPS', 'ibps', 'autonomous', 'central', 'MH', 'https://ibps.in', true),
('State Bank of India', 'SBI', 'sbi', 'psu', 'central', 'MH', 'https://sbi.co.in/web/careers', true),
('Department of Posts (India Post)', 'India Post', 'india-post', 'central_ministry', 'central', 'DL', 'https://indiapostgdsonline.gov.in', true),
('Defence Research and Development Organisation', 'DRDO', 'drdo', 'autonomous', 'central', 'DL', 'https://drdo.gov.in', true),
('Indian Space Research Organisation', 'ISRO', 'isro', 'autonomous', 'central', 'KA', 'https://isro.gov.in', true),
('All India Institute of Medical Sciences', 'AIIMS', 'aiims', 'autonomous', 'central', 'DL', 'https://aiimsexams.ac.in', true),
('Employees'' State Insurance Corporation', 'ESIC', 'esic', 'autonomous', 'central', 'DL', 'https://esic.gov.in', true),
('Employees'' Provident Fund Organisation', 'EPFO', 'epfo', 'autonomous', 'central', 'DL', 'https://epfindia.gov.in', true),
('Border Security Force', 'BSF', 'bsf', 'central_police', 'central', 'DL', 'https://rectt.bsf.gov.in', true),
('Central Reserve Police Force', 'CRPF', 'crpf', 'central_police', 'central', 'DL', 'https://rect.crpf.gov.in', true),
('Central Industrial Security Force', 'CISF', 'cisf', 'central_police', 'central', 'DL', 'https://cisfrectt.cisf.gov.in', true),
('Indo-Tibetan Border Police', 'ITBP', 'itbp', 'central_police', 'central', 'DL', 'https://recruitment.itbpolice.nic.in', true),
('Sashastra Seema Bal', 'SSB', 'ssb', 'central_police', 'central', 'DL', 'https://ssbrectt.gov.in', true),
('Indian Army (Join Indian Army)', 'Army', 'indian-army', 'defence', 'central', 'DL', 'https://joinindianarmy.nic.in', true),
('Indian Navy (Join Indian Navy)', 'Navy', 'indian-navy', 'defence', 'central', 'DL', 'https://joinindiannavy.gov.in', true),
('Indian Air Force (IAF Careers)', 'IAF', 'indian-air-force', 'defence', 'central', 'DL', 'https://careerindianairforce.cdac.in', true),

-- State PSCs (Priority 2)
('Bihar Public Service Commission', 'BPSC', 'bpsc', 'commission', 'state', 'BR', 'https://bpsc.bih.nic.in', true),
('Uttar Pradesh Public Service Commission', 'UPPSC', 'uppsc', 'commission', 'state', 'UP', 'https://uppsc.up.nic.in', true),
('Madhya Pradesh Public Service Commission', 'MPPSC', 'mppsc', 'commission', 'state', 'MP', 'https://mppsc.mp.gov.in', true),
('Rajasthan Public Service Commission', 'RPSC', 'rpsc', 'commission', 'state', 'RJ', 'https://rpsc.rajasthan.gov.in', true),
('Uttarakhand Public Service Commission', 'UKPSC', 'ukpsc', 'commission', 'state', 'UK', 'https://psc.uk.gov.in', true),
('Jharkhand Public Service Commission', 'JPSC', 'jpsc', 'commission', 'state', 'JH', 'https://jpsc.gov.in', true),
('Haryana Public Service Commission', 'HPSC', 'hpsc', 'commission', 'state', 'HR', 'https://hpsc.gov.in', true),
('West Bengal Public Service Commission', 'WBPSC', 'wbpsc', 'commission', 'state', 'WB', 'https://psc.wb.gov.in', true),
('Odisha Public Service Commission', 'OPSC', 'opsc', 'commission', 'state', 'OD', 'https://opsc.gov.in', true),
('Assam Public Service Commission', 'APSC', 'apsc', 'commission', 'state', 'AS', 'https://apsc.nic.in', true)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    acronym = EXCLUDED.acronym,
    type = EXCLUDED.type,
    jurisdiction = EXCLUDED.jurisdiction,
    state_code = EXCLUDED.state_code,
    website_url = EXCLUDED.website_url,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- =============================================================================
-- 2. Upsert Automated Ingestion Pipelines (import_sources)
-- =============================================================================
INSERT INTO import_sources (
    code, name, description, adapter_key, target_module, organization_id, base_url, config, is_enabled, sync_interval_minutes
) VALUES
-- National Sources (18)
(
    'ssc_official_feed',
    'Staff Selection Commission (SSC) Official Feed',
    'Automated extraction of SSC recruitment notices (CGL, CHSL, MTS, CPO, GD Constable) from ssc.gov.in.',
    'ssc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'ssc' LIMIT 1),
    'https://ssc.gov.in',
    '{"category": "central-govt"}'::jsonb,
    true,
    360
),
(
    'rrb_official_feed',
    'Railway Recruitment Boards (RRB) Official Feed',
    'Automated ingestion of Indian Railways recruitments (NTPC, ALP, Technician, Group D) from indianrailways.gov.in.',
    'rrb_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'rrb' LIMIT 1),
    'https://indianrailways.gov.in',
    '{"category": "railways"}'::jsonb,
    true,
    360
),
(
    'ibps_official_feed',
    'Institute of Banking Personnel Selection (IBPS) Official Feed',
    'Automated feed of Public Sector Bank recruitments (PO, Clerk, SO, RRB Scale I/II/III) from ibps.in.',
    'ibps_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'ibps' LIMIT 1),
    'https://ibps.in',
    '{"category": "banking-financial"}'::jsonb,
    true,
    360
),
(
    'sbi_official_feed',
    'State Bank of India (SBI Careers) Official Feed',
    'Automated extraction of SBI Probationary Officers, Junior Associates, and Specialist Cadre Officer circulars.',
    'sbi_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'sbi' LIMIT 1),
    'https://sbi.co.in/web/careers',
    '{"category": "banking-financial"}'::jsonb,
    true,
    360
),
(
    'india_post_official_feed',
    'Department of Posts (India Post GDS) Official Feed',
    'Ingestion of Gramin Dak Sevaks (GDS), Postal Assistants, and Postman recruitment cycles from indiapostgdsonline.gov.in.',
    'india_post_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'india-post' LIMIT 1),
    'https://indiapostgdsonline.gov.in',
    '{"category": "central-govt"}'::jsonb,
    true,
    360
),
(
    'drdo_official_feed',
    'DRDO (Recruitment & Assessment Centre) Official Feed',
    'Automated ingestion of Scientist ''B'', Technical Cadre, and Apprentice openings from drdo.gov.in & rac.gov.in.',
    'drdo_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'drdo' LIMIT 1),
    'https://drdo.gov.in',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'isro_official_feed',
    'ISRO (Centralised Recruitment Board - ICRB) Official Feed',
    'Ingestion of Scientist/Engineer (SC), Technical Assistant, and Administrative post notices from isro.gov.in.',
    'isro_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'isro' LIMIT 1),
    'https://isro.gov.in',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'aiims_official_feed',
    'All India Institute of Medical Sciences (AIIMS Exam Section) Feed',
    'Automated extraction of AIIMS NORCET Nursing Officer, Faculty, and Senior Resident recruitment circulars.',
    'aiims_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'aiims' LIMIT 1),
    'https://aiimsexams.ac.in',
    '{"category": "healthcare-medical"}'::jsonb,
    true,
    360
),
(
    'esic_official_feed',
    'Employees'' State Insurance Corporation (ESIC) Official Feed',
    'Ingestion of ESIC Medical Officers, UDC, Steno, and Paramedical recruitment gazettes from esic.gov.in.',
    'esic_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'esic' LIMIT 1),
    'https://esic.gov.in',
    '{"category": "healthcare-medical"}'::jsonb,
    true,
    360
),
(
    'epfo_official_feed',
    'Employees'' Provident Fund Organisation (EPFO) Official Feed',
    'Automated feed for EPFO Enforcement Officer (EO/AO), APFC, and Social Security Assistant (SSA) notices.',
    'epfo_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'epfo' LIMIT 1),
    'https://epfindia.gov.in',
    '{"category": "central-govt"}'::jsonb,
    true,
    360
),
(
    'bsf_official_feed',
    'Border Security Force (BSF Recruitment) Official Feed',
    'Ingestion of BSF Head Constable (RO/RM), Tradesman, Sub-Inspector, and Assistant Commandant circulars.',
    'bsf_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'bsf' LIMIT 1),
    'https://rectt.bsf.gov.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),
(
    'crpf_official_feed',
    'Central Reserve Police Force (CRPF Recruitment) Official Feed',
    'Extraction of CRPF Constable (Technical & Tradesmen), Head Constable (Ministerial), and Signal Staff notices.',
    'crpf_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'crpf' LIMIT 1),
    'https://rect.crpf.gov.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),
(
    'cisf_official_feed',
    'Central Industrial Security Force (CISF Rectt) Official Feed',
    'Ingestion of CISF Constable (Fireman), Head Constable (Ministerial), and ASI (Steno) recruitment advertisements.',
    'cisf_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'cisf' LIMIT 1),
    'https://cisfrectt.cisf.gov.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),
(
    'itbp_official_feed',
    'Indo-Tibetan Border Police (ITBP Recruitment) Official Feed',
    'Automated extraction of ITBP Constable, Sub-Inspector, and Telecommunications recruitment gazettes.',
    'itbp_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'itbp' LIMIT 1),
    'https://recruitment.itbpolice.nic.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),
(
    'ssb_official_feed',
    'Sashastra Seema Bal (SSB Recruitment) Official Feed',
    'Extraction of SSB Constable (Tradesmen), Head Constable, Sub-Inspector, and Assistant Commandant notices.',
    'ssb_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'ssb' LIMIT 1),
    'https://ssbrectt.gov.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),
(
    'indian_army_official_feed',
    'Join Indian Army (Agniveer & Commissioned Officer) Feed',
    'Automated ingestion of Indian Army Agniveer Rally schemes, TGC, TES, and Permanent Commission notices.',
    'indian_army_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'indian-army' LIMIT 1),
    'https://joinindianarmy.nic.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),
(
    'indian_navy_official_feed',
    'Join Indian Navy (Executive, Technical & SSR/MR) Feed',
    'Extraction of Indian Navy Agniveer SSR/MR, Short Service Commission (SSC Officer), and INET advertisements.',
    'indian_navy_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'indian-navy' LIMIT 1),
    'https://joinindiannavy.gov.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),
(
    'indian_air_force_official_feed',
    'Indian Air Force (AFCAT & Agniveervayu) Official Feed',
    'Ingestion of IAF Air Force Common Admission Test (AFCAT), Meteorological Branch, and Agniveervayu intakes.',
    'indian_air_force_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'indian-air-force' LIMIT 1),
    'https://careerindianairforce.cdac.in',
    '{"category": "defence-security"}'::jsonb,
    true,
    360
),

-- State Public Service Commissions (10)
(
    'bpsc_official_feed',
    'Bihar Public Service Commission (BPSC) Official Feed',
    'Automated extraction of Bihar Combined Competitive Examination (CCE), Teacher Recruitment (TRE), and Assistant Engineer notices.',
    'bpsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'bpsc' LIMIT 1),
    'https://bpsc.bih.nic.in',
    '{"category": "state-govt", "state": "BR"}'::jsonb,
    true,
    360
),
(
    'uppsc_official_feed',
    'Uttar Pradesh Public Service Commission (UPPSC) Official Feed',
    'Ingestion of UP Combined State/Upper Subordinate (PCS), RO/ARO, and Staff Nurse official recruitment notices.',
    'uppsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'uppsc' LIMIT 1),
    'https://uppsc.up.nic.in',
    '{"category": "state-govt", "state": "UP"}'::jsonb,
    true,
    360
),
(
    'mppsc_official_feed',
    'Madhya Pradesh Public Service Commission (MPPSC) Official Feed',
    'Extraction of MP State Service Examination (SSE), State Forest Service, and Assistant Professor advertisements.',
    'mppsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'mppsc' LIMIT 1),
    'https://mppsc.mp.gov.in',
    '{"category": "state-govt", "state": "MP"}'::jsonb,
    true,
    360
),
(
    'rpsc_official_feed',
    'Rajasthan Public Service Commission (RPSC) Official Feed',
    'Ingestion of Rajasthan Administrative Services (RAS/RTS), Senior Teacher, School Lecturer, and Junior Legal Officer notices.',
    'rpsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'rpsc' LIMIT 1),
    'https://rpsc.rajasthan.gov.in',
    '{"category": "state-govt", "state": "RJ"}'::jsonb,
    true,
    360
),
(
    'ukpsc_official_feed',
    'Uttarakhand Public Service Commission (UKPSC) Official Feed',
    'Automated extraction of Uttarakhand Combined State Civil/Upper Subordinate (PCS), Lower PCS, and Lecturer notifications.',
    'ukpsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'ukpsc' LIMIT 1),
    'https://psc.uk.gov.in',
    '{"category": "state-govt", "state": "UK"}'::jsonb,
    true,
    360
),
(
    'jpsc_official_feed',
    'Jharkhand Public Service Commission (JPSC) Official Feed',
    'Extraction of Combined Civil Services Examination (JPSC CCE), Medical Officer, and CDPO official notifications.',
    'jpsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'jpsc' LIMIT 1),
    'https://jpsc.gov.in',
    '{"category": "state-govt", "state": "JH"}'::jsonb,
    true,
    360
),
(
    'hpsc_official_feed',
    'Haryana Public Service Commission (HPSC) Official Feed',
    'Ingestion of Haryana Civil Services (Executive Branch) & Allied Services (HCS), Assistant Professor, and PGT notices.',
    'hpsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'hpsc' LIMIT 1),
    'https://hpsc.gov.in',
    '{"category": "state-govt", "state": "HR"}'::jsonb,
    true,
    360
),
(
    'wbpsc_official_feed',
    'West Bengal Public Service Commission (WBPSC) Official Feed',
    'Automated extraction of West Bengal Civil Service (Executive) etc. Examination (WBCS), Miscellaneous Services, and Clerkship.',
    'wbpsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'wbpsc' LIMIT 1),
    'https://psc.wb.gov.in',
    '{"category": "state-govt", "state": "WB"}'::jsonb,
    true,
    360
),
(
    'opsc_official_feed',
    'Odisha Public Service Commission (OPSC) Official Feed',
    'Extraction of Odisha Civil Services (OCS), Assistant Section Officer (ASO), and Assistant Executive Engineer notices.',
    'opsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'opsc' LIMIT 1),
    'https://opsc.gov.in',
    '{"category": "state-govt", "state": "OD"}'::jsonb,
    true,
    360
),
(
    'apsc_official_feed',
    'Assam Public Service Commission (APSC) Official Feed',
    'Ingestion of Combined Competitive Examination (CCE), Inspector of Legal Metrology, and Assistant Engineer notifications.',
    'apsc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'apsc' LIMIT 1),
    'https://apsc.nic.in',
    '{"category": "state-govt", "state": "AS"}'::jsonb,
    true,
    360
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    adapter_key = EXCLUDED.adapter_key,
    target_module = EXCLUDED.target_module,
    organization_id = EXCLUDED.organization_id,
    base_url = EXCLUDED.base_url,
    config = EXCLUDED.config,
    is_enabled = EXCLUDED.is_enabled,
    sync_interval_minutes = EXCLUDED.sync_interval_minutes,
    updated_at = NOW();

-- =============================================================================
-- 3. Upsert Official Portal Registry (official_sources)
-- =============================================================================
INSERT INTO official_sources (name, base_url, portal_type, is_verified, organization_id) VALUES
('SSC Official Application Portal', 'https://ssc.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'ssc' LIMIT 1)),
('Indian Railways Recruitment Portal', 'https://indianrailways.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'rrb' LIMIT 1)),
('IBPS Online Examination Portal', 'https://ibps.in', 'autonomous', true, (SELECT id FROM organizations WHERE slug = 'ibps' LIMIT 1)),
('SBI Official Careers Portal', 'https://sbi.co.in/web/careers', 'psu', true, (SELECT id FROM organizations WHERE slug = 'sbi' LIMIT 1)),
('India Post GDS Online Engagement', 'https://indiapostgdsonline.gov.in', 'central_ministry', true, (SELECT id FROM organizations WHERE slug = 'india-post' LIMIT 1)),
('DRDO RAC Recruitment Portal', 'https://drdo.gov.in', 'autonomous', true, (SELECT id FROM organizations WHERE slug = 'drdo' LIMIT 1)),
('ISRO Careers & ICRB Portal', 'https://isro.gov.in', 'autonomous', true, (SELECT id FROM organizations WHERE slug = 'isro' LIMIT 1)),
('AIIMS Examination Section', 'https://aiimsexams.ac.in', 'autonomous', true, (SELECT id FROM organizations WHERE slug = 'aiims' LIMIT 1)),
('ESIC Official Public Portal', 'https://esic.gov.in', 'autonomous', true, (SELECT id FROM organizations WHERE slug = 'esic' LIMIT 1)),
('EPFO Official Careers Portal', 'https://epfindia.gov.in', 'autonomous', true, (SELECT id FROM organizations WHERE slug = 'epfo' LIMIT 1)),
('BSF Recruitment Portal', 'https://rectt.bsf.gov.in', 'central_police', true, (SELECT id FROM organizations WHERE slug = 'bsf' LIMIT 1)),
('CRPF Recruitment Portal', 'https://rect.crpf.gov.in', 'central_police', true, (SELECT id FROM organizations WHERE slug = 'crpf' LIMIT 1)),
('CISF Recruitment Portal', 'https://cisfrectt.cisf.gov.in', 'central_police', true, (SELECT id FROM organizations WHERE slug = 'cisf' LIMIT 1)),
('ITBP Recruitment Portal', 'https://recruitment.itbpolice.nic.in', 'central_police', true, (SELECT id FROM organizations WHERE slug = 'itbp' LIMIT 1)),
('SSB Recruitment Portal', 'https://ssbrectt.gov.in', 'central_police', true, (SELECT id FROM organizations WHERE slug = 'ssb' LIMIT 1)),
('Join Indian Army Portal', 'https://joinindianarmy.nic.in', 'defence', true, (SELECT id FROM organizations WHERE slug = 'indian-army' LIMIT 1)),
('Join Indian Navy Portal', 'https://joinindiannavy.gov.in', 'defence', true, (SELECT id FROM organizations WHERE slug = 'indian-navy' LIMIT 1)),
('Indian Air Force AFCAT Portal', 'https://careerindianairforce.cdac.in', 'defence', true, (SELECT id FROM organizations WHERE slug = 'indian-air-force' LIMIT 1)),
('BPSC Official Portal', 'https://bpsc.bih.nic.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'bpsc' LIMIT 1)),
('UPPSC Official Portal', 'https://uppsc.up.nic.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'uppsc' LIMIT 1)),
('MPPSC Official Portal', 'https://mppsc.mp.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'mppsc' LIMIT 1)),
('RPSC Official Portal', 'https://rpsc.rajasthan.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'rpsc' LIMIT 1)),
('UKPSC Official Portal', 'https://psc.uk.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'ukpsc' LIMIT 1)),
('JPSC Official Portal', 'https://jpsc.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'jpsc' LIMIT 1)),
('HPSC Official Portal', 'https://hpsc.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'hpsc' LIMIT 1)),
('WBPSC Official Portal', 'https://psc.wb.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'wbpsc' LIMIT 1)),
('OPSC Official Portal', 'https://opsc.gov.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'opsc' LIMIT 1)),
('APSC Official Portal', 'https://apsc.nic.in', 'commission', true, (SELECT id FROM organizations WHERE slug = 'apsc' LIMIT 1))
ON CONFLICT DO NOTHING;
