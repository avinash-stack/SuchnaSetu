import { getAiConfig } from "./config";
import { StructuredSearchIntent } from "./search/types";

const SEARCH_INTENT_JSON_SCHEMA = {
  name: "search_intent",
  strict: true,
  schema: {
    type: "object",
    properties: {
      module: {
        type: "string",
        enum: ["jobs", "exams", "all", "bulletins"],
        description: "Target module based on user query",
      },
      query: {
        type: ["string", "null"],
        description: "Specific cleaned search keywords or null if purely filter-based",
      },
      state: {
        type: ["string", "null"],
        description: "Target Indian state name or abbreviation if specified (e.g. Bihar, UP, Rajasthan, Maharashtra)",
      },
      state_code: {
        type: ["string", "null"],
        description: "Two-letter state code if known (e.g. BR, UP, RJ, MH, DL, MP, WB)",
      },
      qualification: {
        type: ["array", "null"],
        items: { type: "string" },
        description: "Educational qualifications mentioned (e.g. 10th, 12th, Graduate, BTech, Diploma, Post Graduate, B.Ed, ITI)",
      },
      category: {
        type: ["string", "null"],
        description: "Sector/Category (e.g. Police, Defence, Banking, Teaching, Railway, Engineering, Medical, Administrative)",
      },
      employment_type: {
        type: ["string", "null"],
        enum: ["permanent", "contract", "deputation", "apprenticeship", null],
        description: "Job employment type",
      },
      status: {
        type: ["string", "null"],
        enum: ["active", "all", "upcoming", "closing_soon", "concluded", null],
        description: "Recruitment/exam status",
      },
      application_open: {
        type: ["boolean", "null"],
        description: "True if user asked for open/currently applying notices",
      },
      gender: {
        type: ["string", "null"],
        enum: ["female", "male", "all", null],
        description: "Gender specific requirements if mentioned (e.g. women, female)",
      },
      salary_min: {
        type: ["number", "null"],
        description: "Minimum monthly numeric salary requested (e.g. 50000)",
      },
      salary_max: {
        type: ["number", "null"],
        description: "Maximum monthly salary",
      },
      deadline_before: {
        type: ["string", "null"],
        description: "ISO date or relative deadline if mentioned (e.g. closing this month)",
      },
      sort: {
        type: "string",
        enum: ["relevance", "latest", "deadline", "salary"],
        description: "Sorting preference",
      },
    },
    required: [
      "module",
      "query",
      "state",
      "state_code",
      "qualification",
      "category",
      "employment_type",
      "status",
      "application_open",
      "gender",
      "salary_min",
      "salary_max",
      "deadline_before",
      "sort",
    ],
    additionalProperties: false,
  },
};

/**
 * OpenRouter Client for Intent Parsing with Structured Outputs
 */
export async function callOpenRouterStructuredIntent(
  userQuery: string,
  targetModule: "jobs" | "exams" | "all" | "bulletins" = "all"
): Promise<{ intent: StructuredSearchIntent | null; error?: string }> {
  const config = getAiConfig();

  if (!config.isEnabled || !config.apiKey) {
    return { intent: null, error: "AI_SEARCH_DISABLED" };
  }

  const prompt = `Extract Indian recruitment search intent from: "${userQuery}"
Context: ${targetModule}

Output ONLY a single raw JSON object matching:
{
  "module": "${targetModule === "all" ? "all" : targetModule}",
  "query": null,
  "state": null,
  "state_code": null,
  "qualification": null,
  "application_open": true,
  "gender": null,
  "salary_min": null,
  "salary_max": null
}

Examples:
- "Bihar me 10th pass sarkari naukri" -> {"module": "jobs", "query": null, "state": "Bihar", "state_code": "BR", "qualification": ["10th"], "application_open": true, "gender": null, "salary_min": null, "salary_max": null}
- "UP Police SI salary above 50000" -> {"module": "jobs", "query": "Police SI", "state": "Uttar Pradesh", "state_code": "UP", "qualification": null, "application_open": true, "gender": null, "salary_min": 50000, "salary_max": null}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.apiKey}`,
        "HTTP-Referer": "https://suchnasetu.in",
        "X-Title": "SuchnaSetu AI Search",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.searchModel,
        messages: [
          {
            role: "system",
            content: "You are a search intent extraction engine. Respond with a valid JSON object ONLY. Never include markdown backticks or conversational prose.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: config.searchModel.includes(":free")
          ? { type: "json_object" }
          : {
              type: "json_schema",
              json_schema: SEARCH_INTENT_JSON_SCHEMA,
            },
        temperature: 0.1,
        max_tokens: 400,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.warn(`[OpenRouter API Error ${response.status}]:`, errText);
      return { intent: null, error: `OPENROUTER_HTTP_${response.status}` };
    }

    const data = await response.json();
    const message = data?.choices?.[0]?.message;
    const rawContent = `${message?.content || ""} ${message?.reasoning || ""}`.trim();

    if (!rawContent) {
      return { intent: null, error: "EMPTY_COMPLETION" };
    }

    const firstBrace = rawContent.indexOf("{");
    if (firstBrace === -1) {
      return { intent: null, error: "NO_JSON_OBJECT" };
    }

    let depth = 0;
    let endIdx = -1;
    for (let i = firstBrace; i < rawContent.length; i++) {
      if (rawContent[i] === "{") depth++;
      else if (rawContent[i] === "}") {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }

    const candidate = endIdx !== -1 ? rawContent.slice(firstBrace, endIdx + 1) : rawContent.slice(firstBrace);
    let parsed: any;
    try {
      parsed = JSON.parse(candidate);
    } catch {
      const sanitized = candidate
        .replace(/'/g, '"')
        .replace(/\bTrue\b/g, "true")
        .replace(/\bFalse\b/g, "false")
        .replace(/\bNone\b/g, "null");
      parsed = JSON.parse(sanitized);
    }

    return { intent: parsed as StructuredSearchIntent };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === "AbortError";
    console.warn(`[OpenRouter Intent Parsing Failed: ${isTimeout ? "Timeout" : err.message}]`);
    return { intent: null, error: isTimeout ? "TIMEOUT" : err.message || "UNKNOWN_ERROR" };
  }
}
