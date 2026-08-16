"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  toggleExamStatusAction,
  softDeleteExamAction,
  restoreExamAction,
} from "../actions";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  RotateCcw,
  CheckCircle,
  Archive,
  Eye,
} from "lucide-react";

interface AdminExamActionsProps {
  exam: {
    id: string;
    slug: string;
    status: string;
    deleted_at: string | null;
  };
}

export function AdminExamActions({ exam }: AdminExamActionsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (status: "draft" | "published" | "archived") => {
    setLoading(true);
    setIsOpen(false);
    await toggleExamStatusAction(exam.id, status);
    setLoading(false);
    router.refresh();
  };

  const handleSoftDelete = async () => {
    if (!confirm("Are you sure you want to move this examination notice to trash?")) return;
    setLoading(true);
    setIsOpen(false);
    await softDeleteExamAction(exam.id);
    setLoading(false);
    router.refresh();
  };

  const handleRestore = async () => {
    setLoading(true);
    setIsOpen(false);
    await restoreExamAction(exam.id);
    setLoading(false);
    router.refresh();
  };

  const isTrash = Boolean(exam.deleted_at);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        disabled={loading}
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0"
      >
        <MoreVertical className="h-4 w-4 text-slate-500" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95">
          {!isTrash ? (
            <>
              {exam.status === "published" && (
                <Link
                  href={`/exams/${exam.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <span>View Public Page</span>
                </Link>
              )}

              <Link
                href={`/admin/exams/${exam.id}/edit`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                <Edit className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit Notice</span>
              </Link>

              <div className="my-1 border-t border-slate-100" />

              {exam.status !== "published" && (
                <button
                  onClick={() => handleStatusChange("published")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Publish Notice</span>
                </button>
              )}

              {exam.status !== "draft" && (
                <button
                  onClick={() => handleStatusChange("draft")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-amber-700 hover:bg-amber-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Switch to Draft</span>
                </button>
              )}

              {exam.status !== "archived" && (
                <button
                  onClick={() => handleStatusChange("archived")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>Archive Notice</span>
                </button>
              )}

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={handleSoftDelete}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Move to Trash</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleRestore}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-emerald-700 hover:bg-emerald-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restore Notice</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
