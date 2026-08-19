import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, SYSTEM_MODULES } from "@/lib/constants";
import { ShieldAlert, ExternalLink, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#0F172A] text-slate-400">
      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="border-b border-slate-800 bg-[#080E1E] px-4 py-5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 rounded-xs border-l-4 border-[#FE8D01] bg-slate-900/80 p-4 md:flex-row md:items-center">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xs bg-[#FE8D01]/10 text-[#FE8D01]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-[#FE8D01]">Statutory Transparency Disclaimer: </span>
              {SITE_CONFIG.disclaimer} All candidates are strictly advised to cross-verify notification details, eligibility requirements, and deadlines directly with the official recruitment portal or Gazette circular before application.
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-icon.png"
                alt="SuchnaSetu Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain bg-white rounded-xs p-0.5"
              />
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>National Open Data Standards Compliant</span>
            </div>
          </div>

          {/* Platform Sections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-1.5">
              Information Modules
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {SYSTEM_MODULES.slice(0, 5).map((mod) => (
                <li key={mod.key}>
                  <Link
                    href={mod.href}
                    className="hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{mod.shortTitle}</span>
                    {mod.status === "active" ? (
                      <span className="rounded-xs bg-[#013089] px-1 text-[9px] text-white font-bold">
                        Live
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-600">Upcoming</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick State Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-1.5">
              State Portals
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/jobs?state=BR" className="hover:text-white transition-colors">
                  Bihar Govt Jobs (BPSC/BSSC)
                </Link>
              </li>
              <li>
                <Link href="/jobs?state=UP" className="hover:text-white transition-colors">
                  UP Govt Jobs (UPPSC/UPSSSC)
                </Link>
              </li>
              <li>
                <Link href="/jobs?state=RJ" className="hover:text-white transition-colors">
                  Rajasthan Jobs (RPSC/RSMSSB)
                </Link>
              </li>
              <li>
                <Link href="/jobs?state=MP" className="hover:text-white transition-colors">
                  MP Govt Jobs (MPPSC/MPESB)
                </Link>
              </li>
              <li>
                <Link href="/jobs?state=DL" className="hover:text-white transition-colors">
                  Delhi Govt Jobs (DSSSB/DHC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Official Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-1.5">
              Official Portals
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="https://upsc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>UPSC Portal</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ssc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>SSC Official</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://egazette.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>The Gazette of India</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ncs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>National Career Service</span>
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Official Public Information &amp; Gazette Aggregator.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <Link href="/robots.txt" className="hover:text-slate-300 transition-colors">
              Robots.txt
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">
              Sitemap.xml
            </Link>
            <Link href="/admin/login" className="hover:text-slate-300 transition-colors">
              Admin Gateway
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
