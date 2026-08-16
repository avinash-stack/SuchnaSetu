"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toggleBulletinPublishAction, deleteBulletinAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Edit, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface AdminBulletinActionsProps {
  bulletinId: string;
  slug: string;
  currentStatus: "draft" | "published" | "archived";
}

export function AdminBulletinActions({ bulletinId, slug, currentStatus }: AdminBulletinActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleToggleStatus = async (targetStatus: "draft" | "published" | "archived") => {
    setIsLoading(true);
    try {
      const res = await toggleBulletinPublishAction(bulletinId, targetStatus);
      if (!res.success) {
        alert(res.error || "Failed to update bulletin status");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to update bulletin status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this bulletin/news item?")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await deleteBulletinAction(bulletinId);
      if (!res.success) {
        alert(res.error || "Failed to delete bulletin");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete bulletin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {currentStatus === "published" && (
        <Link href={`/news/${slug}`} target="_blank">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" title="View Public Page">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      )}

      <Link href={`/admin/bulletins/${bulletinId}/edit`}>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Edit Bulletin">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>

      {currentStatus === "draft" ? (
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          onClick={() => handleToggleStatus("published")}
          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          title="Publish Bulletin"
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

      <Button
        variant="ghost"
        size="icon"
        disabled={isLoading}
        onClick={handleDelete}
        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        title="Delete Bulletin"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
