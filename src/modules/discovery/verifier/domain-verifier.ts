import { VerificationResult } from "../types";

/**
 * Registry of verified official Central & State Public Sector Undertakings (PSUs)
 * and autonomous government bodies that use specific corporate or organizational domain extensions.
 */
const VERIFIED_OFFICIAL_DOMAINS: Record<string, { name: string; type: "psu" | "autonomous" | "central_gov" | "state_gov" }> = {
  // Fertilizer & Chemicals
  "rfcl.co.in": { name: "Ramagundam Fertilizers and Chemicals Limited (RFCL)", type: "psu" },
  "nfl.co.in": { name: "National Fertilizers Limited (NFL)", type: "psu" },
  "rcfltd.com": { name: "Rashtriya Chemicals and Fertilizers (RCF)", type: "psu" },
  "bvfcl.com": { name: "Brahmaputra Valley Fertilizer Corporation Limited", type: "psu" },
  "fact.co.in": { name: "Fertilisers and Chemicals Travancore Limited (FACT)", type: "psu" },

  // Engineering, Aviation & Infrastructure
  "engineersindia.com": { name: "Engineers India Limited (EIL)", type: "psu" },
  "aai.aero": { name: "Airports Authority of India (AAI)", type: "psu" },
  "nbccindia.com": { name: "NBCC (India) Limited", type: "psu" },
  "ircon.org": { name: "IRCON International Limited", type: "psu" },
  "rites.com": { name: "RITES Limited", type: "psu" },
  "rvnl.org": { name: "Rail Vikas Nigam Limited (RVNL)", type: "psu" },
  "bhel.com": { name: "Bharat Heavy Electricals Limited (BHEL)", type: "psu" },
  "bel-india.in": { name: "Bharat Electronics Limited (BEL)", type: "psu" },
  "hal-india.co.in": { name: "Hindustan Aeronautics Limited (HAL)", type: "psu" },

  // Energy & Natural Resources
  "ongcindia.com": { name: "Oil and Natural Gas Corporation (ONGC)", type: "psu" },
  "iocl.com": { name: "Indian Oil Corporation Limited (IOCL)", type: "psu" },
  "bpcl.co.in": { name: "Bharat Petroleum Corporation Limited (BPCL)", type: "psu" },
  "hpcl.in": { name: "Hindustan Petroleum Corporation Limited (HPCL)", type: "psu" },
  "gailonline.com": { name: "GAIL (India) Limited", type: "psu" },
  "sail.co.in": { name: "Steel Authority of India Limited (SAIL)", type: "psu" },
  "coalindia.in": { name: "Coal India Limited (CIL)", type: "psu" },
  "ntpc.co.in": { name: "NTPC Limited", type: "psu" },
  "powergrid.in": { name: "Power Grid Corporation of India", type: "psu" },
  "nmdc.co.in": { name: "NMDC Limited", type: "psu" },

  // Technology & Research
  "cdac.in": { name: "Centre for Development of Advanced Computing (C-DAC)", type: "autonomous" },
  "sameer.gov.in": { name: "Society for Applied Microwave Electronics Engineering & Research", type: "autonomous" },
  "tifr.res.in": { name: "Tata Institute of Fundamental Research", type: "autonomous" },

  // Defense Shipyards & Manufacturing
  "mazagondock.in": { name: "Mazagon Dock Shipbuilders Limited (MDL)", type: "psu" },
  "grse.in": { name: "Garden Reach Shipbuilders & Engineers (GRSE)", type: "psu" },
  "cochinshipyard.in": { name: "Cochin Shipyard Limited (CSL)", type: "psu" },
  "bdl-india.in": { name: "Bharat Dynamics Limited (BDL)", type: "psu" },
  "midhani-india.in": { name: "Mishra Dhatu Nigam Limited (MIDHANI)", type: "psu" },

  // Banking & Financial Authorities
  "sbi.co.in": { name: "State Bank of India (SBI)", type: "psu" },
  "rbi.org.in": { name: "Reserve Bank of India (RBI)", type: "autonomous" },
  "ibps.in": { name: "Institute of Banking Personnel Selection (IBPS)", type: "autonomous" },
  "nabard.org": { name: "National Bank for Agriculture and Rural Development", type: "autonomous" },
  "licindia.in": { name: "Life Insurance Corporation of India (LIC)", type: "psu" },
};

/**
 * List of known aggregator/scraping domains that should NEVER be accepted as official sources.
 */
