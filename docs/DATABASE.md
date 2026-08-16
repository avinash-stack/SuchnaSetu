# Database Design & Schema Specification — SuchnaSetu

## 1. Relational Architecture & Normalization

SuchnaSetu implements a **3NF Normalized PostgreSQL Database** in Supabase, structured into two distinct layers:
1. **Core Master Layer**: System-wide taxonomies and master entities shared across all modules (`states_uts`, `organizations`, `departments`, `categories`, `qualifications`, `modules`, `official_sources`, `admin_profiles`, `audit_logs`).
2. **Domain Module Layer**: Isolated table structures for each domain module (e.g. `gov_jobs`, `job_vacancies`, `job_important_dates`, `job_eligibility`, `job_official_documents`, `public_bulletins`).

---

## 2. Entity-Relationship Model (Core & Jobs Module)

```mermaid
erDiagram
    STATES_UTS ||--o{ ORGANIZATIONS : "located in"
    STATES_UTS ||--o{ GOV_JOBS : "jurisdiction"
    ORGANIZATIONS ||--o{ DEPARTMENTS : "branches into"
    ORGANIZATIONS ||--o{ OFFICIAL_SOURCES : "operates"
    ORGANIZATIONS ||--o{ GOV_JOBS : "publishes"
    ORGANIZATIONS ||--o{ PUBLIC_BULLETINS : "issues"
    DEPARTMENTS ||--o{ GOV_JOBS : "cadre"
    CATEGORIES ||--o{ GOV_JOBS : "classified under"
    QUALIFICATIONS ||--o{ GOV_JOBS : "min requirement"
    
    ADMIN_PROFILES ||--o{ AUDIT_LOGS : "performed"
    
    GOV_JOBS ||--o{ JOB_VACANCIES : "contains (1:N)"
    GOV_JOBS ||--o{ JOB_IMPORTANT_DATES : "scheduled with (1:N)"
    GOV_JOBS ||--o{ JOB_ELIGIBILITY : "specifies (1:1)"
    GOV_JOBS ||--o{ JOB_OFFICIAL_DOCUMENTS : "references (1:N)"
    GOV_JOBS ||--o{ PUBLIC_BULLETINS : "related news (1:N)"

    STATES_UTS {
        varchar(5) code PK
        varchar(100) name
        varchar(20) type
        varchar(100) capital
        boolean is_active
    }

    ORGANIZATIONS {
        uuid id PK
        varchar(255) name
        varchar(50) acronym
        varchar(255) slug UK
        varchar(50) type
        varchar(20) jurisdiction
        varchar(5) state_code FK
        text website_url
    }

    DEPARTMENTS {
        uuid id PK
        uuid organization_id FK
        varchar(255) name
        varchar(50) acronym
        varchar(255) slug UK
        boolean is_active
    }

    CATEGORIES {
        uuid id PK
        varchar(100) name
        varchar(100) slug UK
        text description
        varchar(50) icon_name
        int display_order
    }

    QUALIFICATIONS {
        uuid id PK
        varchar(100) name
        varchar(100) slug UK
        varchar(50) level
        int display_order
    }

    MODULES {
        varchar(50) key PK
        varchar(100) title
        text description
        boolean is_enabled
        varchar(100) route_path
    }

    GOV_JOBS {
        uuid id PK
        varchar(500) title
        varchar(500) slug UK
        varchar(255) notification_number
        uuid organization_id FK
        uuid department_id FK
        uuid category_id FK
        uuid min_qualification_id FK
        varchar(5) state_code FK
        varchar(50) employment_type
        int total_vacancies
        numeric salary_min
        numeric salary_max
        text pay_scale_details
        text official_notification_url
        text official_apply_url
        varchar(20) status
        varchar(255) meta_title
        text meta_description
        timestamptz published_at
        timestamptz deleted_at
    }

    JOB_VACANCIES {
        uuid id PK
        uuid job_id FK
        varchar(255) post_name
        varchar(50) post_code
        int total_posts
        int ur_posts
        int ews_posts
        int obc_posts
        int sc_posts
        int st_posts
        int pwd_posts
        varchar(50) pay_level
    }

    JOB_IMPORTANT_DATES {
        uuid id PK
        uuid job_id FK
        varchar(100) event_name
        timestamptz event_date
        varchar(100) event_date_text
        boolean is_tentative
        int display_order
    }

    JOB_ELIGIBILITY {
        uuid id PK
        uuid job_id FK
        int min_age
        int max_age
        date age_calculation_date
        text age_relaxation_details
        text education_qualification
        text experience_details
        text selection_process
        jsonb application_fee_details
    }

    JOB_OFFICIAL_DOCUMENTS {
        uuid id PK
        uuid job_id FK
        varchar(50) document_type
        varchar(255) title
        text file_url
        bigint file_size_bytes
        date published_date
    }

    PUBLIC_BULLETINS {
        uuid id PK
        varchar(500) title
        varchar(500) slug UK
        varchar(50) category
        uuid organization_id FK
        uuid related_job_id FK
        text summary
        text content
        text source_url
        varchar(255) source_name
        boolean is_breaking
        varchar(20) status
        timestamptz published_at
    }
```

---

## 3. Data Integrity & Constraints

1. **Foreign Key Integrity**:
   - `job_vacancies`, `job_important_dates`, `job_eligibility`, and `job_official_documents` cascade on `job_id` deletion (`ON DELETE CASCADE`).
   - `gov_jobs` references master tables (`organizations`, `departments`, `categories`, `qualifications`, `states_uts`).
2. **Soft Deletes**:
   - `gov_jobs.deleted_at` allows moving notices to Trash without losing audit trails or sub-table breakdowns.
3. **Audit Log Trail**:
   - Every mutation is recorded in `audit_logs` with `admin_id`, `action`, `entity_type`, `entity_id`, and `metadata`.
4. **Row Level Security (RLS)**:
   - **Public**: Anonymous `SELECT` permitted only where `status = 'published'` and `deleted_at IS NULL`.
   - **Admin**: Full access granted to authenticated users verified in `admin_profiles` (`is_active = true`).
