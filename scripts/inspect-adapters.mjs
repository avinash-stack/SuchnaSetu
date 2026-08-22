import { createAdminClient } from "../src/lib/supabase/admin.js";
import { SourceAdapterRegistry } from "../src/modules/ingestion/core/registry.js";

async function inspectAdapters() {
  const supabase = createAdminClient();
  const { data: sources, error } = await supabase.from("import_sources")
    .select("id, name, code, adapter_key, target_module, is_enabled")
    .order("name");

  if (error) {
    console.error("Error fetching sources:", error);
    return;
  }

  const registered = SourceAdapterRegistry.listAdapters();
  console.log(`Total DB Sources: ${sources.length}`);
  console.log(`Total Registered Adapters in Code: ${registered.length}`);

  const activeSources = sources.filter((s) => s.is_enabled);
  console.log(`Active DB Sources: ${activeSources.length}`);

  console.log("\n--- Checking Active Sources against Adapter Registry ---");
  const missing = [];
  for (const s of activeSources) {
    const adapter = SourceAdapterRegistry.getAdapter(s.adapter_key);
    if (!adapter) {
      console.log(`❌ MISSING: source="${s.name}" (code: ${s.code}) -> adapter_key="${s.adapter_key}"`);
      missing.push({ source: s, adapter_key: s.adapter_key });
    }
  }

  console.log(`\nTotal Missing Adapters for Active Sources: ${missing.length}`);
  missing.forEach(m => console.log(` - Source: ${m.source.code} | AdapterKey: ${m.adapter_key} | Name: ${m.source.name}`));

  console.log("\n--- Let's list all registered adapter keys in Code ---");
  const regKeys = registered.map(r => r.key).sort();
  console.log("Registered keys count:", regKeys.length);
  // Look for partial matches for the 5 failing keys
  const failingKeys = ["defence_exams_feed", "wb_exams_feed", "uk_exams_feed", "up_exams_feed", "sbi_exams_feed"];
  for (const fk of failingKeys) {
    const matches = regKeys.filter(k => k.includes(fk.replace("_feed", "").replace("_exams", "")) || fk.includes(k));
    console.log(`Lookup '${fk}': matching registered keys in code ->`, matches);
  }
}

inspectAdapters().catch(console.error);
