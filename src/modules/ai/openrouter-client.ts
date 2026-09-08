/**
 * @deprecated OpenRouter client has been replaced by Groq for GPT-OSS-120B.
 * This file forwards all requests to groq-client for backward compatibility.
 */

export {
  SEARCH_INTENT_JSON_SCHEMA,
  callGroqStructuredIntent,
  callOpenRouterStructuredIntent,
} from "./groq-client";
