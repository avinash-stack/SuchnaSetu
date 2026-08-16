import { notFound } from "next/navigation";
import { getAdminExamById, getExamTaxonomies } from "@/modules/exams/service";
import { ExamForm } from "@/modules/exams/components/exam-form";

interface EditExamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditExamPage({ params }: EditExamPageProps) {
  const { id } = await params;
  const [exam, taxonomies] = await Promise.all([
    getAdminExamById(id),
    getExamTaxonomies(),
  ]);

  if (!exam) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Edit Examination Notice
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Update examination parameters, shift timetables, stages, eligibility rules, and official documentation attachments.
        </p>
      </div>

      <ExamForm initialData={exam} taxonomies={taxonomies} />
    </div>
  );
}
