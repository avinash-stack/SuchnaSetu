import fs from "fs";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Read environment variables
const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openRouterKey = env.OPENROUTER_API_KEY;
const aiModel = env.NEWS_AI_MODEL || "google/gemini-2.5-flash";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Canonical Sources Registry
const DEFAULT_NEWS_SOURCES = [
  {
    code: "google_news_india",
    name: "Google News India",
    website_url: "https://news.google.com",
    feed_url: "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
    source_type: "rss",
    default_category: "india",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 1,
    fetch_interval_minutes: 15,
    failure_count: 0,
  },
  {
    code: "dd_news",
    name: "DD News National",
    website_url: "https://ddnews.gov.in",
    feed_url: "https://ddnews.gov.in/rss-feeds",
    source_type: "rss",
    default_category: "india",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 1,
    fetch_interval_minutes: 30,
    failure_count: 0,
  },
  {
    code: "zee_news_india",
    name: "Zee News National",
    website_url: "https://zeenews.india.com",
    feed_url: "https://zeenews.india.com/rss/india-national-news.xml",
    source_type: "rss",
    default_category: "india",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 2,
    fetch_interval_minutes: 30,
    failure_count: 0,
  },
  {
    code: "abp_news",
    name: "ABP News",
    website_url: "https://news.abplive.com",
    feed_url: "https://news.abplive.com/home/feed",
    source_type: "rss",
    default_category: "india",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 2,
    fetch_interval_minutes: 30,
    failure_count: 0,
  },
  {
    code: "ndtv_india",
    name: "NDTV India News",
    website_url: "https://ndtv.com",
    feed_url: "https://feeds.feedburner.com/ndtvnews-india-news",
    source_type: "rss",
    default_category: "india",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 2,
    fetch_interval_minutes: 30,
    failure_count: 0,
  },
  {
    code: "the_hindu_national",
    name: "The Hindu National",
    website_url: "https://thehindu.com",
    feed_url: "https://www.thehindu.com/news/national/feeder/default.rss",
    source_type: "rss",
    default_category: "india",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 2,
    fetch_interval_minutes: 30,
    failure_count: 0,
  },
  {
    code: "indian_express_edu",
    name: "Indian Express Education",
    website_url: "https://indianexpress.com",
    feed_url: "https://indianexpress.com/section/education/feed/",
    source_type: "rss",
    default_category: "education",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 2,
    fetch_interval_minutes: 30,
    failure_count: 0,
  },
  {
    code: "times_tech",
    name: "ET Tech & Digital India",
    website_url: "https://economictimes.indiatimes.com",
    feed_url: "https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms",
    source_type: "rss",
    default_category: "technology",
    state_code: null,
    country: "IN",
    is_enabled: true,
    priority: 3,
    fetch_interval_minutes: 45,
    failure_count: 0,
  },
  {
    code: "pib_national",
    name: "Press Information Bureau (PIB)",
    website_url: "https://pib.gov.in",
    feed_url: "https://pib.gov.in/RssMain.aspx",
    source_type: "rss",
    default_category: "governance",
    state_code: null,
    country: "IN",
    is_enabled: false, // Disabled: current endpoint returns HTML portal page
    priority: 9,
    fetch_interval_minutes: 60,
    failure_count: 0,
  },
  {
    code: "aaj_tak",
    name: "Aaj Tak",
    website_url: "https://aajtak.in",
    feed_url: "https://aajtak.in/rssfeeds/latest-news.xml",
    source_type: "rss",
    default_category: "india",
    state_code: null,
    country: "IN",
    is_enabled: false, // Disabled: current endpoint returns 'Invalid Request'
    priority: 9,
    fetch_interval_minutes: 60,
    failure_count: 0,
  },
];

// Utility functions
function sanitizeHtml(rawHtml) {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, maxLength = 350) {
  if (!text) return "";
  const cleaned = sanitizeHtml(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

function generateSlug(title, dateStr) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const hash = crypto
    .createHash("md5")
    .update(title + (dateStr || ""))
    .digest("hex")
    .slice(0, 6);

  return `${base}-${hash}`;
}

function computeContentHash(title, text) {
  const clean = (title + text)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w]/g, "");
  return crypto.createHash("sha256").update(clean).digest("hex");
}

