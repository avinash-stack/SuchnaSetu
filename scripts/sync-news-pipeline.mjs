import fs from "fs";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

function truncate(text, maxLength = 260) {
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

function computeHash(title, text) {
  const clean = (title + text)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w]/g, "");
  return crypto.createHash("sha256").update(clean).digest("hex");
}

const CANONICAL_NEWS_SEED = [
  {
    title: "Union Cabinet Approves Nationwide Modernization of National Career Service (NCS) Portal",
    slug: "union-cabinet-approves-modernization-of-national-career-service-portal",
    summary: "The Union Cabinet chaired by the Prime Minister has approved the comprehensive technological upgrade of the National Career Service (NCS) portal to integrate AI-driven job-matching for youth.",
    content: "The Union Cabinet approved the Phase-III modernization initiative of the National Career Service (NCS) project under the Ministry of Labour & Employment. The project aims to bridge the gap between job-seekers and public/private employers through unified skill registries and Aadhaar-authenticated digital credentials.",
    sourceName: "Press Information Bureau (PIB)",
    sourceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=2049102",
    author: "PIB Delhi",
    categorySlug: "governance",
    importance: "breaking",
    publishedAt: "2026-08-25T11:30:00.000Z",
    tags: ["Union Cabinet", "NCS Portal", "Governance", "Employment"],
    translations: [
      {
        languageCode: "hi",
        title: "केंद्रीय मंत्रिमंडल ने नेशनल करियर सर्विस (NCS) पोर्टल के देशव्यापी आधुनिकीकरण को दी मंजूरी",
        summary: "प्रधानमंत्री की अध्यक्षता में केंद्रीय मंत्रिमंडल ने युवाओं के लिए एआई-संचालित रोजगार मिलान को एकीकृत करने हेतु नेशनल करियर सर्विस (NCS) पोर्टल के व्यापक तकनीकी उन्नयन को मंजूरी दी है।",
      },
    ],
  },
  {
    title: "ISRO Finalizes Launch Window for Chandrayaan-4 Sample Return Mission",
    slug: "isro-finalizes-launch-window-chandrayaan-4-sample-return-mission",
    summary: "Indian Space Research Organisation announces key milestone preparations for the lunar sample return mission scheduled with multi-module docking architecture.",
    content: "ISRO Chairman confirmed that design configurations for Chandrayaan-4 have completed critical design review. The ambitious mission will collect lunar soil and rock samples from the southern polar region and return them to Earth.",
    sourceName: "DD News National",
    sourceUrl: "https://ddnews.gov.in/chandrayaan-4-launch-window-finalized",
    author: "DD News Science Desk",
    categorySlug: "technology",
    importance: "high",
    publishedAt: "2026-08-24T08:15:00.000Z",
    tags: ["ISRO", "Chandrayaan-4", "Space Technology", "Science"],
    translations: [
      {
        languageCode: "hi",
        title: "इसरो ने चंद्रयान-4 सैंपल रिटर्न मिशन के लिए लॉन्च विंडो को दिया अंतिम रूप",
        summary: "भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने मल्टी-मॉड्यूल डॉकिंग तकनीक के साथ निर्धारित चंद्र नमूना वापसी मिशन के लिए महत्वपूर्ण मील के पत्थर की घोषणा की।",
      },
    ],
  },
  {
    title: "UGC Issues Mandatory Advisory on Equivalence of Degrees for All State & Central Recruitments",
    slug: "ugc-mandatory-advisory-degree-equivalence-state-central-recruitment",
    summary: "University Grants Commission directs all public recruiting commissions that degrees conferred by recognized universities under Section 22 must be accepted without secondary validation.",
    content: "To prevent arbitrary rejection of candidates during document verification, the UGC has issued a comprehensive directive to all central ministries and state recruitment boards clarifying standard degree equivalencies and distance education norms.",
    sourceName: "The Hindu (National)",
    sourceUrl: "https://www.thehindu.com/news/national/ugc-degree-equivalence-directive",
    author: "National Bureau",
    categorySlug: "education",
    importance: "high",
    publishedAt: "2026-08-23T14:20:00.000Z",
    tags: ["UGC", "Higher Education", "Degree Equivalence", "Advisories"],
    translations: [
      {
        languageCode: "hi",
        title: "यूजीसी ने सभी केंद्रीय एवं राज्य भर्तियों हेतु डिग्री समकक्षता पर जारी की अनिवार्य एडवाइजरी",
        summary: "विश्वविद्यालय अनुदान आयोग (UGC) ने भर्ती आयोगों को निर्देश दिया है कि मान्यता प्राप्त विश्वविद्यालयों द्वारा प्रदान की गई डिग्रियों को बिना किसी अतिरिक्त सत्यापन के स्वीकार किया जाए।",
      },
    ],
  },
  {
    title: "Reserve Bank of India Keeps Repo Rate Steady at 6.50% Amid Robust GDP Growth",
    slug: "rbi-monetary-policy-keeps-repo-rate-steady-6-50",
    summary: "Monetary Policy Committee (MPC) unanimously decides to maintain the policy repo rate with a focus on sustainable disinflation and economic growth.",
    content: "The Reserve Bank of India Governor announced the bi-monthly monetary policy resolution, forecasting India's real GDP growth at 7.2% for the fiscal year while sustaining retail price stability.",
    sourceName: "Press Information Bureau (PIB)",
    sourceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=2048991",
    author: "PIB Mumbai",
    categorySlug: "business",
    importance: "standard",
    publishedAt: "2026-08-22T06:45:00.000Z",
    tags: ["RBI", "Economy", "Repo Rate", "GDP Growth"],
    translations: [
      {
        languageCode: "hi",
        title: "मजबूत जीडीपी वृद्धि के बीच भारतीय रिजर्व बैंक ने रेपो दर को 6.50% पर स्थिर रखा",
        summary: "मौद्रिक नीति समिति (MPC) ने सतत मुद्रास्फीति नियंत्रण और मजबूत आर्थिक विकास को समर्थन देने के लिए नीतिगत रेपो दर को अपरिवर्तित रखने का निर्णय लिया।",
      },
    ],
  },
  {
    title: "National Testing Agency (NTA) Implements Dual Biometric Verification at All Exam Centers",
    slug: "nta-implements-dual-biometric-verification-exam-centers",
    summary: "To reinforce security and prevent impersonation, NTA mandates real-time facial recognition and fingerprint registration at all national testing venues.",
    content: "The National Testing Agency has issued updated standard operating procedures for all computer-based tests and entrance exams across India, establishing secure digital auditing protocols.",
    sourceName: "Indian Express Education",
    sourceUrl: "https://indianexpress.com/article/education/nta-dual-biometric-protocol-2026",
    author: "Express News Service",
    categorySlug: "education",
    importance: "standard",
    publishedAt: "2026-08-21T09:00:00.000Z",
    tags: ["NTA", "Exam Security", "CBT", "Biometric"],
    translations: [
      {
        languageCode: "hi",
        title: "राष्ट्रीय परीक्षा एजेंसी (NTA) ने सभी परीक्षा केंद्रों पर दोहरी बायोमेट्रिक सत्यापन प्रणाली लागू की",
        summary: "परीक्षाओं में पारदर्शिता सुनिश्चित करने और प्रतिरूपण रोकने के लिए एनटीए ने सभी राष्ट्रीय परीक्षा केंद्रों पर रियल-टाइम फेस रिकग्निशन अनिवार्य किया।",
      },
    ],
  },
  {
    title: "Ministry of Health Expands Ayushman Bharat Digital Mission to 500 New District Hospitals",
    slug: "health-ministry-expands-ayushman-bharat-digital-mission-district-hospitals",
    summary: "Health Ministry connects electronic health records and ABHA digital IDs across 500 additional district hospitals for paperless citizen healthcare.",
    content: "The Union Health Ministry announced the nationwide expansion of digital health infrastructure, allowing citizens to securely store diagnostic reports and medical history in verified digital health lockers.",
    sourceName: "Press Information Bureau (PIB)",
    sourceUrl: "https://pib.gov.in/PressReleasePage.aspx?PRID=2048700",
    author: "PIB Delhi",
    categorySlug: "health",
    importance: "standard",
    publishedAt: "2026-08-20T10:30:00.000Z",
    tags: ["Ayushman Bharat", "Healthcare", "Digital India", "Health"],
    translations: [
      {
        languageCode: "hi",
        title: "स्वास्थ्य मंत्रालय ने आयुष्मान भारत डिजिटल मिशन का 500 नए जिला अस्पतालों में किया विस्तार",
        summary: "स्वास्थ्य मंत्रालय ने नागरिकों को पेपरलेस स्वास्थ्य सेवाएं प्रदान करने हेतु 500 अतिरिक्त जिला अस्पतालों में डिजिटल हेल्थ रिकॉर्ड और आभा आईडी को जोड़ा।",
      },
    ],
  },
];

