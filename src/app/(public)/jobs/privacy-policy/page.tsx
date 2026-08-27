import { Metadata } from "next";
import Link from "next/link";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { ShieldCheck, Lock, Cookie, Eye, ExternalLink, HelpCircle, Mail } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Jobs Portal Privacy Policy — SuchnaSetu",
  description: "Official Privacy Policy for the SuchnaSetu Recruitment & Government Jobs portal. Learn how we handle cookies, analytics, advertising, and user data.",
  path: "/jobs/privacy-policy",
  canonicalPath: "/jobs/privacy-policy",
});

export default function JobsPrivacyPolicyPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Jobs", url: "/jobs" },
    { name: "Privacy Policy", url: "/jobs/privacy-policy" },
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
              <span>SuchnaSetu Legal & Data Governance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Jobs Portal Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Effective Date: August 28, 2026 • Last Updated: August 28, 2026
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
              SuchnaSetu (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is an open, independent civic information gateway providing structured public access to Government of India recruitments, exams, and official circulars. This Privacy Policy governs your use of the SuchnaSetu Jobs Portal (<Link href="/jobs" className="text-[#013089] font-semibold underline">suchnasetu.in/jobs</Link>).
            </p>
          </div>

          {/* Section 1: Data Collection */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Eye className="h-5 w-5 text-[#013089]" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              SuchnaSetu is built on the principle of minimal data collection. We do NOT require user account creation or registration to browse public job notifications.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li><strong>Search & Filter Preferences:</strong> Queries submitted in search bars, state filters, qualification selections, and category tags to present relevant recruitment listings.</li>
              <li><strong>Technical Log Data:</strong> Internet Protocol (IP) addresses, browser type, operating system, referring URLs, timestamps, and page interaction duration for security and site reliability.</li>
              <li><strong>Local Storage Data:</strong> Saved job bookmarks and language preferences stored locally in your web browser.</li>
            </ul>
            <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-4 text-xs sm:text-sm text-slate-700">
              <strong>Important:</strong> SuchnaSetu never collects candidate resumes, banking details, passwords, or government identity documents (Aadhaar, PAN). All official job applications occur exclusively on authorized government commission servers.
            </div>
          </section>

          {/* Section 2: Cookies & Local Storage */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Cookie className="h-5 w-5 text-[#FE8D01]" />
              <h2>2. Cookies and Tracking Technologies</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              We use cookies, web beacons, and browser local storage to maintain interface preferences and measure platform usage:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li><strong>Essential Functional Cookies:</strong> To remember your selected language (English or Hindi), pagination limits (20, 50, 100), and view mode (Card or List view).</li>
              <li><strong>Performance & Analytics Cookies:</strong> Aggregated measurement of visitor volume and high-demand job categories to optimize server capacity during peak exam announcement days.</li>
              <li><strong>Managing Cookies:</strong> You can choose to disable or block cookies through your browser settings without losing access to basic job notification summaries.</li>
            </ul>
          </section>

          {/* Section 3: Google AdSense & Advertising */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Lock className="h-5 w-5 text-emerald-600" />
              <h2>3. Google AdSense & Third-Party Advertising</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              To support the free operation of this civic portal, SuchnaSetu may display advertisements served by Google AdSense and authorized third-party ad networks.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li>Google uses cookies (including the DoubleClick DART cookie) to serve ads to users based on their visits to SuchnaSetu and other websites across the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#013089] underline font-semibold">Google Ads Settings</a> or the <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#013089] underline font-semibold">Digital Advertising Alliance</a>.</li>
              <li>Third-party ad servers may use technology that automatically receives your IP address when ad units load on your screen. SuchnaSetu has no control over these third-party cookies.</li>
            </ul>
          </section>

          {/* Section 4: Third-Party Government Services */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <ExternalLink className="h-5 w-5 text-[#013089]" />
              <h2>4. Third-Party Official Commission Links</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Job detail pages contain outbound hyperlinks directing candidates to official government portals (e.g., UPSC, SSC, NTA, State PSCs, Railway Recruitment Boards). Once you navigate to an external government or commission website, their respective privacy policies and terms of service apply. We encourage candidates to review the privacy statements of every destination site.
            </p>
          </section>

          {/* Section 5: Data Protection & User Rights */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
              <h2>5. User Rights (DPDP Act 2023 Compliance)</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              In accordance with the Digital Personal Data Protection (DPDP) Act 2023 of India, you hold rights concerning your data interactions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li><strong>Right to Inquire:</strong> Request clarification on any automated technical logs or preferences stored during your session.</li>
              <li><strong>Right to Erase:</strong> Clear local storage and cached job entries directly through your browser or by submitting a request to our data desk.</li>
              <li><strong>Right of Grievance Redressal:</strong> Direct any privacy-related questions or data concerns to our designated Grievance Officer.</li>
            </ul>
          </section>

          {/* Section 6: Contact & Grievance */}
          <section className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white font-heading">
              <Mail className="h-5 w-5 text-[#FE8D01]" />
              <h2>6. Contact & Grievance Officer</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              For any questions, clarifications, or privacy grievance redressals regarding the SuchnaSetu Jobs Portal, please reach out to us:
            </p>
            <div className="space-y-1 text-sm text-slate-300">
              <p><strong>Grievance Officer:</strong> Legal & Privacy Desk, SuchnaSetu</p>
              <p><strong>Email:</strong> <a href="mailto:privacy@suchnasetu.in" className="text-[#FE8D01] underline font-semibold">privacy@suchnasetu.in</a> / <a href="mailto:support@suchnasetu.in" className="text-[#FE8D01] underline font-semibold">support@suchnasetu.in</a></p>
              <p><strong>Portal URL:</strong> <a href="https://suchnasetu.in" className="text-slate-300 underline">https://suchnasetu.in</a></p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
