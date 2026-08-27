import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["\x27]|["\x27]$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const articles = [
  {
    slug: "union-cabinet-approves-modernization-of-national-career-service-portal",
    summary: "The Union Cabinet chaired by the Prime Minister has approved the comprehensive technological upgrade of the National Career Service (NCS) portal to integrate AI-driven job-matching for youth.",
    content: `The Union Cabinet, chaired by the Prime Minister, has formally approved the Phase-III modernization initiative of the National Career Service (NCS) project implemented under the Ministry of Labour & Employment. The project aims to bridge the gap between job-seekers and public and private employers across India through unified skill registries and Aadhaar-authenticated digital credentials.

Under the approved modernization blueprint, the upgraded portal will deploy artificial intelligence and machine learning algorithms to map candidate qualifications, vocational certifications, and regional preferences directly with active vacancies across central ministries, state public sector undertakings, and private sector enterprises. The initiative includes seamless integration with DigiLocker and e-Shram databases to ensure verifiable employment records.

Furthermore, the Cabinet has earmarked dedicated budgetary support to upgrade over 1,000 model career centres across all 28 states and 8 union territories. These physical-digital hybrid centers will provide free career counseling, mock interview simulations, and specialized skill assessment modules for rural youth and first-generation college graduates.

The Labour Ministry noted that the revamped architecture will significantly shorten recruitment discovery timelines for candidates preparing for competitive examinations and technical apprenticeships. Official guidelines and standard operating procedures are scheduled to be published in the central gazette within the coming weeks.`,
  },
  {
    slug: "isro-finalizes-launch-window-chandrayaan-4-sample-return-mission",
    summary: "Indian Space Research Organisation announces key milestone preparations for the lunar sample return mission scheduled with multi-module docking architecture.",
    content: `The Indian Space Research Organisation (ISRO) has officially completed the Critical Design Review (CDR) for the Chandrayaan-4 lunar sample-return mission, finalizing the mission timeline and orbital insertion window. The mission represents India's next frontier in planetary exploration, designed to collect surface soil and rock cores from the lunar south pole and safely transport them back to Earth.

Unlike previous single-stack lunar missions, Chandrayaan-4 will utilize a sophisticated multi-modular architecture requiring two separate launches via the LVM3 launch vehicle. The spacecraft configuration comprises five distinct modules: an Ascender Module, a Descender Module, a Transfer Module, a Re-entry Module, and a Propulsion Module. The autonomous docking of these modules in lunar orbit will be a historic technological demonstration for India.

ISRO Chairman confirmed that the mission payloads include high-precision robotic drills capable of extracting subsurface samples up to two meters deep without thermal degradation. Once secured in sealed preservation canisters, the ascent vehicle will lift off from the lunar surface to rendezvous with the return stack.

The returned extraterrestrial samples will be housed in an ultra-clean planetary material containment facility under construction at URSC Bengaluru, providing Indian scientists and academic institutions direct access to pristine lunar geological records.`,
  },
  {
    slug: "ugc-mandatory-advisory-degree-equivalence-state-central-recruitment",
    summary: "University Grants Commission directs all public recruiting commissions that degrees conferred by recognized universities under Section 22 must be accepted without secondary validation.",
    content: `To eliminate arbitrary rejections during recruitment document verification, the University Grants Commission (UGC) has issued a binding statutory circular to all central ministries, state public service commissions, and staff selection boards across India regarding degree equivalence.

The advisory explicitly reiterates that any undergraduate, postgraduate, or technical degree awarded by a university recognized under Section 2(f) and Section 3 of the UGC Act, 1956, and conforming to Section 22 specifications, possesses full legal equivalence across all public recruitment drives. Recruiting authorities are strictly prohibited from demanding supplementary validation certificates or institutional equivalence affidavits from applicants.

The directive also clarifies the status of distance learning degrees and online programs recognized by the Distance Education Bureau (DEB). Degrees acquired through approved open and distance learning (ODL) modes are declared fully on par with conventional full-time campus degrees for government employment, provided the institution held valid DEB approval during the candidate's enrollment tenure.

The Commission has warned that non-compliance or unilateral disqualification of candidates holding valid recognized degrees will attract strict administrative review and legal accountability under higher education statutory regulations.`,
  },
];

async function sync() {
  for (const art of articles) {
    const { error } = await supabase
      .from("news_articles")
      .update({
        content: art.content,
        summary: art.summary,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", art.slug);

    if (error) {
      console.error(`✗ Error:`, error.message);
    } else {
      console.log(`✓ Updated ${art.slug}`);
    }
  }
}
sync().catch(console.error);
