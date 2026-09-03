import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-brand-600 mb-6 border border-brand-200">
        <FileQuestion className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-2 font-heading">
        Page or Notice Not Found
      </h1>
      <p className="max-w-md text-base text-slate-500 mb-8">
        The requested public notice or page could not be located. It may have been archived, rescheduled, or the link has changed.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/news">
          <Button variant="primary" className="gap-2">
            <span>Latest News &amp; Updates</span>
          </Button>
        </Link>
        <Link href="/jobs">
          <Button variant="outline" className="gap-2">
            <span>Browse Govt Jobs</span>
          </Button>
        </Link>
        <Link href="/exams">
          <Button variant="outline" className="gap-2">
            <span>Check Exams</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="gap-2 text-slate-500">
            <Home className="h-4 w-4" />
            <span>Homepage</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
