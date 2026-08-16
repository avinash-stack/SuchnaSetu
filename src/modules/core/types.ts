import { Database } from "@/types/database.types";

export type StateUT = Database["public"]["Tables"]["states_uts"]["Row"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Department = Database["public"]["Tables"]["departments"]["Row"];
export type Qualification = Database["public"]["Tables"]["qualifications"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Module = Database["public"]["Tables"]["modules"]["Row"];
export type OfficialSource = Database["public"]["Tables"]["official_sources"]["Row"];
export type AdminProfile = Database["public"]["Tables"]["admin_profiles"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
