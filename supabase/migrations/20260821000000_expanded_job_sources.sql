-- =============================================================================
-- SuchnaSetu Phase 5 Database Migration:
-- Expanded Government Job Sources Coverage (28 Additional Sources)
-- Seeds Master Organizations, Automated Ingestion Pipelines (import_sources),
-- and Verified Official Portals (official_sources) for:
-- 1. Courts & Judiciary (SCI, Patna HC, Allahabad HC, Delhi HC, eCourts)
-- 2. State Subordinate & Police Boards (BSSC, CSBC, BPSSC, UPSSSC, UPPRPB, RSMSSB, MPESB, HSSC, DSSSB)
-- 3. State Departments & Institutions (JEEViKA, SHSB, UP-NHM, BSPHCL, UPPCL, DLRS)
-- 4. Central Government, Education Bodies & PSUs (KVS, NVS, FCI, AAI, ONGC, NTPC, BHEL, NTA)
-- =============================================================================

-- =============================================================================
-- SECTION 1: UPSERT MASTER ORGANIZATIONS (28 Organizations)
-- =============================================================================
INSERT INTO organizations (name, acronym, slug, type, jurisdiction, state_code, website_url, is_active) VALUES
-- 1. Courts & Judiciary
('Supreme Court of India', 'SCI', 'sci', 'judiciary', 'central', 'DL', 'https://sci.gov.in', true),
('High Court of Judicature at Patna', 'Patna HC', 'patna-high-court', 'judiciary', 'state', 'BR', 'https://patnahighcourt.gov.in', true),
('High Court of Judicature at Allahabad', 'Allahabad HC', 'allahabad-high-court', 'judiciary', 'state', 'UP', 'https://www.allahabadhighcourt.in', true),
('High Court of Delhi', 'Delhi HC', 'delhi-high-court', 'judiciary', 'state', 'DL', 'https://delhihighcourt.nic.in', true),
('eCourts Integrated Mission Mode Project', 'eCourts', 'ecourts', 'judiciary', 'central', 'DL', 'https://services.ecourts.gov.in', true),

-- 2. State Subordinate & Police Boards
('Bihar Staff Selection Commission', 'BSSC', 'bssc', 'commission', 'state', 'BR', 'https://bssc.bihar.gov.in', true),
('Central Selection Board of Constable (Bihar Police)', 'CSBC', 'csbc', 'commission', 'state', 'BR', 'https://csbc.bihar.gov.in', true),
('Bihar Police Sub-ordinate Services Commission', 'BPSSC', 'bpssc', 'commission', 'state', 'BR', 'https://bpssc.bihar.gov.in', true),
('Uttar Pradesh Subordinate Services Selection Commission', 'UPSSSC', 'upsssc', 'commission', 'state', 'UP', 'https://upsssc.gov.in', true),
('Uttar Pradesh Police Recruitment and Promotion Board', 'UPPRPB', 'upprpb', 'commission', 'state', 'UP', 'https://uppbpb.gov.in', true),
('Rajasthan Staff Selection Board', 'RSMSSB', 'rsmssb', 'commission', 'state', 'RJ', 'https://rsmssb.rajasthan.gov.in', true),
('Madhya Pradesh Employees Selection Board', 'MPESB', 'mpesb', 'commission', 'state', 'MP', 'https://esb.mp.gov.in', true),
('Haryana Staff Selection Commission', 'HSSC', 'hssc', 'commission', 'state', 'HR', 'https://hssc.gov.in', true),
('Delhi Subordinate Services Selection Board', 'DSSSB', 'dsssb', 'commission', 'state', 'DL', 'https://dsssb.delhi.gov.in', true),

