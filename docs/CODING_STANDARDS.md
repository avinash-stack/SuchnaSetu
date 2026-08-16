# Coding Standards & Engineering Guidelines — SuchnaSetu

## 1. Core Principles
- **SOLID & Clean Architecture**: Maintain strict separation between UI components, domain module services, database clients, and utilities.
- **DRY (Don't Repeat Yourself)**: Shared utilities, UI design primitives, and type definitions reside in centralized packages (`src/lib/`, `src/components/ui/`, `src/types/`).
- **Strict Type Safety**: All TypeScript code must pass with zero `any` exceptions where domain types exist.

---

## 2. Directory & File Conventions
1. **Modules (`src/modules/<name>/`)**:
   - `types.ts`: Domain models and database table row mappings.
   - `schemas.ts`: Zod validation schemas for input/output payloads.
   - `index.ts`: Public module barrel export.
2. **Components (`src/components/`)**:
   - `ui/`: Design system primitives (stateless or client presentation).
   - `layout/`: Structural shells (Header, Footer, Sidebar).
   - `shared/`: Composite UI pieces used across multiple pages.
3. **Libraries (`src/lib/`)**:
   - Pure functions, Supabase clients, auth helpers, constants.

---

## 3. Component Design Guidelines
- Use Server Components by default. Only add `"use client"` when component requires client state (e.g. `useState`, `useEffect`, interactive event handlers).
- Always use `cn()` from `@/lib/utils` for composing dynamic Tailwind class names.
- Accessible semantic HTML tags (`<header>`, `<main>`, `<footer>`, `<nav>`, `<aside>`, `<article>`) must be used on all pages.

---

## 4. Error Handling & Logging
- Never expose internal database error details to client responses.
- Use standardized response objects (`ApiResponse<T>`) for API route handlers and server actions.
- Wrap critical pages in error boundaries (`error.tsx`).
