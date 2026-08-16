# Product Requirements Document (PRD) — SuchnaSetu

## 1. Document Overview
- **Document Version**: 1.0.0
- **Product Stage**: Foundation & Architecture
- **Primary Domain**: Public Sector Information Aggregation

---

## 2. Goals & Success Metrics

### 2.1 Business & Product Goals
1. Establish a solid, scalable, and modular foundation for 9 public sector information modules.
2. Deliver sub-second page loads with Server-Side Rendering (SSR/RSC) and 100% Core Web Vitals compliance.
3. Provide an intuitive, accessible (WCAG 2.1 AA) UI for both public visitors and editorial administrators.
4. Guarantee strict role-based access control (RBAC) so that only authorized administrators can modify public records.

### 2.2 Success Metrics
- **Performance**: Lighthouse Performance Score ≥ 95.
- **Accessibility**: Lighthouse Accessibility Score ≥ 98.
- **Security**: 0 unauthenticated access routes to `/admin/*`, 100% RLS coverage on Supabase database.
- **Type Safety**: 0 TypeScript compilation errors with strict mode enabled.

---

## 3. User Personas & User Stories

### Persona A: Public Citizen / Aspirant (Rahul)
- **Goal**: Browse authentic government recruitment notices without being bombarded by ads or misleading information.
- **Story**: *As a citizen, I want to view verified government job notices with direct links to the official gazette PDF so that I can prepare my application with confidence.*

### Persona B: Editorial Administrator (Priya)
- **Goal**: Manage, audit, and publish structured notifications safely.
- **Story**: *As an admin, I want to securely log in to an administrative console and manage modular notices with automated audit logging.*

---

## 4. Functional Requirements

### 4.1 Public Portal Requirements
- **FR-PUB-01 (Homepage Shell)**: Clear platform identity, search bar shell, directory cards for all 9 modules (Jobs active, others upcoming), official sources list, and statutory disclaimer.
- **FR-PUB-02 (SEO & Discoverability)**: Canonical URLs, OpenGraph social cards, JSON-LD structured data generator, dynamic `/robots.txt`, and `/sitemap.xml`.
- **FR-PUB-03 (Navigation)**: Responsive desktop and mobile navigation with direct links and accessible landmarks.

### 4.2 Admin Portal Requirements
- **FR-ADM-01 (Admin Authentication)**: Supabase Email/Password authentication strictly restricted to active records in `admin_profiles`.
- **FR-ADM-02 (Route Protection)**: Next.js Edge Middleware guarding all `/admin/*` paths and redirecting unauthenticated users to `/admin/login`.
- **FR-ADM-03 (Dashboard Shell)**: Key metrics cards, module deployment matrix, and system audit trail status.

### 4.3 Database & Modular Requirements
- **FR-DB-01 (Normalization)**: Fully normalized 3NF schema for master entities (`states_uts`, `organizations`, `categories`, `modules`, `official_sources`, `admin_profiles`, `audit_logs`).
- **FR-DB-02 (Jobs Schema)**: Multi-table normalized schema for Government Jobs (`gov_jobs`, `job_vacancies`, `job_important_dates`, `job_eligibility`, `job_official_documents`).
- **FR-DB-03 (RLS)**: Row Level Security policies guaranteeing public read for published content and admin write for authenticated administrators.

---

## 5. Non-Functional Requirements (NFRs)
- **Performance**: Edge-cached static content, optimized bundle size (< 150KB first-load JS).
- **Security**: CSP headers, secure HTTP-only cookies, parameterized database queries, no secrets leaked to client bundles.
- **Maintainability**: Clean Architecture, SOLID principles, zero code duplication, strict TypeScript typing.
- **Scalability**: Capable of hosting 100,000+ structured notices across all 9 modules without architectural refactoring.
