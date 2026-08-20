import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://imxhzknmlepvvimorfmn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteGh6a25tbGVwdnZpbW9yZm1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjQ2NTQwOSwiZXhwIjoyMTAyMDQxNDA5fQ.nf2JLNrVboWO4DwgCgnlreCTYnlbM3P7kUGiL-_CPko";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("--- 1. INSPECTING import_sources ---");
  const { data: importSources, error: isError } = await supabase
    .from("import_sources")
    .select("*, organizations(name, slug, acronym)")
    .order("name", { ascending: true });

  if (isError) {
    console.error("Error fetching import_sources:", isError);
  } else {
    console.log(`Total import_sources: ${importSources.length}`);
    
    // Group by organization_id + target_module
    const orgModuleMap = new Map();
    for (const s of importSources) {
      const key = `${s.organization_id || "no_org"}|${s.target_module}`;
      if (!orgModuleMap.has(key)) orgModuleMap.set(key, []);
      orgModuleMap.get(key).push(s);
    }
    
    console.log("\n--- Duplicate import_sources by (organization_id, target_module): ---");
    let duplicateImportCount = 0;
    for (const [key, list] of orgModuleMap.entries()) {
      if (list.length > 1) {
        duplicateImportCount++;
        console.log(`\nGroup [${key}] (${list.length} records):`);
        for (const s of list) {
          console.log(`  - id: ${s.id} | code: ${s.code} | name: "${s.name}" | org: ${s.organizations?.name} (${s.organizations?.slug}) | adapter: ${s.adapter_key} | base_url: ${s.base_url}`);
        }
      }
    }
    if (duplicateImportCount === 0) {
      console.log("No duplicate (organization_id, target_module) found in import_sources.");
    }

    // Group by code
    const codeMap = new Map();
    for (const s of importSources) {
      if (!codeMap.has(s.code)) codeMap.set(s.code, []);
      codeMap.get(s.code).push(s);
    }
    console.log("\n--- Duplicate import_sources by code: ---");
    let duplicateCodeCount = 0;
    for (const [code, list] of codeMap.entries()) {
      if (list.length > 1) {
        duplicateCodeCount++;
        console.log(`Code [${code}] has ${list.length} records`);
      }
    }
    if (duplicateCodeCount === 0) {
      console.log("No duplicate codes in import_sources.");
    }
  }

  console.log("\n--- 2. INSPECTING official_sources ---");
  const { data: officialSources, error: osError } = await supabase
    .from("official_sources")
    .select("*, organizations(name, slug, acronym)")
    .order("name", { ascending: true });

  if (osError) {
    console.error("Error fetching official_sources:", osError);
  } else {
    console.log(`Total official_sources: ${officialSources.length}`);
    
    // Group by normalized base_url
    const urlMap = new Map();
    for (const s of officialSources) {
      const normalizedUrl = (s.base_url || "").trim().toLowerCase().replace(/\/+$/, "");
      if (!urlMap.has(normalizedUrl)) urlMap.set(normalizedUrl, []);
      urlMap.get(normalizedUrl).push(s);
    }

    console.log("\n--- Duplicate official_sources by base_url: ---");
    let duplicateUrlCount = 0;
    for (const [url, list] of urlMap.entries()) {
      if (list.length > 1) {
        duplicateUrlCount++;
        console.log(`\nURL [${url}] (${list.length} records):`);
        for (const s of list) {
          console.log(`  - id: ${s.id} | name: "${s.name}" | org: ${s.organizations?.name} (${s.organizations?.slug}) | portal_type: ${s.portal_type} | created_at: ${s.created_at}`);
        }
      }
    }

    // Group by organization_id
    const orgMap = new Map();
    for (const s of officialSources) {
      const orgId = s.organization_id || "no_org";
      if (!orgMap.has(orgId)) orgMap.set(orgId, []);
      orgMap.get(orgId).push(s);
    }

    console.log("\n--- Duplicate official_sources by organization_id: ---");
    for (const [orgId, list] of orgMap.entries()) {
      if (list.length > 1 && orgId !== "no_org") {
        console.log(`\nOrg [${orgId}] (${list[0].organizations?.name}) (${list.length} records):`);
        for (const s of list) {
          console.log(`  - id: ${s.id} | name: "${s.name}" | url: ${s.base_url}`);
        }
      }
    }
  }

  // Check sync jobs related to import_sources
  console.log("\n--- 3. INSPECTING import_jobs ---");
  const { data: jobs, error: jError } = await supabase
    .from("import_jobs")
    .select("id, source_id, status, created_at");

  if (jError) {
    console.error("Error fetching import_jobs:", jError);
  } else {
    console.log(`Total import_jobs: ${jobs.length}`);
    const jobsBySource = new Map();
    for (const j of jobs) {
      jobsBySource.set(j.source_id, (jobsBySource.get(j.source_id) || 0) + 1);
    }
    console.log(`Sources with jobs: ${jobsBySource.size}`);
  }
}

main().catch(console.error);
