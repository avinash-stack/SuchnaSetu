import { getJobTaxonomies } from "@/modules/jobs/service";
import { JobForm } from "@/modules/jobs/components/job-form";

export default async function AdminNewJobPage() {
  const taxonomies = await getJobTaxonomies();

  return <JobForm taxonomies={taxonomies} />;
}
