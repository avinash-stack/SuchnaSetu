"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { PublicBulletinInput } from "./schemas";

export interface SaveBulletinPayload extends PublicBulletinInput {
  id?: string;
}

/**
 * Server Action: Create or Update a Public Bulletin with Audit Logging.
 */
export async function saveBulletinAction(payload: SaveBulletinPayload): Promise<{
  success: boolean;
  bulletinId?: string;
  error?: string;
}> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    let slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);
    if (!slug) {
      slug = `bulletin-${Date.now()}`;
    }

    const isUpdate = Boolean(payload.id);
    let bulletinId = payload.id;

    // Check slug uniqueness
    let slugCheckQuery = (supabase.from("public_bulletins") as any).select("id").eq("slug", slug);
    if (isUpdate && bulletinId) {
      slugCheckQuery = slugCheckQuery.neq("id", bulletinId);
    }
    const { data: existingSlug } = await slugCheckQuery;
    if (existingSlug && existingSlug.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const bulletinData: any = {
      title: payload.title,
      slug,
      category: payload.category,
      organization_id: payload.organizationId || null,
      related_job_id: payload.relatedJobId || null,
      summary: payload.summary,
      content: payload.content || null,
      source_url: payload.sourceUrl,
      source_name: payload.sourceName,
      is_breaking: payload.isBreaking,
      status: payload.status,
    };

    if (payload.status === "published" && !isUpdate) {
      bulletinData.published_at = new Date().toISOString();
    }

    if (isUpdate && bulletinId) {
      const { error: updateError } = await (supabase.from("public_bulletins") as any)
        .update(bulletinData)
        .eq("id", bulletinId);

      if (updateError) throw updateError;
    } else {
      const { data: newBulletin, error: insertError } = await (supabase.from("public_bulletins") as any)
        .insert(bulletinData)
        .select("id")
        .single();

      if (insertError) throw insertError;
      bulletinId = (newBulletin as any).id;
    }

    if (!bulletinId) throw new Error("Failed to resolve Bulletin ID");

    // Record Audit Log
    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: isUpdate ? "UPDATE_BULLETIN" : "CREATE_BULLETIN",
      entity_type: "public_bulletins",
      entity_id: bulletinId,
      metadata: {
        title: payload.title,
        category: payload.category,
        slug,
      },
    });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath(`/news/${slug}`);
    revalidatePath("/admin/bulletins");
    revalidatePath("/admin");

    return { success: true, bulletinId };
  } catch (error: any) {
    console.error("Save bulletin error:", error);
    return { success: false, error: error?.message || "Failed to save bulletin" };
  }
}

/**
 * Server Action: Toggle publication status of a bulletin.
 */
export async function toggleBulletinPublishAction(
  id: string,
  newStatus: "draft" | "published" | "archived"
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const updateData: any = { status: newStatus };
    if (newStatus === "published") {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await (supabase.from("public_bulletins") as any)
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: `SET_BULLETIN_STATUS_${newStatus.toUpperCase()}`,
      entity_type: "public_bulletins",
      entity_id: id,
    });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin/bulletins");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update status" };
  }
}

/**
 * Server Action: Delete a bulletin.
 */
export async function deleteBulletinAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    const { error } = await (supabase.from("public_bulletins") as any).delete().eq("id", id);
    if (error) throw error;

    await (supabase.from("audit_logs") as any).insert({
      admin_id: admin.id,
      action: "DELETE_BULLETIN",
      entity_type: "public_bulletins",
      entity_id: id,
    });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin/bulletins");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete bulletin" };
  }
}