-- 3. State Departments & Institutions
('Bihar Rural Livelihoods Promotion Society (JEEViKA)', 'JEEViKA', 'jeevika-brlps', 'autonomous', 'state', 'BR', 'https://brlps.in', true),
('State Health Society Bihar (National Health Mission)', 'SHSB', 'shsb', 'autonomous', 'state', 'BR', 'https://shs.bihar.gov.in', true),
('National Health Mission Uttar Pradesh', 'UP-NHM', 'up-nhm', 'autonomous', 'state', 'UP', 'https://upnrhm.gov.in', true),
('Bihar State Power Holding Company Limited', 'BSPHCL', 'bsphcl', 'psu', 'state', 'BR', 'https://bsphcl.co.in', true),
('Uttar Pradesh Power Corporation Limited', 'UPPCL', 'uppcl', 'psu', 'state', 'UP', 'https://www.upenergy.in', true),
('Directorate of Land Records & Survey (Revenue Dept, Bihar)', 'DLRS', 'dlrs-bihar', 'commission', 'state', 'BR', 'https://dlrs.bihar.gov.in', true),

-- 4. Central Government, Education & PSUs
('Kendriya Vidyalaya Sangathan', 'KVS', 'kvs', 'autonomous', 'central', 'DL', 'https://kvsangathan.nic.in', true),
('Navodaya Vidyalaya Samiti', 'NVS', 'nvs', 'autonomous', 'central', 'UP', 'https://navodaya.gov.in', true),
('Food Corporation of India', 'FCI', 'fci', 'psu', 'central', 'DL', 'https://fci.gov.in', true),
('Airports Authority of India', 'AAI', 'aai', 'psu', 'central', 'DL', 'https://www.aai.aero', true),
('Oil and Natural Gas Corporation Limited', 'ONGC', 'ongc', 'psu', 'central', 'DL', 'https://ongcindia.com', true),
('NTPC Limited', 'NTPC', 'ntpc', 'psu', 'central', 'DL', 'https://careers.ntpc.co.in', true),
('Bharat Heavy Electricals Limited', 'BHEL', 'bhel', 'psu', 'central', 'DL', 'https://careers.bhel.in', true),
('National Testing Agency (Central Recruitment Services)', 'NTA', 'nta-recruitment', 'autonomous', 'central', 'DL', 'https://recruitment.nta.nic.in', true)

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
-- SECTION 2: UPSERT AUTOMATED INGESTION PIPELINES (import_sources)
-- =============================================================================
INSERT INTO import_sources (
    code, name, description, adapter_key, target_module, organization_id, base_url, config, is_enabled, sync_interval_minutes
) VALUES
-- Courts & Judiciary
(
    'sci_official_feed',
    'Supreme Court of India (SCI) Official Feed',
    'Automated extraction of Supreme Court of India recruitment circulars (Junior Court Assistant, Law Clerk, Court Attendants).',
    'sci_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'sci' LIMIT 1),
    'https://sci.gov.in',
    '{"category": "judiciary-law"}'::jsonb,
    true,
    360
),
(
    'patna_hc_official_feed',
    'Patna High Court Official Feed',
    'Automated extraction of Patna High Court recruitments (Assistant, Translator, Stenographer, Computer Operator).',
    'patna_hc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'patna-high-court' LIMIT 1),
    'https://patnahighcourt.gov.in',
    '{"category": "judiciary-law"}'::jsonb,
    true,
    360
),
(
    'allahabad_hc_official_feed',
    'Allahabad High Court Official Feed',
    'Automated ingestion of Allahabad High Court recruitment notices (RO, ARO, Group C & D, Stenographers).',
    'allahabad_hc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'allahabad-high-court' LIMIT 1),
    'https://www.allahabadhighcourt.in',
    '{"category": "judiciary-law"}'::jsonb,
    true,
    360
),
(
    'delhi_hc_official_feed',
    'Delhi High Court Official Feed',
    'Automated extraction of Delhi High Court recruitment advertisements (Senior Judicial Assistant, Court Attendant, SPA).',
    'delhi_hc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'delhi-high-court' LIMIT 1),
    'https://delhihighcourt.nic.in',
    '{"category": "judiciary-law"}'::jsonb,
    true,
    360
),
(
    'ecourts_national_feed',
    'eCourts Services National Judicial Recruitment Feed',
    'Aggregated circulars from All India District & Sessions Courts via eCourts Integrated Portal.',
    'ecourts_national_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'ecourts' LIMIT 1),
    'https://services.ecourts.gov.in',
    '{"category": "judiciary-law"}'::jsonb,
    true,
    360
),

