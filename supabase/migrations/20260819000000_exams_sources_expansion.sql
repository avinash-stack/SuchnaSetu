-- =============================================================================
-- SuchnaSetu Migration: Comprehensive Central & State Examinations Expansion
-- Seeds State Boards, Police Recruitment Authorities, and Dedicated Exam Ingestion Pipelines
-- =============================================================================

-- =============================================================================
-- 1. Upsert State Boards, Police Authorities & Central Bodies into organizations
-- =============================================================================
INSERT INTO organizations (name, acronym, slug, type, jurisdiction, state_code, website_url, is_active) VALUES
-- Delhi
('Delhi Subordinate Services Selection Board', 'DSSSB', 'dsssb', 'commission', 'state', 'DL', 'https://dsssb.delhi.gov.in', true),
('Delhi Police Recruitment Cell', 'Delhi Police', 'delhi-police', 'state_police', 'state', 'DL', 'https://delhipolice.gov.in', true),

-- Punjab
('Punjab Public Service Commission', 'PPSC', 'ppsc', 'commission', 'state', 'PB', 'https://ppsc.gov.in', true),
('Punjab Subordinate Services Selection Board', 'PSSSB', 'psssb', 'commission', 'state', 'PB', 'https://sssb.punjab.gov.in', true),
('Punjab Police Recruitment Board', 'Punjab Police', 'punjab-police', 'state_police', 'state', 'PB', 'https://punjabpolice.gov.in', true),

-- Bihar
('Bihar Staff Selection Commission', 'BSSC', 'bssc', 'commission', 'state', 'BR', 'https://bssc.bihar.gov.in', true),
('Bihar Police Subordinate Services Commission', 'BPSSC', 'bpssc', 'state_police', 'state', 'BR', 'https://bpssc.bih.nic.in', true),
('Central Selection Board of Constable (Bihar)', 'CSBC', 'csbc', 'state_police', 'state', 'BR', 'https://csbc.bih.nic.in', true),

-- Uttar Pradesh
('Uttar Pradesh Subordinate Services Selection Commission', 'UPSSSC', 'upsssc', 'commission', 'state', 'UP', 'https://upsssc.gov.in', true),
('Uttar Pradesh Police Recruitment & Promotion Board', 'UPPRPB', 'upprpb', 'state_police', 'state', 'UP', 'https://uppbpb.gov.in', true),

-- Madhya Pradesh
('Madhya Pradesh Employees Selection Board', 'MPESB', 'mpesb', 'commission', 'state', 'MP', 'https://esb.mp.gov.in', true),
('Madhya Pradesh Police Recruitment', 'MP Police', 'mp-police', 'state_police', 'state', 'MP', 'https://mppolice.gov.in', true),

-- Rajasthan
('Rajasthan Staff Selection Board', 'RSMSSB', 'rsmssb', 'commission', 'state', 'RJ', 'https://rsmssb.rajasthan.gov.in', true),
('Rajasthan Police Recruitment Cell', 'Rajasthan Police', 'rajasthan-police', 'state_police', 'state', 'RJ', 'https://police.rajasthan.gov.in', true),

-- Haryana
('Haryana Staff Selection Commission', 'HSSC', 'hssc', 'commission', 'state', 'HR', 'https://hssc.gov.in', true),
('Haryana Police Recruitment Board', 'Haryana Police', 'haryana-police', 'state_police', 'state', 'HR', 'https://haryanapolice.gov.in', true),

-- Jharkhand
('Jharkhand Staff Selection Commission', 'JSSC', 'jssc', 'commission', 'state', 'JH', 'https://jssc.nic.in', true),
('Jharkhand Police Recruitment Board', 'Jharkhand Police', 'jharkhand-police', 'state_police', 'state', 'JH', 'https://jhpolice.gov.in', true),

-- Uttarakhand
('Uttarakhand Subordinate Service Selection Commission', 'UKSSSC', 'uksssc', 'commission', 'state', 'UK', 'https://sssc.uk.gov.in', true),
('Uttarakhand Police Recruitment Cell', 'Uttarakhand Police', 'uttarakhand-police', 'state_police', 'state', 'UK', 'https://uttarakhandpolice.uk.gov.in', true),

-- West Bengal
('West Bengal Police Recruitment Board', 'WBPRB', 'wbprb', 'state_police', 'state', 'WB', 'https://prb.wb.gov.in', true),
('West Bengal Board of Primary Education', 'WBBPE', 'wbbpe', 'autonomous', 'state', 'WB', 'https://wbbpe.org', true),

