import { z } from "zod";

export const publicBulletinSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(500),
  slug: z.string().min(3).max(500).optional(),
  category: z.enum([
    "employment_news",
    "student_advisory",
    "legal_update",
    "press_release",
    "government_updates",
    "recruitment_jobs",
    "exams",
    "education",
    "government_schemes",
    "important_notifications",
  ]),
  organizationId: z.string().uuid("Invalid Organization UUID").optional().nullable(),
  relatedJobId: z.string().uuid("Invalid Job UUID").optional().nullable(),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().optional().nullable(),
  sourceUrl: z.string().url("Must be a valid official source URL"),
  sourceName: z.string().min(2, "Source name is required"),
  isBreaking: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export type PublicBulletinInput = z.infer<typeof publicBulletinSchema>;
