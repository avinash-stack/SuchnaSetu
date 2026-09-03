/**
 * SuchnaSetu Event Analytics Service
 * Safe client-side and server-side tracking wrapper for GA4 and custom telemetry.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export type SearchEventParams = {
  query?: string;
  module?: "jobs" | "exams" | "all" | "bulletins";
  results_count?: number;
  ai_used?: boolean;
  filter_state?: string;
  filter_qualification?: string;
  execution_time_ms?: number;
  fallback_reason?: string;
};

export type ClickEventParams = {
  item_id?: string;
  item_slug?: string;
  item_title?: string;
  item_type?: "job" | "exam" | "bulletin" | "syllabus" | "admit_card" | "result";
  organization?: string;
  url?: string;
  source?: string;
};

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GA_ID ||
  "G-GPENK8HFEH";

/**
 * Safely dispatches a Google Analytics 4 event
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        ...params,
        send_to: GA_MEASUREMENT_ID,
      });
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  } catch (err) {
    // Non-blocking telemetry silence
    console.debug("[Analytics Event Dispatch Error]", err);
  }
}

/**
 * Dispatches a formal GA4 page_view event on Next.js client-side navigation.
 * Crucial for multi-page session tracking, real bounce rate, and user movement.
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== "undefined" ? document.title : ""),
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
}

/**
 * Tracks when a user moves from one module to another (News -> Job, Job -> Exam, etc.)
 */
export function trackInternalNavigation(
  fromPage: string,
  toPage: string,
  itemType: "job" | "exam" | "news" | "bulletin",
  itemTitle?: string
) {
  trackEvent("internal_navigation", {
    from_page: fromPage,
    to_page: toPage,
    item_type: itemType,
    item_title: itemTitle || "",
  });
}

/**
 * Tracks scroll depth on reading pages (25%, 50%, 75%, 100%)
 */
export function trackScrollDepth(depthPercent: number, pagePath: string) {
  trackEvent("scroll_depth", {
    depth_percent: depthPercent,
    page_path: pagePath,
  });
}

// 1. Search Started
export function trackSearchStarted(query: string, module: "jobs" | "exams" | "all" = "all") {
  trackEvent("search_started", {
    search_term: query,
    search_module: module,
  });
}

// 2. Search Completed
export function trackSearchCompleted(params: SearchEventParams) {
  trackEvent("search_completed", {
    search_term: params.query || "",
    search_module: params.module || "all",
    results_count: params.results_count ?? 0,
    ai_used: Boolean(params.ai_used),
    filter_state: params.filter_state || null,
    filter_qualification: params.filter_qualification || null,
    execution_time_ms: params.execution_time_ms ?? 0,
  });
}

// 3. AI Search Used
export function trackAiSearchUsed(query: string, model: string, structuredFilters: Record<string, any>) {
  trackEvent("ai_search_used", {
    search_term: query,
    ai_model: model,
    detected_state: structuredFilters.state || null,
    detected_qualification: structuredFilters.qualification || null,
    detected_salary_min: structuredFilters.salary_min || null,
  });
}

// 4. AI Search Fallback
export function trackAiSearchFallback(query: string, reason: string) {
  trackEvent("ai_search_fallback", {
    search_term: query,
    fallback_reason: reason,
  });
}

// 5. Job Result Clicked
export function trackJobResultClicked(params: ClickEventParams) {
  trackEvent("job_result_clicked", {
    item_id: params.item_id,
    item_slug: params.item_slug,
    item_name: params.item_title,
    organization: params.organization,
    source: params.source || "search",
  });
}

// 6. Exam Result Clicked
export function trackExamResultClicked(params: ClickEventParams) {
  trackEvent("exam_result_clicked", {
    item_id: params.item_id,
    item_slug: params.item_slug,
    item_name: params.item_title,
    organization: params.organization,
    source: params.source || "search",
  });
}

// 7. Apply Clicked
export function trackApplyClicked(itemTitle: string, orgName: string, destinationUrl: string) {
  trackEvent("apply_clicked", {
    item_name: itemTitle,
    organization: orgName,
    destination_url: destinationUrl,
  });
}

// 8. Notification PDF Clicked
export function trackNotificationClicked(itemTitle: string, orgName: string, docUrl: string) {
  trackEvent("notification_clicked", {
    item_name: itemTitle,
    organization: orgName,
    document_url: docUrl,
  });
}

// 9. Syllabus Clicked
export function trackSyllabusClicked(itemTitle: string, orgName: string) {
  trackEvent("syllabus_clicked", {
    item_name: itemTitle,
    organization: orgName,
  });
}

// 10. Answer Key Clicked
export function trackAnswerKeyClicked(itemTitle: string, orgName: string) {
  trackEvent("answer_key_clicked", {
    item_name: itemTitle,
    organization: orgName,
  });
}