function parsePublicationDate(pubDateStr) {
  if (!pubDateStr) return new Date().toISOString();
  const trimmed = pubDateStr.trim();

  // 1. DD News format: "26-08-2026 | 11:14 pm" or "26-08-2026 23:14:00"
  const ddNewsMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})\s*\|\s*(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (ddNewsMatch) {
    const [, day, month, year, hoursStr, minutesStr, ampm] = ddNewsMatch;
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (ampm) {
      if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;
    }
    const pad = (n) => String(n).padStart(2, "0");
    const istDate = new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+05:30`);
    if (!isNaN(istDate.getTime())) {
      return istDate.toISOString();
    }
  }

  // 2. Standard ISO / RFC-2822 date parse
  const standardDate = new Date(trimmed);
  if (!isNaN(standardDate.getTime())) {
    return standardDate.toISOString();
  }

  return new Date().toISOString();
}

function parseXmlFeed(xml) {
  const items = [];
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 25) {
    const itemXml = match[1];

    const getTag = (tag) => {
      const tMatch = itemXml.match(new RegExp(`<(?:[a-zA-Z0-9_-]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z0-9_-]+:)?${tag}>`, "i"));
      if (!tMatch) return "";
      let val = tMatch[1].trim();
      if (val.startsWith("<![CDATA[") && val.endsWith("]]>")) {
        val = val.slice(9, -3).trim();
      }
      return val;
    };

    const getAttr = (tag, attr) => {
      const aMatch = itemXml.match(new RegExp(`<(?:[a-zA-Z0-9_-]+:)?${tag}[^>]*${attr}=["']([^"']+)["']`, "i"));
      return aMatch ? aMatch[1] : "";
    };

    const title = getTag("title");
    const link = getTag("link") || getAttr("link", "href");
    const pubDate = getTag("pubDate") || getTag("published") || getTag("updated") || getTag("date");
    const description = getTag("description") || getTag("summary");
    const content = getTag("encoded") || getTag("content") || description;
    const author = getTag("author") || getTag("creator");
    const enclosureUrl = getAttr("enclosure", "url");
    const mediaThumbnail = getAttr("thumbnail", "url");

    if (title && link) {
      items.push({
        title: sanitizeHtml(title),
        link: link.trim(),
        pubDate,
        summary: sanitizeHtml(description),
        content: sanitizeHtml(content),
        author: sanitizeHtml(author),
        imageUrl: enclosureUrl || mediaThumbnail || null,
      });
    }
  }

  return items;
}

async function syncSourcesRegistry() {
  console.log("Synchronizing news sources registry into database...");
  for (const src of DEFAULT_NEWS_SOURCES) {
    await supabase.from("news_sources").upsert(
      {
        code: src.code,
        name: src.name,
        website_url: src.website_url,
        feed_url: src.feed_url,
        source_type: src.source_type,
        default_category: src.default_category,
        state_code: src.state_code,
        is_enabled: src.is_enabled,
        priority: src.priority,
        fetch_interval_minutes: src.fetch_interval_minutes,
      },
      { onConflict: "code" }
    );
  }
}

async function processSource(source) {
  const startTime = Date.now();
  console.log(`\n▶ [SYNC] ${source.name} (${source.code}) | Feed: ${source.feed_url}`);

  let fetched = 0;
  let inserted = 0;
  let duplicates = 0;
  let failed = 0;
  let lastError = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(source.feed_url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SuchnaSetu-NewsBot/1.0 (+https://suchnasetu.in/about)",
        "Accept": "application/rss+xml, application/xml, text/xml, application/atom+xml, */*",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const xml = await res.text();
    const rawItems = parseXmlFeed(xml);
    fetched = rawItems.length;
    console.log(`   Fetched ${fetched} raw articles from XML feed.`);

    for (const raw of rawItems) {
      try {
        let cleanTitle = raw.title;
        let author = raw.author || source.name;

        // Clean Google News Aggregator Title ("Headline - Publisher")
        const lastDash = cleanTitle.lastIndexOf(" - ");
        if (lastDash > 10) {
          const potentialHeadline = cleanTitle.slice(0, lastDash).trim();
          const potentialPublisher = cleanTitle.slice(lastDash + 3).trim();
          if (potentialPublisher.length > 0 && potentialPublisher.length <= 45 && !/[.!?]$/.test(potentialPublisher)) {
            cleanTitle = potentialHeadline;
            if (!raw.author || raw.author === source.name) {
              author = potentialPublisher;
            }
          }
        }

        const summaryText = raw.summary || raw.content || cleanTitle;
        const cleanSummary = truncate(summaryText, 350);
        const publishedAt = parsePublicationDate(raw.pubDate);
        const contentHash = computeContentHash(cleanTitle, cleanSummary);
        const slug = generateSlug(cleanTitle, publishedAt);

        // Deduplication Check: safe check across content_hash, source_url, and slug
        let existingId = null;

        const { data: byHash } = await supabase
          .from("news_articles")
          .select("id")
          .eq("content_hash", contentHash)
          .limit(1)
          .maybeSingle();
        if (byHash?.id) existingId = byHash.id;

        if (!existingId && raw.link) {
          const { data: byUrl } = await supabase
            .from("news_articles")
            .select("id")
            .eq("source_url", raw.link)
            .limit(1)
            .maybeSingle();
          if (byUrl?.id) existingId = byUrl.id;
        }

        if (!existingId && slug) {
          const { data: bySlug } = await supabase
            .from("news_articles")
            .select("id")
            .eq("slug", slug)
            .limit(1)
            .maybeSingle();
          if (bySlug?.id) existingId = bySlug.id;
        }

        const articlePayload = {
          title: cleanTitle,
          summary: cleanSummary,
          content: raw.content ? truncate(raw.content, 1500) : null,
          source_id: source.id,
          source_name: source.name,
          source_url: raw.link,
          canonical_url: raw.link,
          author: author,
          image_url: raw.imageUrl,
          category_slug: source.default_category || "india",
          state_code: source.state_code || null,
          tags: [source.default_category || "India News"],
          importance: "standard",
          ai_status: "pending",
          content_hash: contentHash,
          published_at: publishedAt,
          is_published: true,
          updated_at: new Date().toISOString(),
        };

        if (existingId) {
          // Idempotent update
          await supabase.from("news_articles").update(articlePayload).eq("id", existingId);
          duplicates++;
          continue;
        }

        // Insert new article
        articlePayload.slug = slug;
        articlePayload.views_count = 0;

        const { error: insErr } = await supabase.from("news_articles").insert(articlePayload);

        if (insErr) {
          if (insErr.code === "23505" || insErr.message?.includes("news_articles_slug_key")) {
            await supabase.from("news_articles").update(articlePayload).eq("slug", slug);
            duplicates++;
          } else {
            console.warn(`   ⚠️ Insert error for "${cleanTitle.slice(0, 40)}":`, insErr.message);
            failed++;
          }
        } else {
          inserted++;
        }
      } catch (itemErr) {
        failed++;
      }
    }

    await supabase
      .from("news_sources")
      .update({
        last_synced_at: new Date().toISOString(),
        last_error: null,
        failure_count: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", source.id);

  } catch (err) {
    lastError = err.message;
    console.error(`   ❌ Source sync failed:`, lastError);

    await supabase
      .from("news_sources")
      .update({
        last_synced_at: new Date().toISOString(),
        last_error: lastError,
        failure_count: (source.failure_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", source.id);
  }

  const durationMs = Date.now() - startTime;
  const status = lastError && inserted === 0 ? "failed" : lastError ? "partial" : "success";

  await supabase.from("news_ingestion_logs").insert({
    source_id: source.id,
    status,
    fetched_count: fetched,
    inserted_count: inserted,
    duplicate_count: duplicates,
    error_message: lastError,
    duration_ms: durationMs,
  });

  console.log(`   Status: ${status} | Fetched: ${fetched} | Inserted: ${inserted} | Duplicates: ${duplicates} | Duration: ${durationMs}ms`);

  return {
    sourceCode: source.code,
    sourceName: source.name,
    status,
    fetched,
    inserted,
    duplicates,
    failed,
    lastError,
    durationMs,
  };
}

async function main() {
  console.log("=================================================");
  console.log("=== SuchnaSetu Production News Pipeline Sync ===");
  console.log("=================================================");

  // 1. Sync registry to DB
  await syncSourcesRegistry();

  // 2. Fetch enabled sources from DB
  const { data: sources, error } = await supabase
    .from("news_sources")
    .select("*")
    .eq("is_enabled", true)
    .order("priority", { ascending: true });

  if (error || !sources || sources.length === 0) {
    console.error("❌ No enabled news sources found:", error?.message);
    return;
  }

  console.log(`Found ${sources.length} enabled news sources to process.`);

  const results = [];
  for (const src of sources) {
    const res = await processSource(src);
    results.push(res);
  }

  // 3. Query newest article
  const { data: latestArticles } = await supabase
    .from("news_articles")
    .select("title, source_name, published_at")
    .order("published_at", { ascending: false })
    .limit(3);

  const successful = results.filter((r) => r.status === "success" || r.status === "partial").length;
  const failedSources = results.filter((r) => r.status === "failed").length;
  const totalFetched = results.reduce((acc, r) => acc + r.fetched, 0);
  const totalInserted = results.reduce((acc, r) => acc + r.inserted, 0);
  const totalDuplicates = results.reduce((acc, r) => acc + r.duplicates, 0);

  console.log("\n=================================================");
  console.log("=== NEWS PIPELINE EXECUTION SUMMARY ===");
  console.log("=================================================");
  console.log(`- Sources Attempted:     ${sources.length}`);
  console.log(`- Successful Sources:    ${successful}`);
  console.log(`- Failed Sources:        ${failedSources}`);
  console.log(`- Articles Fetched:      ${totalFetched}`);
  console.log(`- New Articles Inserted: ${totalInserted}`);
  console.log(`- Duplicates Skipped:    ${totalDuplicates}`);
  if (latestArticles && latestArticles.length > 0) {
    console.log(`- Newest Article Pub:    ${latestArticles[0].published_at} ("${latestArticles[0].title.slice(0, 60)}..." by ${latestArticles[0].source_name})`);
  }
  console.log("=================================================\n");
}

main().catch(console.error);
