import { z } from "zod";

export const ExamStageSchema = z.object({
  id: z.string().optional(),
  stageName: z.string().min(2, "Stage name is required"),
  stageOrder: z.coerce.number().int().min(1).default(1),
  stageType: z.enum([
    "prelims",
    "mains",
    "interview",
    "physical_test",
    "skill_test",
    "document_verification",
    "medical_exam",
  ]),
  mode: z.string().default("offline_omr"),
  durationMinutes: z.coerce.number().int().optional().nullable(),
  totalMarks: z.coerce.number().int().optional().nullable(),
  qualifyingMarks: z.coerce.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum([
    "upcoming",
    "scheduled",
    "ongoing",
    "completed",
    "cancelled",
    "postponed",
  ]).default("scheduled"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
});

export const ExamScheduleSchema = z.object({
  id: z.string().optional(),
  stageId: z.string().optional().nullable(),
  paperName: z.string().min(2, "Paper name is required"),
  examDate: z.string().min(4, "Exam date is required"),
  shiftName: z.string().optional().nullable(),
  reportingTime: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
});

export const ExamEligibilitySchema = z.object({
  minAge: z.coerce.number().int().min(14).max(65).optional().nullable(),
  maxAge: z.coerce.number().int().min(14).max(65).optional().nullable(),
  ageRelaxationRules: z.string().optional().nullable(),
  minQualificationId: z.string().optional().nullable(),
  educationalQualificationDescription: z.string().optional().nullable(),
  nationalityCriteria: z.string().default("Citizen of India"),
  attemptsLimit: z.coerce.number().int().optional().nullable(),
  physicalStandards: z.string().optional().nullable(),
  experienceRequired: z.string().optional().nullable(),
});

export const ExamImportantDateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Event title is required"),
  eventDate: z.string().min(4, "Event date is required"),
  eventTime: z.string().optional().nullable(),
  dateType: z.enum([
    "notification_release",
    "application_start",
    "application_end",
    "fee_payment_end",
    "correction_window",
    "admit_card_release",
    "exam_start",
    "exam_end",
    "answer_key_release",
    "result_declaration",
    "interview_date",
    "other",
  ]),
  isTentative: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export const ExamCenterSchema = z.object({
  id: z.string().optional(),
  stateCode: z.string().optional().nullable(),
  cityName: z.string().min(2, "City name is required"),
  centerCode: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const ExamOfficialDocumentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Document title is required"),
  fileUrl: z.string().url("Must be a valid URL"),
  documentType: z.enum([
    "notification",
    "syllabus",
    "timetable",
    "instructions",
    "circular",
    "gazette",
    "press_release",
  ]).default("circular"),
  fileSizeBytes: z.coerce.number().int().optional().nullable(),
  publishedDate: z.string().optional().nullable(),
});

export const ExamFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  shortTitle: z.string().optional().nullable(),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  examCode: z.string().optional().nullable(),
  organizationId: z.string().uuid("Please select a valid conducting organization"),
  departmentId: z.string().uuid().optional().nullable().or(z.literal("")),
  categoryId: z.string().uuid().optional().nullable().or(z.literal("")),
  stateCode: z.string().optional().nullable().or(z.literal("")),
  relatedJobId: z.string().uuid().optional().nullable().or(z.literal("")),
  mode: z.enum(["online_cbt", "offline_omr", "pen_paper", "hybrid", "interview_only"]).default("offline_omr"),
  frequency: z.enum(["annual", "bi_annual", "quarterly", "irregular", "single_recruitment"]).default("annual"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  syllabusSummary: z.string().optional().nullable(),
  markingScheme: z.string().optional().nullable(),
  patternDescription: z.string().optional().nullable(),
  applicationProcessGuide: z.string().optional().nullable(),
  officialNotificationUrl: z.string().url().optional().nullable().or(z.literal("")),
  officialWebsiteUrl: z.string().url().optional().nullable().or(z.literal("")),
  applicationFeeDetails: z.record(z.any()).optional().nullable(),
  status: z.enum(["draft", "published", "archived", "scheduled", "ongoing", "concluded"]).default("draft"),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  stages: z.array(ExamStageSchema).default([]),
  schedules: z.array(ExamScheduleSchema).default([]),
  eligibility: ExamEligibilitySchema.optional().nullable(),
  importantDates: z.array(ExamImportantDateSchema).default([]),
  centers: z.array(ExamCenterSchema).default([]),
  officialDocuments: z.array(ExamOfficialDocumentSchema).default([]),
});

export type ExamFormData = z.infer<typeof ExamFormSchema>;