-- State Subordinate & Police Boards
(
    'bssc_official_feed',
    'Bihar Staff Selection Commission (BSSC) Official Feed',
    'Automated ingestion of BSSC recruitment notices (Inter Level, CGL, Technical Staff, Panchayat Secretary).',
    'bssc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'bssc' LIMIT 1),
    'https://bssc.bihar.gov.in',
    '{"category": "state-govt"}'::jsonb,
    true,
    360
),
(
    'csbc_bihar_police_feed',
    'Central Selection Board of Constable (CSBC) Bihar Police Feed',
    'Automated extraction of Bihar Police Constable, Fireman, and Special Armed Police recruitments.',
    'csbc_bihar_police_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'csbc' LIMIT 1),
    'https://csbc.bihar.gov.in',
    '{"category": "defence-police"}'::jsonb,
    true,
    360
),
(
    'bpssc_police_feed',
    'Bihar Police Sub-ordinate Services Commission (BPSSC) Official Feed',
    'Automated extraction of Bihar Police Sub-Inspector (Daroga), Enforcement SI, and Sergeant recruitments.',
    'bpssc_police_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'bpssc' LIMIT 1),
    'https://bpssc.bihar.gov.in',
    '{"category": "defence-police"}'::jsonb,
    true,
    360
),
(
    'upsssc_official_feed',
    'UP Subordinate Services Selection Commission (UPSSSC) Official Feed',
    'Automated extraction of UPSSSC recruitments (PET, Rajasva Lekhpal, VDO, Junior Assistant, Supply Inspector).',
    'upsssc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'upsssc' LIMIT 1),
    'https://upsssc.gov.in',
    '{"category": "state-govt"}'::jsonb,
    true,
    360
),
(
    'upprpb_police_feed',
    'UP Police Recruitment and Promotion Board (UPPRPB) Official Feed',
    'Automated ingestion of UP Police Constable, Sub-Inspector (SI), and PAC mass recruitment drives.',
    'upprpb_police_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'upprpb' LIMIT 1),
    'https://uppbpb.gov.in',
    '{"category": "defence-police"}'::jsonb,
    true,
    360
),
(
    'rsmssb_official_feed',
    'Rajasthan Staff Selection Board (RSMSSB) Official Feed',
    'Automated extraction of Rajasthan CET, Patwari, VDO, LDC, and Computor direct recruitments.',
    'rsmssb_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'rsmssb' LIMIT 1),
    'https://rsmssb.rajasthan.gov.in',
    '{"category": "state-govt"}'::jsonb,
    true,
    360
),
(
    'mpesb_vyapam_feed',
    'MP Employees Selection Board (MPESB / Vyapam) Official Feed',
    'Automated ingestion of MP Police Constable, Patwari, Group 4, and Samvida Shikshak recruitments.',
    'mpesb_vyapam_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'mpesb' LIMIT 1),
    'https://esb.mp.gov.in',
    '{"category": "state-govt"}'::jsonb,
    true,
    360
),
(
    'hssc_official_feed',
    'Haryana Staff Selection Commission (HSSC) Official Feed',
    'Automated extraction of Haryana CET Group C & D, Haryana Police, and Patwari notices from hssc.gov.in.',
    'hssc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'hssc' LIMIT 1),
    'https://hssc.gov.in',
    '{"category": "state-govt"}'::jsonb,
    true,
    360
),
(
    'dsssb_official_feed',
    'Delhi Subordinate Services Selection Board (DSSSB) Official Feed',
    'Automated ingestion of Delhi Govt Teaching (TGT/PGT/PRT), Nursing Officer, and LDC advertisements.',
    'dsssb_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'dsssb' LIMIT 1),
    'https://dsssb.delhi.gov.in',
    '{"category": "state-govt"}'::jsonb,
    true,
    360
),

