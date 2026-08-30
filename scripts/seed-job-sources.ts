import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { GOV_JOB_SOURCES_CONFIG } from "../src/modules/ingestion/adapters/sources.config";

// Read environment variables
const envContent = fs.readFileSync(".env.local", "utf-8");
const env: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedJobSources() {
  console.log("================================================================================");
  console.log(`SEEDING & SYNCHRONIZING ${GOV_JOB_SOURCES_CONFIG.length} JOB SOURCES IN SUPABASE`);
  console.log("================================================================================");

  // 1. Preload all existing organizations and import_sources
  const { data: existingOrgs, error: orgsErr } = await supabase
    .from("organizations")
    .select("id, slug, name");

  if (orgsErr) {
    console.error("Failed to load organizations:", orgsErr.message);
    return;
  }

  const { data: existingSources, error: srcErr } = await supabase
    .from("import_sources")
    .select("id, code");

  if (srcErr) {
    console.error("Failed to load import_sources:", srcErr.message);
    return;
  }

  const orgMap = new Map<string, string>(); // slug or lower name -> id
  (existingOrgs || []).forEach((o) => {
    if (o.slug) orgMap.set(o.slug, o.id);
    if (o.name) orgMap.set(o.name.toLowerCase(), o.id);
  });

  const sourceMap = new Map<string, string>(); // code -> id
  (existingSources || []).forEach((s) => {
    if (s.code) sourceMap.set(s.code, s.id);
  });

  console.log(`Preloaded ${existingOrgs?.length || 0} organizations and ${existingSources?.length || 0} import_sources.`);

  let orgsCreated = 0;
  let sourcesCreated = 0;
  let sourcesUpdated = 0;

  for (const src of GOV_JOB_SOURCES_CONFIG) {
    // Check if organization exists
    let orgId = orgMap.get(src.organizationSlug) || orgMap.get(src.organizationName.toLowerCase());

    if (!orgId) {
      const dbJurisdiction =
        src.jurisdiction === "defence" || src.jurisdiction === "central_police"
          ? "central"
          : src.jurisdiction;

      const orgPayload = {
        name: src.organizationName,
        slug: src.organizationSlug,
        type: src.jurisdiction === "psu" ? "psu" : src.jurisdiction === "defence" ? "defence" : "commission",
        jurisdiction: dbJurisdiction,
        state_code: src.stateCode || (src.jurisdiction === "central" || dbJurisdiction === "central" ? "DL" : null),
        website_url: src.baseUrl,
        is_active: true,
      };

      const { data: newOrg, error: insertOrgErr } = await supabase
        .from("organizations")
        .insert(orgPayload)
        .select("id")
        .single();

      if (insertOrgErr) {
        console.error(`[ORG INSERT ERROR] ${src.organizationSlug}:`, insertOrgErr.message);
        continue;
      }

      orgId = newOrg.id as string;
      if (orgId) {
        orgMap.set(src.organizationSlug, orgId);
        orgMap.set(src.organizationName.toLowerCase(), orgId);
      }
      orgsCreated++;
    }

    // Upsert import_source
    const sourcePayload = {
      code: src.key,
      name: src.name,
      description: `Official automated extraction pipeline for ${src.organizationName} recruitment notifications from ${src.baseUrl}.`,
      adapter_key: src.key,
      target_module: "jobs",
      organization_id: orgId,
      base_url: src.baseUrl,
      config: {
        recruitmentPath: src.recruitmentPath,
        applyUrl: src.applyUrl,
        organizationSlug: src.organizationSlug,
        organizationName: src.organizationName,
        jurisdiction: src.jurisdiction,
        stateCode: src.stateCode,
        defaultCategory: src.defaultCategory,
      },
      is_enabled: true,
      sync_interval_minutes: 360,
    };

    const existingSourceId = sourceMap.get(src.key);

    if (existingSourceId) {
      const { error: updateSrcErr } = await supabase
        .from("import_sources")
        .update({
          name: src.name,
          adapter_key: src.key,
          organization_id: orgId,
          base_url: src.baseUrl,
          config: sourcePayload.config,
          is_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSourceId);

      if (updateSrcErr) {
        console.error(`[SOURCE UPDATE ERROR] ${src.key}:`, updateSrcErr.message);
      } else {
        sourcesUpdated++;
      }
    } else {
      const { data: newSrc, error: insertSrcErr } = await supabase
        .from("import_sources")
        .insert(sourcePayload)
        .select("id")
        .single();

      if (insertSrcErr) {
        console.error(`[SOURCE INSERT ERROR] ${src.key}:`, insertSrcErr.message);
      } else {
        sourcesCreated++;
        if (newSrc) sourceMap.set(src.key, newSrc.id);
        console.log(`+ Added: [${src.key}] ${src.name}`);
      }
    }
  }

  console.log("\n================================================================================");
  console.log(`SEEDING COMPLETE SUMMARY:`);
  console.log(`Organizations Created: ${orgsCreated}`);
  console.log(`Import Sources Created: ${sourcesCreated}`);
  console.log(`Import Sources Updated: ${sourcesUpdated}`);
  console.log(`Total Active Job Sources in Registry: ${GOV_JOB_SOURCES_CONFIG.length}`);
  console.log("================================================================================");
}

seedJobSources().catch(console.error);
