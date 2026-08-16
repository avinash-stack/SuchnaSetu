import { notFound } from "next/navigation";
import { getAdminJobById, getJobTaxonomies } from "@/modules/jobs/service";
import { JobForm } from "@/modules/jobs/components/job-form";

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const [job, taxonomies] = await Promise.all([
    getAdminJobById(id),
    getJobTaxonomies(),
  ]);

  if (!job) {
    notFound();
  }

  return <JobForm initialData={job} taxonomies={taxonomies} />;
}