const KNOWN_AGGREGATOR_DOMAINS = new Set([
  "sarkariresult.com",
  "freejobalert.com",
  "fresherslive.com",
  "indgovtjobs.in",
  "testbook.com",
  "adda247.com",
  "jagranjosh.com",
  "careers360.com",
  "shiksha.com",
  "collegedunia.com",
  "freshersnow.com",
  "rojgarsamachar.in",
  "rojgarresult.com",
  "govtexamalert.com",
]);

/**
 * Verifies if a given notification URL or apply URL belongs to a legitimate, official authority.
 */
export class OfficialDomainVerifier {
  /**
   * Evaluates the domain provenance and official authenticity of a recruitment notice URL.
   */
  static verifyUrl(url?: string | null): VerificationResult {
    if (!url || typeof url !== "string" || !url.trim().startsWith("http")) {
      return {
        isOfficial: false,
        confidenceScore: 0,
        domain: "",
        domainType: "unverified_third_party",
        reason: "Missing or malformed URL",
      };
    }

    try {
      const parsed = new URL(url.trim());
      const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

      // 1. Explicit Aggregator / Ad Portal Rejection
      if (KNOWN_AGGREGATOR_DOMAINS.has(hostname) || Array.from(KNOWN_AGGREGATOR_DOMAINS).some((d) => hostname.endsWith(`.${d}`))) {
        return {
          isOfficial: false,
          confidenceScore: 0,
          domain: hostname,
          domainType: "unverified_third_party",
          reason: `Rejected: Domain ${hostname} is a third-party commercial job aggregator.`,
        };
      }

      // 2. Primary National / State Government Domains (.gov.in & .nic.in)
      if (hostname.endsWith(".gov.in") || hostname.endsWith(".nic.in")) {
        return {
          isOfficial: true,
          confidenceScore: 98,
          domain: hostname,
          domainType: hostname.includes("state") || hostname.split(".").length > 3 ? "state_gov" : "central_gov",
          reason: `Verified: Official Government of India domain (${hostname}).`,
          normalizedOfficialUrl: url.trim(),
        };
      }

      // 3. Indian Defense / Military (.mil.in)
      if (hostname.endsWith(".mil.in")) {
        return {
          isOfficial: true,
          confidenceScore: 98,
          domain: hostname,
          domainType: "central_gov",
          reason: `Verified: Official Indian Armed Forces / Military domain (${hostname}).`,
          normalizedOfficialUrl: url.trim(),
        };
      }

      // 4. Recognized Government Universities & Autonomous Institutes (.ac.in, .edu.in, .res.in)
      if (hostname.endsWith(".ac.in") || hostname.endsWith(".edu.in") || hostname.endsWith(".res.in")) {
        return {
          isOfficial: true,
          confidenceScore: 90,
          domain: hostname,
          domainType: "autonomous",
          reason: `Verified: Official Indian Academic / Autonomous Research Institution domain (${hostname}).`,
          normalizedOfficialUrl: url.trim(),
        };
      }

      // 5. Check Curated Official PSU & Statutory Bodies Registry
      for (const [verifiedDomain, info] of Object.entries(VERIFIED_OFFICIAL_DOMAINS)) {
        if (hostname === verifiedDomain || hostname.endsWith(`.${verifiedDomain}`)) {
          return {
            isOfficial: true,
            confidenceScore: 95,
            domain: hostname,
            domainType: info.type,
            reason: `Verified: ${info.name} official domain (${hostname}).`,
            normalizedOfficialUrl: url.trim(),
          };
        }
      }

      // 6. Generic or Unrecognized Domain
      return {
        isOfficial: false,
        confidenceScore: 35,
        domain: hostname,
        domainType: "unverified_third_party",
        reason: `Unverified: Domain ${hostname} is not in the official Government / PSU whitelist.`,
      };
    } catch {
      return {
        isOfficial: false,
        confidenceScore: 0,
        domain: "",
        domainType: "unverified_third_party",
        reason: "Failed to parse URL hostname",
      };
    }
  }

  /**
   * Resolves the primary official domain and overall confidence for a discovered recruitment candidate.
   */
  static verifyCandidate(candidate: {
    officialNotificationUrl?: string | null;
    officialApplyUrl?: string | null;
    sourceUrl: string;
  }): VerificationResult {
    // Check notification URL first
    if (candidate.officialNotificationUrl) {
      const notifRes = this.verifyUrl(candidate.officialNotificationUrl);
      if (notifRes.isOfficial) return notifRes;
    }

    // Check apply URL
    if (candidate.officialApplyUrl) {
      const applyRes = this.verifyUrl(candidate.officialApplyUrl);
      if (applyRes.isOfficial) return applyRes;
    }

    // Check source URL as fallback
    const sourceRes = this.verifyUrl(candidate.sourceUrl);
    return sourceRes;
  }
}
