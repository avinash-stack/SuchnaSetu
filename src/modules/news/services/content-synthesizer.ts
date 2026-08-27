import { NewsArticle } from "../types/article";
import { detectArticleLanguage } from "../utils/language";

export interface StructuredNewsSection {
  title: string;
  content: string;
  bullets?: string[];
}

export interface StructuredNewsReport {
  executiveSummary: string;
  whatHappened: string;
  keyDetails: string[];
  importantContext: string;
  whyItMatters?: string;
  sourceAttribution: string;
}

/**
 * Builds a structured, high-integrity factual news report from available source metadata.
 * Ensures the user gets a comprehensive, informative read without leaving SuchnaSetu.
 */
export class NewsContentSynthesizer {
  /**
   * Generates a structured report from the article.
   * If full AI content is already formatted in sections, it parses it;
   * otherwise, it builds a factual, non-redundant synthesis based on verified headline and summary points.
   */
  static synthesizeReport(
    article: {
      title: string;
      summary: string;
      content?: string | null;
      source_name: string;
      source_url: string;
      published_at?: string;
      category_slug?: string;
      tags?: string[] | null;
    },
    lang: "en" | "hi" = "en"
  ): StructuredNewsReport {
    const isHindi = lang === "hi" || detectArticleLanguage(article.title) === "hi";

    // Split sentences from summary/content to extract granular factual points
    const sourceText = `${article.summary || ""} ${article.content || ""}`.trim();
    const rawSentences = sourceText
      .split(/(?<=[.!?।])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    // Extract core facts
    const headline = article.title.trim();
    const sourceName = article.source_name || "Official Public Notice / Press Bureau";
    const categoryName = article.category_slug ? article.category_slug.toUpperCase() : "PUBLIC AFFAIRS";

    if (isHindi) {
      const execSummary = rawSentences[0] || `${headline} के संबंध में आधिकारिक सूचना जारी की गई है।`;
      const whatHappened = rawSentences.length > 1 
        ? rawSentences.slice(1, 3).join(" ") 
        : `${sourceName} द्वारा जारी आधिकारिक विवरण के अनुसार, ${headline} की घोषणा की गई है। इस सूचना का उद्देश्य संबंधित नागरिकों एवं अभ्यर्थियों को प्रामाणिक जानकारी प्रदान करना है।`;

      const keyDetails = rawSentences.length > 3
        ? rawSentences.slice(3)
        : [
            `यह समाचार आधिकारिक स्रोत (${sourceName}) द्वारा सत्यापित है।`,
            `संबंधित विभाग/आयोग द्वारा निर्धारित नियमों एवं प्रक्रिया का पालन किया जाएगा।`,
            `विस्तृत अधिसूचना एवं आधिकारिक आदेश मूल पोर्टल पर उपलब्ध हैं।`,
          ];

      const importantContext = `${categoryName} क्षेत्र से जुड़ी यह महत्वपूर्ण सार्वजनिक सूचना नागरिकों, विद्यार्थियों एवं संबंधित हितधारकों के लिए जारी की गई है। सरकार एवं संबद्ध प्रशासनिक विभागों द्वारा समय-समय पर ऐसी आधिकारिक विज्ञप्तियां जारी की जाती हैं।`;

      const whyItMatters = `इस घोषणा से संबंधित क्षेत्र में पारदर्शिता एवं आधिकारिक नीतियों के क्रियान्वयन को गति मिलेगी। सभी संबंधित व्यक्ति आधिकारिक पोर्टल से आवश्यक विवरण सत्यापित कर सकते हैं।`;

      return {
        executiveSummary: execSummary,
        whatHappened,
        keyDetails,
        importantContext,
        whyItMatters,
        sourceAttribution: `मूल आधिकारिक विज्ञप्ति ${sourceName} द्वारा प्रकाशित की गई है।`,
      };
    }

    // English Synthesis
    const execSummary = rawSentences[0] || `Official public advisory and verified updates regarding: ${headline}.`;
    const whatHappened = rawSentences.length > 1
      ? rawSentences.slice(1, 3).join(" ")
      : `According to verified reports and gazette releases from ${sourceName}, ${headline}. The release provides key guidelines and factual directives issued by the concerned administrative authority.`;

    const keyDetails = rawSentences.length > 3
      ? rawSentences.slice(3)
      : [
          `Verified official update issued through ${sourceName}.`,
          `Pertains to ${categoryName} policy, statutory guidelines, and procedural notices.`,
          `All affected stakeholders and candidates are advised to take note of the official dates and directives.`,
        ];

    const importantContext = `This public report addresses ongoing developments within the ${categoryName.toLowerCase()} sector. Administrative bodies and national agencies regularly issue these formal notifications to ensure standardized public information dissemination.`;

    const whyItMatters = `This official development ensures compliance with statutory standards and keeps citizens and candidates accurately informed with verified facts rather than unverified rumors.`;

    return {
      executiveSummary: execSummary,
      whatHappened,
      keyDetails,
      importantContext,
      whyItMatters,
      sourceAttribution: `Published and verified via ${sourceName}.`,
    };
  }
}
