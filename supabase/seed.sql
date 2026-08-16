-- =============================================================================
-- SuchnaSetu Master Seed Data
-- =============================================================================

-- 1. States and Union Territories of India
INSERT INTO states_uts (code, name, type, capital, is_active) VALUES
('AN', 'Andaman and Nicobar Islands', 'ut', 'Port Blair', true),
('AP', 'Andhra Pradesh', 'state', 'Amaravati', true),
('AR', 'Arunachal Pradesh', 'state', 'Itanagar', true),
('AS', 'Assam', 'state', 'Dispur', true),
('BR', 'Bihar', 'state', 'Patna', true),
('CH', 'Chandigarh', 'ut', 'Chandigarh', true),
('CG', 'Chhattisgarh', 'state', 'Raipur', true),
('DN', 'Dadra and Nagar Haveli and Daman and Diu', 'ut', 'Daman', true),
('DL', 'Delhi (NCT)', 'ut', 'New Delhi', true),
('GA', 'Goa', 'state', 'Panaji', true),
('GJ', 'Gujarat', 'state', 'Gandhinagar', true),
('HR', 'Haryana', 'state', 'Chandigarh', true),
('HP', 'Himachal Pradesh', 'state', 'Shimla', true),
('JK', 'Jammu and Kashmir', 'ut', 'Srinagar', true),
('JH', 'Jharkhand', 'state', 'Ranchi', true),
('KA', 'Karnataka', 'state', 'Bengaluru', true),
('KL', 'Kerala', 'state', 'Thiruvananthapuram', true),
('LA', 'Ladakh', 'ut', 'Leh', true),
('LD', 'Lakshadweep', 'ut', 'Kavaratti', true),
('MP', 'Madhya Pradesh', 'state', 'Bhopal', true),
('MH', 'Maharashtra', 'state', 'Mumbai', true),
('MN', 'Manipur', 'state', 'Imphal', true),
('ML', 'Meghalaya', 'state', 'Shillong', true),
('MZ', 'Mizoram', 'state', 'Aizawl', true),
('NL', 'Nagaland', 'state', 'Kohima', true),
('OD', 'Odisha', 'state', 'Bhubaneswar', true),
('PY', 'Puducherry', 'ut', 'Puducherry', true),
('PB', 'Punjab', 'state', 'Chandigarh', true),
('RJ', 'Rajasthan', 'state', 'Jaipur', true),
('SK', 'Sikkim', 'state', 'Gangtok', true),
('TN', 'Tamil Nadu', 'state', 'Chennai', true),
('TS', 'Telangana', 'state', 'Hyderabad', true),
('TR', 'Tripura', 'state', 'Agartala', true),
('UP', 'Uttar Pradesh', 'state', 'Lucknow', true),
('UK', 'Uttarakhand', 'state', 'Dehradun', true),
('WB', 'West Bengal', 'state', 'Kolkata', true)
ON CONFLICT (code) DO NOTHING;

-- 2. Platform Modules Registry
INSERT INTO modules (key, title, description, is_enabled, route_path, icon_name, display_order) VALUES
('jobs', 'Government Jobs', 'Aggregated official notifications for central, state, and PSU recruitment notices.', true, '/jobs', 'Briefcase', 1),
('exams', 'Government Exams', 'Upcoming examination schedules, eligibility calendars, and official dates.', false, '/exams', 'Calendar', 2),
('results', 'Results', 'Published scorecard announcements, merit lists, and cutoff notices.', false, '/results', 'Award', 3),
('admit_cards', 'Admit Cards', 'Hall tickets and examination center intimation slip releases.', false, '/admit-cards', 'FileText', 4),
('schemes', 'Government Schemes', 'Central and state public welfare programs, subsidies, and citizen initiatives.', false, '/schemes', 'ShieldCheck', 5),
('scholarships', 'Scholarships', 'Financial grants, educational aid, and fellowship notices from official ministries.', false, '/scholarships', 'GraduationCap', 6),
('tenders', 'Tenders', 'Public procurement opportunities and procurement circulars.', false, '/tenders', 'FileSpreadsheet', 7),
('circulars', 'Circulars', 'Official administrative orders, gazette notifications, and memoranda.', false, '/circulars', 'Layers', 8),
('public_notices', 'Public Notices', 'Statutory advisories, consumer warnings, and official public releases.', false, '/public-notices', 'Bell', 9)
ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    is_enabled = EXCLUDED.is_enabled,
    route_path = EXCLUDED.route_path,
    icon_name = EXCLUDED.icon_name,
    display_order = EXCLUDED.display_order;