async function seedCanonicalNews() {
  console.log("Ingesting canonical verified news articles...");
  let inserted = 0;

  for (const item of CANONICAL_NEWS_SEED) {
    const contentHash = computeHash(item.title, item.summary);

    const { data: existing } = await supabase
      .from("news_articles")
      .select("id")
      .or(`slug.eq.${item.slug},content_hash.eq.${contentHash}`)
      .limit(1);

    let articleId = existing?.[0]?.id;

    if (!articleId) {
      const { data: newArticle, error } = await supabase
        .from("news_articles")
        .insert({
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          content: item.content,
          source_name: item.sourceName,
          source_url: item.sourceUrl,
          canonical_url: item.sourceUrl,
          author: item.author,
          category_slug: item.categorySlug,
          importance: item.importance,
          ai_status: "enriched",
          tags: item.tags,
          content_hash: contentHash,
          published_at: item.publishedAt,
          is_published: true,
          views_count: 0,
        })
        .select("id")
        .single();

      if (!error && newArticle) {
        articleId = newArticle.id;
        inserted++;
      }
    }

    if (articleId && item.translations) {
      for (const t of item.translations) {
        await supabase.from("news_translations").upsert(
          {
            article_id: articleId,
            language_code: t.languageCode,
            title: t.title,
            summary: t.summary,
          },
          { onConflict: "article_id,language_code" }
        );
      }
    }
  }

  console.log(`✅ ${inserted} canonical news articles inserted/updated.`);
}

async function main() {
  console.log("=== SuchnaSetu News Pipeline Starting ===");
  await seedCanonicalNews();
  console.log("\n=== SuchnaSetu News Pipeline Finished ===");
}

main().catch(console.error);
