export type Jurisdiction = "central" | "state" | "autonomous" | "psu";

export type AdminRole = "super_admin" | "editor" | "auditor";

export type NoticeStatus = "draft" | "published" | "archived";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  disabled?: boolean;
  external?: boolean;
}
