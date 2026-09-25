import { createAdminClient } from "@/lib/supabase/admin";
import { FALLBACK_PILLAR_RESOURCES } from "../constants";

export interface DiscoveredTopicContext {
  targetExamOrJob: string;
  organization: string;
  categorySlug: string;
  suggestedTitle: string;
  suggestedSlug: string;
  groundingFacts: {
    stages?: string[];
    payLevel?: string;
    eligibilityKeywords?: string[];
    officialAgency?: string;
  };
}

const TOPIC_TEMPLATES = [
  {
    categorySlug: "preparation-strategy",
    titleTemplate: (org: string, target: string) => `How to Clear ${target} (${org}) on First Attempt: Subject Strategy & Timetable`,
    slugPrefix: "how-to-prepare",
  },
  {
    categorySlug: "syllabus-guide",
    titleTemplate: (org: string, target: string) => `${target} Complete Syllabus & Section-Wise Weightage Analysis`,
    slugPrefix: "syllabus-breakdown",
  },
  {
    categorySlug: "salary-perks",
    titleTemplate: (org: string, target: string) => `${target} In-Hand Salary Structure, 7th CPC Allowances & Career Growth`,
    slugPrefix: "salary-structure",
  },
  {
    categorySlug: "eligibility-rules",
    titleTemplate: (org: string, target: string) => `${target} Eligibility Criteria: Age Limits, Reservations & Academic Rules`,
    slugPrefix: "eligibility-rules",
  },
  {
    categorySlug: "interview-prep",
    titleTemplate: (org: string, target: string) => `${target} Interview & Document Verification Guide: Board Questions & Checklist`,
    slugPrefix: "interview-guide",
  },
];

export async function discoverNextTrendingTopic(existingSlugs: Set<string>): Promise<DiscoveredTopicContext> {
  const supabase = createAdminClient();

  // 1. Try to fetch active exams from database
  let targetExams: { title: string; organization_name?: string }[] = [];
  try {
    const { data: exams } = await (supabase.from("gov_exams") as any)
      .select("title, organizations(name)")
      .eq("status", "active")
      .limit(15);

    if (exams && exams.length > 0) {
      targetExams = exams.map((e: any) => ({
        title: e.title,
        organization_name: e.organizations?.name || "Official Commission",
      }));
    }
  } catch (err) {
    console.warn("Could not query live exams for topic discovery:", err);
  }

  // 2. High-value evergreen backup subjects if database query returns sparse data
  const candidateSubjects = [
    { target: "UPSC Civil Services (IAS/IPS)", org: "UPSC", pay: "Level 10 (₹56,100)", stages: ["Prelims", "Mains", "Personality Test"] },
    { target: "SSC Combined Higher Secondary Level (CHSL)", org: "SSC", pay: "Level 4 (₹25,500)", stages: ["Tier-1", "Tier-2", "Skill Test"] },
    { target: "SBI Probationary Officer (PO)", org: "State Bank of India", pay: "Junior Management Scale-I", stages: ["Prelims", "Mains", "GE & Interview"] },
    { target: "Railway Non-Technical Popular Categories (NTPC)", org: "Railway Recruitment Board", pay: "Level 2 to Level 6", stages: ["CBT-1", "CBT-2", "CBAT/Typing", "DV"] },
    { target: "UPPSC Combined State Upper Subordinate", org: "Uttar Pradesh PSC", pay: "Level 7 to Level 10", stages: ["Prelims", "Mains", "Interview"] },
    { target: "BPSC Combined Competitive Examination", org: "Bihar Public Service Commission", pay: "Level 7 to Level 9", stages: ["Prelims", "Mains", "Interview"] },
    { target: "SSC Central Police Organization (CPO SI)", org: "SSC", pay: "Level 6 (₹35,400)", stages: ["Paper-1", "PET/PST", "Paper-2", "DME"] },
    { target: "RBI Grade B Officer", org: "Reserve Bank of India", pay: "Grade B (₹55,200 basic)", stages: ["Phase-I", "Phase-II", "Interview"] },
    { target: "IBPS Clerk Recruitment", org: "IBPS", pay: "Clerical Scale", stages: ["Prelims", "Mains", "DV"] },
    { target: "Central Armed Police Forces (CAPF AC)", org: "UPSC", pay: "Level 10 (₹56,100)", stages: ["Written Exam", "PET/PST", "Interview"] },
  ];

  // 3. Match candidate subjects against templates to find an unwritten topic
  for (const subject of candidateSubjects) {
    for (const template of TOPIC_TEMPLATES) {
      const cleanTargetSlug = subject.target
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const generatedSlug = `${template.slugPrefix}-${cleanTargetSlug}`;

      // Check if already written
      if (!existingSlugs.has(generatedSlug)) {
        return {
          targetExamOrJob: subject.target,
          organization: subject.org,
          categorySlug: template.categorySlug,
          suggestedTitle: template.titleTemplate(subject.org, subject.target),
          suggestedSlug: generatedSlug,
          groundingFacts: {
            officialAgency: subject.org,
            payLevel: subject.pay,
            stages: subject.stages,
          },
        };
      }
    }
  }

  // Fallback unique topic with timestamp suffix if all combinations are exhausted
  const ts = Date.now().toString(36).slice(-4);
  return {
    targetExamOrJob: "Central Government Recruitment 2026",
    organization: "Government of India",
    categorySlug: "preparation-strategy",
    suggestedTitle: `Strategic Preparation Playbook for 2026 Competitive Exams (${ts.toUpperCase()})`,
    suggestedSlug: `strategic-preparation-playbook-${ts}`,
    groundingFacts: {
      officialAgency: "Various Central Commissions",
      stages: ["Preliminary", "Main / Skill", "Interview / Verification"],
    },
  };
}
