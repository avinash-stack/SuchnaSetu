import fs from "fs";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["\x27]|["\x27]$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function sanitizeHtml(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#8217;/gi, "'")
    .replace(/&#8216;/gi, "'")
    .replace(/&#8220;/gi, '"')
    .replace(/&#8221;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function parseXml(xml) {
  const items = [];
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
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

    const title = getTag("title");
    const link = getTag("link") || getTag("guid");
    const pubDate = getTag("pubDate") || getTag("published") || getTag("updated");
    const description = getTag("description") || getTag("summary");
    const content = getTag("encoded") || getTag("content") || description;

    if (title && link) {
      items.push({
        title: sanitizeHtml(title),
        link: link.trim(),
        pubDate,
        summary: sanitizeHtml(description),
        content: sanitizeHtml(content),
      });
    }
  }
  return items;
}

function parseArticleTextFromHtml(html) {
  if (!html || html.length < 250) return null;

  const clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
    .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const pMatches = [...clean.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];

  const boilerplateKeywords = [
    "subscribe to our",
    "subscription",
    "download our app",
    "follow us on",
    "all rights reserved",
    "terms of service",
    "privacy policy",
    "click here to read",
    "advertisement",
    "also read",
    "read more:",
    "sign in to continue",
    "copyright ©",
    "unlock these with",
    "express photo by",
    "whatsapp channel",
    "epaper",
    "today’s paper",
    "premium stories",
    "the view from india",
  ];

  const paragraphs = [];

  for (const match of pMatches) {
    const rawText = sanitizeHtml(match[1]);
    if (rawText.length < 45) continue;

    const lower = rawText.toLowerCase();
    const isBoilerplate = boilerplateKeywords.some((kw) => lower.includes(kw));
    if (!isBoilerplate) {
      paragraphs.push(rawText);
    }
  }

  if (paragraphs.length >= 2) {
    return paragraphs.slice(0, 12).join("\n\n");
  }
  return null;
}

async function extractFullContent(targetUrl) {
  if (!targetUrl || !targetUrl.startsWith("http")) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 SuchnaSetu-Reader/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const html = await res.text();
    return parseArticleTextFromHtml(html);
  } catch {
    return null;
  }
}

async function enrichWithAi(title, rawText) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are a factual, objective news editor for SuchnaSetu. Process this authentic news report and output a structured editorial report along with taxonomy metadata:

Title: ${title}
Raw Story Text:
${rawText.slice(0, 3500)}

Strict Editorial Directives:
1. "summary": A crisp 2-sentence factual executive summary of what happened.
2. "content": Write a thorough, multi-paragraph factual news article (at least 3-4 distinct paragraphs separated by double newlines \\n\\n) based strictly on the provided real news text:
   - Paragraph 1: The core announcement or event, key individuals/authorities involved, and primary context.
   - Paragraph 2: Specific figures, numbers, dates, locations, quotes, and operational decisions mentioned in the story.
   - Paragraph 3: Background context, affected citizens/stakeholders, and procedural details.
   - DO NOT invent or hallucinate any facts.
   - DO NOT generate generic template filler or repetitive platitudes.
   - DO NOT repeat the headline as the body.
   - Preserve all specific names, dates, numbers, and locations from the source text.
3. "category_slug": Must be exactly one of: india, states, education, governance, business, technology, politics, world, health, sports, entertainment.
4. "tags": 3 to 5 relevant topic tags.

Respond with a single raw JSON object matching:
{
  "summary": "Crisp 2-sentence factual summary",
  "content": "Paragraph 1\\n\\nParagraph 2\\n\\nParagraph 3",
  "category_slug": "india",
  "tags": ["Tag1", "Tag2"]
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    return null;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70);
}

function computeHash(title, summary) {
  return crypto.createHash("sha256").update(`${title.trim()}|${summary.trim()}`).digest("hex");
}

