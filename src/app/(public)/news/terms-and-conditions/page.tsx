import { Metadata } from "next";
import Link from "next/link";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { FileText, AlertTriangle, ExternalLink, ShieldCheck, Scale, Sparkles, Newspaper } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "News Portal Terms & Conditions — SuchnaSetu",
  description: "Official Terms and Conditions governing the use of SuchnaSetu News. Learn about editorial disclaimers, machine translation policies, copyright, and limitation of liability.",
  path: "/news/terms-and-conditions",
  canonicalPath: "/news/terms-and-conditions",
});

export default function NewsTermsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: "Terms & Conditions", url: "/news/terms-and-conditions" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#013089]">
              <Scale className="h-4 w-4 text-[#FE8D01]" />
              <span>SuchnaSetu Editorial & User Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              News Portal Terms & Conditions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Effective Date: August 28, 2026 • Last Updated: August 28, 2026
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
              These Terms and Conditions govern your access to and use of SuchnaSetu News (<Link href="/news" className="text-[#013089] font-semibold underline">suchnasetu.in/news</Link>). By browsing, reading, or sharing news articles on this platform, you agree to comply with and be bound by these Terms.
            </p>
          </div>

          {/* Section 1: Editorial Disclaimer & Purpose */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Newspaper className="h-5 w-5 text-[#013089]" />
              <h2>1. Editorial Mission & Public Information Disclaimer</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                SuchnaSetu News operates as an independent civic news and public intelligence gateway. We aggregate, synthesize, and summarize official government releases, press releases (e.g., Press Information Bureau, DD News), policy decisions, and verified national headlines.
              </p>
              <p>
                <strong>Informational Purpose:</strong> News reports and summaries are provided solely for general public awareness, civic literacy, and educational review. They do NOT constitute legal advice, administrative orders, or official policy enactments.
              </p>
            </div>
          </section>

          {/* Section 2: Machine Translations & AI Summaries */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Sparkles className="h-5 w-5 text-[#FE8D01]" />
              <h2>2. Machine Translations & AI Synthesis Disclaimer</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              SuchnaSetu incorporates algorithmic synthesis and automated translation tools (including Google Translate) to present news in English and Hindi:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li>Machine translations are provided as a convenience to facilitate broader linguistic access across India.</li>
              <li>While we strive to preserve facts, figures, and proper names accurately, automated translations may occasionally contain minor linguistic nuances or phrasing variations.</li>
              <li><strong>Authoritative Source:</strong> In the event of any discrepancies or interpretation differences, the original publication in its source language and the primary government circular shall remain the definitive reference.</li>
            </ul>
          </section>

          {/* Section 3: Copyright & Attribution */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h2>3. Copyright & Source Attribution</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              SuchnaSetu strictly respects the intellectual property rights of news publishers, government bureaus, and news desks:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li>Every news report includes clear source attribution naming the issuing authority or original reporting desk (e.g., PIB, DD News, The Hindu).</li>
              <li>Original full text and multimedia elements belong exclusively to their respective publishers. SuchnaSetu provides links to original source documents for complete context.</li>
              <li>The proprietary software code, curation architecture, and unique editorial summaries on SuchnaSetu remain the intellectual property of SuchnaSetu.</li>
            </ul>
          </section>

          {/* Section 4: External Hyperlinks */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <ExternalLink className="h-5 w-5 text-[#013089]" />
              <h2>4. External References and Third-Party Links</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              SuchnaSetu News links to external websites for attribution and verification. We do not endorse, manage, or guarantee the content, privacy standards, or availability of third-party domains.
            </p>
          </section>

          {/* Section 5: Limitation of Liability */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              <h2>5. Limitation of Liability</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              SuchnaSetu and its team shall not be held liable for any decisions made or actions taken based on news summaries published on this portal. Readers are encouraged to cross-reference important policy announcements with official ministry circulars or gazettes.
            </p>
          </section>

          {/* Section 6: Governing Law & Jurisdiction */}
          <section className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white font-heading">
              <Scale className="h-5 w-5 text-[#FE8D01]" />
              <h2>6. Governing Law & Jurisdiction</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of India. Any legal proceedings or disputes related to SuchnaSetu News shall fall under the exclusive jurisdiction of the courts in New Delhi, India.
            </p>
            <p className="text-sm text-slate-400 pt-2 border-t border-slate-800">
              For editorial queries or corrections: <a href="mailto:news-desk@suchnasetu.in" className="text-[#FE8D01] underline font-semibold">news-desk@suchnasetu.in</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
