-- =============================================================================
-- SuchnaSetu Phase 4 Database Migration:
-- Government Examination Module (3NF Normalized Schema, Stages, Schedules,
-- Eligibility, Important Dates Timeline, Exam Centers, Documents & Seed Data)
-- =============================================================================

-- =============================================================================
-- 1. Core Government Examinations Entity
-- =============================================================================
CREATE TABLE IF NOT EXISTS gov_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    short_title VARCHAR(100),
    slug VARCHAR(255) UNIQUE NOT NULL,
    exam_code VARCHAR(100),
    organization_id UUID REFERENCES organizations(id) ON DELETE RESTRICT NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    state_code VARCHAR(5) REFERENCES states_uts(code) ON DELETE SET NULL,
    related_job_id UUID REFERENCES gov_jobs(id) ON DELETE SET NULL,
    mode VARCHAR(50) NOT NULL DEFAULT 'offline_omr' CHECK (mode IN ('online_cbt', 'offline_omr', 'pen_paper', 'hybrid', 'interview_only')),
    frequency VARCHAR(50) NOT NULL DEFAULT 'annual' CHECK (frequency IN ('annual', 'bi_annual', 'quarterly', 'irregular', 'single_recruitment')),
    description TEXT NOT NULL,
    syllabus_summary TEXT,
    marking_scheme TEXT,
    pattern_description TEXT,
    application_process_guide TEXT,
    official_notification_url TEXT,
    official_website_url TEXT,
    application_fee_details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled', 'ongoing', 'concluded')),
    is_featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(255),
    meta_description TEXT,
    source_metadata JSONB DEFAULT '{}'::jsonb,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TRIGGER update_gov_exams_updated_at
