"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleJobPublishAction, softDeleteJobAction, restoreJobAction, deleteJobAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Edit, Eye, CheckCircle, XCircle, Trash2, RotateCcw } from "lucide-react";

interface AdminJobActionsProps {
  jobId: string;
  slug: string;
  currentStatus: "draft" | "published" | "archived";
  isDeleted?: boolean;
}

export function AdminJobActions({ jobId, slug, currentStatus, isDeleted = false }: AdminJobActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleToggleStatus = async (targetStatus: "draft" | "published" | "archived") => {
    setIsLoading(true);
    try {
      const res = await toggleJobPublishAction(jobId, targetStatus);
      if (!res.success) {
        alert(res.error || "Failed to update notice status");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update notice status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!confirm("Move this notice to trash (soft-delete)? You can restore it anytime.")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await softDeleteJobAction(jobId);
      if (!res.success) {
        alert(res.error || "Failed to move notice to trash");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to soft delete notice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const res = await restoreJobAction(jobId);
      if (!res.success) {
        alert(res.error || "Failed to restore notice");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to restore notice");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!confirm("PERMANENT DELETE: This will completely remove this notice and its post breakdown from database. This action CANNOT be undone. Continue?")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await deleteJobAction(jobId);
      if (!res.success) {
        alert(res.error || "Failed to permanently delete notice");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete notice");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* If soft-deleted / in trash */}
      {isDeleted ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={handleRestore}
            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            title="Restore Notice"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={handlePermanentDelete}
            className="h-8 w-8 text-red-700 hover:text-red-900 hover:bg-red-50"
            title="Permanent Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          {/* View Public Notice if Published */}
          {currentStatus === "published" && (
            <Link href={`/jobs/${slug}`} target="_blank">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" title="View Public Page">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Edit Notice */}
          <Link href={`/admin/jobs/${jobId}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Edit Notice">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>

          {/* Publish / Unpublish Toggle */}
          {currentStatus === "draft" ? (
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={() => handleToggleStatus("published")}
              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              title="Publish Notice"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          ) : currentStatus === "published" ? (
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              onClick={() => handleToggleStatus("draft")}
              className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              title="Revert to Draft"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          ) : null}

          {/* Soft Delete (Trash) */}
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading}
            onClick={handleSoftDelete}
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Move to Trash"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
