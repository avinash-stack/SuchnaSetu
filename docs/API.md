# API Design & Integration Contracts — SuchnaSetu

## 1. Overview
SuchnaSetu operates primarily on **Next.js Server Components** and **Server Actions** for secure internal data operations, complemented by RESTful API endpoints for system utilities and auth lifecycle management.

---

## 2. API Endpoints

### 2.1 Public & System Endpoints

#### GET `/robots.txt`
- **Purpose**: Crawl directives for search engines.
- **Access**: Public.
- **Output**: Directs crawlers to allow public pages and disallow `/admin/` and `/api/auth/`.

#### GET `/sitemap.xml`
- **Purpose**: Dynamic sitemap index for search engines.
- **Access**: Public.
- **Output**: XML sitemap covering all active and upcoming modular routes.

---

### 2.2 Admin & Auth Lifecycle Endpoints

#### POST `/api/auth/logout`
- **Purpose**: Terminate active Supabase session and clear HTTP-only cookies.
- **Access**: Authenticated Admin.
- **Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 3. Server Actions & Domain Contracts (Jobs Module)

In upcoming phases, module operations will use typed Server Actions backed by Zod validation schemas defined in `src/modules/jobs/schemas.ts`:

- `getPublishedJobsAction(filters: JobFilterParams): Promise<PaginatedResult<GovJob>>`
- `getJobBySlugAction(slug: string): Promise<GovJobDetailed | null>`
- `createJobNoticeAction(input: GovJobInput): Promise<ApiResponse<GovJob>>` (Admin only)
- `updateJobNoticeAction(id: string, input: Partial<GovJobInput>): Promise<ApiResponse<GovJob>>` (Admin only)
- `publishJobNoticeAction(id: string): Promise<ApiResponse<void>>` (Admin only)
