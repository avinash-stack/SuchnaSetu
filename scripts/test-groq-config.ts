import fs from "fs";
import { getAiConfig, validateAiConfig } from "../src/modules/ai/config";
import { callGroqStructuredIntent, SEARCH_INTENT_JSON_SCHEMA } from "../src/modules/ai/groq-client";

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
} catch (e) {
  // .env.local might not exist or already loaded
}

async function runGroqAudit() {
  console.log("================================================================");
  console.log("SUCHNASETU GROQ & GPT-OSS-120B CONFIGURATION AUDIT");
  console.log("================================================================\n");

  const config = getAiConfig();
  const validation = validateAiConfig();

  console.log("1. Configuration Status:");
  console.log("   - Provider           :", config.provider);
  console.log("   - Target Model       :", config.model);
  console.log("   - API Endpoint       :", config.endpoint);
  console.log("   - Timeout            :", config.timeoutMs + "ms");
  console.log("   - API Key Configured :", validation.hasKey ? `Yes (${validation.keyMasked})` : "NO (Empty)");
  console.log("   - AI Feature Enabled :", config.isEnabled ? "YES" : "NO");

  if (validation.warnings.length > 0) {
    console.log("\n   ⚠️  Config Warnings:");
    for (const w of validation.warnings) {
      console.log("      -", w);
    }
  }

  if (validation.errors.length > 0) {
    console.log("\n   ❌ Config Errors:");
    for (const err of validation.errors) {
      console.log("      -", err);
    }
  }

  console.log("\n2. Minimal API Request Test (Ping / Pong):");
  if (!config.apiKey) {
    console.log("   ⏭️  SKIPPED: GROQ_API_KEY is not configured in .env.local.");
    console.log("       Please add your Groq key: GROQ_API_KEY=\"gsk_...\" in .env.local to run live tests.\n");
    return;
  }

  const pingStart = Date.now();
  try {
    const res = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "SuchnaSetu-Audit-Script/1.0",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "user", content: "Reply with the exact single word: PONG" }
        ],
        max_completion_tokens: 100,
        temperature: 0.1,
      }),
    });

    const pingLatency = Date.now() - pingStart;
    console.log(`   - HTTP Status        : ${res.status} ${res.statusText} (${pingLatency}ms)`);

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.log("   ❌ Minimal Request Failed:");
      console.log("      ", errBody);
      return;
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "";
    console.log(`   - Model Response     : "${reply}"`);
    console.log("   ✅ Minimal API test passed successfully!");
  } catch (err: any) {
    console.log("   ❌ Network or Fetch Error during minimal test:", err?.message || err);
    return;
  }

  console.log("\n3. Structured JSON Schema Output Test (Recruitment Intent):");
  const testQuery = "Bihar me 10th pass sarkari naukri";
  console.log(`   - Testing Query      : "${testQuery}"`);
  const intentStart = Date.now();
  try {
    const res = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "SuchnaSetu-Audit-Script/1.0",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: "You are a recruitment search intent extraction engine. Respond with a valid JSON object ONLY.",
          },
          {
            role: "user",
            content: `Extract Indian recruitment search intent from: "${testQuery}". Context: jobs`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: SEARCH_INTENT_JSON_SCHEMA,
        },
        temperature: 0.1,
        max_completion_tokens: 1500,
      }),
    });

    const intentLatency = Date.now() - intentStart;
    console.log(`   - HTTP Status        : ${res.status} ${res.statusText} (${intentLatency}ms)`);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.log("   ❌ Structured Output Test Failed:", errText);
      return;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim() || "";
    console.log("   - Raw Output         :", content);

    const parsed = JSON.parse(content);
    console.log("   - Parsed State Code  :", parsed.state_code);
    console.log("   - Qualifications     :", parsed.qualification);
    console.log("   - Module             :", parsed.module);
    console.log("   ✅ Structured JSON Schema output verified successfully!");
  } catch (err: any) {
    console.log("   ❌ Structured output test error:", err?.message || err);
  }

  console.log("\n================================================================");
}

runGroqAudit().catch(console.error);