BEFORE UPDATE ON gov_exams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for gov_exams
CREATE INDEX IF NOT EXISTS idx_gov_exams_slug ON gov_exams(slug);
CREATE INDEX IF NOT EXISTS idx_gov_exams_status_pub ON gov_exams(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_gov_exams_org ON gov_exams(organization_id);
CREATE INDEX IF NOT EXISTS idx_gov_exams_dept ON gov_exams(department_id);
CREATE INDEX IF NOT EXISTS idx_gov_exams_cat ON gov_exams(category_id);
CREATE INDEX IF NOT EXISTS idx_gov_exams_state ON gov_exams(state_code);
CREATE INDEX IF NOT EXISTS idx_gov_exams_job ON gov_exams(related_job_id);
CREATE INDEX IF NOT EXISTS idx_gov_exams_deleted ON gov_exams(deleted_at) WHERE deleted_at IS NULL;

-- =============================================================================
-- 2. Examination Stages (Prelims, Mains, Interview, Physical Test, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS exam_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES gov_exams(id) ON DELETE CASCADE NOT NULL,
    stage_name VARCHAR(150) NOT NULL,
    stage_order INT NOT NULL DEFAULT 1,
    stage_type VARCHAR(50) NOT NULL CHECK (stage_type IN ('prelims', 'mains', 'interview', 'physical_test', 'skill_test', 'document_verification', 'medical_exam')),
    mode VARCHAR(50) DEFAULT 'offline_omr',
    duration_minutes INT,
    total_marks INT,
    qualifying_marks INT,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('upcoming', 'scheduled', 'ongoing', 'completed', 'cancelled', 'postponed')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_stages_exam ON exam_stages(exam_id, stage_order);

-- =============================================================================
-- 3. Detailed Examination Schedules / Shifts & Papers
-- =============================================================================
CREATE TABLE IF NOT EXISTS exam_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES gov_exams(id) ON DELETE CASCADE NOT NULL,
    stage_id UUID REFERENCES exam_stages(id) ON DELETE CASCADE,
    paper_name VARCHAR(200) NOT NULL,
    exam_date DATE NOT NULL,
    shift_name VARCHAR(100),
    reporting_time TIME,
    start_time TIME,
    end_time TIME,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_schedules_exam ON exam_schedules(exam_id, exam_date);
CREATE INDEX IF NOT EXISTS idx_exam_schedules_stage ON exam_schedules(stage_id);

-- =============================================================================
-- 4. Examination Eligibility Criteria
-- =============================================================================
CREATE TABLE IF NOT EXISTS exam_eligibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES gov_exams(id) ON DELETE CASCADE NOT NULL UNIQUE,
    min_age INT,
    max_age INT,
    age_relaxation_rules TEXT,
    min_qualification_id UUID REFERENCES qualifications(id) ON DELETE SET NULL,
    educational_qualification_description TEXT,
    nationality_criteria VARCHAR(255) DEFAULT 'Citizen of India',
    attempts_limit INT,
    physical_standards TEXT,
    experience_required TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_eligibility_exam ON exam_eligibility(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_eligibility_qual ON exam_eligibility(min_qualification_id);

-- =============================================================================
-- 5. Examination Important Dates Timeline
-- =============================================================================
CREATE TABLE IF NOT EXISTS exam_important_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES gov_exams(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    date_type VARCHAR(50) NOT NULL CHECK (date_type IN ('notification_release', 'application_start', 'application_end', 'fee_payment_end', 'correction_window', 'admit_card_release', 'exam_start', 'exam_end', 'answer_key_release', 'result_declaration', 'interview_date', 'other')),
    is_tentative BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_dates_exam ON exam_important_dates(exam_id, event_date);

-- =============================================================================
-- 6. Examination Centers Directory (Future-ready)
-- =============================================================================
CREATE TABLE IF NOT EXISTS exam_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES gov_exams(id) ON DELETE CASCADE NOT NULL,
    state_code VARCHAR(5) REFERENCES states_uts(code) ON DELETE SET NULL,
    city_name VARCHAR(100) NOT NULL,
    center_code VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_centers_exam ON exam_centers(exam_id, state_code);

-- =============================================================================
-- 7. Examination Official Documents & Circulars
-- =============================================================================
CREATE TABLE IF NOT EXISTS exam_official_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES gov_exams(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    document_type VARCHAR(50) DEFAULT 'circular' CHECK (document_type IN ('notification', 'syllabus', 'timetable', 'instructions', 'circular', 'gazette', 'press_release')),
    file_size_bytes BIGINT,
    published_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_docs_exam ON exam_official_documents(exam_id);

-- =============================================================================
-- 8. Row Level Security (RLS) Policies
-- =============================================================================
ALTER TABLE gov_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_eligibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_important_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_official_documents ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Published Exams" ON gov_exams 
FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Public Read Exam Stages" ON exam_stages 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_exams WHERE gov_exams.id = exam_stages.exam_id AND gov_exams.status = 'published' AND gov_exams.deleted_at IS NULL)
);

CREATE POLICY "Public Read Exam Schedules" ON exam_schedules 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_exams WHERE gov_exams.id = exam_schedules.exam_id AND gov_exams.status = 'published' AND gov_exams.deleted_at IS NULL)
);

CREATE POLICY "Public Read Exam Eligibility" ON exam_eligibility 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_exams WHERE gov_exams.id = exam_eligibility.exam_id AND gov_exams.status = 'published' AND gov_exams.deleted_at IS NULL)
);

CREATE POLICY "Public Read Exam Dates" ON exam_important_dates 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_exams WHERE gov_exams.id = exam_important_dates.exam_id AND gov_exams.status = 'published' AND gov_exams.deleted_at IS NULL)
);

CREATE POLICY "Public Read Exam Centers" ON exam_centers 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_exams WHERE gov_exams.id = exam_centers.exam_id AND gov_exams.status = 'published' AND gov_exams.deleted_at IS NULL)
);

CREATE POLICY "Public Read Exam Documents" ON exam_official_documents 
FOR SELECT USING (
    EXISTS (SELECT 1 FROM gov_exams WHERE gov_exams.id = exam_official_documents.exam_id AND gov_exams.status = 'published' AND gov_exams.deleted_at IS NULL)
);

-- Admin Full Access Policies (Authenticated with active admin profile)
CREATE POLICY "Admin All Exams" ON gov_exams 
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Exam Stages" ON exam_stages 
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Exam Schedules" ON exam_schedules 
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Exam Eligibility" ON exam_eligibility 
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Exam Dates" ON exam_important_dates 
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Exam Centers" ON exam_centers 
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

CREATE POLICY "Admin All Exam Documents" ON exam_official_documents 
FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid() AND admin_profiles.is_active = true)
);

-- =============================================================================
-- 9. Benchmark Seed Data for National Government Examinations
-- =============================================================================