-- State Departments & Institutions
(
    'jeevika_bihar_feed',
    'JEEViKA Bihar Rural Livelihoods (BRLPS) Official Feed',
    'Automated ingestion of Community Coordinator, Area Coordinator, and Block Project Manager notices from brlps.in.',
    'jeevika_bihar_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'jeevika-brlps' LIMIT 1),
    'https://brlps.in',
    '{"category": "agriculture-rural"}'::jsonb,
    true,
    360
),
(
    'shsb_bihar_health_feed',
    'State Health Society Bihar (SHSB) Official Feed',
    'Automated extraction of Bihar National Health Mission circulars (CHO, Staff Nurse, ANM, Medical Officers).',
    'shsb_bihar_health_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'shsb' LIMIT 1),
    'https://shs.bihar.gov.in',
    '{"category": "medical-healthcare"}'::jsonb,
    true,
    360
),
(
    'up_nhm_health_feed',
    'National Health Mission UP (UP-NHM) Official Feed',
    'Automated extraction of Uttar Pradesh NHM Staff Nurse, CHO, Pharmacist, and Lab Technician recruitments.',
    'up_nhm_health_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'up-nhm' LIMIT 1),
    'https://upnrhm.gov.in',
    '{"category": "medical-healthcare"}'::jsonb,
    true,
    360
),
(
    'bsphcl_power_feed',
    'Bihar State Power Holding Company (BSPHCL) Official Feed',
    'Automated ingestion of BSPHCL Junior Engineer, Technician Grade III, and Correspondence Clerk circulars.',
    'bsphcl_power_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'bsphcl' LIMIT 1),
    'https://bsphcl.co.in',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'uppcl_power_feed',
    'UP Power Corporation Limited (UPPCL) Official Feed',
    'Automated extraction of UPPCL Assistant Engineer, Junior Engineer, and Technician (TG2) recruitments.',
    'uppcl_power_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'uppcl' LIMIT 1),
    'https://www.upenergy.in',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'dlrs_bihar_revenue_feed',
    'Bihar Directorate of Land Records & Survey (DLRS) Official Feed',
    'Automated extraction of Bihar Special Survey Amin, Kanoongo, and Special Survey Clerk notices.',
    'dlrs_bihar_revenue_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'dlrs-bihar' LIMIT 1),
    'https://dlrs.bihar.gov.in',
    '{"category": "state-govt"}'::jsonb,
    true,
    360
),

