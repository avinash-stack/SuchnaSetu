import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Provider-independent AI Image Generation service for News Articles.
 * Generates editorial, high-quality, story-specific imagery and persists it to the database.
 * Serves optimized 16:9 images directly from edge CDNs or Supabase Storage, bypassing Vercel Image Optimization.
 */
export class NewsImageGenerator {
  /**
   * Generates a context-specific editorial image prompt from article metadata.
   */
  static buildImagePrompt(article: {
    title: string;
    summary?: string | null;
    category_slug?: string | null;
    tags?: string[] | null;
  }): string {
    // 1. Extract core nouns and subjects from title
    let cleanTitle = article.title
      .replace(/^(breaking|exclusive|update|alert|watch|just in)[:\s-]*/i, "")
      .replace(/[|–-].*$/, "") // Remove publisher suffixes
      .replace(/[^\w\s,]/g, "")
      .trim();

    const category = (article.category_slug || "national").toLowerCase();

    // 2. Category contextual enhancements
    let contextHint = "editorial news photojournalism";
    if (category === "technology" || category === "science") {
      contextHint = "high-tech research scientific photography, detailed engineering";
    } else if (category === "governance" || category === "politics") {
      contextHint = "official Indian government administrative conference, diplomatic setting";
    } else if (category === "business" || category === "economy") {
      contextHint = "Indian financial district, corporate economic infrastructure";
    } else if (category === "education") {
      contextHint = "Indian university campus academic institution, students and faculty";
    } else if (category === "sports") {
      contextHint = "professional sports arena stadium, athletic action photography";
    }

    // 3. Build focused prompt
    const prompt = `${cleanTitle}, ${contextHint}, cinematic realistic lighting, sharp focus, 8k resolution, documentary photography, no text overlays, no watermarks`;
    return prompt.slice(0, 300);
  }

  /**
   * Attempts to upload the generated image buffer to Supabase Storage for direct origin delivery.
   * Falls back gracefully to the direct provider URL if storage bucket is not configured or fails.
   */
  private static async tryPersistToStorage(
    sourceUrl: string,
    slugOrId: string
  ): Promise<string | null> {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return null;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const res = await fetch(sourceUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) return null;

      const buffer = await res.arrayBuffer();
      const cleanSlug = slugOrId.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 80);
      const fileName = `${cleanSlug}.jpg`;
      const supabase = createAdminClient();

      const { data, error } = await supabase.storage
        .from("news-images")
        .upload(fileName, buffer, {
          contentType: "image/jpeg",
          cacheControl: "31536000",
          upsert: true,
        });

      if (error || !data) {
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);

      return publicUrlData?.publicUrl || null;
    } catch {
      // Storage upload failure should NEVER disrupt image display
      return null;
    }
  }

  /**
   * Generates or retrieves a persistent AI image URL for a news article.
   * Ensures the image is generated once and stored in an optimized 16:9 format.
   */
  static async getOrGenerateArticleImage(article: {
    id: string;
    slug?: string;
    title: string;
    summary?: string | null;
    category_slug?: string | null;
    tags?: string[] | null;
    image_url?: string | null;
  }): Promise<string | null> {
    // 1. If article already has an image, return it immediately
    if (article.image_url && article.image_url.trim().length > 10) {
      return article.image_url;
    }

    try {
      // 2. Build deterministic seed from article ID / slug
      const seedSource = article.id || article.slug || article.title;
      let seed = 42;
      for (let i = 0; i < seedSource.length; i++) {
        seed = (seed << 5) - seed + seedSource.charCodeAt(i);
        seed |= 0;
      }
      const positiveSeed = Math.abs(seed);

      // 3. Generate image URL via provider (Pollinations FLUX / Turbo) in pre-optimized 960x540 (16:9)
      const prompt = this.buildImagePrompt(article);
      const encodedPrompt = encodeURIComponent(prompt);

      // Check if custom provider endpoint configured
      const customApi = process.env.IMAGE_GEN_API_URL;
      let generatedImageUrl: string;

      if (customApi) {
        generatedImageUrl = `${customApi}?prompt=${encodedPrompt}&seed=${positiveSeed}&width=960&height=540`;
      } else {
        generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=960&height=540&model=flux&nologo=true&seed=${positiveSeed}`;
      }

      let finalImageUrl = generatedImageUrl;

      // 4. Optionally persist to Supabase Storage if configured and available
      const storageUrl = await this.tryPersistToStorage(generatedImageUrl, article.slug || article.id);
      if (storageUrl) {
        finalImageUrl = storageUrl;
      }

      // 5. Update database asynchronously so subsequent views use stored URL
      if (article.id) {
        try {
          const supabase = createAdminClient();
          await (supabase as any)
            .from("news_articles")
            .update({
              image_url: finalImageUrl,
              updated_at: new Date().toISOString(),
            })
            .eq("id", article.id);
        } catch {
          // Continue gracefully
        }
      }

      return finalImageUrl;
    } catch {
      // If image generation fails, return null so the article still renders perfectly
      return null;
    }
  }
}
