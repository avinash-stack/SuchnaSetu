import { notFound } from "next/navigation";
import { getAdminBulletinById } from "@/modules/bulletins/service";
import { getJobTaxonomies } from "@/modules/jobs/service";
import { BulletinForm } from "@/modules/bulletins/components/bulletin-form";

interface EditBulletinPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditBulletinPage({ params }: EditBulletinPageProps) {
  const { id } = await params;
  const [bulletin, taxonomies] = await Promise.all([
    getAdminBulletinById(id),
    getJobTaxonomies(),
  ]);

  if (!bulletin) {
    notFound();
  }

  return <BulletinForm initialData={bulletin} organizations={taxonomies.organizations} />;
}
