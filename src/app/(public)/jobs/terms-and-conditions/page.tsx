import { Metadata } from "next";
import Link from "next/link";
import { constructMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { FileText, AlertTriangle, ExternalLink, ShieldCheck, Scale, Sparkles, BookOpen } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Jobs Portal Terms & Conditions — SuchnaSetu",
  description: "Official Terms and Conditions governing the use of the SuchnaSetu Recruitment & Government Jobs portal. Understand disclaimers, usage rules, and liability limits.",
  path: "/jobs/terms-and-conditions",
  canonicalPath: "/jobs/terms-and-conditions",
});

export default function JobsTermsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Jobs", url: "/jobs" },
    { name: "Terms & Conditions", url: "/jobs/terms-and-conditions" },
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
              <span>SuchnaSetu User Agreement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Jobs Portal Terms & Conditions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Effective Date: August 28, 2026 • Last Updated: August 28, 2026
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
              Please read these Terms and Conditions carefully before accessing or utilizing the SuchnaSetu Jobs Portal (<Link href="/jobs" className="text-[#013089] font-semibold underline">suchnasetu.in/jobs</Link>). By browsing, searching, or interacting with job listings on this platform, you acknowledge and agree to be bound by these Terms.
            </p>
          </div>

          {/* Section 1: Non-Government Entity & Statutory Disclaimer */}
          <section className="rounded-3xl border-2 border-amber-300 bg-amber-50/60 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-amber-950 font-heading">
              <AlertTriangle className="h-5 w-5 text-[#FE8D01]" />
              <h2>1. Non-Government Entity & Statutory Disclaimer</h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-amber-900 leading-relaxed">
              <p>
                <strong>Statutory Notice:</strong> SuchnaSetu is an independent civic digital platform developed for public awareness and convenience. <strong>SuchnaSetu is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with the Government of India, any State Government, Union Territory administration, or any public recruiting commission</strong> (including UPSC, SSC, NTA, IBPS, or State PSCs).
              </p>
              <p>
                All recruitment notices, eligibility rules, fee structures, exam dates, syllabus summaries, and application deadlines are aggregated strictly from public gazettes, press releases, and official commission websites.
              </p>
              <p className="font-semibold text-amber-950">
                Candidates must verify all recruitment criteria against the official gazette notification or authorized commission portal before applying or paying any application fees.
              </p>
            </div>
          </section>

          {/* Section 2: Permitted Usage */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <FileText className="h-5 w-5 text-[#013089]" />
              <h2>2. Permitted Use of the Platform</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li><strong>Informational Purpose:</strong> You may access and view job notifications strictly for personal, non-commercial research, academic awareness, and career preparation.</li>
              <li><strong>Prohibited Actions:</strong> You may not use automated web scrapers, bots, or data extraction scripts to harvest data from SuchnaSetu without express written permission.</li>
              <li><strong>Integrity of Service:</strong> You must not attempt to disrupt, overburden, or compromise server security, APIs, or database integrity.</li>
            </ul>
          </section>

          {/* Section 3: AI Summaries & Automated Translations */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <Sparkles className="h-5 w-5 text-[#FE8D01]" />
              <h2>3. AI Summaries & Automated Translations Disclaimer</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              SuchnaSetu utilizes automated algorithms and translation engines (including Google Translate) to provide multilingual access to recruitment circulars.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pl-2">
              <li>Summaries, eligibility checklists, and translated Hindi versions are provided solely for preliminary readability and fast comprehension.</li>
              <li>In the event of any ambiguity, discrepancy, or dispute between translated text and the original official notification, <strong>the official gazette document published by the issuing commission in its designated official language shall strictly prevail</strong>.</li>
            </ul>
          </section>

          {/* Section 4: External Links & Official Commission Portals */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <ExternalLink className="h-5 w-5 text-[#013089]" />
              <h2>4. External Links & Third-Party Portals</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Our job listings provide direct outbound links to external third-party government application portals. SuchnaSetu exercises no administrative control over external servers, online payment gateways, portal uptime, or application processing times. We bear no liability for transaction failures or application submission issues on external government websites.
            </p>
          </section>

          {/* Section 5: Intellectual Property & Copyright */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              <h2>5. Intellectual Property & Fair Use</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              All government logos, commission seals, official acronyms (UPSC, SSC, NTA), and original notification text remain the intellectual property of their respective government authorities and ministries. SuchnaSetu displays this information under fair dealing and public interest reporting principles. The proprietary design, software code, and presentation layout of SuchnaSetu belong exclusively to SuchnaSetu.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900 font-heading">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              <h2>6. Limitation of Liability & Indemnification</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Under no circumstances shall SuchnaSetu, its operators, developers, or affiliates be held liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of, or inability to use, information provided on this platform—including missed application deadlines, eligibility disqualification, or typographical errors in circular summaries.
            </p>
          </section>

          {/* Section 7: Governing Law & Jurisdiction */}
          <section className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-lg font-bold text-white font-heading">
              <Scale className="h-5 w-5 text-[#FE8D01]" />
              <h2>7. Governing Law & Jurisdiction</h2>
            </div>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with the use of SuchnaSetu shall be subject to the exclusive jurisdiction of the competent courts located in New Delhi, India.
            </p>
            <p className="text-sm text-slate-400 pt-2 border-t border-slate-800">
              For legal inquiries or notices: <a href="mailto:legal@suchnasetu.in" className="text-[#FE8D01] underline font-semibold">legal@suchnasetu.in</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
