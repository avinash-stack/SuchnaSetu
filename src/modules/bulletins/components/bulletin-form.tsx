"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Organization } from "@/modules/core/types";
import { PublicBulletinDetailed, BulletinCategory } from "../types";
import { saveBulletinAction, SaveBulletinPayload } from "../actions";
import { BULLETIN_CATEGORIES } from "../constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotificationBanner } from "@/components/shared/notification-banner";
import { Save, ArrowLeft, ShieldCheck, Flame, Newspaper } from "lucide-react";

interface BulletinFormProps {
  initialData?: PublicBulletinDetailed | null;
  organizations: Organization[];
}

export function BulletinForm({ initialData, organizations }: BulletinFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState(initialData?.title || "");
  const [slug, setSlug] = React.useState(initialData?.slug || "");
  const [category, setCategory] = React.useState<BulletinCategory>(
    initialData?.category || "employment_news"
  );
  const [organizationId, setOrganizationId] = React.useState(initialData?.organization_id || "");
  const [summary, setSummary] = React.useState(initialData?.summary || "");
  const [content, setContent] = React.useState(initialData?.content || "");
  const [sourceUrl, setSourceUrl] = React.useState(initialData?.source_url || "");
  const [sourceName, setSourceName] = React.useState(
    initialData?.source_name || "Official Commission Release"
  );
  const [isBreaking, setIsBreaking] = React.useState(initialData?.is_breaking || false);
  const [status, setStatus] = React.useState<"draft" | "published" | "archived">(
    initialData?.status || "published"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!title.trim()) throw new Error("Bulletin Title is required");
      if (!summary.trim()) throw new Error("Summary is required");
      if (!sourceUrl.trim()) throw new Error("Official Source URL is required");
      if (!sourceName.trim()) throw new Error("Source Name is required");

      const payload: SaveBulletinPayload = {
        id: initialData?.id,
        title: title.trim(),
        slug: slug.trim() || undefined,
        category,
        organizationId: organizationId || null,
        summary: summary.trim(),
        content: content.trim() || null,
        sourceUrl: sourceUrl.trim(),
        sourceName: sourceName.trim(),
        isBreaking,
        status,
      };

      const result = await saveBulletinAction(payload);
      if (!result.success) {
        throw new Error(result.error || "Failed to save bulletin");
      }

      router.push("/admin/bulletins");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/bulletins">
            <Button type="button" variant="outline" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
              {initialData ? "Edit Public Bulletin" : "Publish New Bulletin / Student Advisory"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured news, Employment News (Rozgar Samachar) digests, and verified student advisories.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="brand"
          size="md"
          isLoading={isSubmitting}
          className="gap-2 font-bold shadow-md"
        >
          <Save className="h-4 w-4" />
          <span>{initialData ? "Update Bulletin" : "Publish Bulletin"}</span>
        </Button>
      </div>

      {error && (
        <NotificationBanner
          type="warning"
          title="Validation Error"
          message={error}
        />
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-brand-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Bulletin Details & Provenance
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Bulletin Headline / Title *"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Employment News (15-21 Aug 2026 Edition): Key Central Govt Recruitments Summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BulletinCategory)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {BULLETIN_CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Associated Organization (Optional)
              </label>
              <select
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">General / Multi-Authority Release</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.acronym ? `${org.acronym} - ${org.name}` : org.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                label="Official Source Name *"
                required
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g. PIB Delhi / Supreme Court Order / UPSC Press Note"
              />
            </div>

            <div>
              <Input
                label="Direct Official Source / Document URL *"
                type="url"
                required
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://pib.gov.in/PressReleasePage.aspx?PRID=..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Summary & Key Points *
              </label>
              <textarea
                rows={3}
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief factual overview of the development or weekly vacancy count..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Details & In-Depth Text (Optional)
              </label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full official release text, committee decisions, or list of posts..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visibility & Breaking Control */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-slate-900">
            Visibility & Ticker Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="published">Published (Live immediately)</option>
                <option value="draft">Draft (Private)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isBreaking"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="isBreaking" className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-amber-600" />
                <span>Show in Top Breaking Headlines Ticker</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Link href="/admin/bulletins">
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
          <span>{initialData ? "Update Bulletin" : "Publish Bulletin"}</span>
        </Button>
      </div>
    </form>
  );
}
