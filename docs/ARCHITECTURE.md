# Architecture & System Design — SuchnaSetu

## 1. Architectural Overview

SuchnaSetu employs a **Modular Monolith Architecture** with **Domain-Driven Design (DDD)** principles, built upon Next.js 15 (App Router) and Supabase (PostgreSQL 15+).

```
                              ┌─────────────────────────────┐
                              │     Internet / Clients      │
                              └──────────────┬──────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
         ┌─────────────▼─────────────┐               ┌─────────────▼─────────────┐
         │   Public Website Shell    │               │  Admin Dashboard Shell    │
         │  - Next.js RSC & SSR      │               │  - Supabase SSR Auth      │
         │  - OpenGraph / JSON-LD    │               │  - RBAC & Route Guard     │
         │  - Static & Dynamic SEO   │               │  - Editorial Operations   │
         └─────────────┬─────────────┘               └─────────────┬─────────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │     Next.js App Router      │
                              │    (Edge Middleware Guard)  │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │    Domain Modules Layer     │
                              │  ┌───────────────────────┐  │
                              │  │ Jobs Module (Initial) │  │
                              │  ├───────────────────────┤  │
                              │  │ Exams Module (Future) │  │
                              │  ├───────────────────────┤  │
                              │  │ Schemes Module (Fut.) │  │
                              │  ├───────────────────────┤  │
                              │  │ Core Master Taxonomies│  │
                              │  └───────────────────────┘  │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │  Supabase PostgreSQL (RLS)  │
                              │  - Master & Domain Tables   │
                              │  - Audit Logs & Auth Users  │
                              │  - Automated Triggers       │
                              └─────────────────────────────┘
```

---

## 2. Key Design Decisions & Rationale

### 2.1 Next.js 15 App Router & Server Components
- **Why**: Government and civic notice portals demand fast initial page loads, dynamic OpenGraph previews, and flawless indexing by search engines. Server Components execute on the server, minimizing JavaScript sent to client browsers.
- **Route Groups**: Segregates public pages `(public)` from restricted admin pages `(admin)` with independent layout hierarchies.

### 2.2 Domain-Driven Modular Organization (`src/modules/`)
- Each module (e.g. `src/modules/jobs/`) encapsulates its own types, validation schemas (Zod), and domain services.
- Adding a future module (such as `exams` or `schemes`) is an additive operation requiring zero refactoring of core systems.

### 2.3 Supabase PostgreSQL with Row Level Security (RLS)
- **Why**: Relational database integrity is essential for multi-entity notices (breakdown of vacancies across reservation categories, multi-step dates, official PDF documents).
- **Security**: PostgreSQL RLS policies enforce read/write constraints at the database engine layer.

### 2.4 Separation of Admin Authentication from Public Access
- Public visitors never encounter a login wall or captcha barrier.
- Admin authentication uses secure HTTP-only cookies managed via `@supabase/ssr` and verified in Next.js middleware.

---

## 3. Directory Layout Blueprint

