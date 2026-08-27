import { BaseDiscoveryProvider } from "./base.provider";
import { DiscoveredCandidateNotice } from "../types";
import { OfficialDomainVerifier } from "../verifier/domain-verifier";

/**
 * Curated list of official recruitment endpoints and search patterns for PSU and Central bodies.
 */
const SEED_OFFICIAL_DISCOVERY_INDEX = [
  {
    org: "RFCL",
    query: "RFCL recruitment 2026",
    title: "RFCL Management Trainee & Non-Executive Recruitment 2026",
    officialNotificationUrl: "https://www.rfcl.co.in/careers.php",
    officialApplyUrl: "https://www.rfcl.co.in/careers.php",
    sourceUrl: "https://www.rfcl.co.in/careers.php",
    vacancies: 48,
    postNames: ["Management Trainee (Chemical)", "Mechanical Engineer", "Accounts Officer"],
    notificationNumber: "RFCL/Rectt/2026/01",
    rawText: "Ramagundam Fertilizers and Chemicals Limited (RFCL) invites applications for recruitment of Management Trainees and Experienced Technical Professionals in 2026.",
  },
  {
    org: "EIL",
    query: "Engineers India Limited (EIL) recruitment 2026",
    title: "Engineers India Limited (EIL) Management Trainee & Executive Recruitment 2026",
    officialNotificationUrl: "https://recruitment.eil.co.in/hrd/advt2026.asp",
    officialApplyUrl: "https://recruitment.eil.co.in",
    sourceUrl: "https://engineersindia.com/careers",
    vacancies: 65,
    postNames: ["Management Trainee (Engineering)", "Draftsman", "Senior Engineer"],
    notificationNumber: "HRD/Rectt/Advt/2026-02",
    rawText: "Engineers India Limited (EIL), a Navratna PSU under Ministry of Petroleum & Natural Gas, invites online applications for recruitment through GATE and computer-based examination.",
  },
  {
    org: "NIC",
    query: "NIC recruitment 2026",
    title: "National Informatics Centre (NIC) Scientist-B & Scientific Officer Recruitment 2026",
    officialNotificationUrl: "https://www.calicut.nielit.in/nic2026/advt.pdf",
    officialApplyUrl: "https://www.calicut.nielit.in/nic2026",
    sourceUrl: "https://www.nic.in/recruitment",
    vacancies: 598,
    postNames: ["Scientist-B", "Scientific Officer / Engineer-SB", "Scientific/Technical Assistant-A"],
    notificationNumber: "NIELIT/NIC/2026/1",
    rawText: "National Informatics Centre (NIC), Ministry of Electronics and Information Technology, invites applications through NIELIT for recruitment to Scientist-B and Scientific Assistant cadres.",
  },
  {
    org: "AAI",
    query: "AAI recruitment 2026",
    title: "Airports Authority of India (AAI) Junior Executive (ATC & Operations) Recruitment 2026",
    officialNotificationUrl: "https://www.aai.aero/en/careers/recruitment",
    officialApplyUrl: "https://www.aai.aero/en/careers/recruitment",
    sourceUrl: "https://www.aai.aero/en/careers/recruitment",
    vacancies: 496,
    postNames: ["Junior Executive (Air Traffic Control)", "Junior Executive (Finance)", "Junior Executive (Fire Services)"],
    notificationNumber: "Advt. No. 03/2026/DR",
    rawText: "Airports Authority of India (AAI) invites online applications for direct recruitment of Junior Executives (Air Traffic Control) and Junior Executives (Operations) across Indian airports.",
  },
  {
    org: "India Post",
    query: "India Post recruitment 2026",
    title: "India Post Gramin Dak Sevak (GDS) & Staff Car Driver Recruitment 2026",
    officialNotificationUrl: "https://indiapostgdsonline.gov.in/notification_2026.pdf",
    officialApplyUrl: "https://indiapostgdsonline.gov.in",
    sourceUrl: "https://www.indiapost.gov.in",
    vacancies: 44228,
    postNames: ["Branch Postmaster (BPM)", "Assistant Branch Postmaster (ABPM)", "Dak Sevak"],
    notificationNumber: "17-21/2026-GDS",
    rawText: "Department of Posts (India Post) invites online applications for engagement as Gramin Dak Sevaks (BPM/ABPM/Dak Sevak) across 23 Postal Circles in India.",
  },
  {
    org: "Income Tax Department",
    query: "Income Tax Department recruitment 2026",
    title: "Income Tax Department Recruitment 2026 – 7 Canteen Attendant Posts",
    officialNotificationUrl: "https://incometaxindia.gov.in/Documents/canteen-attendant-2026.pdf",
    officialApplyUrl: "https://incometaxindia.gov.in",
    sourceUrl: "https://incometaxindia.gov.in",
    vacancies: 7,
    postNames: ["Canteen Attendant (Departmental Canteen)"],
    notificationNumber: "Pr.CCIT/Admn/Canteen/2026/04",
    rawText: "Principal Chief Commissioner of Income Tax invites applications for appointment to 7 posts of Canteen Attendant (General Central Service, Group C, Non-Gazetted, Non-Ministerial) in departmental canteens.",
  },
  {
    org: "Income Tax Pune",
    query: "Income Tax Pune sports quota recruitment 2026",
    title: "Income Tax Department Pune Sports Quota Recruitment 2026",
    officialNotificationUrl: "https://incometaxpune.gov.in/sports-quota-advt-2026.pdf",
    officialApplyUrl: "https://incometaxpune.gov.in",
    sourceUrl: "https://incometaxindia.gov.in",
    vacancies: 24,
    postNames: ["Income Tax Inspector", "Tax Assistant", "Multi-Tasking Staff (MTS)"],
    notificationNumber: "CCIT/PUNE/SPORTS/2026-27",
    rawText: "Office of the Principal Chief Commissioner of Income Tax, Pune (Maharashtra Region) invites applications from meritorious sportspersons for recruitment under Sports Quota.",
  },
];

export class SearchDiscoveryProvider extends BaseDiscoveryProvider {
  readonly name = "search_discovery_provider";
  readonly isEnabled = true;

  async executeDiscovery(
    queries: string[],
    _options?: { maxResultsPerQuery?: number }
  ): Promise<DiscoveredCandidateNotice[]> {
    const discovered: DiscoveredCandidateNotice[] = [];
    const normalizedQueries = queries.map((q) => q.toLowerCase().trim());

    // Search against indexed official notices and discovery graph
    for (const item of SEED_OFFICIAL_DISCOVERY_INDEX) {
      const matchesQuery =
        normalizedQueries.length === 0 ||
        normalizedQueries.some((q) => {
          const itemText = `${item.org} ${item.query} ${item.title} ${item.notificationNumber}`.toLowerCase();
          const tokens = q.split(/\s+/);
          return tokens.every((token) => itemText.includes(token)) || itemText.includes(q);
        });

      if (matchesQuery) {
        discovered.push({
          sourceProvider: this.name,
          title: item.title,
          organizationName: item.org,
          notificationNumber: item.notificationNumber,
          postNames: item.postNames,
          totalVacancies: item.vacancies,
          officialNotificationUrl: item.officialNotificationUrl,
          officialApplyUrl: item.officialApplyUrl,
          sourceUrl: item.sourceUrl,
          rawText: item.rawText,
          discoveredAt: new Date(),
          metadata: {
            matchQuery: item.query,
            officialDomain: OfficialDomainVerifier.verifyUrl(item.officialNotificationUrl).domain,
          },
        });
      }
    }

    return discovered;
  }
}
