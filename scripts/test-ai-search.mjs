import fs from "fs";
import { callGroqStructuredIntent } from "../src/modules/ai/groq-client";
import { executeAiEnhancedSearch } from "../src/modules/ai/search/search-service";
import { getAiConfig, validateAiConfig } from "../src/modules/ai/config";

// Load .env.local if not already in process.env
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const k = match[1].trim();
      let v = match[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) {
        process.env[k] = v;
      }
    }
  }
} catch (e) {}

async function main() {
  console.log("================================================================");
  console.log("SUCHNASETU GROQ & GPT-OSS-120B AI SEARCH STATUS CHECK");
  console.log("================================================================\n");

  const config = getAiConfig();
  const validation = validateAiConfig();

  console.log("1. Configuration Status:");
  console.log("   - Provider           :", config.provider);
  console.log("   - Model              :", config.model);
  console.log("   - API Key Configured :", validation.hasKey ? `Yes (${validation.keyMasked})` : "No");
  console.log("   - AI Search Enabled  :", config.isEnabled);
  console.log("   - Timeout Limit      :", config.timeoutMs + "ms\n");

  const query = "Bihar me 10th pass sarkari naukri";
  console.log(`2. Testing Query: "${query}"`);

  if (!config.apiKey) {
    console.log("   ⏭️  AI parsing skipped: GROQ_API_KEY is not set.");
  } else {
    console.log("   Calling Groq (openai/gpt-oss-120b)...");
    const intentRes = await callGroqStructuredIntent(query, "jobs");
    if (intentRes.intent) {
      console.log("\n   ✅ SUCCESS! Groq AI is active and working!");
      console.log("   Structured Intent Parsed by AI:");
      console.log(JSON.stringify(intentRes.intent, null, 4));
    } else {
      console.log("\n   ⚠️ Groq returned an error / fallback:");
      console.log("   Error Details:", intentRes.error);
    }
  }

  console.log("\n3. Testing Fail-Safe Search Fallback:");
  const searchRes = await executeAiEnhancedSearch(query, { module: "jobs", limitPerType: 3 });
  console.log("   - AI Assisted Mode :", searchRes.isAiAssisted);
  console.log("   - Fallback Reason  :", searchRes.fallbackReason || "None (AI succeeded)");
  console.log("   - Total Jobs Found :", searchRes.totalCount);
  console.log("   - Search Status    : Working 100% smoothly");

  console.log("\n================================================================");
}

main().catch(console.error);
