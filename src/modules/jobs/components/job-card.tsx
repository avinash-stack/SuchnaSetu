import Link from "next/link";
import { GovJobDetailed } from "../types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatINR, formatNumber } from "@/lib/utils";
import {
  Building2,
  Calendar,
  IndianRupee,
  Users,
  MapPin,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface JobCardProps {
  job: GovJobDetailed;
}

export function JobCard({ job }: JobCardProps) {
  const isClosingSoon = job.application_end_date
    ? new Date(job.application_end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 &&
      new Date(job.application_end_date).getTime() > Date.now()
    : false;

  return (
    <Card className="flex flex-col justify-between overflow-hidden border-slate-200 bg-white transition-all hover:border-brand-400 hover:shadow-md">
      <CardHeader className="pb-3">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Badge variant="brand" className="text-[11px] font-bold">
              {job.organization?.acronym || job.organization?.name || "Govt"}
            </Badge>
            {job.category && (
              <Badge variant="default" className="text-[10px]">
                {job.category.name}
              </Badge>
            )}
          </div>

          {job.state ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span>{job.state.name}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span>All India</span>
            </span>
          )}
        </div>

        {/* Title & Notification Number */}
        <Link href={`/jobs/${job.slug}`} className="group">
          <CardTitle className="text-base font-bold leading-snug text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
            {job.title}
          </CardTitle>
        </Link>

        {job.notification_number && (
          <p className="text-[11px] font-mono text-slate-400 mt-1">
            Ref: {job.notification_number}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pb-4 text-xs text-slate-600">
        {/* Vacancies & Salary Stats */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 border border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Vacancies</div>
              <div className="font-bold text-slate-800 text-sm">
                {formatNumber(job.total_vacancies)} Posts
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Pay Scale</div>
              <div className="font-medium text-slate-800 text-xs truncate max-w-[120px]">
                {job.salary_min || job.salary_max
                  ? `${formatINR(job.salary_min)} - ${formatINR(job.salary_max)}`
                  : job.pay_scale_details || "As per 7th CPC"}
              </div>
            </div>
          </div>
        </div>

        {/* Key Dates Strip */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Last Date:</span>
            <span className="font-semibold text-slate-800">
              {formatDate(job.application_end_date)}
            </span>
          </div>

          {isClosingSoon && (
            <Badge variant="danger" className="text-[9px] animate-pulse">
              Closing Soon
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 bg-slate-50/50 p-3 pt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Official Notice</span>
        </span>

        <Link href={`/jobs/${job.slug}`} className="flex-shrink-0">
          <Button variant="primary" size="sm" className="h-8 gap-1 text-xs font-semibold px-3">
            <span>View Details</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
