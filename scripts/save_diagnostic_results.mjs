import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = "https://imxhzknmlepvvimorfmn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlteGh6a25tbGVwdnZpbW9yZm1uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjQ2NTQwOSwiZXhwIjoyMTAyMDQxNDA5fQ.nf2JLNrVboWO4DwgCgnlreCTYnlbM3P7kUGiL-_CPko";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: importSources } = await supabase
    .from("import_sources")
    .select("*, organizations(name, slug, acronym)")
    .order("name", { ascending: true });

  const { data: officialSources } = await supabase
    .from("official_sources")
    .select("*, organizations(name, slug, acronym)")
    .order("name", { ascending: true });

  const { data: importJobs } = await supabase
    .from("import_jobs")
    .select("id, source_id, status, created_at");

  // Analyze import_sources duplicates
  const importOrgModuleMap = {};
  for (const s of importSources || []) {
    const key = `${s.organization_id || "no_org"}|${s.target_module}`;
    if (!importOrgModuleMap[key]) importOrgModuleMap[key] = [];
    importOrgModuleMap[key].push({
      id: s.id,
      code: s.code,
      name: s.name,
      org: s.organizations?.name,
      slug: s.organizations?.slug,
      adapter_key: s.adapter_key,
      target_module: s.target_module,
      base_url: s.base_url,
      is_enabled: s.is_enabled
    });
  }

  const duplicateImportGroups = Object.entries(importOrgModuleMap)
    .filter(([_, list]) => list.length > 1)
    .map(([key, list]) => ({ key, count: list.length, records: list }));

  // Analyze official_sources duplicates by normalized base_url
  const officialUrlMap = {};
  for (const s of officialSources || []) {
    const normUrl = (s.base_url || "").trim().toLowerCase().replace(/\/+$/, "");
    if (!officialUrlMap[normUrl]) officialUrlMap[normUrl] = [];
    officialUrlMap[normUrl].push({
      id: s.id,
      name: s.name,
      org: s.organizations?.name,
      slug: s.organizations?.slug,
      portal_type: s.portal_type,
      base_url: s.base_url,
      created_at: s.created_at
    });
  }

  const duplicateOfficialGroups = Object.entries(officialUrlMap)
    .filter(([_, list]) => list.length > 1)
    .map(([url, list]) => ({ url, count: list.length, records: list }));

  const results = {
    importSourcesCount: importSources?.length || 0,
    duplicateImportGroups,
    officialSourcesCount: officialSources?.length || 0,
    duplicateOfficialGroupsCount: duplicateOfficialGroups.length,
    duplicateOfficialGroups,
    importJobsCount: importJobs?.length || 0
  };

  fs.writeFileSync(
    "/Users/copious/.gemini/antigravity-ide/brain/bf6ed8fe-f734-465e-a406-f4b673c4e8d3/scratch/diagnostic_results.json",
    JSON.stringify(results, null, 2)
  );

  console.log("Wrote diagnostic results successfully!");
}

main().catch(console.error);