-- Benchmark 1: UPSC Civil Services Examination 2026
DO $$
DECLARE
    v_org_id UUID;
    v_dept_id UUID;
    v_cat_id UUID;
    v_qual_id UUID;
    v_exam_id UUID;
    v_stage_prelims UUID;
    v_stage_mains UUID;
    v_stage_interview UUID;
BEGIN
    SELECT id INTO v_org_id FROM organizations WHERE slug = 'upsc' LIMIT 1;
    SELECT id INTO v_dept_id FROM departments WHERE slug = 'upsc-civil-services-wing' LIMIT 1;
    SELECT id INTO v_cat_id FROM categories WHERE slug = 'central-govt' LIMIT 1;
    SELECT id INTO v_qual_id FROM qualifications WHERE slug = 'graduate-degree' LIMIT 1;

    IF v_org_id IS NOT NULL THEN
        INSERT INTO gov_exams (
            title, short_title, slug, exam_code, organization_id, department_id, category_id, state_code,
            mode, frequency, description, syllabus_summary, marking_scheme, pattern_description,
            application_process_guide, official_notification_url, official_website_url,
            application_fee_details, status, is_featured, meta_title, meta_description,
            published_at
        ) VALUES (
            'Civil Services (Preliminary & Main) Examination 2026',
            'UPSC CSE 2026',
            'upsc-civil-services-examination-2026',
            'UPSC-CSE-2026',
            v_org_id,
            v_dept_id,
            v_cat_id,
            'DL',
            'offline_omr',
            'annual',
            'The Union Public Service Commission conducts the Civil Services Examination annually for recruitment to the Indian Administrative Service (IAS), Indian Foreign Service (IFS), Indian Police Service (IPS), and other Group A & B Central Civil Services.',
            'General Studies Paper-I (Current events, History, Geography, Polity, Economics, Science & Tech) and General Studies Paper-II / CSAT (Comprehension, Logical reasoning, Quantitative aptitude).',
            'Negative marking of 1/3rd (0.33) marks for wrong answers in Objective Preliminary Examination. CSAT Paper-II is qualifying with minimum 33% marks.',
            'Three-stage comprehensive competitive selection: Stage I (Preliminary Objective Screening), Stage II (Main Written Descriptive 9 Papers), Stage III (Personality Test / Interview).',
            'Candidates must register on the UPSC One Time Registration (OTR) platform at upsconline.nic.in and submit the online application with verified photograph, signature, and photo identity card details.',
            'https://upsc.gov.in/examinations/civil-services-examination-2026',
            'https://upsconline.nic.in',
            '{"general": 100, "obc": 100, "ews": 100, "sc": 0, "st": 0, "female": 0, "pwd": 0}'::jsonb,
            'published',
            true,
            'UPSC Civil Services Examination 2026 - Syllabus, Dates, Stages & Eligibility',
            'Comprehensive official guide for UPSC CSE 2026 examination including preliminary date, mains timetable, syllabus breakdown, qualification, age relaxation, and OTR application process.',
            NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
        RETURNING id INTO v_exam_id;

        -- Examination Stages
        INSERT INTO exam_stages (id, exam_id, stage_name, stage_order, stage_type, mode, duration_minutes, total_marks, qualifying_marks, description, status, start_date, end_date)
        VALUES 
        (gen_random_uuid(), v_exam_id, 'Stage I: Civil Services (Preliminary) Examination', 1, 'prelims', 'offline_omr', 240, 400, 132, 'Objective type screening test consisting of Paper I (GS) and Paper II (CSAT).', 'scheduled', '2026-05-24', '2026-05-24')
        RETURNING id INTO v_stage_prelims;

        INSERT INTO exam_stages (id, exam_id, stage_name, stage_order, stage_type, mode, duration_minutes, total_marks, qualifying_marks, description, status, start_date, end_date)
        VALUES 
        (gen_random_uuid(), v_exam_id, 'Stage II: Civil Services (Main) Examination (Written)', 2, 'mains', 'pen_paper', 1620, 1750, 750, 'Conventional descriptive examination consisting of 9 written theory papers.', 'upcoming', '2026-09-18', '2026-09-22')
        RETURNING id INTO v_stage_mains;

        INSERT INTO exam_stages (id, exam_id, stage_name, stage_order, stage_type, mode, duration_minutes, total_marks, qualifying_marks, description, status, start_date, end_date)
        VALUES 
        (gen_random_uuid(), v_exam_id, 'Stage III: Personality Test (Interview)', 3, 'interview', 'interview_only', 45, 275, 100, 'Board interview evaluating candidate suitability, mental caliber, and analytical judgment.', 'upcoming', '2027-01-15', '2027-03-20')
        RETURNING id INTO v_stage_interview;

        -- Examination Schedules for Prelims
        INSERT INTO exam_schedules (exam_id, stage_id, paper_name, exam_date, shift_name, reporting_time, start_time, end_time, instructions)
        VALUES
        (v_exam_id, v_stage_prelims, 'General Studies Paper-I (GS)', '2026-05-24', 'Morning Shift', '09:00:00', '09:30:00', '11:30:00', 'Black ball point pen only. No electronic devices, smartwatches, or calculators permitted in examination hall.'),
        (v_exam_id, v_stage_prelims, 'General Studies Paper-II (CSAT)', '2026-05-24', 'Afternoon Shift', '14:00:00', '14:30:00', '16:30:00', 'Qualifying paper. Candidates must secure at least 33% marks (66 marks out of 200).');

        -- Eligibility
        INSERT INTO exam_eligibility (exam_id, min_age, max_age, age_relaxation_rules, min_qualification_id, educational_qualification_description, nationality_criteria, attempts_limit, physical_standards)
        VALUES (
            v_exam_id,
            21,
            32,
            'Age calculated as on 1st August 2026. Upper age limit relaxation: 5 years for SC/ST, 3 years for OBC, 10 years for PwBD candidates, 5 years for Defence personnel disabled in operations.',
            v_qual_id,
            'Candidate must hold a Bachelor’s Degree of any recognized University incorporated by an Act of the Central or State Legislature in India or other educational institutions established by an Act of Parliament.',
            'Citizen of India for IAS & IPS; for other services: Citizen of India, subject of Nepal, or subject of Bhutan.',
            6,
            'Medical examination as per Civil Services Examination Rules 2026 appendix guidelines for technical and non-technical cadres.'
        )
        ON CONFLICT (exam_id) DO UPDATE SET min_age = EXCLUDED.min_age;

        -- Important Dates
        INSERT INTO exam_important_dates (exam_id, title, event_date, date_type, is_tentative, display_order)
        VALUES
        (v_exam_id, 'Official Notification Release Date', '2026-02-11', 'notification_release', false, 1),
        (v_exam_id, 'Online Application Window Opens', '2026-02-11', 'application_start', false, 2),
        (v_exam_id, 'Last Date to Submit Application Form', '2026-03-03', 'application_end', false, 3),
        (v_exam_id, 'Application Form Correction Window', '2026-03-04', 'correction_window', false, 4),
        (v_exam_id, 'Preliminary e-Admit Card Release', '2026-05-08', 'admit_card_release', true, 5),
        (v_exam_id, 'Civil Services (Preliminary) Exam Date', '2026-05-24', 'exam_start', false, 6),
        (v_exam_id, 'Preliminary Examination Result Declaration', '2026-06-25', 'result_declaration', true, 7),
        (v_exam_id, 'Civil Services (Main) Exam Commencement', '2026-09-18', 'exam_start', false, 8);

        -- Exam Centers
        INSERT INTO exam_centers (exam_id, state_code, city_name, center_code)
        VALUES
        (v_exam_id, 'DL', 'Delhi', 'DEL-01'),
        (v_exam_id, 'MH', 'Mumbai', 'MUM-01'),
        (v_exam_id, 'KA', 'Bengaluru', 'BLR-01'),
        (v_exam_id, 'TN', 'Chennai', 'CHE-01'),
        (v_exam_id, 'WB', 'Kolkata', 'KOL-01'),
        (v_exam_id, 'UP', 'Prayagraj (Allahabad)', 'PRY-01'),
        (v_exam_id, 'BR', 'Patna', 'PAT-01'),
        (v_exam_id, 'TS', 'Hyderabad', 'HYD-01'),
        (v_exam_id, 'RJ', 'Jaipur', 'JAI-01');

        -- Official Documents
        INSERT INTO exam_official_documents (exam_id, title, file_url, document_type, published_date)
        VALUES
        (v_exam_id, 'UPSC Civil Services Examination 2026 Official Gazette Notification', 'https://upsc.gov.in/sites/default/files/Notification-CSP-2026-Eng.pdf', 'notification', '2026-02-11'),
        (v_exam_id, 'UPSC CSE 2026 Detailed Syllabus & Scheme of Examination', 'https://upsc.gov.in/sites/default/files/Syllabus-CSE-2026.pdf', 'syllabus', '2026-02-11'),
        (v_exam_id, 'One Time Registration (OTR) Candidate Guidelines Brochure', 'https://upsconline.nic.in/otr/OTR_Instructions.pdf', 'instructions', '2026-02-11');
    END IF;
END $$;

-- Benchmark 2: SSC Combined Graduate Level (CGL) Examination 2026
DO $$
DECLARE
    v_org_id UUID;
    v_dept_id UUID;
    v_cat_id UUID;
    v_qual_id UUID;
    v_exam_id UUID;
    v_stage_tier1 UUID;
    v_stage_tier2 UUID;
BEGIN
    SELECT id INTO v_org_id FROM organizations WHERE slug = 'ssc' LIMIT 1;
    SELECT id INTO v_dept_id FROM departments WHERE slug = 'ssc-cgl-cell' LIMIT 1;
    SELECT id INTO v_cat_id FROM categories WHERE slug = 'central-govt' LIMIT 1;
    SELECT id INTO v_qual_id FROM qualifications WHERE slug = 'graduate-degree' LIMIT 1;

    IF v_org_id IS NOT NULL THEN
        INSERT INTO gov_exams (
            title, short_title, slug, exam_code, organization_id, department_id, category_id, state_code,
            mode, frequency, description, syllabus_summary, marking_scheme, pattern_description,
            application_process_guide, official_notification_url, official_website_url,
            application_fee_details, status, is_featured, meta_title, meta_description,
            published_at
        ) VALUES (
            'Combined Graduate Level Examination 2026 (Tier-I & Tier-II)',
            'SSC CGL 2026',
            'ssc-combined-graduate-level-cgl-examination-2026',
            'SSC-CGL-2026',
            v_org_id,
            v_dept_id,
            v_cat_id,
            'DL',
            'online_cbt',
            'annual',
            'Staff Selection Commission conducts the Combined Graduate Level Examination for filling up various Group B and Group C non-technical posts across various Ministries, Departments, and Organizations of the Government of India.',
            'Tier-I: General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension. Tier-II: Mathematical Abilities, Reasoning & General Intelligence, English Language, General Awareness, Computer Knowledge Module, and Data Entry Speed Test.',
            'Negative marking of 0.50 marks for each wrong answer in Tier-I. In Tier-II Section-I & II, negative marking is 1 mark for each wrong answer.',
            'Two-tier Computer Based Examination (CBT): Tier-I (Objective 100 questions / 200 marks) followed by Tier-II (Objective + Skill Test).',
            'Apply online at ssc.gov.in through candidate portal with live webcam photo capture and fee payment.',
            'https://ssc.gov.in/api/attachment/uploads/date-wise/notices/CGL2026_Notice.pdf',
            'https://ssc.gov.in',
            '{"general": 100, "obc": 100, "ews": 100, "sc": 0, "st": 0, "female": 0, "pwd": 0}'::jsonb,
            'published',
            true,
            'SSC CGL 2026 Examination - Tier 1 & 2 Syllabus, Dates & Pattern',
            'Official complete notification for SSC Combined Graduate Level (CGL) 2026 examination including computer based test dates, shift schedules, eligibility criteria, and syllabus breakdown.',
            NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
        RETURNING id INTO v_exam_id;

        -- Stages
        INSERT INTO exam_stages (id, exam_id, stage_name, stage_order, stage_type, mode, duration_minutes, total_marks, qualifying_marks, description, status, start_date, end_date)
        VALUES 
        (gen_random_uuid(), v_exam_id, 'Tier-I Examination (Computer Based Test)', 1, 'prelims', 'online_cbt', 60, 200, 60, 'Mandatory computer based test across 4 sections with 100 multiple choice questions.', 'scheduled', '2026-09-09', '2026-09-26')
        RETURNING id INTO v_stage_tier1;

        INSERT INTO exam_stages (id, exam_id, stage_name, stage_order, stage_type, mode, duration_minutes, total_marks, qualifying_marks, description, status, start_date, end_date)
        VALUES 
        (gen_random_uuid(), v_exam_id, 'Tier-II Examination & Computer Skill Test', 2, 'mains', 'online_cbt', 150, 390, 130, 'Detailed computer based test and Data Entry Speed Test (DEST).', 'upcoming', '2026-12-10', '2026-12-14')
        RETURNING id INTO v_stage_tier2;

        -- Schedules
        INSERT INTO exam_schedules (exam_id, stage_id, paper_name, exam_date, shift_name, reporting_time, start_time, end_time, instructions)
        VALUES
        (v_exam_id, v_stage_tier1, 'Tier-I Computer Based Test (All Sections)', '2026-09-09', 'Shift 1 (Morning)', '07:30:00', '09:00:00', '10:00:00', 'Original government photo ID card (Aadhaar, Voter ID, Passport) and printed admit card mandatory.'),
        (v_exam_id, v_stage_tier1, 'Tier-I Computer Based Test (All Sections)', '2026-09-09', 'Shift 2 (Afternoon)', '11:00:00', '12:30:00', '13:30:00', 'Strict biometric verification at entrance.');

        -- Eligibility
        INSERT INTO exam_eligibility (exam_id, min_age, max_age, age_relaxation_rules, min_qualification_id, educational_qualification_description, nationality_criteria, attempts_limit)
        VALUES (
            v_exam_id,
            18,
            30,
            'Age relaxation: 5 years for SC/ST, 3 years for OBC, 10 years for PwD, 3 years after deduction of military service for Ex-Servicemen.',
            v_qual_id,
            'Bachelor’s Degree from a recognized University or equivalent. Candidates appearing in the final year of graduation are also eligible to apply subject to acquiring degree before cutoff date.',
            'Citizen of India',
            NULL
        )
        ON CONFLICT (exam_id) DO UPDATE SET min_age = EXCLUDED.min_age;

        -- Important Dates
        INSERT INTO exam_important_dates (exam_id, title, event_date, date_type, is_tentative, display_order)
        VALUES
        (v_exam_id, 'Official Notice Release Date', '2026-06-24', 'notification_release', false, 1),
        (v_exam_id, 'Online Application Window Opens', '2026-06-24', 'application_start', false, 2),
        (v_exam_id, 'Last Date for Online Application & Fee Payment', '2026-07-24', 'application_end', false, 3),
        (v_exam_id, 'Window for Application Form Correction', '2026-08-10', 'correction_window', false, 4),
        (v_exam_id, 'Tier-I City Intimation Slip Release', '2026-08-30', 'other', true, 5),
        (v_exam_id, 'Tier-I Admit Card Release Date', '2026-09-04', 'admit_card_release', true, 6),
        (v_exam_id, 'Tier-I Computer Based Examination Window', '2026-09-09', 'exam_start', false, 7),
        (v_exam_id, 'Tier-I Answer Key & Objection Window', '2026-10-05', 'answer_key_release', true, 8);

        -- Centers
        INSERT INTO exam_centers (exam_id, state_code, city_name, center_code)
        VALUES
        (v_exam_id, 'DL', 'New Delhi', 'NR-DEL-01'),
        (v_exam_id, 'UP', 'Lucknow', 'CR-LKO-01'),
        (v_exam_id, 'UP', 'Kanpur', 'CR-KNP-01'),
        (v_exam_id, 'BR', 'Patna', 'CR-PAT-01'),
        (v_exam_id, 'WB', 'Kolkata', 'ER-KOL-01'),
        (v_exam_id, 'MH', 'Mumbai', 'WR-MUM-01'),
        (v_exam_id, 'KA', 'Bengaluru', 'KKR-BLR-01'),
        (v_exam_id, 'TN', 'Chennai', 'SR-CHE-01');

        -- Official Documents
        INSERT INTO exam_official_documents (exam_id, title, file_url, document_type, published_date)
        VALUES
        (v_exam_id, 'SSC CGL 2026 Official Examination Notification Document', 'https://ssc.gov.in/api/attachment/uploads/date-wise/notices/CGL2026_Notice.pdf', 'notification', '2026-06-24'),
        (v_exam_id, 'Tier-I & Tier-II Normalization Formula Guidelines', 'https://ssc.gov.in/notices/press-release-normalization.pdf', 'circular', '2026-06-24');
    END IF;
END $$;