-- Odisha
('Odisha Sub-ordinate Staff Selection Commission', 'OSSSC', 'osssc', 'commission', 'state', 'OD', 'https://osssc.gov.in', true),
('Odisha Staff Selection Commission', 'OSSC', 'ossc', 'commission', 'state', 'OD', 'https://ossc.gov.in', true),
('Odisha Police State Selection Board', 'Odisha Police', 'odisha-police', 'state_police', 'state', 'OD', 'https://odishapolice.gov.in', true),

-- Assam
('State Level Police Recruitment Board Assam', 'SLPRB Assam', 'slprb-assam', 'state_police', 'state', 'AS', 'https://slprbassam.in', true),

-- Defence
('Indian Coast Guard', 'ICG', 'indian-coast-guard', 'defence', 'central', 'DL', 'https://joinindiancoastguard.cdac.in', true)

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
-- 2. Upsert Dedicated Examination Pipelines (import_sources with target_module = 'exams')
-- =============================================================================
INSERT INTO import_sources (
    code, name, description, adapter_key, target_module, organization_id, base_url, config, is_enabled, sync_interval_minutes
) VALUES
-- Central Examination Feeds
(
    'upsc_exams_feed',
    'Union Public Service Commission (UPSC) Official Examination Feed',
    'Ingests annual calendars and multi-stage schedules for UPSC CSE, ESE, CDS, NDA, CMS, CAPF, IFS, and EPFO.',
    'upsc_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1),
    'https://upsc.gov.in',
    '{"category": "central-govt"}'::jsonb,
    true,
    360
),
(
    'ssc_exams_feed',
    'Staff Selection Commission (SSC) Official Examination Feed',
    'Ingests national competitive examination schedules for SSC CGL, CHSL, MTS, GD Constable, CPO, JE, and Steno.',
    'ssc_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'ssc' LIMIT 1),
    'https://ssc.gov.in',
    '{"category": "central-govt"}'::jsonb,
    true,
    360
),
(
    'rrb_exams_feed',
    'Railway Recruitment Boards (RRB) Official Examination Feed',
    'Ingests CBT exam timetables and notifications for RRB NTPC, Group D, ALP, Technician, and RRB JE.',
    'rrb_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'rrb' LIMIT 1),
    'https://indianrailways.gov.in',
    '{"category": "railways"}'::jsonb,
    true,
    360
),
(
    'ibps_exams_feed',
    'Institute of Banking Personnel Selection (IBPS) Examination Feed',
    'Ingests CRP PO/MT, CRP Clerk, CRP Specialist Officers, and CRP RRB examination schedules.',
    'ibps_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'ibps' LIMIT 1),
    'https://ibps.in',
    '{"category": "banking"}'::jsonb,
    true,
    360
),
(
    'sbi_exams_feed',
    'State Bank of India (SBI) Recruitment Examination Feed',
    'Ingests SBI Probationary Officers (PO) and Junior Associates (Clerical) examination timetables.',
    'sbi_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'sbi' LIMIT 1),
    'https://sbi.co.in',
    '{"category": "banking"}'::jsonb,
    true,
    360
),
(
    'defence_exams_feed',
    'Combined Indian Armed Forces Examination Feed (AFCAT / NDA / CDS / Agniveer / ICG)',
    'Ingests national defence officer and Agniveer test schedules across Army, Navy, Air Force, and Coast Guard.',
    'defence_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'indian-army' LIMIT 1),
    'https://joinindianarmy.nic.in',
    '{"category": "defence"}'::jsonb,
    true,
    360
),
(
    'central_autonomous_exams_feed',
    'Central Autonomous Bodies Examination Feed (AIIMS / DRDO / ISRO / ESIC / EPFO / India Post)',
    'Ingests national scientific, medical, and postal entrance/recruitment examination notices.',
    'central_autonomous_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'aiims' LIMIT 1),
    'https://aiimsexams.ac.in',
    '{"category": "central-govt"}'::jsonb,
    true,
    360
),

