# Deployment Guide & Infrastructure — SuchnaSetu

## 1. Hosting Architecture
- **Frontend / Application**: Next.js App Router deployed to Vercel or Node.js Docker runtime.
- **Database & Auth**: Supabase Managed PostgreSQL with automatic backups and edge connection pooling.

---

## 2. Environment Variables Checklist

| Variable Name | Scope | Required | Description |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Public / Browser | Yes | Production canonical domain (e.g. `https://suchnasetu.in`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Browser | Yes | Supabase Project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Browser | Yes | Supabase anonymous API key subject to RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Yes | Supabase privileged service role key |
| `NODE_ENV` | Server-Only | Yes | `production` / `development` |

---

## 3. Database Migration Deployment
1. Connect to Supabase project via Supabase CLI or SQL Editor.
2. Execute migration script:
   ```bash
   # Run initial schema DDL
   supabase db push / apply supabase/migrations/20260815000000_initial_schema.sql
   ```
3. Execute seed data:
   ```bash
   # Populate master states, categories, and module registry
   supabase db execute -f supabase/seed.sql
   ```

---

## 4. Build & Verification Commands

```bash
# Install dependencies
npm install

# TypeScript Type Check
npm run typecheck

# Standard Next.js Build
npm run build

# OpenNext Cloudflare Adapter Build
npm run build:worker

# Local Cloudflare Worker Preview
npm run preview

# Deploy to Cloudflare Workers
npm run deploy
```

---

## 5. Cloudflare Dashboard Deployment Settings

When connecting the repository to Cloudflare Workers Builds or Cloudflare Pages:

- **Framework Preset**: `None` / `Custom`
- **Build Command**: `npm run build:worker` (or `npx opennextjs-cloudflare build`)
- **Deploy Command**: Automatic via Wrangler configuration (`wrangler.jsonc`)
- **Build Output Directory**: `.open-next`
- **Root Directory**: `/`
- **Compatibility Date**: `2024-12-30` (or latest)
- **Compatibility Flags**: `nodejs_compat`
- **Environment Variables**:
  - `NEXT_PUBLIC_APP_URL`: Canonical site URL (e.g. `https://suchnasetu.in`)
  - `NEXT_PUBLIC_SITE_URL`: Canonical site URL
  - `SITE_URL`: Canonical site URL
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
  - `SUPABASE_SERVICE_ROLE_KEY`: Add via Cloudflare Workers Secrets (`wrangler secret put SUPABASE_SERVICE_ROLE_KEY` or Dashboard Encrypted Secret). Never expose this key to browser bundles or in public config files.
