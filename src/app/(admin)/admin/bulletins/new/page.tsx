import { getJobTaxonomies } from "@/modules/jobs/service";
import { BulletinForm } from "@/modules/bulletins/components/bulletin-form";

export default async function AdminNewBulletinPage() {
  const taxonomies = await getJobTaxonomies();

  return <BulletinForm organizations={taxonomies.organizations} />;
}
