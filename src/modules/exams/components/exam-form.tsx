"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category, Organization, StateUT, Department, Qualification } from "@/modules/core/types";
import { GovExamDetailed } from "../types";
import { saveExamAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NotificationBanner } from "@/components/shared/notification-banner";
import {
  Calendar,
  Building2,
  Layers,
  Clock,
  FileText,
  MapPin,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ShieldCheck,
  Search,
  Eye,
  X,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface ExamFormProps {
  initialData?: GovExamDetailed | null;
  taxonomies: {
    categories: Category[];
    organizations: Organization[];
    departments: Department[];
    qualifications: Qualification[];
    states: StateUT[];
    jobs: Array<{ id: string; title: string; slug: string; organization_id: string }>;
  };
}

export function ExamForm({ initialData, taxonomies }: ExamFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<
    "basic" | "syllabus" | "stages" | "schedules" | "eligibility" | "dates" | "centers" | "documents" | "seo"
  >("basic");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);

  // --- 1. Basic Info ---
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [shortTitle, setShortTitle] = React.useState(initialData?.short_title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [examCode, setExamCode] = React.useState(initialData?.exam_code || "");
  const [organizationId, setOrganizationId] = React.useState(
    initialData?.organization_id || taxonomies.organizations[0]?.id || ""
  );
  const [departmentId, setDepartmentId] = React.useState(initialData?.department_id || "");
  const [categoryId, setCategoryId] = React.useState(
    initialData?.category_id || taxonomies.categories[0]?.id || ""
  );
  const [stateCode, setStateCode] = React.useState(initialData?.state_code || "");
  const [relatedJobId, setRelatedJobId] = React.useState(initialData?.related_job_id || "");
  const [mode, setMode] = React.useState<"online_cbt" | "offline_omr" | "pen_paper" | "hybrid" | "interview_only">(
    initialData?.mode || "offline_omr"
  );
  const [frequency, setFrequency] = React.useState<"annual" | "bi_annual" | "quarterly" | "irregular" | "single_recruitment">(
    initialData?.frequency || "annual"
  );
  const [status, setStatus] = React.useState<"draft" | "published" | "archived">(
    (initialData?.status as any) || "draft"
  );
  const [isFeatured, setIsFeatured] = React.useState(initialData?.is_featured || false);

  // --- 2. Scheme & Syllabus ---
  const [description, setDescription] = React.useState(initialData?.description || "");
  const [syllabusSummary, setSyllabusSummary] = React.useState(initialData?.syllabus_summary || "");
  const [markingScheme, setMarkingScheme] = React.useState(initialData?.marking_scheme || "");
  const [patternDescription, setPatternDescription] = React.useState(initialData?.pattern_description || "");
  const [applicationProcessGuide, setApplicationProcessGuide] = React.useState(
    initialData?.application_process_guide || ""
  );
  const [officialNotificationUrl, setOfficialNotificationUrl] = React.useState(
    initialData?.official_notification_url || ""
  );
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = React.useState(
    initialData?.official_website_url || ""
  );

  // --- 3. Stages ---
  const [stages, setStages] = React.useState<Array<{
    id?: string;
    stageName: string;
    stageOrder: number;
    stageType: "prelims" | "mains" | "interview" | "physical_test" | "skill_test" | "document_verification" | "medical_exam";
    mode: string;
    durationMinutes: number | undefined;
    totalMarks: number | undefined;
    qualifyingMarks: number | undefined;
    description: string;
    status: "upcoming" | "scheduled" | "ongoing" | "completed" | "cancelled" | "postponed";
    startDate: string;
    endDate: string;
  }>>(
    initialData?.stages?.map((s) => ({
      id: s.id,
      stageName: s.stage_name,
      stageOrder: s.stage_order,
      stageType: s.stage_type,
      mode: s.mode || "offline_omr",
      durationMinutes: s.duration_minutes || undefined,
      totalMarks: s.total_marks || undefined,
      qualifyingMarks: s.qualifying_marks || undefined,
      description: s.description || "",
      status: s.status,
      startDate: s.start_date || "",
      endDate: s.end_date || "",
    })) || [
      {
        stageName: "Stage I: Preliminary Examination",
        stageOrder: 1,
        stageType: "prelims",
        mode: "offline_omr",
        durationMinutes: 120,
        totalMarks: 200,
        qualifyingMarks: 66,
        description: "Objective Multiple Choice Question screening test.",
        status: "scheduled",
        startDate: "",
        endDate: "",
      },
    ]
  );

  // --- 4. Schedules / Shifts ---
  const [schedules, setSchedules] = React.useState<Array<{
    id?: string;
    stageId?: string;
    paperName: string;
    examDate: string;
    shiftName: string;
    reportingTime: string;
    startTime: string;
    endTime: string;
    instructions: string;
  }>>(
    initialData?.schedules?.map((sc) => ({
      id: sc.id,
      stageId: sc.stage_id || "",
      paperName: sc.paper_name,
      examDate: sc.exam_date || "",
      shiftName: sc.shift_name || "",
      reportingTime: sc.reporting_time || "",
      startTime: sc.start_time || "",
      endTime: sc.end_time || "",
      instructions: sc.instructions || "",
    })) || []
  );

  // --- 5. Eligibility & Fee ---
  const [minAge, setMinAge] = React.useState<string>(
    initialData?.eligibility?.min_age ? String(initialData.eligibility.min_age) : ""
  );
  const [maxAge, setMaxAge] = React.useState<string>(
    initialData?.eligibility?.max_age ? String(initialData.eligibility.max_age) : ""
  );
  const [ageRelaxationRules, setAgeRelaxationRules] = React.useState(
    initialData?.eligibility?.age_relaxation_rules || ""
  );
  const [minQualificationId, setMinQualificationId] = React.useState(
    initialData?.eligibility?.min_qualification_id || ""
  );
  const [educationalDescription, setEducationalDescription] = React.useState(
    initialData?.eligibility?.educational_qualification_description || ""
  );
  const [nationalityCriteria, setNationalityCriteria] = React.useState(
    initialData?.eligibility?.nationality_criteria || "Citizen of India"
  );
  const [attemptsLimit, setAttemptsLimit] = React.useState<string>(
    initialData?.eligibility?.attempts_limit ? String(initialData.eligibility.attempts_limit) : ""
  );
  const [physicalStandards, setPhysicalStandards] = React.useState(
    initialData?.eligibility?.physical_standards || ""
  );

  // Fee matrix
  const existingFee = (initialData?.application_fee_details as any) || {};
  const [feeGeneral, setFeeGeneral] = React.useState<string>(existingFee.general !== undefined ? String(existingFee.general) : "100");
  const [feeObc, setFeeObc] = React.useState<string>(existingFee.obc !== undefined ? String(existingFee.obc) : "100");
  const [feeEws, setFeeEws] = React.useState<string>(existingFee.ews !== undefined ? String(existingFee.ews) : "100");
  const [feeScSt, setFeeScSt] = React.useState<string>(existingFee.sc !== undefined ? String(existingFee.sc) : "0");
  const [feeFemale, setFeeFemale] = React.useState<string>(existingFee.female !== undefined ? String(existingFee.female) : "0");

  // --- 6. Important Dates ---
  const [importantDates, setImportantDates] = React.useState<Array<{
    id?: string;
    title: string;
    eventDate: string;
    dateType: any;
    isTentative: boolean;
    displayOrder: number;
  }>>(
    initialData?.important_dates?.map((d) => ({
      id: d.id,
      title: d.title,
      eventDate: d.event_date,
      dateType: d.date_type,
      isTentative: d.is_tentative,
      displayOrder: d.display_order,
    })) || [
      {
        title: "Official Notification Release",
        eventDate: "",
        dateType: "notification_release",
        isTentative: false,
        displayOrder: 1,
      },
      {
        title: "Online Application Opens",
        eventDate: "",
        dateType: "application_start",
        isTentative: false,
        displayOrder: 2,
      },
      {
        title: "Last Date to Apply Online",
        eventDate: "",
        dateType: "application_end",
        isTentative: false,
        displayOrder: 3,
      },
      {
        title: "Preliminary Exam Date",
        eventDate: "",
        dateType: "exam_start",
        isTentative: false,
        displayOrder: 4,
      },
    ]
  );

  // --- 7. Centers ---
  const [centers, setCenters] = React.useState<Array<{
    id?: string;
    stateCode: string;
    cityName: string;
    centerCode: string;
  }>>(
    initialData?.centers?.map((c) => ({
      id: c.id,
      stateCode: c.state_code || "",
      cityName: c.city_name,
      centerCode: c.center_code || "",
    })) || []
  );

  // --- 8. Documents ---
  const [documents, setDocuments] = React.useState<Array<{
    id?: string;
    title: string;
    fileUrl: string;
    documentType: any;
    publishedDate: string;
  }>>(
    initialData?.official_documents?.map((doc) => ({
      id: doc.id,
      title: doc.title,
      fileUrl: doc.file_url,
      documentType: doc.document_type,
      publishedDate: doc.published_date || "",
    })) || []
  );

  // --- 9. SEO ---
  const [metaTitle, setMetaTitle] = React.useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = React.useState(initialData?.meta_description || "");

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generatedSlug);
    }
  };

  // Filter departments for selected organization
  const availableDepartments = taxonomies.departments.filter(
    (d) => d.organization_id === organizationId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        id: initialData?.id,
        title,
        shortTitle: shortTitle || undefined,
        slug,
        examCode: examCode || undefined,
        organizationId,
        departmentId: departmentId || undefined,
        categoryId: categoryId || undefined,
        stateCode: stateCode || undefined,
        relatedJobId: relatedJobId || undefined,
        mode,
        frequency,
        description,
        syllabusSummary: syllabusSummary || undefined,
        markingScheme: markingScheme || undefined,
        patternDescription: patternDescription || undefined,
        applicationProcessGuide: applicationProcessGuide || undefined,
        officialNotificationUrl: officialNotificationUrl || undefined,
        officialWebsiteUrl: officialWebsiteUrl || undefined,
        applicationFeeDetails: {
          general: Number(feeGeneral) || 0,
          obc: Number(feeObc) || 0,
          ews: Number(feeEws) || 0,
          sc: Number(feeScSt) || 0,
          st: Number(feeScSt) || 0,
          female: Number(feeFemale) || 0,
          pwd: 0,
        },
        status,
        isFeatured,
        metaTitle: metaTitle || undefined,
        metaDescription: metaDescription || undefined,
        stages: stages.map((s, idx) => ({
          id: s.id,
          stageName: s.stageName,
          stageOrder: idx + 1,
          stageType: s.stageType,
          mode: s.mode,
          durationMinutes: s.durationMinutes ? Number(s.durationMinutes) : undefined,
          totalMarks: s.totalMarks ? Number(s.totalMarks) : undefined,
          qualifyingMarks: s.qualifyingMarks ? Number(s.qualifyingMarks) : undefined,
          description: s.description || undefined,
          status: s.status,
          startDate: s.startDate || undefined,
          endDate: s.endDate || undefined,
        })),
        schedules: schedules.map((sc) => ({
          id: sc.id,
          stageId: sc.stageId || undefined,
          paperName: sc.paperName,
          examDate: sc.examDate,
          shiftName: sc.shiftName || undefined,
          reportingTime: sc.reportingTime || undefined,
          startTime: sc.startTime || undefined,
          endTime: sc.endTime || undefined,
          instructions: sc.instructions || undefined,
        })),
        eligibility: {
          minAge: minAge ? Number(minAge) : undefined,
          maxAge: maxAge ? Number(maxAge) : undefined,
          ageRelaxationRules: ageRelaxationRules || undefined,
          minQualificationId: minQualificationId || undefined,
          educationalQualificationDescription: educationalDescription || undefined,
          nationalityCriteria: nationalityCriteria || "Citizen of India",
          attemptsLimit: attemptsLimit ? Number(attemptsLimit) : undefined,
          physicalStandards: physicalStandards || undefined,
        },
        importantDates: importantDates
          .filter((d) => d.title && d.eventDate)
          .map((d, idx) => ({
            id: d.id,
            title: d.title,
            eventDate: d.eventDate,
            dateType: d.dateType,
            isTentative: d.isTentative,
            displayOrder: idx + 1,
          })),
        centers: centers
          .filter((c) => c.cityName)
          .map((c) => ({
            id: c.id,
            stateCode: c.stateCode || undefined,
            cityName: c.cityName,
            centerCode: c.centerCode || undefined,
            isActive: true,
          })),
        officialDocuments: documents
          .filter((doc) => doc.title && doc.fileUrl)
          .map((doc) => ({
            id: doc.id,
            title: doc.title,
            fileUrl: doc.fileUrl,
            documentType: doc.documentType,
            publishedDate: doc.publishedDate || undefined,
          })),
      };

      const res = await saveExamAction(payload as any);
      if (!res.success) {
        setError(res.error || "Failed to save examination notice");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/exams");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const selectedOrg = taxonomies.organizations.find((o) => o.id === organizationId);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <NotificationBanner type="warning" message={error} />}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/exams">
            <Button variant="outline" size="sm" type="button" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Exams</span>
            </Button>
          </Link>
          <span className="text-sm font-semibold text-slate-800">
            {initialData ? `Editing: ${initialData.title}` : "New Examination Notice"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => setShowPreviewModal(true)}
            className="gap-1.5"
          >
            <Eye className="h-4 w-4" />
            <span>Live Preview</span>
          </Button>

          <Button
            type="submit"
            variant="brand"
            size="md"
            disabled={isSubmitting}
            className="gap-2 font-bold"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? "Saving..." : initialData ? "Update Exam Notice" : "Save Exam Notice"}</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-1 text-xs font-semibold">
        {[
          { id: "basic", label: "1. Primary Details" },
          { id: "syllabus", label: "2. Syllabus & Pattern" },
          { id: "stages", label: `3. Exam Stages (${stages.length})` },
          { id: "schedules", label: `4. Shift Schedules (${schedules.length})` },
          { id: "eligibility", label: "5. Eligibility & Fees" },
          { id: "dates", label: `6. Dates Timeline (${importantDates.length})` },
          { id: "centers", label: `7. Exam Centers (${centers.length})` },
          { id: "documents", label: `8. Documents (${documents.length})` },
          { id: "seo", label: "9. SEO Metadata" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 transition-colors border-b-2 font-medium ${
              activeTab === tab.id
                ? "border-brand-600 bg-brand-50/50 font-bold text-brand-900"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BASIC DETAILS */}
      {activeTab === "basic" && (
        <Card>
          <CardHeader>
            <CardTitle>Primary Examination Information</CardTitle>
            <CardDescription>
              Define the examination title, conducting authority, state jurisdiction, exam mode, and publishing state.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-800">
                  Full Official Examination Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Civil Services (Preliminary & Main) Examination 2026"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Short Title / Acronym</label>
                <Input
                  placeholder="e.g. UPSC CSE 2026"
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. upsc-civil-services-examination-2026"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Exam Code / Ref ID</label>
                <Input
                  placeholder="e.g. UPSC-CSE-2026"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Conducting Organization <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={organizationId}
                  onChange={(e) => {
                    setOrganizationId(e.target.value);
                    setDepartmentId("");
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                >
                  {taxonomies.organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.acronym || org.jurisdiction})
                    </option>
                  ))}
                </select>
              </div>

              {availableDepartments.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Department / Specialized Wing</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">-- Optional: Select Department --</option>
                    {availableDepartments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.acronym || "Wing"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Sector / Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                >
                  {taxonomies.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">State / UT Jurisdiction</label>
                <select
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- All India / Central National --</option>
                  {taxonomies.states.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Examination Delivery Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="online_cbt">Online Computer Based Test (CBT)</option>
                  <option value="offline_omr">Offline OMR Sheet</option>
                  <option value="pen_paper">Pen & Paper Conventional</option>
                  <option value="hybrid">Hybrid (CBT + Written)</option>
                  <option value="interview_only">Interview Only</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Exam Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="annual">Annual (Once a Year)</option>
                  <option value="bi_annual">Bi-Annual (Twice a Year)</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="single_recruitment">Single Recruitment Specific</option>
                  <option value="irregular">Irregular / As Notified</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Related Recruitment Job Notice</label>
                <select
                  value={relatedJobId}
                  onChange={(e) => setRelatedJobId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                >
                  <option value="">-- None / Direct Standalone Exam --</option>
                  {taxonomies.jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Publishing Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold focus:border-brand-500 focus:outline-none"
                >
                  <option value="draft">Draft (Internal review only)</option>
                  <option value="published">Published (Public live)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Feature this Examination on Homepage & Top of Portal
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: SYLLABUS & PATTERN */}
      {activeTab === "syllabus" && (
        <Card>
          <CardHeader>
            <CardTitle>Scheme, Syllabus & Application Procedure</CardTitle>
            <CardDescription>
              Comprehensive syllabus structure, marking rules, negative marking details, and official candidate application guide.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">
                Official Examination Overview / Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed summary of the examination, participating services/cadres, and selection objective..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Syllabus Summary & Key Topics</label>
              <textarea
                rows={4}
                value={syllabusSummary}
                onChange={(e) => setSyllabusSummary(e.target.value)}
                placeholder="Topic-wise syllabus breakdown for General Studies, Aptitude, Technical domain, Optional papers..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Marking Scheme & Negative Marking</label>
                <textarea
                  rows={3}
                  value={markingScheme}
                  onChange={(e) => setMarkingScheme(e.target.value)}
                  placeholder="e.g. 1/3rd (0.33) marks deducted per incorrect answer. Paper-II is qualifying with minimum 33% marks..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Examination Pattern Overview</label>
                <textarea
                  rows={3}
                  value={patternDescription}
                  onChange={(e) => setPatternDescription(e.target.value)}
                  placeholder="e.g. 3 Tier Evaluation: Tier-I CBT (200 marks), Tier-II Descriptive, Tier-III Interview..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Application Process Guide & Steps</label>
              <textarea
                rows={3}
                value={applicationProcessGuide}
                onChange={(e) => setApplicationProcessGuide(e.target.value)}
                placeholder="Step-by-step instructions: One Time Registration (OTR), photo/signature specifications, document uploads..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Official Notification URL (Gazette / PDF)</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={officialNotificationUrl}
                  onChange={(e) => setOfficialNotificationUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Official Commission / Application Portal URL</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={officialWebsiteUrl}
                  onChange={(e) => setOfficialWebsiteUrl(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: STAGES */}
      {activeTab === "stages" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Examination Stages</CardTitle>
              <CardDescription>
                Define multi-tiered stages (e.g. Prelims, Mains, Interview, Physical Test, Skill Test).
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setStages([
                  ...stages,
                  {
                    stageName: `Stage ${stages.length + 1}`,
                    stageOrder: stages.length + 1,
                    stageType: "mains",
                    mode: "offline_omr",
                    durationMinutes: undefined,
                    totalMarks: undefined,
                    qualifyingMarks: undefined,
                    description: "",
                    status: "scheduled",
                    startDate: "",
                    endDate: "",
                  },
                ])
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stage</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {stages.map((stage, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{stage.stageName || "Unnamed Stage"}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStages(stages.filter((_, i) => i !== idx))}
                    className="text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700">Stage Name</label>
                    <Input
                      value={stage.stageName}
                      onChange={(e) => {
                        const copy = [...stages];
                        copy[idx].stageName = e.target.value;
                        setStages(copy);
                      }}
                      placeholder="e.g. Stage I: Preliminary Examination"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Stage Type</label>
                    <select
                      value={stage.stageType}
                      onChange={(e) => {
                        const copy = [...stages];
                        copy[idx].stageType = e.target.value as any;
                        setStages(copy);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                    >
                      <option value="prelims">Preliminary Exam (Prelims)</option>
                      <option value="mains">Main Exam (Mains)</option>
                      <option value="interview">Interview / Personality Test</option>
                      <option value="physical_test">Physical Fitness / PST / PET</option>
                      <option value="skill_test">Computer / Skill / Typing Test</option>
                      <option value="document_verification">Document Verification</option>
                      <option value="medical_exam">Medical Examination</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Stage Status</label>
                    <select
                      value={stage.status}
                      onChange={(e) => {
                        const copy = [...stages];
                        copy[idx].status = e.target.value as any;
                        setStages(copy);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="postponed">Postponed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Duration (Minutes)</label>
                    <Input
                      type="number"
                      value={stage.durationMinutes ?? ""}
                      onChange={(e) => {
                        const copy = [...stages];
                        copy[idx].durationMinutes = e.target.value ? Number(e.target.value) : undefined;
                        setStages(copy);
                      }}
                      placeholder="120"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Total Marks</label>
                    <Input
                      type="number"
                      value={stage.totalMarks ?? ""}
                      onChange={(e) => {
                        const copy = [...stages];
                        copy[idx].totalMarks = e.target.value ? Number(e.target.value) : undefined;
                        setStages(copy);
                      }}
                      placeholder="200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Qualifying Marks</label>
                    <Input
                      type="number"
                      value={stage.qualifyingMarks ?? ""}
                      onChange={(e) => {
                        const copy = [...stages];
                        copy[idx].qualifyingMarks = e.target.value ? Number(e.target.value) : undefined;
                        setStages(copy);
                      }}
                      placeholder="66"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Start Date</label>
                    <Input
                      type="date"
                      value={stage.startDate}
                      onChange={(e) => {
                        const copy = [...stages];
                        copy[idx].startDate = e.target.value;
                        setStages(copy);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Stage Description & Notes</label>
                  <Input
                    value={stage.description}
                    onChange={(e) => {
                      const copy = [...stages];
                      copy[idx].description = e.target.value;
                      setStages(copy);
                    }}
                    placeholder="e.g. Objective screening test consisting of General Studies and CSAT papers."
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 4: SCHEDULES / SHIFTS */}
      {activeTab === "schedules" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Shift Timetable & Paper Schedules</CardTitle>
              <CardDescription>
                Detailed paper-by-paper shift timings, reporting hours, and candidate instructions.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setSchedules([
                  ...schedules,
                  {
                    paperName: "",
                    examDate: "",
                    shiftName: "Morning Shift (Paper I)",
                    reportingTime: "08:30",
                    startTime: "09:30",
                    endTime: "11:30",
                    instructions: "Black ball point pen only. Carry government photo ID.",
                  },
                ])
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Schedule Shift</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                No shift schedules added yet. Click &quot;Add Schedule Shift&quot; above to create examination shifts.
              </div>
            ) : (
              schedules.map((sc, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900">Shift #{idx + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSchedules(schedules.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Paper Name</label>
                      <Input
                        value={sc.paperName}
                        onChange={(e) => {
                          const copy = [...schedules];
                          copy[idx].paperName = e.target.value;
                          setSchedules(copy);
                        }}
                        placeholder="e.g. General Studies Paper-I"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Exam Date</label>
                      <Input
                        type="date"
                        value={sc.examDate}
                        onChange={(e) => {
                          const copy = [...schedules];
                          copy[idx].examDate = e.target.value;
                          setSchedules(copy);
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Shift Name</label>
                      <Input
                        value={sc.shiftName}
                        onChange={(e) => {
                          const copy = [...schedules];
                          copy[idx].shiftName = e.target.value;
                          setSchedules(copy);
                        }}
                        placeholder="e.g. Morning Shift"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Reporting Time</label>
                      <Input
                        type="time"
                        value={sc.reportingTime}
                        onChange={(e) => {
                          const copy = [...schedules];
                          copy[idx].reportingTime = e.target.value;
                          setSchedules(copy);
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Start Time</label>
                      <Input
                        type="time"
                        value={sc.startTime}
                        onChange={(e) => {
                          const copy = [...schedules];
                          copy[idx].startTime = e.target.value;
                          setSchedules(copy);
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">End Time</label>
                      <Input
                        type="time"
                        value={sc.endTime}
                        onChange={(e) => {
                          const copy = [...schedules];
                          copy[idx].endTime = e.target.value;
                          setSchedules(copy);
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Candidate Instructions</label>
                    <Input
                      value={sc.instructions}
                      onChange={(e) => {
                        const copy = [...schedules];
                        copy[idx].instructions = e.target.value;
                        setSchedules(copy);
                      }}
                      placeholder="e.g. No digital watch or calculator allowed. Biometric verification at gate."
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 5: ELIGIBILITY & FEES */}
      {activeTab === "eligibility" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Standards</CardTitle>
              <CardDescription>
                Age brackets, educational qualifications, attempts limit, and relaxation norms.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Minimum Age</label>
                  <Input
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    placeholder="21"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Maximum Age</label>
                  <Input
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    placeholder="32"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Attempts Limit (General)</label>
                  <Input
                    type="number"
                    value={attemptsLimit}
                    onChange={(e) => setAttemptsLimit(e.target.value)}
                    placeholder="6 (Leave empty if unlimited)"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-800">Minimum Master Qualification Level</label>
                  <select
                    value={minQualificationId}
                    onChange={(e) => setMinQualificationId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="">-- Optional: Select Qualification Level --</option>
                    {taxonomies.qualifications.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name} ({q.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Nationality Criteria</label>
                  <Input
                    value={nationalityCriteria}
                    onChange={(e) => setNationalityCriteria(e.target.value)}
                    placeholder="Citizen of India"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Educational Qualification Description</label>
                <textarea
                  rows={3}
                  value={educationalDescription}
                  onChange={(e) => setEducationalDescription(e.target.value)}
                  placeholder="Candidate must hold a degree of any recognized University or equivalent..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Age Relaxation Rules</label>
                <textarea
                  rows={3}
                  value={ageRelaxationRules}
                  onChange={(e) => setAgeRelaxationRules(e.target.value)}
                  placeholder="5 years for SC/ST, 3 years for OBC, 10 years for PwD..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Physical Standards & Medical Requirements</label>
                <textarea
                  rows={2}
                  value={physicalStandards}
                  onChange={(e) => setPhysicalStandards(e.target.value)}
                  placeholder="Height, chest expansion, vision criteria for police/defence/technical cadres..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Application Fee Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Application Fee Matrix (₹ INR)</CardTitle>
              <CardDescription>Category-wise government application fee breakdown.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">General / UR (₹)</label>
                  <Input
                    type="number"
                    value={feeGeneral}
                    onChange={(e) => setFeeGeneral(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">OBC (₹)</label>
                  <Input
                    type="number"
                    value={feeObc}
                    onChange={(e) => setFeeObc(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">EWS (₹)</label>
                  <Input
                    type="number"
                    value={feeEws}
                    onChange={(e) => setFeeEws(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">SC / ST (₹)</label>
                  <Input
                    type="number"
                    value={feeScSt}
                    onChange={(e) => setFeeScSt(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Female / PwD (₹)</label>
                  <Input
                    type="number"
                    value={feeFemale}
                    onChange={(e) => setFeeFemale(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 6: DATES TIMELINE */}
      {activeTab === "dates" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Important Dates Timeline</CardTitle>
              <CardDescription>
                Chronological milestone tracker (Application open/close, correction, admit cards, exam dates, results).
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setImportantDates([
                  ...importantDates,
                  {
                    title: "",
                    eventDate: "",
                    dateType: "other",
                    isTentative: false,
                    displayOrder: importantDates.length + 1,
                  },
                ])
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Date Event</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {importantDates.map((date, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Event Title</label>
                  <Input
                    value={date.title}
                    onChange={(e) => {
                      const copy = [...importantDates];
                      copy[idx].title = e.target.value;
                      setImportantDates(copy);
                    }}
                    placeholder="e.g. Preliminary e-Admit Card Release"
                  />
                </div>

                <div className="w-full sm:w-44 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Event Date</label>
                  <Input
                    type="date"
                    value={date.eventDate}
                    onChange={(e) => {
                      const copy = [...importantDates];
                      copy[idx].eventDate = e.target.value;
                      setImportantDates(copy);
                    }}
                  />
                </div>

                <div className="w-full sm:w-48 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Event Type</label>
                  <select
                    value={date.dateType}
                    onChange={(e) => {
                      const copy = [...importantDates];
                      copy[idx].dateType = e.target.value as any;
                      setImportantDates(copy);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                  >
                    <option value="notification_release">Notification Release</option>
                    <option value="application_start">Application Start</option>
                    <option value="application_end">Application End</option>
                    <option value="fee_payment_end">Fee Payment End</option>
                    <option value="correction_window">Correction Window</option>
                    <option value="admit_card_release">Admit Card Release</option>
                    <option value="exam_start">Exam Date / Start</option>
                    <option value="exam_end">Exam End</option>
                    <option value="answer_key_release">Answer Key Release</option>
                    <option value="result_declaration">Result Declaration</option>
                    <option value="interview_date">Interview Date</option>
                    <option value="other">Other Milestone</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4 sm:pt-6">
                  <input
                    type="checkbox"
                    id={`tentative-${idx}`}
                    checked={date.isTentative}
                    onChange={(e) => {
                      const copy = [...importantDates];
                      copy[idx].isTentative = e.target.checked;
                      setImportantDates(copy);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600"
                  />
                  <label htmlFor={`tentative-${idx}`} className="text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                    Tentative
                  </label>
                </div>

                <div className="pt-4 sm:pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImportantDates(importantDates.filter((_, i) => i !== idx))}
                    className="text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 7: CENTERS */}
      {activeTab === "centers" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Examination Centers Directory</CardTitle>
              <CardDescription>
                State/UT and city-wise list of designated examination centers.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setCenters([
                  ...centers,
                  { stateCode: "DL", cityName: "", centerCode: "" },
                ])
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Center</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {centers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                No exam centers specified. Click &quot;Add Center&quot; above to add allocated test cities.
              </div>
            ) : (
              centers.map((center, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  <div className="w-full sm:w-48 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">State / UT</label>
                    <select
                      value={center.stateCode}
                      onChange={(e) => {
                        const copy = [...centers];
                        copy[idx].stateCode = e.target.value;
                        setCenters(copy);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                    >
                      {taxonomies.states.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">City / Test Center Name</label>
                    <Input
                      value={center.cityName}
                      onChange={(e) => {
                        const copy = [...centers];
                        copy[idx].cityName = e.target.value;
                        setCenters(copy);
                      }}
                      placeholder="e.g. New Delhi / Prayagraj"
                    />
                  </div>

                  <div className="w-full sm:w-36 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Center Code</label>
                    <Input
                      value={center.centerCode}
                      onChange={(e) => {
                        const copy = [...centers];
                        copy[idx].centerCode = e.target.value;
                        setCenters(copy);
                      }}
                      placeholder="DEL-01"
                    />
                  </div>

                  <div className="pt-4 sm:pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCenters(centers.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 8: DOCUMENTS */}
      {activeTab === "documents" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Official Documents & Circulars</CardTitle>
              <CardDescription>
                Direct links to authentic official PDFs, gazette notifications, syllabus booklets, and advisory circulars.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setDocuments([
                  ...documents,
                  {
                    title: "",
                    fileUrl: "",
                    documentType: "notification",
                    publishedDate: new Date().toISOString().slice(0, 10),
                  },
                ])
              }
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Document</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
                No official documents attached. Click &quot;Add Document&quot; above to link authentic PDFs.
              </div>
            ) : (
              documents.map((doc, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Document Title</label>
                    <Input
                      value={doc.title}
                      onChange={(e) => {
                        const copy = [...documents];
                        copy[idx].title = e.target.value;
                        setDocuments(copy);
                      }}
                      placeholder="e.g. Official Gazette Examination Notification PDF"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Document URL</label>
                    <Input
                      type="url"
                      value={doc.fileUrl}
                      onChange={(e) => {
                        const copy = [...documents];
                        copy[idx].fileUrl = e.target.value;
                        setDocuments(copy);
                      }}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="w-full sm:w-36 space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Type</label>
                    <select
                      value={doc.documentType}
                      onChange={(e) => {
                        const copy = [...documents];
                        copy[idx].documentType = e.target.value as any;
                        setDocuments(copy);
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:outline-none"
                    >
                      <option value="notification">Notification</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="timetable">Timetable</option>
                      <option value="instructions">Instructions</option>
                      <option value="circular">Circular</option>
                      <option value="gazette">Gazette</option>
                      <option value="press_release">Press Release</option>
                    </select>
                  </div>

                  <div className="pt-4 sm:pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDocuments(documents.filter((_, i) => i !== idx))}
                      className="text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 9: SEO */}
      {activeTab === "seo" && (
        <Card>
          <CardHeader>
            <CardTitle>Search Engine Optimization (SEO) & Social Meta</CardTitle>
            <CardDescription>
              Fine-tune custom Google title tags, meta descriptions, and OpenGraph previews.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Custom Meta Title</label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. UPSC Civil Services Examination 2026 - Syllabus, Dates & Pattern"
              />
              <p className="text-[11px] text-slate-500">
                Recommended: 50–60 characters. If empty, the official examination title and organization will be used automatically.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Custom Meta Description</label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="e.g. Comprehensive official guide for UPSC CSE 2026 examination including preliminary date, mains timetable, syllabus breakdown, qualification, age relaxation, and OTR application process."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs focus:border-brand-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                Recommended: 120–160 characters. Summarizes the examination for search engines and social shares.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="brand" className="text-xs">
                  Live Preview Mode
                </Badge>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  {title || "Untitled Examination Notice"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preview Banner */}
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-900">
                <Building2 className="h-4 w-4 text-brand-600" />
                <span>{selectedOrg?.name || "Official Examination Authority"}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                {title || "Examination Title Placeholder"}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {description || "No description provided yet."}
              </p>
            </div>

            {/* Stages & Mode Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="font-bold text-slate-800">Stages Breakdown:</span>
                {stages.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-600">
                    <span>{s.stageName || `Stage ${i + 1}`}</span>
                    <Badge variant="outline" className="text-[10px]">{s.stageType}</Badge>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <span className="font-bold text-slate-800">Eligibility & Fee Preview:</span>
                <div className="text-slate-600 space-y-1">
                  <div>Age: {minAge || 18} - {maxAge || 30} years</div>
                  <div>General/OBC Fee: ₹{feeGeneral} | SC/ST: ₹{feeScSt}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button type="button" variant="primary" onClick={() => setShowPreviewModal(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
