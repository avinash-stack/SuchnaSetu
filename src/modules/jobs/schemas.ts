import { z } from "zod";

export const jobVacancySchema = z.object({
  postName: z.string().min(2, "Post name must be at least 2 characters"),
  postCode: z.string().optional(),
  totalPosts: z.number().int().min(0, "Total posts cannot be negative"),
  urPosts: z.number().int().min(0).default(0),
  ewsPosts: z.number().int().min(0).default(0),
  obcPosts: z.number().int().min(0).default(0),
  scPosts: z.number().int().min(0).default(0),
  stPosts: z.number().int().min(0).default(0),
  pwdPosts: z.number().int().min(0).default(0),
  payLevel: z.string().optional(),
});

export const jobImportantDateSchema = z.object({
  eventName: z.string().min(2, "Event name is required"),
  eventDate: z.string().datetime().optional().nullable(),
  eventDateText: z.string().optional().nullable(),
  isTentative: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export const jobEligibilitySchema = z.object({
  minAge: z.number().int().min(14).max(70).optional().nullable(),
  maxAge: z.number().int().min(14).max(70).optional().nullable(),
  ageCalculationDate: z.string().optional().nullable(),
  ageRelaxationDetails: z.string().optional().nullable(),
  educationQualification: z.string().min(5, "Educational qualification description is required"),
  experienceDetails: z.string().optional().nullable(),
  selectionProcess: z.string().optional().nullable(),
  applicationFeeDetails: z.any().optional().nullable(),
});

export const jobOfficialDocumentSchema = z.object({
  documentType: z.enum([
    "full_notification",
    "short_notice",
    "corrigendum",
    "syllabus",
    "admit_card_notice",
    "result_notice",
  ]),
  title: z.string().min(2, "Document title is required"),
  fileUrl: z.string().url("Must be a valid document URL"),
  fileSizeBytes: z.number().int().optional().nullable(),
  publishedDate: z.string().optional().nullable(),
});

export const govJobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(500),
  slug: z.string().min(3).max(500).optional(),
  notificationNumber: z.string().max(255).optional().nullable(),
  organizationId: z.string().uuid("Invalid Organization UUID"),
  departmentId: z.string().uuid("Invalid Department UUID").optional().nullable(),
  categoryId: z.string().uuid("Invalid Category UUID"),
  minQualificationId: z.string().uuid("Invalid Qualification UUID").optional().nullable(),
  stateCode: z.string().max(5).optional().nullable(),
  employmentType: z.enum(["permanent", "contract", "deputation", "apprenticeship"]).default("permanent"),
  totalVacancies: z.number().int().min(0, "Total vacancies cannot be negative"),
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),
  payScaleDetails: z.string().optional().nullable(),
  officialNotificationUrl: z.string().url("Must be a valid official notification URL"),
  officialApplyUrl: z.string().url("Must be a valid application URL").optional().nullable().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  isFeatured: z.boolean().default(false),
  summary: z.string().optional().nullable(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  applicationStartDate: z.string().datetime().optional().nullable(),
  applicationEndDate: z.string().datetime().optional().nullable(),
  vacancies: z.array(jobVacancySchema).optional().default([]),
  importantDates: z.array(jobImportantDateSchema).optional().default([]),
  eligibility: jobEligibilitySchema.optional(),
  officialDocuments: z.array(jobOfficialDocumentSchema).optional().default([]),
});

export type GovJobInput = z.infer<typeof govJobSchema>;
