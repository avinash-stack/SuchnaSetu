import Link from "next/link";
import { PublicBulletinDetailed } from "../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Building2,
  Calendar,
  ExternalLink,
  Flame,
  Scale,
  Users,
  Briefcase,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface BulletinCardProps {
  bulletin: PublicBulletinDetailed;
}

const categoryMeta: Record<string, { label: string; variant: "brand" | "warning" | "success" | "default"; icon: any }> = {
  employment_news: { label: "Rozgar Samachar", variant: "brand", icon: Briefcase },
  student_advisory: { label: "Student Advisory", variant: "warning", icon: Users },
  legal_update: { label: "Court / Legal", variant: "default", icon: Scale },
  press_release: { label: "Press Release", variant: "success", icon: FileText },
};

export function BulletinCard({ bulletin }: BulletinCardProps) {
  const meta = categoryMeta[bulletin.category] || categoryMeta.employment_news;
  const Icon = meta.icon;

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-slate-200 bg-white transition-all hover:border-brand-400 hover:shadow-md">
      <CardHeader className="pb-3">
        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Badge variant={meta.variant} className="gap-1 text-[10px] font-bold">
              <Icon className="h-3 w-3" />
              <span>{meta.label}</span>
            </Badge>

            {bulletin.is_breaking && (
              <Badge variant="danger" className="text-[9px] font-bold animate-pulse">
                Breaking
              </Badge>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            {formatDate(bulletin.published_at)}
          </span>
        </div>

        {/* Title */}
        <Link href={`/news/${bulletin.slug}`} className="group">
          <CardTitle className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
            {bulletin.title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="pb-4 text-xs text-slate-600 space-y-2.5">
        <p className="line-clamp-3 leading-relaxed">
          {bulletin.summary}
        </p>

        {/* Source Citation Pill */}
        <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500 border border-slate-100">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
          <span className="font-medium text-slate-700">Source:</span>
          <span className="truncate">{bulletin.source_name}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-3 pt-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Official Release
        </span>

        <Link href={`/news/${bulletin.slug}`}>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 transition-colors">
            <span>Read Full Advisory</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}
