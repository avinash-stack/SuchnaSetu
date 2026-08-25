"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/context";
import { ShieldAlert, ExternalLink, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 bg-[#0F172A] text-slate-400">
      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="border-b border-slate-800 bg-[#080E1E] px-4 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 rounded-xl border-l-4 border-[#FE8D01] bg-slate-900/90 p-5 md:flex-row md:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FE8D01]/10 text-[#FE8D01]">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="text-sm leading-relaxed text-slate-300">
              <span className="font-bold text-[#FE8D01]">Statutory Transparency Notice: </span>
              {t("footer.statutory_disclaimer")}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-icon.png"
                alt="SuchnaSetu Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain bg-white rounded-lg p-0.5"
              />
              <span className="text-2xl font-bold tracking-tight text-white font-heading">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>National Open Data Standards Compliant</span>
            </div>
          </div>

          {/* Platform Sections */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              {t("footer.public_modules")}
            </h4>
            <ul className="mt-4 space-y-2 text-xs sm:text-[13px]">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.jobs")}</span>
                  <span className="rounded bg-[#013089] px-1.5 py-0.2 text-[10px] text-white font-bold">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.exams")}</span>
                  <span className="rounded bg-[#013089] px-1.5 py-0.2 text-[10px] text-white font-bold">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/admit-cards" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.admit_cards")}</span>
                  <span className="rounded bg-[#FE8D01] px-1.5 py-0.2 text-[10px] text-white font-bold">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.results")}</span>
                  <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[10px] text-white font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.news")}</span>
                </Link>
              </li>
              <li>
                <Link href="/answer-keys" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.answer_keys")}</span>
                </Link>
              </li>
              <li>
                <Link href="/syllabus" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.syllabus")}</span>
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.coming_soon")}</span>
                </Link>
              </li>
              <li>
                <Link href="/directory" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>{t("nav.directory")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick State Access */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              {t("footer.state_portals")}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
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
                <Link href="/jobs?state=WB" className="hover:text-white transition-colors">
                  West Bengal Jobs (WBPSC)
                </Link>
              </li>
              <li>
                <Link href="/jobs?state=OR" className="hover:text-white transition-colors">
                  Odisha Govt Jobs (OPSC)
                </Link>
              </li>
              <li>
                <Link href="/jobs?state=AS" className="hover:text-white transition-colors">
                  Assam Govt Jobs (APSC)
                </Link>
              </li>
              <li>
                <Link href="/jobs?state=PB" className="hover:text-white transition-colors">
                  Punjab Govt Jobs (PPSC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Official Portals */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              {t("footer.official_commissions")}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="https://upsc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>UPSC Portal</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ssc.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>SSC Official</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://egazette.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>The Gazette of India</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ncs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>National Career Service</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-4">
          <p>{t("footer.rights")}</p>
          <div className="flex items-center space-x-6 text-xs sm:text-sm">
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
