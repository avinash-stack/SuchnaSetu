"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Category, Organization, StateUT, Department, Qualification } from "@/modules/core/types";
import { GovJobDetailed } from "../types";
import { saveJobNoticeAction, SaveJobPayload } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NotificationBanner } from "@/components/shared/notification-banner";
import {
  Briefcase,
  Calendar,
  Building2,
  FileSpreadsheet,
  GraduationCap,
  FileText,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ShieldCheck,
  Search,
} from "lucide-react";
import Link from "next/link";

interface JobFormProps {
  initialData?: GovJobDetailed | null;
  taxonomies: {
    categories: Category[];
    organizations: Organization[];
    departments: Department[];
    qualifications: Qualification[];
    states: StateUT[];
  };
}

export function JobForm({ initialData, taxonomies }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [notificationNumber, setNotificationNumber] = React.useState(initialData?.notification_number || "");
  const [organizationId, setOrganizationId] = React.useState(
    initialData?.organization_id || taxonomies.organizations[0]?.id || ""
  );
  const [departmentId, setDepartmentId] = React.useState(initialData?.department_id || "");
  const [categoryId, setCategoryId] = React.useState(
    initialData?.category_id || taxonomies.categories[0]?.id || ""
  );
  const [minQualificationId, setMinQualificationId] = React.useState(initialData?.min_qualification_id || "");
  const [stateCode, setStateCode] = React.useState(initialData?.state_code || "");
  const [employmentType, setEmploymentType] = React.useState<"permanent" | "contract" | "deputation" | "apprenticeship">(
    initialData?.employment_type || "permanent"
  );
  const [totalVacancies, setTotalVacancies] = React.useState<number>(initialData?.total_vacancies || 0);
  const [salaryMin, setSalaryMin] = React.useState<string>(initialData?.salary_min ? String(initialData.salary_min) : "");
  const [salaryMax, setSalaryMax] = React.useState<string>(initialData?.salary_max ? String(initialData.salary_max) : "");
  const [payScaleDetails, setPayScaleDetails] = React.useState(initialData?.pay_scale_details || "");
  const [officialNotificationUrl, setOfficialNotificationUrl] = React.useState(initialData?.official_notification_url || "");
  const [officialApplyUrl, setOfficialApplyUrl] = React.useState(initialData?.official_apply_url || "");
  const [status, setStatus] = React.useState<"draft" | "published" | "archived">(initialData?.status || "draft");
  const [isFeatured, setIsFeatured] = React.useState(initialData?.is_featured || false);
  const [summary, setSummary] = React.useState(initialData?.summary || "");
  const [metaTitle, setMetaTitle] = React.useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = React.useState(initialData?.meta_description || "");
  const [applicationStartDate, setApplicationStartDate] = React.useState(
    initialData?.application_start_date ? initialData.application_start_date.slice(0, 10) : ""
  );
  const [applicationEndDate, setApplicationEndDate] = React.useState(
    initialData?.application_end_date ? initialData.application_end_date.slice(0, 10) : ""
  );

  // Sub-forms: Vacancies
  const [vacancies, setVacancies] = React.useState<Array<{
    postName: string;
    postCode: string;
    totalPosts: number;
    urPosts: number;
    ewsPosts: number;
    obcPosts: number;
    scPosts: number;
    stPosts: number;
    pwdPosts: number;
    payLevel: string;
  }>>(
    initialData?.vacancies?.map((v) => ({
      postName: v.post_name,
      postCode: v.post_code || "",
      totalPosts: v.total_posts,
      urPosts: v.ur_posts || 0,
      ewsPosts: v.ews_posts || 0,
      obcPosts: v.obc_posts || 0,
      scPosts: v.sc_posts || 0,
      stPosts: v.st_posts || 0,
      pwdPosts: v.pwd_posts || 0,
      payLevel: v.pay_level || "",
    })) || []
  );

  // Sub-forms: Important Dates
  const [importantDates, setImportantDates] = React.useState<Array<{
    eventName: string;
    eventDate: string;
    eventDateText: string;
    isTentative: boolean;
  }>>(
    initialData?.important_dates?.map((d) => ({
      eventName: d.event_name,
      eventDate: d.event_date ? d.event_date.slice(0, 10) : "",
      eventDateText: d.event_date_text || "",
      isTentative: d.is_tentative,
    })) || [
      { eventName: "Application Start Date", eventDate: "", eventDateText: "", isTentative: false },
      { eventName: "Last Date to Apply Online", eventDate: "", eventDateText: "", isTentative: false },
    ]
  );

  // Sub-forms: Eligibility
  const [minAge, setMinAge] = React.useState<string>(initialData?.eligibility?.min_age ? String(initialData.eligibility.min_age) : "18");
  const [maxAge, setMaxAge] = React.useState<string>(initialData?.eligibility?.max_age ? String(initialData.eligibility.max_age) : "30");
  const [ageCalculationDate, setAgeCalculationDate] = React.useState(
    initialData?.eligibility?.age_calculation_date ? initialData.eligibility.age_calculation_date.slice(0, 10) : ""
  );
  const [ageRelaxationDetails, setAgeRelaxationDetails] = React.useState(initialData?.eligibility?.age_relaxation_details || "");
  const [educationQualification, setEducationQualification] = React.useState(
    initialData?.eligibility?.education_qualification || "Graduate degree from a recognized university or equivalent."
  );
  const [selectionProcess, setSelectionProcess] = React.useState(initialData?.eligibility?.selection_process || "");
  const [feeDetails, setFeeDetails] = React.useState(
    initialData?.eligibility?.application_fee_details
      ? JSON.stringify(initialData.eligibility.application_fee_details, null, 2)
      : "General / OBC: ₹100\nSC / ST / PwD / Female: Nil"
  );

  // Sub-forms: Documents
  const [officialDocuments, setOfficialDocuments] = React.useState<Array<{
    documentType: "full_notification" | "short_notice" | "corrigendum" | "syllabus" | "admit_card_notice" | "result_notice";
    title: string;
    fileUrl: string;
    publishedDate: string;
  }>>(
    initialData?.official_documents?.map((d) => ({
      documentType: d.document_type,
      title: d.title,
      fileUrl: d.file_url,
      publishedDate: d.published_date ? d.published_date.slice(0, 10) : "",
    })) || [
      { documentType: "full_notification", title: "Official Full Notification PDF", fileUrl: "", publishedDate: "" },
    ]
  );

  const addVacancyRow = () => {
    setVacancies([
      ...vacancies,
      {
        postName: "",
        postCode: "",
        totalPosts: 0,
        urPosts: 0,
        ewsPosts: 0,
        obcPosts: 0,
        scPosts: 0,
        stPosts: 0,
        pwdPosts: 0,
        payLevel: "",
      },
    ]);
  };

  const removeVacancyRow = (index: number) => {
    setVacancies(vacancies.filter((_, i) => i !== index));
  };

  const addDateRow = () => {
    setImportantDates([
      ...importantDates,
      { eventName: "", eventDate: "", eventDateText: "", isTentative: false },
    ]);
  };

  const addDocRow = () => {
    setOfficialDocuments([
      ...officialDocuments,
      { documentType: "corrigendum", title: "", fileUrl: "", publishedDate: "" },
    ]);
  };

  // Filtered departments for chosen organization
  const availableDepartments = React.useMemo(() => {
    if (!organizationId) return taxonomies.departments;
    return taxonomies.departments.filter((d) => d.organization_id === organizationId || !d.organization_id);
  }, [organizationId, taxonomies.departments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!title.trim()) throw new Error("Notice Title is required");
      if (!organizationId) throw new Error("Organization is required");
      if (!categoryId) throw new Error("Category is required");
      if (!officialNotificationUrl.trim()) throw new Error("Official Notification URL is required");

      const payload: SaveJobPayload = {
        id: initialData?.id,
        title,
        slug: slug.trim() || undefined,
        notificationNumber: notificationNumber.trim() || undefined,
        organizationId,
        departmentId: departmentId || null,
        categoryId,
        minQualificationId: minQualificationId || null,
        stateCode: stateCode || undefined,
        employmentType,
        totalVacancies: Number(totalVacancies) || 0,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        payScaleDetails: payScaleDetails.trim() || undefined,
        officialNotificationUrl: officialNotificationUrl.trim(),
        officialApplyUrl: officialApplyUrl.trim() || undefined,
        status,
        isFeatured,
        summary: summary.trim() || undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        applicationStartDate: applicationStartDate ? new Date(applicationStartDate).toISOString() : null,
        applicationEndDate: applicationEndDate ? new Date(applicationEndDate).toISOString() : null,
        vacancies: vacancies.map((v) => ({
          postName: v.postName,
          postCode: v.postCode || undefined,
          totalPosts: Number(v.totalPosts) || 0,
          urPosts: Number(v.urPosts) || 0,
          ewsPosts: Number(v.ewsPosts) || 0,
          obcPosts: Number(v.obcPosts) || 0,
          scPosts: Number(v.scPosts) || 0,
          stPosts: Number(v.stPosts) || 0,
          pwdPosts: Number(v.pwdPosts) || 0,
          payLevel: v.payLevel || undefined,
        })),
        importantDates: importantDates.map((d, idx) => ({
          eventName: d.eventName,
          eventDate: d.eventDate ? new Date(d.eventDate).toISOString() : null,
          eventDateText: d.eventDateText || undefined,
          isTentative: d.isTentative,
          displayOrder: idx,
        })),
        eligibility: {
          minAge: minAge ? Number(minAge) : null,
          maxAge: maxAge ? Number(maxAge) : null,
          ageCalculationDate: ageCalculationDate || null,
          ageRelaxationDetails: ageRelaxationDetails.trim() || undefined,
          educationQualification: educationQualification.trim(),
          selectionProcess: selectionProcess.trim() || undefined,
          applicationFeeDetails: feeDetails.trim() || undefined,
        },
        officialDocuments: officialDocuments
          .filter((d) => d.title.trim() && d.fileUrl.trim())
          .map((d) => ({
            documentType: d.documentType,
            title: d.title,
            fileUrl: d.fileUrl,
            publishedDate: d.publishedDate || undefined,
          })),
      };

      const result = await saveJobNoticeAction(payload);

      if (!result.success) {
        throw new Error(result.error || "Failed to save notice");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while saving the notice.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/jobs">
            <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
              {initialData ? "Edit Job Notice" : "Create New Job Notice"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured form with normalization for vacancies, eligibility, department, and official links.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="brand"
            size="md"
            isLoading={isSubmitting}
            className="gap-2 font-bold shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>{initialData ? "Update Notice" : "Save Notice"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <NotificationBanner
          type="warning"
          title="Submission Error"
          message={error}
        />
      )}

      {/* SECTION 1: Primary Notice Details */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-brand-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              1. Primary Notice Information & Authority
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Full Notice Title *"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. UPSC Civil Services Examination (CSE) 2026 Notification"
              />
            </div>

            <div>
              <Input
                label="Notification / Reference Number"
                value={notificationNumber}
                onChange={(e) => setNotificationNumber(e.target.value)}
                placeholder="e.g. 05/2026-CSP"
              />
            </div>

            <div>
              <Input
                label="Custom URL Slug (Optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="upsc-civil-services-2026"
                helperText="Leave empty to auto-generate from title."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Organization / Commission *
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {taxonomies.organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.acronym ? `${org.acronym} - ${org.name}` : org.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Department / Wing / Cadre (Optional)
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">None / General Cadre</option>
                {availableDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.acronym ? `${dept.acronym} - ${dept.name}` : dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Sector / Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {taxonomies.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Minimum Educational Qualification
              </label>
              <select
                value={minQualificationId}
                onChange={(e) => setMinQualificationId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Not Specified / Multiple Entries</option>
                {taxonomies.qualifications.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Jurisdiction / State
              </label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">All India / Central</option>
                {taxonomies.states.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="permanent">Permanent / Regular</option>
                <option value="contract">Contractual</option>
                <option value="deputation">Deputation</option>
                <option value="apprenticeship">Apprenticeship</option>
              </select>
            </div>

            <div>
              <Input
                label="Total Vacancies Count *"
                type="number"
                required
                min={0}
                value={totalVacancies}
                onChange={(e) => setTotalVacancies(Number(e.target.value))}
                placeholder="1056"
              />
            </div>

            <div>
              <Input
                label="Pay Scale Description"
                value={payScaleDetails}
                onChange={(e) => setPayScaleDetails(e.target.value)}
                placeholder="Pay Level 10 (₹56,100 - ₹1,77,500)"
              />
            </div>

            <div>
              <Input
                label="Official Notification PDF URL *"
                type="url"
                required
                value={officialNotificationUrl}
                onChange={(e) => setOfficialNotificationUrl(e.target.value)}
                placeholder="https://upsc.gov.in/notices/exam-2026.pdf"
              />
            </div>

            <div>
              <Input
                label="Official Apply Online URL"
                type="url"
                value={officialApplyUrl}
                onChange={(e) => setOfficialApplyUrl(e.target.value)}
                placeholder="https://upsconline.nic.in"
              />
            </div>

            <div>
              <Input
                label="Application Start Date"
                type="date"
                value={applicationStartDate}
                onChange={(e) => setApplicationStartDate(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Application End Date / Deadline"
                type="date"
                value={applicationEndDate}
                onChange={(e) => setApplicationEndDate(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Notice Summary & Background
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief official overview of the recruitment..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: Post & Vacancy Breakdown Builder */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                2. Post-Wise Vacancy & Category Breakdown
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVacancyRow}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Post Cadre</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {vacancies.map((v, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Post Cadre #{i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVacancyRow(i)}
                  className="h-7 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Post Name"
                    value={v.postName}
                    onChange={(e) => {
                      const copy = [...vacancies];
                      copy[i].postName = e.target.value;
                      setVacancies(copy);
                    }}
                    placeholder="e.g. Assistant Executive Engineer"
                  />
                </div>

                <div>
                  <Input
                    label="Post Code"
                    value={v.postCode}
                    onChange={(e) => {
                      const copy = [...vacancies];
                      copy[i].postCode = e.target.value;
                      setVacancies(copy);
                    }}
                    placeholder="e.g. AEE-01"
                  />
                </div>

                <div>
                  <Input
                    label="Total Posts"
                    type="number"
                    value={v.totalPosts}
                    onChange={(e) => {
                      const copy = [...vacancies];
                      copy[i].totalPosts = Number(e.target.value);
                      setVacancies(copy);
                    }}
                  />
                </div>

                <div>
                  <Input
                    label="UR (General)"
                    type="number"
                    value={v.urPosts}
                    onChange={(e) => {
                      const copy = [...vacancies];
                      copy[i].urPosts = Number(e.target.value);
                      setVacancies(copy);
                    }}
                  />
                </div>

                <div>
                  <Input
                    label="EWS"
                    type="number"
                    value={v.ewsPosts}
                    onChange={(e) => {
                      const copy = [...vacancies];
                      copy[i].ewsPosts = Number(e.target.value);
                      setVacancies(copy);
                    }}
                  />
                </div>

                <div>
                  <Input
                    label="OBC"
                    type="number"
                    value={v.obcPosts}
                    onChange={(e) => {
                      const copy = [...vacancies];
                      copy[i].obcPosts = Number(e.target.value);
                      setVacancies(copy);
                    }}
                  />
                </div>

                <div>
                  <Input
                    label="SC"
                    type="number"
                    value={v.scPosts}
                    onChange={(e) => {
                      const copy = [...vacancies];
                      copy[i].scPosts = Number(e.target.value);
                      setVacancies(copy);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {vacancies.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-4">
              No specific post breakdown added. Click &quot;Add Post Cadre&quot; above to specify posts.
            </p>
          )}
        </CardContent>
      </Card>

      {/* SECTION 3: Important Dates Builder */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                3. Timeline Milestones & Important Dates
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDateRow}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Date Event</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {importantDates.map((d, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-center rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="sm:col-span-5">
                <Input
                  label="Event Name"
                  value={d.eventName}
                  onChange={(e) => {
                    const copy = [...importantDates];
                    copy[i].eventName = e.target.value;
                    setImportantDates(copy);
                  }}
                  placeholder="e.g. Prelims Examination Date"
                />
              </div>

              <div className="sm:col-span-4">
                <Input
                  label="Event Date"
                  type="date"
                  value={d.eventDate}
                  onChange={(e) => {
                    const copy = [...importantDates];
                    copy[i].eventDate = e.target.value;
                    setImportantDates(copy);
                  }}
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id={`tentative-${i}`}
                  checked={d.isTentative}
                  onChange={(e) => {
                    const copy = [...importantDates];
                    copy[i].isTentative = e.target.checked;
                    setImportantDates(copy);
                  }}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor={`tentative-${i}`} className="text-xs text-slate-700">
                  Tentative
                </label>
              </div>

              <div className="sm:col-span-1 pt-6 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setImportantDates(importantDates.filter((_, idx) => idx !== i))}
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECTION 4: Eligibility & Criteria */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              4. Eligibility & Criteria
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Input
                label="Minimum Age"
                type="number"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                placeholder="18"
              />
            </div>
            <div>
              <Input
                label="Maximum Age"
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder="32"
              />
            </div>
            <div>
              <Input
                label="Crucial Date for Age Calculation"
                type="date"
                value={ageCalculationDate}
                onChange={(e) => setAgeCalculationDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Educational Qualifications *
            </label>
            <textarea
              rows={3}
              value={educationQualification}
              onChange={(e) => setEducationQualification(e.target.value)}
              placeholder="Bachelor's Degree in any discipline from a recognized University..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Selection Process Stages
              </label>
              <textarea
                rows={2}
                value={selectionProcess}
                onChange={(e) => setSelectionProcess(e.target.value)}
                placeholder="Stage 1: Preliminary Exam, Stage 2: Main Written Exam, Stage 3: Interview"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Application Fee Structure
              </label>
              <textarea
                rows={2}
                value={feeDetails}
                onChange={(e) => setFeeDetails(e.target.value)}
                placeholder="UR / OBC: ₹100; SC / ST / Female: Exempted"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: Official Documents */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-rose-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                5. Official Verification Documents & PDFs
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDocRow}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Document PDF</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {officialDocuments.map((doc, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-3 sm:grid-cols-12 items-center rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Doc Type</label>
                <select
                  value={doc.documentType}
                  onChange={(e) => {
                    const copy = [...officialDocuments];
                    copy[i].documentType = e.target.value as any;
                    setOfficialDocuments(copy);
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                >
                  <option value="full_notification">Full Notification</option>
                  <option value="short_notice">Short Notice</option>
                  <option value="corrigendum">Corrigendum / Notice</option>
                  <option value="syllabus">Syllabus</option>
                  <option value="admit_card_notice">Admit Card Notice</option>
                  <option value="result_notice">Result Notice</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <Input
                  label="Document Label / Title"
                  value={doc.title}
                  onChange={(e) => {
                    const copy = [...officialDocuments];
                    copy[i].title = e.target.value;
                    setOfficialDocuments(copy);
                  }}
                  placeholder="e.g. Official Notification PDF"
                />
              </div>

              <div className="sm:col-span-4">
                <Input
                  label="Direct Official PDF Link"
                  type="url"
                  value={doc.fileUrl}
                  onChange={(e) => {
                    const copy = [...officialDocuments];
                    copy[i].fileUrl = e.target.value;
                    setOfficialDocuments(copy);
                  }}
                  placeholder="https://upsc.gov.in/doc.pdf"
                />
              </div>

              <div className="sm:col-span-1 pt-5 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOfficialDocuments(officialDocuments.filter((_, idx) => idx !== i))}
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SECTION 6: Granular SEO Settings & Publication Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              6. SEO Metadata & Publication Status
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input
                label="Custom Meta Title (SEO)"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Leave blank to auto-generate standard title"
              />
            </div>

            <div>
              <Input
                label="Custom Meta Description (SEO)"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Leave blank to auto-generate standard summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Publication State *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="draft">Draft (Private, not visible on public portal)</option>
                <option value="published">Published (Live & accessible to all citizens)</option>
                <option value="archived">Archived (Expired / historical reference)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-800">
                Mark as Featured Notice on Homepage
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Link href="/admin/jobs">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          variant="brand"
          size="lg"
          isLoading={isSubmitting}
          className="gap-2 font-bold shadow-md"
        >
          <Save className="h-4 w-4" />
          <span>{initialData ? "Update Notice" : "Save Notice"}</span>
        </Button>
      </div>
    </form>
  );
}
