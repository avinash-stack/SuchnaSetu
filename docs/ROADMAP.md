# Product & Engineering Roadmap — SuchnaSetu

## Phase Overview

```
Phase 1: Project Foundation (COMPLETED)
   ↓
Phase 2: Government Jobs Module
   ↓
Phase 3: Government Exams & Admit Cards
   ↓
Phase 4: Results & Merit Lists
   ↓
Phase 5: Schemes, Scholarships, Tenders & Circulars
```

---

## Phase 1: Project Foundation (Current Phase — Done)
- [x] Next.js 15 App Router & TypeScript project initialization
- [x] Tailwind CSS design system with civic color palette tokens
- [x] Supabase connection architecture (`@supabase/ssr`, server, client, admin)
- [x] 3NF normalized PostgreSQL schema (`supabase/migrations/`) & seed data (`supabase/seed.sql`)
- [x] Admin-only authentication with RBAC and Edge Middleware protection
- [x] Reusable UI component library (`button`, `badge`, `card`, `input`, `table`)
- [x] Public Website Shell (Header, Hero, Module Directory, Official Sources, Footer)
- [x] Admin Dashboard Shell (Sidebar, Header, Overview Metrics, Audit table shell)
- [x] SEO Foundation (Metadata helpers, JSON-LD Schema builder, dynamic `robots.ts`, `sitemap.ts`)
- [x] AEK Engineering Documentation suite (`docs/*`)

---

## Phase 2: Government Jobs Module (Next Phase)
- [ ] Public Jobs Index Page (`/jobs`) with multi-faceted filtering (State, Organization, Category, Qualification)
- [ ] Public Job Detail Page (`/jobs/[slug]`) with post vacancy tables, eligibility cards, and official PDF download links
- [ ] Admin Job Management CRUD interface (`/admin/jobs`)
- [ ] Admin Multi-post vacancy builder and timeline milestone editor
- [ ] JSON-LD JobPosting & GovernmentPermit automated microdata injection

---

## Phase 3: Government Exams & Admit Cards Module
- [ ] Examination calendar & countdown tracking
- [ ] Hall ticket release notification system
- [ ] Exam venue intimation slip tracker

---

## Phase 4: Results & Scorecards Module
- [ ] Published scorecards, cutoff marks, and merit lists
- [ ] Historical cutoff trend comparisons

---

## Phase 5: Citizen Welfare Modules
- [ ] Government Schemes directory with benefit calculators
- [ ] Scholarships & fellowships application windows
- [ ] Public Tenders, Gazette Circulars, and Statutory Notices
