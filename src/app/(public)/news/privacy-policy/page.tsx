import { Metadata } from "next";
import Link from "next/link";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { ShieldCheck, Cookie, Eye, Lock, Globe, Mail, HelpCircle } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "News Portal Privacy Policy — SuchnaSetu",
  description: "Official Privacy Policy for SuchnaSetu News. Learn how we handle cookies, readership analytics, Google AdSense advertising, and news data privacy.",
  path: "/news/privacy-policy",
  canonicalPath: "/news/privacy-policy",
  manifest: "/news/manifest.webmanifest",
});

export default function NewsPrivacyPolicyPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: "Privacy Policy", url: "/news/privacy-policy" },
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
              <ShieldCheck className="h-4 w-4 text-[#FE8D01]" />
              <span>SuchnaSetu News & Public Intelligence Legal Desk</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              News Portal Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Effective Date: August 28, 2026 • Last Updated: August 28, 2026
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
              SuchnaSetu News (<Link href="/news" className="text-[#013089] font-semibold underline">suchnasetu.in/news</Link>) delivers verified public information, national policy circulars, state developments, and education updates. This Privacy Policy details how data is managed when you browse our news reports and public summaries.
            </p>
          </div>

          {/* Section 1: Readership & Technical Data */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Eye className="h-5 w-5 text-[#013089]" />
              <h2>1. Information We Collect from Readers</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              We respect your reading privacy. Access to SuchnaSetu News does not require creating an account or providing personally identifiable information (PII).
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li><strong>Browsing Data & Category Preferences:</strong> Anonymous tracking of read articles, visited news categories (Governance, Education, Technology, States), and search queries to curate trending national updates.</li>
              <li><strong>Device & Network Information:</strong> Browser type, device category (mobile/desktop), operating system, IP address, and HTTP referrer for DDoS protection and content delivery optimization.</li>
              <li><strong>Reading Preferences:</strong> Preferred language (English or Hindi), page display density, and saved stories stored locally in your browser.</li>
            </ul>
          </section>

          {/* Section 2: Cookies & Web Analytics */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Cookie className="h-5 w-5 text-[#FE8D01]" />
              <h2>2. Cookies and Analytical Tools</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              We deploy privacy-conscious cookies and web analytics tools to ensure fast page loads and monitor reader engagement:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li><strong>Session Cookies:</strong> Temporarily retain active pagination filters (20, 50, 100 items per page) and translation state across page transitions.</li>
              <li><strong>Aggregated Analytics:</strong> We analyze overall readership trends (e.g., peak reading hours during major cabinet announcements) to scale cloud infrastructure. Analytics data is completely anonymized.</li>
            </ul>
          </section>

          {/* Section 3: Google AdSense & Advertising Policy */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Lock className="h-5 w-5 text-emerald-600" />
              <h2>3. Google AdSense & Advertising Disclosures</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              SuchnaSetu News is supported through digital advertisements, including those served by Google AdSense:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li>Google uses cookies (such as DoubleClick) to deliver ads tailored to users based on prior visits to our news desk and other sites across the web.</li>
              <li>You may opt out of personalized ad targeting via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#013089] underline font-semibold">Google Ad Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#013089] underline font-semibold">aboutads.info</a>.</li>
              <li>Advertisements are clearly demarcated from news editorial content. Advertisers have no influence over our public reporting, summaries, or categorization.</li>
            </ul>
          </section>

          {/* Section 4: News Sources & Outbound References */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Globe className="h-5 w-5 text-[#013089]" />
              <h2>4. News Source Syndication & Outbound References</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Our articles provide attribution and direct references to official sources (PIB, DD News, Government Portals, and established news desks). Clicking these reference links navigates you away from SuchnaSetu to external domains governed by their own independent privacy practices.
            </p>
          </section>

          {/* Section 5: Data Rights under DPDP Act 2023 */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <h2>5. Your Privacy Rights (DPDP Act 2023)</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Under India&apos;s Digital Personal Data Protection Act 2023:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li>You have the right to clear local browser cookies and translation caches at any time.</li>
              <li>You may contact our editorial and privacy compliance desk to request corrections or voice concerns regarding privacy standards.</li>
            </ul>
          </section>

          {/* Section 6: Editorial & Grievance Contact */}
          <section className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white font-heading">
              <Mail className="h-5 w-5 text-[#FE8D01]" />
              <h2>6. Contact & Grievance Redressal</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              For inquiries regarding news privacy, data practices, or editorial corrections:
            </p>
            <div className="space-y-1 text-sm text-slate-300">
              <p><strong>Editorial & Privacy Desk:</strong> SuchnaSetu News Portal</p>
              <p><strong>Email:</strong> <a href="mailto:news-desk@suchnasetu.in" className="text-[#FE8D01] underline font-semibold">news-desk@suchnasetu.in</a> / <a href="mailto:privacy@suchnasetu.in" className="text-[#FE8D01] underline font-semibold">privacy@suchnasetu.in</a></p>
              <p><strong>Website:</strong> <a href="https://suchnasetu.in/news" className="text-slate-300 underline">https://suchnasetu.in/news</a></p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
