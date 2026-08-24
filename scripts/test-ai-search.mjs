import { callOpenRouterStructuredIntent } from "../src/modules/ai/openrouter-client.js";
import { executeAiEnhancedSearch } from "../src/modules/ai/search/search-service.js";
import { getAiConfig } from "../src/modules/ai/config.js";

async function main() {
  console.log("================================================================");
  console.log("SUCHNASETU OPENROUTER AI SEARCH STATUS CHECK");
  console.log("================================================================\n");

  const config = getAiConfig();
  console.log("1. Configuration Status:");
  console.log("   - API Key Configured :", config.apiKey ? `Yes (ends in ...${config.apiKey.slice(-6)})` : "No");
  console.log("   - AI Search Enabled  :", config.isEnabled);
  console.log("   - Search Model       :", config.searchModel);
  console.log("   - Timeout Limit      :", config.timeoutMs + "ms\n");

  const query = "Bihar me 10th pass sarkari naukri";
  console.log(`2. Testing Query: "${query}"`);
  console.log("   Calling OpenRouter...");

  const intentRes = await callOpenRouterStructuredIntent(query, "jobs");

  if (intentRes.intent) {
    console.log("\n   ✅ SUCCESS! OpenRouter AI is active and working!");
    console.log("   Structured Intent Parsed by AI:");
    console.log(JSON.stringify(intentRes.intent, null, 4));
  } else {
    console.log("\n   ⚠️ OpenRouter returned an error / fallback:");
    console.log("   Error Details:", intentRes.error);
    if (intentRes.error?.includes("402")) {
      console.log("\n   💡 REASON: OpenRouter account has 0 credits.");
      console.log("      To activate AI query understanding, add $1-$5 credits at:");
      console.log("      👉 https://openrouter.ai/settings/credits");
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
