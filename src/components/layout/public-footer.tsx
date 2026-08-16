import Link from "next/link";
import { SITE_CONFIG, SYSTEM_MODULES } from "@/lib/constants";
import { ShieldAlert, ExternalLink, ShieldCheck, Heart } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 md:flex-row md:items-center">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="text-xs leading-relaxed text-slate-300">
              <span className="font-semibold text-amber-300">Statutory Transparency Disclaimer: </span>
              {SITE_CONFIG.disclaimer} All visitors are strictly advised to cross-verify all details, dates, and instructions with the original official recruitment portal or Gazette notice before taking action.
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-emerald-700 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {SITE_CONFIG.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>National Open Data Standards Compliant</span>
            </div>
          </div>

          {/* Platform Modules Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Information Modules
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {SYSTEM_MODULES.slice(0, 5).map((mod) => (
                <li key={mod.key}>
                  <Link
                    href={mod.href}
                    className="hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{mod.shortTitle}</span>
                    {mod.status === "active" ? (
                      <span className="rounded bg-emerald-500/20 px-1 text-[10px] text-emerald-400 font-semibold">
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600">Upcoming</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Modules Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Upcoming Sections
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {SYSTEM_MODULES.slice(5).map((mod) => (
                <li key={mod.key}>
                  <Link
                    href={mod.href}
                    className="hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{mod.shortTitle}</span>
                    <span className="text-[10px] text-slate-600">Upcoming</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Portals & Verification */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Official Portals
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://upsc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>UPSC Portal</span>
                  <ExternalLink className="h-3 w-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://ssc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>SSC Portal</span>
                  <ExternalLink className="h-3 w-3 text-slate-600" />
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
                  <ExternalLink className="h-3 w-3 text-slate-600" />
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
                  <ExternalLink className="h-3 w-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Built for transparent public access to official notices.</p>
          <div className="flex items-center space-x-6">
            <Link href="/robots.txt" className="hover:text-slate-300 transition-colors">
              Robots.txt
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">
              Sitemap.xml
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
