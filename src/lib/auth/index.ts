import { createClient } from "@/lib/supabase/server";
import { AdminProfile } from "@/modules/core/types";

/**
 * Retrieves the currently authenticated user from server context.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Retrieves the active Admin Profile for the current user.
 */
export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as AdminProfile;
}

/**
 * Checks if the current request is from an authenticated, active admin.
 */
export async function requireAdmin(): Promise<AdminProfile> {
  const profile = await getCurrentAdminProfile();
  if (!profile) {
    throw new Error("Unauthorized: Admin access required");
  }
  return profile;
}
