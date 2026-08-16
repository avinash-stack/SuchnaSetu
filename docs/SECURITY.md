# Security Architecture & Policies — SuchnaSetu

## 1. Threat Model & Security Posture

As an authoritative public information platform, SuchnaSetu prioritizes **Content Integrity**, **Attribution Verification**, and **Administrative Guardrails**.

---

## 2. Core Security Pillars

### 2.1 Admin-Only Authentication & RBAC
- **No Public Auth**: Public visitors access notice content completely anonymously without logins, tracking tokens, or personal identifiers.
- **RBAC Roles**:
  - `super_admin`: Full database access, admin provisioning, system configuration.
  - `editor`: Notice creation, drafting, and publication.
  - `auditor`: Read-only access to admin panels and audit logs.

### 2.2 Row Level Security (RLS)
- Every PostgreSQL table has RLS enabled.
- Public read access is strictly filtered by `status = 'published'` or `is_active = true`.
- Insert, Update, and Delete actions are restricted to verified, active records in `admin_profiles` matching `auth.uid()`.

### 2.3 Edge Route Protection (Middleware)
- Next.js Edge Middleware intercepts all `/admin/*` requests (except `/admin/login`).
- Unauthenticated requests are instantly redirected to `/admin/login?redirect=...`.
- Authenticated requests are verified against Supabase user token claims.

### 2.4 Secrets Management
- `SUPABASE_SERVICE_ROLE_KEY` is strictly server-only and NEVER prefixed with `NEXT_PUBLIC_`.
- All client queries use the restricted `NEXT_PUBLIC_SUPABASE_ANON_KEY` subject to RLS.

### 2.5 Audit Logging
- Every administrative change (publish, update, archive) records:
  - Admin Profile ID
  - Action & Entity Type
  - Timestamp & Metadata
  - IP Address (anonymized)

---

## 3. Security Checklist for Future Phases
- [x] RLS enabled on 100% of PostgreSQL tables.
- [x] Environment variable segregation (Client vs Server).
- [x] Edge Middleware session verification.
- [x] Cryptographic UUIDs used for all primary keys.
- [x] Zod input sanitization and URL validation for official links.
