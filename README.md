# SuchnaSetu (सूचना सेतु)

> **Authoritative Public Information Aggregator for Official Government Notifications**

SuchnaSetu aggregates and structures public information from official government gazettes, commissions, and recruitment boards across India into verified, machine-readable schemas.

---

## 🌟 Key Architecture & Highlights

- **Framework**: Next.js 15 (App Router, Server-Side Rendering, React 19, TypeScript)
- **Database & Auth**: Supabase (PostgreSQL 15+) with Row Level Security (RLS) and `@supabase/ssr`
- **Security**: Admin-only authentication with RBAC. Public notices are open with zero login barriers.
- **Styling**: Tailwind CSS + Custom Civic Design System tokens
- **SEO & Open Data**: Dynamic `robots.txt`, dynamic `sitemap.xml`, OpenGraph metadata, and structured JSON-LD schema builder
- **Modular Monolith**: Isolated domain modules under `src/modules/` (starting with Government Jobs, extensible to Exams, Results, Schemes, etc.)

---

## 📁 Repository Structure

```
SuchnaSetu/
├── docs/                     # AEK Governance Documentation (PRD, Architecture, Database, etc.)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (public)/         # Public Website Shell (Header, Hero, Directory, Footer)
│   │   ├── (admin)/          # Admin Console Shell (Sidebar, Header, Overview, Login)
│   │   ├── api/              # API Route Handlers
│   │   ├── robots.ts         # Dynamic robots.txt
│   │   └── sitemap.ts        # Dynamic sitemap.xml
│   ├── components/
│   │   ├── ui/               # Reusable UI Primitives (Button, Badge, Card, Input, Table)
│   │   ├── layout/           # Public & Admin Navigation Layouts
│   │   └── shared/           # SearchBar, NotificationBanner, EmptyState
│   ├── lib/
│   │   ├── auth/             # Session & Admin RBAC verification
│   │   ├── constants/        # System configuration & module registry
│   │   ├── seo/              # Metadata & JSON-LD helpers
│   │   ├── supabase/         # SSR, Client, Server, Admin, and Middleware Supabase clients
│   │   └── utils/            # Helper utilities & class merging (cn)
│   ├── modules/              # Domain-Driven Modules
│   │   ├── core/             # Master Taxonomies (Organizations, Categories, States/UTs)
│   │   └── jobs/             # Government Jobs Domain Module
│   ├── types/                # TypeScript database definitions & common types
│   └── middleware.ts         # Route Protection & Session Refresher
├── supabase/
│   ├── migrations/           # 3NF PostgreSQL DDL Migrations
│   └── seed.sql              # Master Seed Data (States, Categories, benchmark Orgs)
├── .env.example              # Environment Variable Template
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

### 3. Apply Database Migration & Seeds
Run the SQL scripts in `supabase/migrations/` and `supabase/seed.sql` inside your Supabase project's SQL editor.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the Public Portal or [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

### 5. Type Checking & Build Verification
```bash
npm run typecheck
npm run build
```
