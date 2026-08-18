import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const NEWS_PIPELINES = [
  {
    code: "pib_national_news",
    name: "Press Information Bureau (PIB) - National Civic & Policy Releases",
    description: "Official press communiques, union cabinet decisions, and government public notices from PIB India.",
    adapter_key: "pib_national_news_adapter",
    target_module: "bulletins",
    base_url: "https://pib.gov.in",
    sync_interval_minutes: 180,
    is_enabled: true,
  },
  {
    code: "employment_news_digest",
    name: "Employment News (Rozgar Samachar) Official Digest",
    description: "Weekly gazette summaries, consolidated vacancy circulars, and public sector employment communiques.",
    adapter_key: "employment_news_digest_adapter",
    target_module: "bulletins",
    base_url: "http://employmentnews.gov.in",
    sync_interval_minutes: 360,
    is_enabled: true,
  },
  {
    code: "education_ministry_news",
    name: "Ministry of Education & UGC Academic Advisories",
    description: "Higher education policies, university entrance advisories, curriculum reforms, and UGC notifications.",
    adapter_key: "education_ministry_news_adapter",
    target_module: "bulletins",
    base_url: "https://www.education.gov.in",
    sync_interval_minutes: 360,
    is_enabled: true,
  },
  {
    code: "exam_advisories_news",
    name: "Central & State Examination Boards Public Notices",
    description: "Exam date revisions, biometric authentication advisories, center changes, and court ruling digests.",
    adapter_key: "exam_advisories_news_adapter",
    target_module: "bulletins",
    base_url: "https://ssc.gov.in",
    sync_interval_minutes: 180,
    is_enabled: true,
  },
  {
    code: "govt_schemes_news",
    name: "Government Welfare Schemes & Direct Benefit Notifications",
    description: "National and state welfare flagship schemes, scholarship eligibility expansions, and portal launches.",
    adapter_key: "govt_schemes_news_adapter",
    target_module: "bulletins",
    base_url: "https://www.myscheme.gov.in",
    sync_interval_minutes: 360,
    is_enabled: true,
  },
  {
    code: "legal_court_bulletins",
    name: "Judicial Decisions & State Administrative Tribunal Advisories",
    description: "High Court & Supreme Court judgments impacting recruitment rules, age relaxations, and reservation policies.",
    adapter_key: "legal_court_bulletins_adapter",
    target_module: "bulletins",
    base_url: "https://main.sci.gov.in",
    sync_interval_minutes: 720,
    is_enabled: true,
  },
];

async function seedNewsSources() {
  console.log("Seeding News Ingestion Pipelines into import_sources...");

  // Fetch some organizations to attach
  const { data: orgs } = await supabase.from("organizations").select("id, slug");
  const orgMap = new Map((orgs || []).map((o) => [o.slug, o.id]));

  for (const pipe of NEWS_PIPELINES) {
    let orgId = null;
    if (pipe.code.includes("pib") || pipe.code.includes("employment")) {
      orgId = orgMap.get("upsc") || null;
    } else if (pipe.code.includes("exam")) {
      orgId = orgMap.get("ssc") || null;
    } else if (pipe.code.includes("education")) {
      orgId = orgMap.get("aiims-new-delhi") || null;
    }

    const row = {
      code: pipe.code,
      name: pipe.name,
      description: pipe.description,
      adapter_key: pipe.adapter_key,
      target_module: pipe.target_module,
      organization_id: orgId,
      base_url: pipe.base_url,
      sync_interval_minutes: pipe.sync_interval_minutes,
      is_enabled: pipe.is_enabled,
    };

    const { data: existing } = await supabase
      .from("import_sources")
      .select("id")
      .eq("code", pipe.code)
      .maybeSingle();

    if (existing) {
      await supabase.from("import_sources").update(row).eq("id", existing.id);
      console.log(`✅ Updated existing pipeline: [${pipe.code}] ${pipe.name}`);
    } else {
      const { error } = await supabase.from("import_sources").insert(row);
      if (error) {
        console.error(`❌ Failed to insert [${pipe.code}]:`, error);
      } else {
        console.log(`✅ Inserted new pipeline: [${pipe.code}] ${pipe.name}`);
      }
    }
  }

  // Seed verified public portals
  const OFFICIAL_PORTALS = [
    { name: "Press Information Bureau (PIB)", portal_type: "portal", base_url: "https://pib.gov.in", is_verified: true },
    { name: "Employment News (Rozgar Samachar)", portal_type: "portal", base_url: "http://employmentnews.gov.in", is_verified: true },
    { name: "Ministry of Education Portal", portal_type: "portal", base_url: "https://www.education.gov.in", is_verified: true },
    { name: "myScheme National Welfare Platform", portal_type: "portal", base_url: "https://www.myscheme.gov.in", is_verified: true },
  ];

  for (const portal of OFFICIAL_PORTALS) {
    const { data: exist } = await supabase.from("official_sources").select("id").eq("base_url", portal.base_url).maybeSingle();
    if (!exist) {
      await supabase.from("official_sources").insert(portal);
      console.log(`✅ Seeded official portal: ${portal.name}`);
    }
  }

  console.log("🎉 News pipelines & official portals seeded successfully!");
}

seedNewsSources().catch(console.error);
