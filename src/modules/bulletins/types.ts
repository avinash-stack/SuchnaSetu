import { Database } from "@/types/database.types";
import { Organization } from "@/modules/core/types";
import { GovJob } from "@/modules/jobs/types";
import { BulletinCategoryKey } from "./constants";

export type PublicBulletin = Database["public"]["Tables"]["public_bulletins"]["Row"];
export type PublicBulletinInsert = Database["public"]["Tables"]["public_bulletins"]["Insert"];
export type PublicBulletinUpdate = Database["public"]["Tables"]["public_bulletins"]["Update"];

export type BulletinCategory =
  | "employment_news"
  | "student_advisory"
  | "legal_update"
  | "press_release"
  | "government_updates"
  | "recruitment_jobs"
  | "exams"
  | "education"
  | "government_schemes"
  | "important_notifications";

export interface PublicBulletinDetailed extends PublicBulletin {
  organization?: Organization | null;
  related_job?: GovJob | null;
  author?: string | null;
  tags?: string[] | null;
  image_url?: string | null;
  is_manually_edited?: boolean;
}

export interface BulletinFilterParams {
  category?: BulletinCategoryKey;
  organizationSlug?: string;
  isBreaking?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