-- 3. Standard Sectors & Categories
INSERT INTO categories (name, slug, description, icon_name, display_order, is_active) VALUES
('Central Government', 'central-govt', 'All ministries, commissions, and departments under Government of India', 'Landmark', 1, true),
('State Government', 'state-govt', 'State-level public service commissions and state departments', 'Building2', 2, true),
('Defence & Security', 'defence-security', 'Armed forces, Paramilitary forces (CRPF, BSF, CISF), and Police', 'Shield', 3, true),
('Banking & Financial', 'banking-financial', 'Public sector banks, RBI, NABARD, SEBI, and insurance corporations', 'CreditCard', 4, true),
('Railways', 'railways', 'Indian Railways, RRB, and railway development corporations', 'Train', 5, true),
('Engineering & Technical', 'engineering-technical', 'PSUs (ONGC, IOCL, BHEL, NTPC), ISRO, DRDO, and technical bodies', 'Wrench', 6, true),
('Teaching & Research', 'teaching-research', 'Central universities, Kendriya Vidyalaya, Navodaya, and UGC bodies', 'BookOpen', 7, true),
('Healthcare & Medical', 'healthcare-medical', 'AIIMS, State Medical Boards, ESIC, and health departments', 'HeartPulse', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- 4. Key Benchmark Organizations
INSERT INTO organizations (name, acronym, slug, type, jurisdiction, state_code, website_url, is_active) VALUES
('Union Public Service Commission', 'UPSC', 'upsc', 'commission', 'central', 'DL', 'https://upsc.gov.in', true),
('Staff Selection Commission', 'SSC', 'ssc', 'commission', 'central', 'DL', 'https://ssc.gov.in', true),
('Institute of Banking Personnel Selection', 'IBPS', 'ibps', 'autonomous', 'central', 'MH', 'https://ibps.in', true),
('Railway Recruitment Boards', 'RRB', 'rrb', 'commission', 'central', 'DL', 'https://indianrailways.gov.in', true),
('National Testing Agency', 'NTA', 'nta', 'autonomous', 'central', 'DL', 'https://nta.ac.in', true),
('Defence Research and Development Organisation', 'DRDO', 'drdo', 'autonomous', 'central', 'DL', 'https://drdo.gov.in', true),
('Indian Space Research Organisation', 'ISRO', 'isro', 'autonomous', 'central', 'KA', 'https://isro.gov.in', true)
ON CONFLICT (slug) DO NOTHING;

-- 5. Official Sources Registry
INSERT INTO official_sources (name, base_url, portal_type, is_verified) VALUES
('UPSC Official Portal', 'https://upsc.gov.in', 'commission', true),
('SSC Official Portal', 'https://ssc.gov.in', 'commission', true),
('IBPS Portal', 'https://ibps.in', 'autonomous', true),
('NTA Testing Portal', 'https://nta.ac.in', 'autonomous', true),
('National Career Service (NCS)', 'https://ncs.gov.in', 'central_aggregator', true)
ON CONFLICT DO NOTHING;

-- 6. Benchmark Public Bulletins & Student Advisories
INSERT INTO public_bulletins (title, slug, category, organization_id, summary, content, source_url, source_name, is_breaking, status) VALUES
(
  'Employment News (15-21 Aug 2026 Edition): Over 14,000 Central & PSU Vacancies Released',
  'employment-news-15-21-aug-2026-edition-summary',
  'employment_news',
  (SELECT id FROM organizations WHERE slug = 'upsc' LIMIT 1),
  'The latest weekly edition of Employment News / Rozgar Samachar features major recruitments across UPSC, Railways, SSC, and Banking sectors with combined 14,000+ posts.',
  'The Publications Division, Ministry of Information and Broadcasting, has released the weekly edition of Employment News for August 15-21, 2026. Key recruitments include UPSC Civil Services 2026, SSC CGL 2026 Notification, and RRB Technician Grade-I & III. Candidates are advised to apply only on verified commission web portals.',
  'https://employmentnews.gov.in',
  'Employment News / Publications Division (GoI)',
  true,
  'published'
),
(
  'Commission Issues Press Statement Regarding Aspirant Representation on Examination Shifts',
  'commission-press-statement-on-student-representation-and-shifts',
  'student_advisory',
  (SELECT id FROM organizations WHERE slug = 'ssc' LIMIT 1),
  'Staff Selection Commission addresses student delegations and confirms standard percentile normalization formula across multi-shift computer-based tests.',
  'Following representations received from candidate associations regarding question difficulty variance across multiple shifts, the Commission has clarified that equitable percentile score normalization will be applied in accordance with the established statutory expert committee guidelines. No manual moderation will take place.',
  'https://ssc.gov.in/notices/press-release-normalization.pdf',
  'Staff Selection Commission Official Communique',
  false,
  'published'
),
(
  'Supreme Court Dismisses Plea Seeking Exam Cancellation; Directs Strict Anti-Cheating Protocol',
  'supreme-court-dismisses-exam-cancellation-plea-orders-anti-cheating-measures',
  'legal_update',
  NULL,
  'The Supreme Court bench has declined to cancel the national-level competitive examination, directing the testing agency to implement biometrics and strict CCTV monitoring.',
  'A two-judge bench of the Hon’ble Supreme Court of India today dismissed a batch of petitions demanding cancellation of the national examination over isolated malpractice reports. The Court observed that cancelling an exam affecting millions of genuine candidates is unjustified and directed the testing agency and law enforcement to fast-track forensic investigations.',
  'https://main.sci.gov.in/judgments',
  'Supreme Court of India (Record of Proceedings)',
  true,
  'published'
)
ON CONFLICT (slug) DO NOTHING;