-- Central Government, Education & PSUs
(
    'kvs_official_feed',
    'Kendriya Vidyalaya Sangathan (KVS) Official Feed',
    'Automated extraction of KVS Primary Teachers (PRT), TGT, PGT, and Non-Teaching recruitment notices.',
    'kvs_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'kvs' LIMIT 1),
    'https://kvsangathan.nic.in',
    '{"category": "teaching-research"}'::jsonb,
    true,
    360
),
(
    'nvs_official_feed',
    'Navodaya Vidyalaya Samiti (NVS) Official Feed',
    'Automated ingestion of NVS TGT, PGT, Miscellaneous Teachers, and Staff Nurse notices from navodaya.gov.in.',
    'nvs_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'nvs' LIMIT 1),
    'https://navodaya.gov.in',
    '{"category": "teaching-research"}'::jsonb,
    true,
    360
),
(
    'fci_official_feed',
    'Food Corporation of India (FCI) Official Feed',
    'Automated extraction of FCI Assistant Grade-III (General, Depot, Accounts, Technical) recruitments.',
    'fci_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'fci' LIMIT 1),
    'https://fci.gov.in',
    '{"category": "central-govt"}'::jsonb,
    true,
    360
),
(
    'aai_official_feed',
    'Airports Authority of India (AAI) Official Feed',
    'Automated extraction of AAI Junior Executive (Air Traffic Control / Airport Operations / Engineering) recruitments.',
    'aai_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'aai' LIMIT 1),
    'https://www.aai.aero',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'ongc_official_feed',
    'Oil and Natural Gas Corporation (ONGC) Official Feed',
    'Automated extraction of ONGC Graduate Trainees (Engineering & Geo-Sciences) notices via GATE.',
    'ongc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'ongc' LIMIT 1),
    'https://ongcindia.com',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'ntpc_official_feed',
    'NTPC Limited Official Feed',
    'Automated ingestion of NTPC Engineering Executive Trainee (EET) and Diploma Engineer recruitments.',
    'ntpc_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'ntpc' LIMIT 1),
    'https://careers.ntpc.co.in',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'bhel_official_feed',
    'Bharat Heavy Electricals Limited (BHEL) Official Feed',
    'Automated extraction of BHEL Engineer Trainee and Executive Trainee notices from careers.bhel.in.',
    'bhel_official_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'bhel' LIMIT 1),
    'https://careers.bhel.in',
    '{"category": "engineering-technical"}'::jsonb,
    true,
    360
),
(
    'nta_recruitment_feed',
    'National Testing Agency (NTA) Central Recruitment Feed',
    'Automated extraction of Central Universities Non-Teaching Staff & High Court combined recruitment notices.',
    'nta_recruitment_feed',
    'jobs',
    (SELECT id FROM organizations WHERE slug = 'nta-recruitment' LIMIT 1),
    'https://recruitment.nta.nic.in',
    '{"category": "central-govt"}'::jsonb,
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
    updated_at = NOW();

-- =============================================================================
-- SECTION 3: UPSERT OFFICIAL PUBLIC SOURCES REGISTRY (official_sources)
-- =============================================================================
INSERT INTO official_sources (organization_id, name, base_url, portal_type, is_verified) VALUES
-- Courts & Judiciary
((SELECT id FROM organizations WHERE slug = 'sci' LIMIT 1), 'Supreme Court of India Official Recruitment Portal', 'https://sci.gov.in/recruitment', 'judicial_portal', true),
((SELECT id FROM organizations WHERE slug = 'patna-high-court' LIMIT 1), 'Patna High Court Recruitment Portal', 'https://patnahighcourt.gov.in', 'judicial_portal', true),
((SELECT id FROM organizations WHERE slug = 'allahabad-high-court' LIMIT 1), 'Allahabad High Court Official Portal', 'https://www.allahabadhighcourt.in', 'judicial_portal', true),
((SELECT id FROM organizations WHERE slug = 'delhi-high-court' LIMIT 1), 'Delhi High Court Official Notices', 'https://delhihighcourt.nic.in', 'judicial_portal', true),
((SELECT id FROM organizations WHERE slug = 'ecourts' LIMIT 1), 'eCourts District Courts Services Portal', 'https://services.ecourts.gov.in', 'judicial_portal', true),

-- State Subordinate & Police Boards
((SELECT id FROM organizations WHERE slug = 'bssc' LIMIT 1), 'Bihar Staff Selection Commission Portal', 'https://bssc.bihar.gov.in', 'state_commission', true),
((SELECT id FROM organizations WHERE slug = 'csbc' LIMIT 1), 'Central Selection Board of Constable Bihar', 'https://csbc.bihar.gov.in', 'police_board', true),
((SELECT id FROM organizations WHERE slug = 'bpssc' LIMIT 1), 'Bihar Police Sub-ordinate Services Commission', 'https://bpssc.bihar.gov.in', 'police_board', true),
((SELECT id FROM organizations WHERE slug = 'upsssc' LIMIT 1), 'UP Subordinate Services Selection Commission', 'https://upsssc.gov.in', 'state_commission', true),
((SELECT id FROM organizations WHERE slug = 'upprpb' LIMIT 1), 'UP Police Recruitment and Promotion Board', 'https://uppbpb.gov.in', 'police_board', true),
((SELECT id FROM organizations WHERE slug = 'rsmssb' LIMIT 1), 'Rajasthan Staff Selection Board Portal', 'https://rsmssb.rajasthan.gov.in', 'state_commission', true),
((SELECT id FROM organizations WHERE slug = 'mpesb' LIMIT 1), 'Madhya Pradesh Employees Selection Board', 'https://esb.mp.gov.in', 'state_commission', true),
((SELECT id FROM organizations WHERE slug = 'hssc' LIMIT 1), 'Haryana Staff Selection Commission Portal', 'https://hssc.gov.in', 'state_commission', true),
((SELECT id FROM organizations WHERE slug = 'dsssb' LIMIT 1), 'Delhi Subordinate Services Selection Board Portal', 'https://dsssb.delhi.gov.in', 'state_commission', true),

-- State Departments & Institutions
((SELECT id FROM organizations WHERE slug = 'jeevika-brlps' LIMIT 1), 'JEEViKA Bihar Rural Livelihoods Portal', 'https://brlps.in', 'departmental_portal', true),
((SELECT id FROM organizations WHERE slug = 'shsb' LIMIT 1), 'State Health Society Bihar Portal', 'https://shs.bihar.gov.in', 'health_portal', true),
((SELECT id FROM organizations WHERE slug = 'up-nhm' LIMIT 1), 'National Health Mission UP Portal', 'https://upnrhm.gov.in', 'health_portal', true),
((SELECT id FROM organizations WHERE slug = 'bsphcl' LIMIT 1), 'Bihar State Power Holding Company Portal', 'https://bsphcl.co.in', 'psu_portal', true),
((SELECT id FROM organizations WHERE slug = 'uppcl' LIMIT 1), 'Uttar Pradesh Power Corporation Portal', 'https://www.upenergy.in', 'psu_portal', true),
((SELECT id FROM organizations WHERE slug = 'dlrs-bihar' LIMIT 1), 'Directorate of Land Records & Survey Bihar', 'https://dlrs.bihar.gov.in', 'departmental_portal', true),

-- Central Government, Education & PSUs
((SELECT id FROM organizations WHERE slug = 'kvs' LIMIT 1), 'Kendriya Vidyalaya Sangathan Official Portal', 'https://kvsangathan.nic.in', 'education_portal', true),
((SELECT id FROM organizations WHERE slug = 'nvs' LIMIT 1), 'Navodaya Vidyalaya Samiti Official Portal', 'https://navodaya.gov.in', 'education_portal', true),
((SELECT id FROM organizations WHERE slug = 'fci' LIMIT 1), 'Food Corporation of India Careers Portal', 'https://fci.gov.in', 'psu_portal', true),
((SELECT id FROM organizations WHERE slug = 'aai' LIMIT 1), 'Airports Authority of India Careers Portal', 'https://www.aai.aero', 'psu_portal', true),
((SELECT id FROM organizations WHERE slug = 'ongc' LIMIT 1), 'Oil and Natural Gas Corporation Portal', 'https://ongcindia.com', 'psu_portal', true),
((SELECT id FROM organizations WHERE slug = 'ntpc' LIMIT 1), 'NTPC Careers Portal', 'https://careers.ntpc.co.in', 'psu_portal', true),
((SELECT id FROM organizations WHERE slug = 'bhel' LIMIT 1), 'BHEL Careers Portal', 'https://careers.bhel.in', 'psu_portal', true),
((SELECT id FROM organizations WHERE slug = 'nta-recruitment' LIMIT 1), 'NTA Central Recruitment Portal', 'https://recruitment.nta.nic.in', 'recruitment_portal', true);
