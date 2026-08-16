export * from "./types";
export * from "./schemas";
export * from "./service";
export * from "./actions";

export const JOBS_MODULE_CONFIG = {
  key: "jobs",
  title: "Government Jobs",
  description: "Official notifications, post breakdowns, and eligibility from central, state, and PSU sources.",
  routePath: "/jobs",
  iconName: "Briefcase",
  isEnabled: true,
} as const;