```
SuchnaSetu/
├── docs/                     # AEK Governance Documentation
├── public/                   # Static public assets (icons, og-images)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (public)/         # Public portal route group
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (admin)/          # Protected admin route group
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       └── login/page.tsx
│   │   ├── layout.tsx        # Root HTML layout
│   │   ├── globals.css       # Tailwind & CSS custom tokens
│   │   ├── robots.ts         # Dynamic robots.txt
│   │   ├── sitemap.ts        # Dynamic sitemap.xml
│   │   ├── not-found.tsx     # 404 page
│   │   └── error.tsx         # Client error boundary
│   ├── components/
│   │   ├── ui/               # Reusable primitives (button, badge, card, input, table)
│   │   ├── layout/           # Public & Admin headers, footers, sidebars
│   │   └── shared/           # Search bar, notification banners, empty states
│   ├── lib/
│   │   ├── auth/             # Session & role verification helpers
│   │   ├── constants/        # Site configuration & module registry
│   │   ├── seo/              # Metadata & JSON-LD schema builder
│   │   ├── supabase/         # SSR, Client, Admin & Middleware Supabase instances
│   │   └── utils/            # Formatting & string utilities
│   ├── modules/              # Domain Modules
│   │   ├── core/             # Master Taxonomies (Organizations, Categories, States)
│   │   ├── jobs/             # Government Jobs Domain Module
│   │   ├── bulletins/        # Bulletins & Student Advisories Module
│   │   └── ingestion/        # Isolated Data Import Engine
│   │       ├── interfaces/   # Adapter, Normalizer, Queue, Scheduler contracts
│   │       ├── core/         # Pipeline, Hasher, Change Detector, Registry, Retry
│   │       └── adapters/     # Modular source connectors (Plugin pattern)
│   ├── types/                # Global TypeScript declarations & Supabase types
│   └── middleware.ts         # Next.js Edge Auth & Route Protection
├── supabase/
│   ├── migrations/           # PostgreSQL DDL migrations
│   └── seed.sql              # Master taxonomy seed records
├── .env.example              # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 4. Data Ingestion & Import Architecture (Phase 3 Foundation)

The Ingestion Engine operates as an **independent, asynchronous data processing framework** completely decoupled from the web application.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXTENSIBLE SOURCE INGESTION PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
  1. ADAPTER REGISTRATION             ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  SourceAdapterRegistry (Thread-Safe Plugin Registry)                    │
  │  - Holds registered SourceAdapter & DataNormalizer instances            │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
  2. EXTRACTION PHASE                 ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  SourceAdapter.extract(context)                                         │
  │  - Pulls raw payloads from external origins into RawItem<T>[]           │
  │  - Writes immutable payload snapshot to [import_raw_payloads]           │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
  3. NORMALIZATION & VALIDATION       ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  DataNormalizer.normalize(rawItem, context)                             │
  │  - Cleanses, validates, and maps raw fields to canonical domain schemas │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
  4. CHANGE DETECTION & DEDUPLICATION ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  DatabaseChangeDetector                                                 │
  │  - Generates deterministic SHA-256 content hashes (sorted JSON keys)    │
  │  - Compares against [import_entity_hashes]                              │
  │  - Outcomes:                                                            │
  │    • SKIP   -> Identical hash; mark raw payload as duplicate            │
  │    • INSERT -> New natural key; persist to domain table                 │
  │    • UPDATE -> Hash changed; update domain record and fingerprint       │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
  5. PERSISTENCE & AUDIT TRAIL        ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  - Writes target entity to [gov_jobs], [public_bulletins], etc.         │
  │  - Updates [import_entity_hashes] fingerprint                           │
  │  - Writes real-time step execution records to [import_logs]             │
  │  - Finalizes [import_jobs] statistics and updates source sync timestamps│
  └─────────────────────────────────────────────────────────────────────────┘
```

### Adding a New Source Without Modifying Existing Code (Plugin Pattern)

To add a new data source to SuchnaSetu in the future:
1. **Create an Adapter Class** extending `BaseSourceAdapter` implementing `extract(context)` and `testConnection(source)`.
2. **Create a Paired Normalizer Class** implementing `DataNormalizer` to map raw JSON to `NormalizedJobNotice` or `NormalizedBulletinNotice`.
3. **Register the Plugin**:
   ```typescript
   SourceAdapterRegistry.register(new CustomSourceAdapter(), new CustomDataNormalizer());
   ```
4. **Register the Source Record** in `import_sources` database table with `adapter_key = "custom_adapter_key"`.

**Zero Core Code Modification**: The pipeline engine, queue, change detector, hashing, and database persistence layers require zero changes when new adapters are added.

### Production Reference Source: UPSC (`upsc_official_feed`)

The Union Public Service Commission connector (`UpscSourceAdapter` and `UpscDataNormalizer`) serves as the production reference implementation:
- **Adapter**: Queries `https://upsc.gov.in` recruitment and active exam listings.
- **Normalizer**: Parses Indian standard dates, handles reservation category breakdowns (UR, OBC, SC, ST, EWS), and canonicalizes official notification PDF links and online application endpoints (`upsconline.nic.in`).
- **Fingerprinting**: Uses natural keys (`upsc:notice:{advt_no}`) with SHA-256 content hashing to ensure idempotent deduplication.