-- State Examination Feeds (12 Supported States)
(
    'bihar_exams_feed',
    'Bihar State Examination Feed (BPSC / BSSC / BPSSC)',
    'Ingests BPSC Combined Competitive Exam (CCE), BPSC Teacher (TRE), BSSC Inter/CGL, and BPSSC Police SI.',
    'bihar_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'bpsc' LIMIT 1),
    'https://bpsc.bih.nic.in',
    '{"state": "BR"}'::jsonb,
    true,
    360
),
(
    'up_exams_feed',
    'Uttar Pradesh Examination Feed (UPPSC / UPSSSC / UPPRPB)',
    'Ingests UPPSC Combined State Upper Subordinate (PCS), RO/ARO, UPSSSC PET, and UP Police Constable/SI tests.',
    'up_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'uppsc' LIMIT 1),
    'https://uppsc.up.nic.in',
    '{"state": "UP"}'::jsonb,
    true,
    360
),
(
    'mp_exams_feed',
    'Madhya Pradesh Examination Feed (MPPSC / MPESB / MP Police)',
    'Ingests MPPSC State Service Exam (SSE), MPESB Group 2/4 Sub-Group tests, MP Police SI, and MP TET.',
    'mp_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'mppsc' LIMIT 1),
    'https://mppsc.mp.gov.in',
    '{"state": "MP"}'::jsonb,
    true,
    360
),
(
    'rajasthan_exams_feed',
    'Rajasthan Examination Feed (RPSC / RSMSSB / Rajasthan Police)',
    'Ingests RPSC RAS/RTS Combined Exam, RSMSSB CET, REET Teacher Exam, and Rajasthan Police SI tests.',
    'rajasthan_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'rpsc' LIMIT 1),
    'https://rpsc.rajasthan.gov.in',
    '{"state": "RJ"}'::jsonb,
    true,
    360
),
(
    'delhi_exams_feed',
    'Delhi Examination Feed (DSSSB / Delhi Police)',
    'Ingests DSSSB Teaching, Technical, Clerical examinations, and Delhi Police Constable/Head Constable tests.',
    'delhi_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'dsssb' LIMIT 1),
    'https://dsssb.delhi.gov.in',
    '{"state": "DL"}'::jsonb,
    true,
    360
),
(
    'haryana_exams_feed',
    'Haryana Examination Feed (HPSC / HSSC / HTET)',
    'Ingests HPSC Civil Services (HCS), HSSC Common Eligibility Test (CET), and Haryana Police examinations.',
    'haryana_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'hpsc' LIMIT 1),
    'https://hpsc.gov.in',
    '{"state": "HR"}'::jsonb,
    true,
    360
),
(
    'jharkhand_exams_feed',
    'Jharkhand Examination Feed (JPSC / JSSC / Jharkhand Police)',
    'Ingests JPSC Combined Civil Services, JSSC CGL, and Jharkhand Police Constable competitive examinations.',
    'jharkhand_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'jpsc' LIMIT 1),
    'https://jpsc.gov.in',
    '{"state": "JH"}'::jsonb,
    true,
    360
),
(
    'uk_exams_feed',
    'Uttarakhand Examination Feed (UKPSC / UKSSSC / Uttarakhand Police)',
    'Ingests UKPSC PCS, UKSSSC Graduate Level Exam, and Uttarakhand Sub-Inspector examinations.',
    'uk_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'ukpsc' LIMIT 1),
    'https://psc.uk.gov.in',
    '{"state": "UK"}'::jsonb,
    true,
    360
),
(
    'wb_exams_feed',
    'West Bengal Examination Feed (WBPSC / WBPRB / WBBPE)',
    'Ingests WBCS (Exe), WB Police SI & Constable, and West Bengal Primary TET examinations.',
    'wb_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'wbpsc' LIMIT 1),
    'https://psc.wb.gov.in',
    '{"state": "WB"}'::jsonb,
    true,
    360
),
(
    'odisha_exams_feed',
    'Odisha Examination Feed (OPSC / OSSSC / OSSC / Odisha Police)',
    'Ingests OPSC Civil Services (OCS), OSSSC Combined Recruitment, and Odisha Police Constable examinations.',
    'odisha_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'opsc' LIMIT 1),
    'https://opsc.gov.in',
    '{"state": "OD"}'::jsonb,
    true,
    360
),
(
    'assam_exams_feed',
    'Assam Examination Feed (APSC / SLPRB Assam / ADRE)',
    'Ingests APSC Combined Competitive Exam (CCE), Assam Police SLPRB, and Assam Direct Recruitment examinations.',
    'assam_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'apsc' LIMIT 1),
    'https://apsc.nic.in',
    '{"state": "AS"}'::jsonb,
    true,
    360
),
(
    'punjab_exams_feed',
    'Punjab Examination Feed (PPSC / PSSSB / Punjab Police)',
    'Ingests PPSC Civil Services, PSSSB Patwari & Clerk, and Punjab Police SI & Constable examinations.',
    'punjab_exams_feed',
    'exams',
    (SELECT id FROM organizations WHERE slug = 'ppsc' LIMIT 1),
    'https://ppsc.gov.in',
    '{"state": "PB"}'::jsonb,
    true,
    360
)

ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    adapter_key = EXCLUDED.adapter_key,
    target_module = EXCLUDED.target_module,
    base_url = EXCLUDED.base_url,
    config = EXCLUDED.config,
    is_enabled = EXCLUDED.is_enabled,
    sync_interval_minutes = EXCLUDED.sync_interval_minutes,
    updated_at = NOW();
