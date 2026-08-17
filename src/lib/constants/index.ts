import { NavItem } from "@/types/common";

/**
 * Resolves the canonical base URL for SuchnaSetu across environments.
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL
 * 2. SITE_URL
 * 3. NEXT_PUBLIC_APP_URL (if not localhost in production)
 * 4. VERCEL_PROJECT_PRODUCTION_URL (Vercel system variable)
 * 5. VERCEL_URL (Vercel deployment variable)
 * 6. Fallback: "https://suchnasetu.in"
 *
 * Guarantees:
 * - Always returns absolute HTTPS URL in production.
 * - Never returns localhost in production.
 * - Strips trailing slashes.
 */
export function getCanonicalSiteUrl(): string {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    !!process.env.VERCEL ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL;

  if (isProduction) {
    if (rawUrl && !rawUrl.includes("localhost") && !rawUrl.includes("127.0.0.1")) {
      const formatted = rawUrl.startsWith("http://")
        ? rawUrl.replace("http://", "https://")
        : rawUrl.startsWith("https://")
        ? rawUrl
        : `https://${rawUrl}`;
      return formatted.replace(/\/+$/, "");
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, "");
    }

    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
    }

    return "https://suchnasetu.in";
  }

  // Development environment fallback
  if (rawUrl) {
    return rawUrl.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export const SITE_CONFIG = {
  name: "SuchnaSetu",
  tagline: "Official Public Information Aggregator",
  description: "A centralized, verified public portal aggregating and structuring official notifications from government bodies, commissions, and public authorities across India.",
  get url() {
    return getCanonicalSiteUrl();
  },
  disclaimer: "SuchnaSetu is an independent public information aggregator. It is NOT a government entity, recruitment portal, or job agency. All listings cite direct official notification URLs.",
  links: {
    github: "https://github.com/suchnasetu",
    officialGazette: "https://egazette.gov.in",
  },
  contactEmail: "contact@suchnasetu.in",
} as const;

export const SYSTEM_MODULES = [
  {
    key: "jobs",
    title: "Government Jobs",
    shortTitle: "Govt Jobs",
    description: "Central, State & PSU recruitment notifications with post breakdown and eligibility.",
    href: "/jobs",
    icon: "Briefcase",
    status: "active",
    badge: "Available Now",
  },
  {
    key: "exams",
    title: "Government Exams",
    shortTitle: "Exams",
    description: "Examination calendars, test schedules, and qualification milestones.",
    href: "/exams",
    icon: "Calendar",
    status: "active",
    badge: "Available Now",
  },
  {
    key: "results",
    title: "Results & Cutoffs",
    shortTitle: "Results",
    description: "Scorecards, merit lists, cutoff notices, and selection announcements.",
    href: "/results",
    icon: "Award",
    status: "upcoming",
    badge: "Coming Soon",
  },
  {
    key: "admit_cards",
    title: "Admit Cards",
    shortTitle: "Admit Cards",
    description: "Hall tickets, call letters, and test venue intimation releases.",
    href: "/admit-cards",
    icon: "FileText",
    status: "upcoming",
    badge: "Coming Soon",
  },
  {
    key: "schemes",
    title: "Government Schemes",
    shortTitle: "Schemes",
    description: "Central and state citizen welfare initiatives, grants, and subsidies.",
    href: "/schemes",
    icon: "ShieldCheck",
    status: "upcoming",
    badge: "Coming Soon",
  },
  {
    key: "scholarships",
    title: "Scholarships",
    shortTitle: "Scholarships",
    description: "Financial grants, merit fellowships, and higher education assistance.",
    href: "/scholarships",
    icon: "GraduationCap",
    status: "upcoming",
    badge: "Coming Soon",
  },
  {
    key: "tenders",
    title: "Public Tenders",
    shortTitle: "Tenders",
    description: "Official procurement notices, RFPs, and bidding deadlines.",
    href: "/tenders",
    icon: "FileSpreadsheet",
    status: "upcoming",
    badge: "Coming Soon",
  },
  {
    key: "circulars",
    title: "Circulars & Orders",
    shortTitle: "Circulars",
    description: "Official administrative memoranda, rules, and gazette notifications.",
    href: "/circulars",
    icon: "Layers",
    status: "upcoming",
    badge: "Coming Soon",
  },
  {
    key: "public_notices",
    title: "Public Notices",
    shortTitle: "Notices",
    description: "Statutory warnings, consumer advisories, and gazette releases.",
    href: "/public-notices",
    icon: "Bell",
    status: "upcoming",
    badge: "Coming Soon",
  },
] as const;

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Govt Jobs", href: "/jobs" },
  { title: "Govt Exams", href: "/exams" },
  { title: "Employment News", href: "/news" },
  { title: "Directory", href: "/#modules" },
  { title: "Official Sources", href: "/#sources" },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { title: "Government Jobs", href: "/admin/jobs", icon: "Briefcase" },
  { title: "Government Exams", href: "/admin/exams", icon: "Calendar" },
  { title: "Bulletins & News", href: "/admin/bulletins", icon: "Newspaper" },
  { title: "Organizations", href: "/admin/organizations", icon: "Building2" },
  { title: "Official Sources", href: "/admin/sources", icon: "Globe" },
  { title: "Operations Center", href: "/admin/operations", icon: "Activity" },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: "ScrollText" },
  { title: "System Settings", href: "/admin/settings", icon: "Settings" },
];
