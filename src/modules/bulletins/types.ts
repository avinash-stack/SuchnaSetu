import { Database } from "@/types/database.types";
import { Organization } from "@/modules/core/types";
import { GovJob } from "@/modules/jobs/types";

export type PublicBulletin = Database["public"]["Tables"]["public_bulletins"]["Row"];
export type PublicBulletinInsert = Database["public"]["Tables"]["public_bulletins"]["Insert"];
export type PublicBulletinUpdate = Database["public"]["Tables"]["public_bulletins"]["Update"];

export type BulletinCategory = "employment_news" | "student_advisory" | "legal_update" | "press_release";

export interface PublicBulletinDetailed extends PublicBulletin {
  organization?: Organization | null;
  related_job?: GovJob | null;
}

export interface BulletinFilterParams {
  category?: BulletinCategory | "all";
  organizationSlug?: string;
  isBreaking?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
