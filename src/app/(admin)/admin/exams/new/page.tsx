import { getExamTaxonomies } from "@/modules/exams/service";
import { ExamForm } from "@/modules/exams/components/exam-form";

export default async function NewExamPage() {
  const taxonomies = await getExamTaxonomies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Publish New Examination Notice
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Add a verified, structured examination schedule with syllabus breakdown, stages, eligibility, and official links.
        </p>
      </div>

      <ExamForm taxonomies={taxonomies} />
    </div>
  );
}