async function runPipeline() {
  console.log("================================================================================");
  console.log("             TESTING GLOBAL NEWS CONTENT PIPELINE ACROSS SOURCES                ");
  console.log("================================================================================\n");

  const sources = [
    {
      name: "The Indian Express National",
      feedUrl: "https://indianexpress.com/section/india/feed/",
      category: "india",
      stateCode: null,
    },
    {
      name: "Indian Express Education",
      feedUrl: "https://indianexpress.com/section/education/feed/",
      category: "education",
      stateCode: null,
    },
    {
      name: "Indian Express UP Bureau (Lucknow)",
      feedUrl: "https://indianexpress.com/section/cities/lucknow/feed/",
      category: "states",
      stateCode: "UP",
    },
    {
      name: "The Hindu State News",
      feedUrl: "https://www.thehindu.com/news/states/feeder/default.rss",
      category: "states",
      stateCode: null,
    },
  ];

  const ingestedSlugs = [];

  for (const src of sources) {
    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`[SOURCE]: ${src.name}`);
    console.log(`Fetching RSS feed: ${src.feedUrl}`);

    const res = await fetch(src.feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const xml = await res.text();
    const items = parseXml(xml);
    console.log(`Found ${items.length} feed items. Ingesting first item...`);

    if (items.length === 0) continue;

    const item = items[0];
    console.log(`  • Title: "${item.title}"`);
    console.log(`  • Source URL: ${item.link}`);

    console.log(`  Extracting full authentic article content from source page...`);
    const extracted = await extractFullContent(item.link);

    if (extracted) {
      console.log(`  ✓ Successfully extracted ${extracted.length} chars (${extracted.split("\n\n").length} paragraphs)`);
      console.log(`  Sample extracted opening: "${extracted.slice(0, 150)}..."`);
    } else {
      console.log(`  ⚠ Extraction returned null, falling back to summary/content in RSS item`);
    }

    const rawToProcess = extracted || item.content || item.summary || item.title;

    console.log(`  Processing with AI News Intelligence...`);
    const aiResult = await enrichWithAi(item.title, rawToProcess);

    let finalSummary = item.summary;
    let finalContent = extracted || rawToProcess;

    if (aiResult) {
      console.log(`  ✓ AI Enrichment Success:`);
      console.log(`    - Summary (${aiResult.summary.length} chars): "${aiResult.summary}"`);
      console.log(`    - Content (${aiResult.content.length} chars, ${aiResult.content.split("\n\n").length} paras)`);
      console.log(`    - Paras preview:`);
      aiResult.content.split("\n\n").forEach((p, idx) => console.log(`      [P${idx+1}]: ${p.slice(0, 120)}...`));
      finalSummary = aiResult.summary;
      finalContent = aiResult.content;
    }

    const slug = `${slugify(item.title)}-${Math.random().toString(36).substring(2, 8)}`;
    const contentHash = computeHash(item.title, finalSummary);
    const imageSeed = Math.floor(Math.random() * 9000) + 100;
    const prompt = encodeURIComponent(`${item.title}, photojournalism, realistic news photo, 8k`);
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=675&model=flux&nologo=true&seed=${imageSeed}`;

    const { data: inserted, error: insertErr } = await supabase
      .from("news_articles")
      .insert({
        slug,
        title: item.title,
        summary: finalSummary,
        content: finalContent,
        source_name: src.name,
        source_url: item.link,
        canonical_url: item.link,
        author: src.name,
        image_url: imageUrl,
        category_slug: aiResult?.category_slug || src.category,
        state_code: src.stateCode,
        importance: "high",
        ai_status: aiResult ? "enriched" : "skipped",
        content_hash: contentHash,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        is_published: true,
      })
      .select("id, slug")
      .single();

    if (insertErr) {
      console.error(`  ✗ DB Insert Error:`, insertErr.message);
    } else {
      console.log(`  ✓ Saved to DB with ID: ${inserted.id} (slug: ${inserted.slug})`);
      ingestedSlugs.push(inserted.slug);
    }
  }

  console.log("\n================================================================================");
  console.log(`PIPELINE TEST AND INGESTION COMPLETED! Ingested slugs:`, ingestedSlugs);
  console.log("================================================================================");
  return ingestedSlugs;
}

runPipeline().catch(console.error);
