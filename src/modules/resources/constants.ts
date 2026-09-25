import { CareerResourceCategory, CareerResource } from "./types";

export const RESOURCE_CATEGORIES: CareerResourceCategory[] = [
  {
    slug: "preparation-strategy",
    name: "Preparation Strategy",
    name_hi: "तैयारी की रणनीति",
    description: "Actionable study plans, timetable routines, and subject-wise strategies for competitive exams.",
    display_order: 1,
    icon: "Target",
    is_active: true,
  },
  {
    slug: "eligibility-rules",
    name: "Eligibility & Rules",
    name_hi: "पात्रता एवं नियम",
    description: "Age relaxations, community quota reservations, academic qualifications, and medical criteria.",
    display_order: 2,
    icon: "ShieldCheck",
    is_active: true,
  },
  {
    slug: "syllabus-guide",
    name: "Syllabus Breakdown",
    name_hi: "पाठ्यक्रम एवं परीक्षा पैटर्न",
    description: "In-depth syllabus explanations, section weightages, and marking scheme analyses.",
    display_order: 3,
    icon: "BookOpen",
    is_active: true,
  },
  {
    slug: "salary-perks",
    name: "Salary & Perks",
    name_hi: "वेतन एवं सुविधाएं",
    description: "7th Pay Commission pay matrices, allowances (DA/HRA/TA), and government career benefits.",
    display_order: 4,
    icon: "IndianRupee",
    is_active: true,
  },
  {
    slug: "career-roadmaps",
    name: "Career Roadmaps",
    name_hi: "कैरियर रोडमैप",
    description: "Role hierarchies, promotion ladders, and post comparison guides (e.g. Group A vs Group B).",
    display_order: 5,
    icon: "Compass",
    is_active: true,
  },
  {
    slug: "interview-prep",
    name: "Interview & Personality Test",
    name_hi: "साक्षात्कार एवं व्यक्तित्व परीक्षण",
    description: "Viva guidelines, document verification checklists, and interview board preparation tips.",
    display_order: 6,
    icon: "Users",
    is_active: true,
  },
];

export const FALLBACK_PILLAR_RESOURCES: CareerResource[] = [
  {
    id: "cr-001-ssc-cgl-prep",
    slug: "how-to-prepare-ssc-cgl-working-professionals",
    title: "How to Prepare for SSC CGL While Working Full-Time: 6-Month Study Plan & Weekend Routine",
    title_hi: "नौकरी के साथ SSC CGL की तैयारी कैसे करें: 6 महीने का स्टडी प्लान एवं वीकेंड रूटीन",
    excerpt: "A realistic, time-tested strategy for working aspirants balancing an 8-hour corporate job with SSC CGL preparation, focusing on high-yield topics and mock accuracy.",
    excerpt_hi: "वर्किंग प्रोफेशनल्स के लिए एक व्यावहारिक और प्रभावी तैयारी रणनीति, जो सीमित समय में अधिकतम स्कोर करने के लिए सटीक टाइम-टेबल प्रदान करती है।",
    content: `## The Working Aspirant's Dilemma

Cracking the Staff Selection Commission Combined Graduate Level (SSC CGL) exam while holding a full-time private or corporate job is often considered daunting. However, thousands of candidates successfully clear the exam every year by shifting their focus from **number of study hours** to **consistency, syllabus prioritization, and high-frequency revisions**.

---

## 1. Daily Time Allocation: The 4-Hour Non-Negotiable Formula

When working 9 to 6, finding 8–10 hours a day is neither realistic nor sustainable. Instead, commit strictly to **3.5 to 4 hours on weekdays** and **8–10 hours on Saturdays and Sundays**.

### Weekday Schedule
- **06:00 AM – 07:30 AM (90 Mins)**: Quantitative Aptitude (Concept learning + 30 arithmetic/algebra problem sets).
- **Commute / Lunch Breaks (30–45 Mins)**: General Awareness & Current Affairs on mobile phone or flashcards.
- **08:30 PM – 09:30 PM (60 Mins)**: English Comprehension & Vocabulary (Previous year idioms, cloze test, and error spotting).
- **09:30 PM – 10:15 PM (45 Mins)**: Reasoning Ability (Timed sectional quiz) and revision notes.

---

## 2. Tier-Wise Priority Matrix

SSC CGL tests both speed and accuracy. Tier-1 is qualifying in nature, but Tier-2 determines final merit and cadre allocation.

| Subject | Tier-1 Weightage | Tier-2 Weightage | High-Yield Working Aspirant Focus |
| :--- | :--- | :--- | :--- |
| **Mathematical Abilities** | 25 Questions (50 Marks) | 30 Questions (90 Marks) | Arithmetic (Percentages, Profit/Loss, Ratio), Advance (Algebra, Mensuration) |
| **Reasoning & General Intelligence** | 25 Questions (50 Marks) | 30 Questions (90 Marks) | Coding-Decoding, Syllogisms, Series, Blood Relations, Statement-Assumption |
| **English Language & Comprehension** | 25 Questions (50 Marks) | 45 Questions (135 Marks) | Reading Comprehension, Vocab roots, Sentence Improvement, Active-Passive |
| **General Awareness** | 25 Questions (50 Marks) | 25 Questions (75 Marks) | Indian Polity, Modern History, Geography, Static GK & Last 8 Months Current Affairs |
| **Computer Knowledge** | — | 20 Questions (60 Marks - Qualifying) | MS Office, Networking, Cyber Security basics (Do not neglect!) |

---

## 3. Month-by-Month 6-Month Roadmap

### Month 1 & 2: Core Foundation & Concept Clearance
- Clear math fundamentals topic-by-topic.
- Memorize tables up to 30, squares up to 50, cubes up to 30, and Pythagorean triplets for quick calculation.
- Finish 1,500 core vocabulary words (synonyms, antonyms, one-word substitutions).

### Month 3 & 4: Previous Year Question (PYQ) Mastery
- Solve the last 5 years of SSC CGL, CHSL, and CPO questions.
- Maintain an **Error Diary** for every question you solve incorrectly. Working aspirants must review this diary every Sunday.

### Month 5: Sectional Tests & Speed Enhancement
- Shift from untimed chapter practice to 15-minute sectional drills.
- Focus heavily on calculation speed techniques and eliminating calculation friction.

### Month 6: Full-Length Mocks & Analysis
- Take 2 full-length mocks every Saturday and Sunday in exact exam time slots (10:00 AM – 11:00 AM).
- Spend at least 90 minutes analyzing weak areas for every 60-minute test.

---

## 4. Key Mistakes to Avoid
1. **Hoarding Too Many Books**: Stick to one standard book per subject (e.g., Neetu Singh for English, Kiran or Pinnacle PYQs for Math and Reasoning, Lucent/NCERT for General Science and Polity).
2. **Ignoring the Typing Test (DEST)**: Practice typing for 15 minutes every alternate day. Achieving 27–30 WPM with 95%+ accuracy prevents last-minute disqualification.
3. **Skipping Computer Modules**: Many high-scoring candidates fail to secure Assistant Section Officer (ASO) or Inspector posts solely due to missing the computer cutoff.`,
    content_hi: `## नौकरी के साथ तैयारी: व्यावहारिक रणनीति

पूर्णकालिक नौकरी के साथ कर्मचारी चयन आयोग संयुक्त स्नातक स्तरीय परीक्षा (SSC CGL) निकालना बिल्कुल संभव है। इसके लिए अध्ययन के घंटों की तुलना में नियमितता और सही विषयों के चयन पर ध्यान देना आवश्यक है।

### दैनिक समय प्रबंधन (4 घंटे का फॉर्मूला)
- **सुबह 6:00 से 7:30 बजे**: गणित (कॉन्सेप्ट + प्रश्न अभ्यास)
- **लंच व यात्रा का समय**: करंट अफेयर्स व वोकैबुलरी
- **रात 8:30 से 9:30 बजे**: अंग्रेजी व्याकरण व अभ्यास
- **रात 9:30 से 10:15 बजे**: रीजनिंग व रिवीज़न

वीकेंड (शनिवार एवं रविवार) पर 8-10 घंटे लगाकर मॉक टेस्ट और संपूर्ण रिवीज़न पूरा करें।`,
    category_slug: "preparation-strategy",
    tags: ["SSC CGL", "Study Plan", "Working Aspirants", "Time Management", "Tier 1 & 2"],
    faqs: [
      {
        question: "Can an aspirant clear SSC CGL in 6 months with a full-time job?",
        answer: "Yes. By dedicating 3.5 to 4 focused hours on weekdays and 8 to 10 hours on weekends, aspirants can comfortably cover the syllabus, master PYQs, and take 50+ full-length mock tests.",
        question_hi: "क्या नौकरी के साथ 6 महीने में SSC CGL पास किया जा सकता है?",
        answer_hi: "हाँ, यदि आप नियमित रूप से कार्यदिवसों पर 3.5 से 4 घंटे और वीकेंड पर 8 से 10 घंटे समर्पित करते हैं, तो 6 महीने में पाठ्यक्रम और मॉक टेस्ट पूरे किए जा सकते हैं।"
      },
      {
        question: "How many full-length mock tests are sufficient for SSC CGL?",
        answer: "Aim for a minimum of 40–50 full-length mocks for Tier-1 and 30+ dedicated mocks for Tier-2. Thorough post-test analysis of the Error Diary is more critical than the total mock count.",
        question_hi: "SSC CGL के लिए कितने मॉक टेस्ट पर्याप्त हैं?",
        answer_hi: "टियर-1 के लिए कम से कम 40-50 और टियर-2 के लिए 30+ मॉक टेस्ट देना और गलतियों का विश्लेषण करना सबसे महत्वपूर्ण है।"
      },
      {
        question: "Is coaching necessary for SSC CGL if working full-time?",
        answer: "No. Self-study utilizing standard previous-year compilations and quality online test series is sufficient. Structured online modules can help with specific weak topics.",
        question_hi: "क्या नौकरी करने वालों के लिए कोचिंग अनिवार्य है?",
        answer_hi: "नहीं, मानक पुस्तकों और ऑनलाइन टेस्ट सीरीज़ के साथ स्व-अध्ययन पूरी तरह पर्याप्त है।"
      }
    ],
    reading_time_minutes: 7,
    status: "published",
    author_name: "SuchnaSetu Career Editorial Desk",
    author_role: "Staff Selection Commission & Public Service Analyst",
    featured_image: null,
    view_count: 1420,
    published_at: "2026-09-20T08:00:00.000Z",
    created_at: "2026-09-20T08:00:00.000Z",
    updated_at: "2026-09-25T12:00:00.000Z",
  },
  {
    id: "cr-002-upsc-eligibility",
    slug: "upsc-civil-services-eligibility-age-relaxation-rules",
    title: "UPSC Civil Services Eligibility 2026: Age Limits, Category Relaxations & Attempt Limits",
    title_hi: "UPSC सिविल सेवा पात्रता 2026: आयु सीमा, श्रेणीवार छूट एवं प्रयासों की संख्या",
    excerpt: "Complete official breakdown of UPSC CSE eligibility rules, reservation quotas (EWS, OBC NCL, SC, ST, PwBD), cutoff date calculations, and educational requirements.",
    excerpt_hi: "संघ लोक सेवा आयोग सिविल सेवा परीक्षा की विस्तृत पात्रता, आयु सीमा की गणना, आरक्षण प्रमाण-पत्र के नियम और अवसरों की संपूर्ण आधिकारिक जानकारी।",
    content: `## Understanding UPSC CSE Eligibility Rules

The Union Public Service Commission (UPSC) establishes strict nationality, age, educational, and reservation criteria for the Civil Services Examination (CSE) under the Department of Personnel and Training (DoPT) gazette regulations.

---

## 1. Nationality Criteria

- **For IAS, IFS, and IPS**: A candidate must be a citizen of India.
- **For Other Services (IRS, IA&AS, etc.)**: The candidate must be either:
  1. A citizen of India, or
  2. A subject of Nepal or Bhutan, or
  3. A Tibetan refugee who came to India before January 1, 1962, or
  4. A person of Indian origin who has migrated from Pakistan, Burma, Sri Lanka, or East African countries with the intention of permanently settling in India.

---

## 2. Age Limits & Number of Attempts Matrix

The crucial date for age calculation is **1st August** of the examination year. A candidate must have attained 21 years of age and must not have exceeded the upper age limit as of August 1.

| Category | Minimum Age | Maximum Age Limit | Permissible Attempts |
| :--- | :--- | :--- | :--- |
| **General / Unreserved** | 21 Years | 32 Years | 6 Attempts |
| **EWS (Economically Weaker Section)** | 21 Years | 32 Years | 6 Attempts |
| **OBC (Non-Creamy Layer)** | 21 Years | 35 Years (+3 Years) | 9 Attempts |
| **SC / ST** | 21 Years | 37 Years (+5 Years) | Unlimited (up to 37 years) |
| **PwBD (General / EWS / OBC)** | 21 Years | 42 Years (+10 Years) | 9 Attempts (General/EWS/OBC) |
| **PwBD (SC / ST)** | 21 Years | 42 Years (+10 Years) | Unlimited (up to 42 years) |
| **Ex-Servicemen Commissioned Officers** | 21 Years | 37 Years (+5 Years) | Standard as per category |

---

## 3. What Counts as an Attempt?

A common misunderstanding among aspirants is whether merely filling out the application form counts toward the attempt limit.

- **Filling the Form Only**: **Does NOT** count as an attempt.
- **Appearing in Even One Paper of Prelims**: **DOES** count as an official attempt. If you sit for Paper-I (General Studies), your attempt is consumed even if you skip Paper-II (CSAT).
- **Disqualification or Cancellation**: Still counts as an attempt.

---

## 4. Educational Qualifications

1. The candidate must hold a degree from a university incorporated by an Act of the Central or State Legislature in India or other educational institutions established by an Act of Parliament.
2. **Candidates in their Final Year**: Eligible to appear in the Preliminary Examination provided they can submit documentary proof of passing the degree before appearing for the Civil Services (Main) Examination.
3. **Correspondence / Distance Education**: Degrees from recognized open universities (e.g. IGNOU) are fully recognized and eligible.
4. **No Minimum Percentage Required**: Even a simple pass percentage in graduation fulfills the criterion.`,
    content_hi: `## UPSC सिविल सेवा पात्रता नियम

संघ लोक सेवा आयोग (UPSC) द्वारा आयोजित सिविल सेवा परीक्षा में सम्मिलित होने के लिए न्यूनतम आयु 21 वर्ष है। आयु की गणना परीक्षा वर्ष की 1 अगस्त के आधार पर की जाती है।

### आयु सीमा एवं प्रयास:
- **सामान्य वर्ग (General)**: 32 वर्ष (अधिकतम 6 प्रयास)
- **ओबीसी (OBC Non-Creamy Layer)**: 35 वर्ष (अधिकतम 9 प्रयास)
- **एससी / एसटी (SC/ST)**: 37 वर्ष (असीमित प्रयास)
- **दिव्यांग (PwBD)**: 42 वर्ष

प्रारंभिक परीक्षा के किसी भी एक प्रश्न-पत्र में उपस्थित होने पर वह एक प्रयास गिना जाता है।`,
    category_slug: "eligibility-rules",
    tags: ["UPSC CSE", "Eligibility", "Age Limit", "Attempts", "Reservation"],
    faqs: [
      {
        question: "Does applying for UPSC CSE count as an attempt?",
        answer: "No. Merely applying does not count. An attempt is only counted if the candidate actually appears for at least one paper in the Preliminary Examination.",
        question_hi: "क्या केवल आवेदन पत्र भरने से प्रयास गिना जाता है?",
        answer_hi: "नहीं, जब तक उम्मीदवार प्रारंभिक परीक्षा के किसी एक पेपर में शामिल नहीं होता, तब तक प्रयास नहीं गिना जाता।"
      },
      {
        question: "Can final-year degree students apply for UPSC Prelims?",
        answer: "Yes. Final-year students can appear in the Preliminary exam, but must produce proof of passing their graduation degree when submitting the Detailed Application Form (DAF) for Mains.",
        question_hi: "क्या ग्रेजुएशन के अंतिम वर्ष के छात्र आवेदन कर सकते हैं?",
        answer_hi: "हाँ, अंतिम वर्ष के छात्र प्रारंभिक परीक्षा दे सकते हैं, लेकिन मेन्स परीक्षा से पहले डिग्री उत्तीर्ण करने का प्रमाण प्रस्तुत करना होगा।"
      }
    ],
    reading_time_minutes: 6,
    status: "published",
    author_name: "SuchnaSetu Career Editorial Desk",
    author_role: "Constitutional & Civil Services Legal Expert",
    featured_image: null,
    view_count: 2190,
    published_at: "2026-09-18T10:00:00.000Z",
    created_at: "2026-09-18T10:00:00.000Z",
    updated_at: "2026-09-25T14:00:00.000Z",
  },
  {
    id: "cr-003-7th-pay-commission",
    slug: "7th-pay-commission-matrix-level-7-vs-level-8-salary",
    title: "7th Pay Commission Salary Structure: Pay Level 7 vs Level 8 In-Hand Pay, DA & HRA",
    title_hi: "7वां वेतन आयोग: पे लेवल 7 बनाम लेवल 8 का इन-हैंड वेतन, DA, HRA एवं कटौती का पूरा हिसाब",
    excerpt: "Comprehensive comparison of central government Pay Level 7 (44,900) vs Level 8 (47,600) salary breakdown across X, Y, and Z class cities with allowances and NPS deductions.",
    excerpt_hi: "केंद्र सरकार के कर्मचारियों के लिए पे लेवल 7 और लेवल 8 का वास्तविक इन-हैंड वेतन, महंगाई भत्ता (DA), मकान किराया भत्ता (HRA) और एनपीएस कटौती की पूरी गणना।",
    content: `## 7th Central Pay Commission (CPC) Pay Matrix

In central government recruitments (UPSC, SSC CGL, Railways, Defence Civilians), posts are classified under distinct Pay Matrix Levels ranging from Level 1 to Level 18. Among graduate recruitment notifications, **Level 7 (GP 4600)** and **Level 8 (GP 4800)** represent the most sought-after executive and managerial vacancies.

---

## 1. Basic Pay Comparison

| Attribute | Pay Level 7 (Group B Non-Gazetted / Gazetted) | Pay Level 8 (Group B Gazetted) |
| :--- | :--- | :--- |
| **Typical Posts** | ASO (CSS/MEA/IB), Income Tax Inspector, GST Inspector | Assistant Audit Officer (AAO), Assistant Accounts Officer |
| **Initial Basic Pay (Index 1)** | ₹44,900 | ₹47,600 |
| **Maximum Basic Pay (Index 40)** | ₹1,42,400 | ₹1,51,100 |
| **Annual Increment Rate** | 3% compounded annually | 3% compounded annually |

---

## 2. City Classification for Allowances

Allowances depend significantly on the posted city category:
- **Class X (Cities with population > 50 Lakhs)**: Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Ahmedabad, Pune.
- **Class Y (Cities with population 5 to 50 Lakhs)**: Lucknow, Patna, Jaipur, Bhopal, Chandigarh, Kochi, etc.
- **Class Z (All other cities and rural locations)**.

### HRA (House Rent Allowance) Rates
- **X Class**: 30% of Basic Pay (revised when DA crossed 50%).
- **Y Class**: 20% of Basic Pay.
- **Z Class**: 10% of Basic Pay.

---

## 3. Detailed Monthly Salary Calculation (Level 7 vs Level 8)

Below is the salary breakdown for **Class X Cities** (e.g. New Delhi):

### Pay Level 7 (Basic: ₹44,900)
- **Basic Pay**: ₹44,900
- **Dearness Allowance (DA @ 53%)**: ₹23,797
- **House Rent Allowance (HRA @ 30%)**: ₹13,470
- **Transport Allowance (TA - ₹3,600 + DA on TA)**: ₹5,508
- **Gross Monthly Salary**: **₹87,675**
- *Statutory Deductions (NPS 10% of Basic+DA ~ ₹6,870, CGHS ~ ₹650, CGEGIS ~ ₹60)*: ₹7,580
- **Net In-Hand Salary (Approx)**: **₹80,095**

### Pay Level 8 (Basic: ₹47,600)
- **Basic Pay**: ₹47,600
- **Dearness Allowance (DA @ 53%)**: ₹25,228
- **House Rent Allowance (HRA @ 30%)**: ₹14,280
- **Transport Allowance (TA - ₹3,600 + DA on TA)**: ₹5,508
- **Gross Monthly Salary**: **₹92,616**
- *Statutory Deductions (NPS ~ ₹7,283, CGHS ~ ₹650, CGEGIS ~ ₹60)*: ₹7,993
- **Net In-Hand Salary (Approx)**: **₹84,623**

---

## 4. Other Executive Perks & Entitlements
1. **Children Education Allowance (CEA)**: ₹2,250 per month per child (up to two children) + hostel subsidy where applicable.
2. **Leave Travel Concession (LTC)**: Air travel eligibility in Economy class for home town and all-India visits as per service rules.
3. **Medical Facility (CGHS)**: Complete indoor and outdoor medical coverage for employee and recognized dependents.
4. **Annual Bonus**: Non-Productivity Linked Bonus (ad-hoc) of approximately ₹6,908 per financial year.`,
    content_hi: `## पे लेवल 7 और लेवल 8 का वेतन विश्लेषण

केंद्र सरकार के 7वें वेतन आयोग के अंतर्गत पे लेवल 7 (मूल वेतन ₹44,900) और पे लेवल 8 (मूल वेतन ₹47,600) सर्वाधिक लोकप्रिय पद हैं।

### दिल्ली (X श्रेणी) में अनुमानित मासिक वेतन (पे लेवल 7):
- मूल वेतन: ₹44,900
- महंगाई भत्ता (DA 53%): ₹23,797
- मकान किराया भत्ता (HRA 30%): ₹13,470
- परिवहन भत्ता (TA): ₹5,508
- **सकल वेतन (Gross)**: ₹87,675
- **इन-हैंड वेतन (कटौती उपरांत)**: लगभग ₹80,000 प्रति माह`,
    category_slug: "salary-perks",
    tags: ["7th Pay Commission", "Salary", "Pay Level 7", "Pay Level 8", "Allowances", "SSC CGL"],
    faqs: [
      {
        question: "What is the initial in-hand salary of an SSC CGL Inspector (Level 7)?",
        answer: "In a Tier-1 (X class) city like Delhi, the in-hand salary for Pay Level 7 is approximately ₹78,000–₹81,000 per month after mandatory NPS and CGHS deductions.",
        question_hi: "पे लेवल 7 में शुरुआती इन-हैंड वेतन कितना मिलता है?",
        answer_hi: "दिल्ली जैसे महानगरों में सभी कटौतियों के बाद लगभग ₹78,000 से ₹81,000 प्रति माह इन-हैंड मिलता है।"
      },
      {
        question: "What is the current Dearness Allowance (DA) rate under 7th CPC?",
        answer: "Dearness Allowance is revised bi-annually (effective January and July) based on the All-India Consumer Price Index (AICPIN). It currently stands above 50%, triggering automatic revisions in HRA slabs.",
        question_hi: "वर्तमान में महंगाई भत्ता (DA) कितना है?",
        answer_hi: "डीए की दरें 50% से अधिक हैं, जिससे एचआरए की दरों में भी 30%, 20% और 10% की वृद्धि हुई है।"
      }
    ],
    reading_time_minutes: 6,
    status: "published",
    author_name: "SuchnaSetu Career Editorial Desk",
    author_role: "Government Compensation & Pay Commission Specialist",
    featured_image: null,
    view_count: 3410,
    published_at: "2026-09-22T06:00:00.000Z",
    created_at: "2026-09-22T06:00:00.000Z",
    updated_at: "2026-09-25T16:00:00.000Z",
  },
  {
    id: "cr-004-railway-rrb-alp",
    slug: "railway-rrb-alp-technician-selection-stages",
    title: "RRB ALP & Technician Selection Process: CBT-1, CBT-2, CBAT & Medical Standard A-1",
    title_hi: "रेलवे RRB ALP एवं तकनीशियन चयन प्रक्रिया: CBT-1, CBT-2, CBAT एवं मेडिकल स्टैंडर्ड A-1",
    excerpt: "Step-by-step navigation of the Railway Recruitment Board Assistant Loco Pilot exam stages, psycho test batteries, normalized scoring, and stringent vision fitness criteria.",
    excerpt_hi: "रेलवे भर्ती बोर्ड सहायक लोको पायलट परीक्षा के प्रत्येक चरण, कंप्यूटर आधारित एप्टीट्यूड टेस्ट और आंखों की मेडिकल फिटनेस A-1 के संपूर्ण नियम।",
    content: `## The Journey to Becoming an Indian Railways Assistant Loco Pilot

The Railway Recruitment Board (RRB) Assistant Loco Pilot (ALP) post is one of the largest technical recruitment drives in India. Because an ALP operates locomotive engines carrying thousands of passengers, the recruitment involves stringent technical and psychological examinations, culminating in the **Medical Standard A-1** vision test.

---

## 1. Overview of Selection Stages

1. **First Stage Computer Based Test (CBT-1)**: Screening test (Qualifying).
2. **Second Stage Computer Based Test (CBT-2)**:
   - Part A (90 minutes): 100% weightage for shortlisting to CBAT.
   - Part B (60 minutes): Qualifying trade test (35% marks mandatory).
3. **Computer Based Aptitude Test (CBAT / Psycho Test)**: For ALP only.
4. **Document Verification (DV) & Empanelling**.
5. **Rigorous Medical Examination (A-1 Standard)**.

---

## 2. CBT-1 Exam Pattern & Syllabus
- **Duration**: 60 Minutes
- **Total Questions**: 75
- **Marking Scheme**: +1 for correct, -1/3 for wrong.

| Section | Number of Questions | Key Topics |
| :--- | :--- | :--- |
| **Mathematics** | 20 | Number systems, BODMAS, Decimals, Fractions, LCM-HCF, Ratio, Time & Work |
| **General Intelligence & Reasoning** | 25 | Analogies, Mathematical Operations, Syllogism, Venn Diagrams, Coding-Decoding |
| **General Science** | 20 | 10th Standard Physics, Chemistry, and Life Sciences (NCERT based) |
| **General Awareness on Current Affairs** | 10 | Science & Technology, Sports, Culture, Personalities, Economics, Politics |

---

## 3. CBT-2 Part A & Part B Breakdown
Only candidates scoring above the normalized cutoff in CBT-1 are shortlisted for CBT-2 (ratio of 1:15 times the notified vacancies).

- **Part A (100 Questions, 90 Mins)**: Mathematics (25 Q), General Intelligence & Reasoning (25 Q), Basic Science and Engineering (40 Q), and General Awareness (10 Q). Marks scored in Part A determine final merit (70% weightage).
- **Part B (75 Questions, 60 Mins)**: Questions from candidate's designated ITI / Trade syllabus approved by the Directorate General of Training (DGT). Candidates must score at least 35% (26.25 marks) to pass, regardless of community quota.

---

## 4. The Make-or-Break Medical Standard A-1

More than 20% of otherwise qualified candidates get disqualified at the medical stage because **Medical Standard A-1 cannot be compromised**.

### Vision Standards:
- **Distant Vision**: 6/6, 6/6 without glasses (Lens/Glasses not allowed under any circumstances).
- **Near Vision**: Sn 0.6, 0.6 without glasses.
- **Must Pass Tests for**: Color Vision, Binocular Vision, Field of Vision, Night Vision, and Mesopic Vision.
- **LASIK / Refractive Surgery**: **STRICTLY DISQUALIFIED**. Railway medical boards use advanced slit-lamp photography to detect prior eye surgeries. Candidates who underwent LASIK are declared permanently unfit for ALP.`,
    content_hi: `## रेलवे ALP भर्ती चयन प्रक्रिया

रेलवे सहायक लोको पायलट (ALP) पद पर चयन के लिए तीन प्रमुख चरण होते हैं:
1. **CBT-1 (स्क्रीनिंग)**: 75 प्रश्न, 60 मिनट।
2. **CBT-2**:
   - भाग A: 100 प्रश्न (मेरिट का 70% आधार)
   - भाग B: 75 प्रश्न (ट्रेड टेस्ट - 35% अंक अनिवार्य)
3. **CBAT (साइको टेस्ट)**: प्रत्येक बैटरी में 42 अंक अनिवार्य (मेरिट का 30% आधार)

### मेडिकल स्टैंडर्ड A-1 (सबसे महत्वपूर्ण):
- बिना चश्मे के 6/6 दूर दृष्टि अनिवार्य।
- **LASIK सर्जरी वाले अभ्यर्थी अयोग्य घोषित किए जाते हैं।**`,
    category_slug: "career-roadmaps",
    tags: ["RRB ALP", "Indian Railways", "Loco Pilot", "Medical Standard A-1", "CBAT", "Syllabus"],
    faqs: [
      {
        question: "Is LASIK laser eye surgery permitted for RRB ALP candidates?",
        answer: "No. LASIK or any surgical procedure to correct refractive error is strictly prohibited for Medical Standard A-1. Candidates with LASIK history are disqualified.",
        question_hi: "क्या RRB ALP में LASIK लेजर सर्जरी मान्य है?",
        answer_hi: "नहीं, A-1 मेडिकल स्टैंडर्ड के लिए लेसिक या आंखों की कोई भी सर्जरी अमान्य है और ऐसे अभ्यर्थी अनफिट घोषित किए जाते हैं।"
      },
      {
        question: "What is the weightage of CBT-2 and CBAT in the final ALP merit list?",
        answer: "The final merit list is prepared giving 70% weightage to marks obtained in Part A of CBT-2 and 30% weightage to the Computer Based Aptitude Test (CBAT).",
        question_hi: "अंतिम मेरिट सूची में CBT-2 और साइको टेस्ट का कितना वेटेज होता है?",
        answer_hi: "अंतिम मेरिट में CBT-2 पार्ट-A का 70% और CBAT (साइको टेस्ट) का 30% वेटेज जोड़ा जाता है।"
      }
    ],
    reading_time_minutes: 8,
    status: "published",
    author_name: "SuchnaSetu Career Editorial Desk",
    author_role: "Railway Technical Recruitment Specialist",
    featured_image: null,
    view_count: 2890,
    published_at: "2026-09-21T07:00:00.000Z",
    created_at: "2026-09-21T07:00:00.000Z",
    updated_at: "2026-09-25T15:00:00.000Z",
  },
  {
    id: "cr-005-bank-po-vs-ssc-cgl",
    slug: "bank-po-vs-ssc-cgl-career-comparison",
    title: "Bank PO vs SSC CGL: Work-Life Balance, Salary, Promotion Ladder & Job Stability",
    title_hi: "बैंक पीओ बनाम SSC CGL: वर्क-लाइफ बैलेंस, वेतन, पदोन्नति एवं नौकरी की स्थिरता की तुलना",
    excerpt: "Unbiased, detailed comparative analysis between Public Sector Bank Probationary Officer (IBPS/SBI PO) and Central Government Inspector (SSC CGL) to help you choose the right path.",
    excerpt_hi: "सरकारी बैंक पीओ और केंद्रीय सचिवालय/इस्पेक्टर पदों के बीच वास्तविक कार्यशैली, स्थानांतरण नीति, पदोन्नति के अवसर और जीवनशैली की निष्पक्ष तुलना।",
    content: `## The Ultimate Career Dilemma: Banking or SSC?

Every year, lakhs of graduates prepare simultaneously for Public Sector Bank PO exams (SBI PO, IBPS PO) and Staff Selection Commission (SSC CGL). While both career paths offer immense prestige, pension security, and financial independence, their day-to-day realities and career trajectories differ substantially.

---

## 1. Quick Comparison Snapshot

| Feature | Bank PO (SBI / IBPS) | SSC CGL (Inspector / ASO) |
| :--- | :--- | :--- |
| **Exam Cycle Duration** | Extremely Fast (6 to 8 Months) | Moderate to Slow (10 to 14 Months) |
| **Initial In-Hand Salary** | ₹65,000 – ₹78,000 (Higher allowances in SBI) | ₹72,000 – ₹82,000 (Pay Level 7) |
| **Work-Life Balance** | High Pressure, Customer Dealing, Target Oriented | Structured (9 to 5), 5-Day Week (ASO/Desk roles) |
| **Transfer Frequency** | Every 3 years (Rural/Semi-urban mandatory) | Zonal transfers; CSS/MEA/Railways mostly Delhi |
| **Promotion Velocity** | Very Fast (Can reach AGM/DGM in 12–15 years) | Slower, seniority-linked |
| **Public Holidays** | 2nd & 4th Saturday Off, Banking holidays | All Saturdays & Sundays Off, 17+ Gazetted holidays |

---

## 2. In-Depth Analysis: The 4 Key Decision Pillars

### Pillar 1: Work-Life Balance & Stress
- **Bank PO**: As a branch officer, you handle cash limits, loan appraisals, NPA recoveries, and direct retail customer friction. Evening departures regularly stretch to 7:00 PM or 8:00 PM during audit seasons or financial year-ends.
- **SSC CGL**: Desk posts like Assistant Section Officer (ASO) in Central Secretariat Service (CSS), Ministry of External Affairs (MEA), or Railway Board offer a predictable 9:00 AM to 5:30 PM working environment with zero public interface and no quarterly targets. Field posts (GST Inspector, Preventive Officer) have operational inspections but maintain high administrative autonomy.

### Pillar 2: Promotional Ladder
- **Bank PO Wins Hands Down**: The banking sector operates on a strict merit-cum-performance appraisal system. An ambitious PO who clears JAIIB and CAIIB exams can realistically rise from Scale-I Officer to Chief Manager (Scale-IV) in under a decade, with opportunities to reach General Manager (GM) or Executive Director (ED).
- **SSC CGL is Seniority-Bound**: Promotions in government departments typically require 6 to 10 years per step and heavily rely on departmental vacancy ratios and seniority lists.

### Pillar 3: Posting & Relocation
- **Bank PO**: Mandatory rural or semi-urban branches for 2 to 3 years to qualify for higher-scale promotions. All-India transferability every 3 to 4 years.
- **SSC CGL**: ASO posts in CSS, MEA, and AFHQ offer lifelong or long-term postings in New Delhi. For field inspectors, zonal allocation remains stable unless a candidate requests mutual or compassionate transfer.

---

## 3. Which One Should You Choose?

### Choose Bank PO if:
1. You need a government job **urgently within 6 to 9 months** (banking exam calendars are clockwork).
2. You thrive in fast-paced commercial environments and aspire to rapid executive promotions.
3. You enjoy customer interaction, financial analysis, and do not mind frequent city relocations.

### Choose SSC CGL if:
1. You prioritize **work-life balance, peace of mind, and fixed working hours**.
2. You want a 5-day working week to spend time with family or prepare for UPSC Civil Services.
3. You prefer administrative authority and metropolitan stability (Delhi or major state capitals).`,
    content_hi: `## बैंक पीओ बनाम SSC CGL: कौन सा विकल्प बेहतर है?

दोनों ही करियर विकल्प स्नातक युवाओं के बीच बेहद लोकप्रिय हैं, लेकिन दोनों की कार्यशैली में बड़ा अंतर है:

### बैंक पीओ (SBI/IBPS):
- भर्ती प्रक्रिया बेहद तेज़ (6-8 महीने में नियुक्ति)।
- पदोन्नति बहुत तेज़ी से होती है (10-12 वर्षों में शीर्ष प्रबंधन तक)।
- कार्य का दबाव अधिक और प्रत्येक 3 वर्ष में स्थानांतरण।

### SSC CGL (ASO / इंस्पेक्टर):
- 5-दिवसीय कार्य सप्ताह, निश्चित कार्य समय (सुबह 9:00 से शाम 5:30)।
- केंद्रीय सचिवालय (दिल्ली) में स्थायी पोस्टिंग का अवसर।
- वर्क-लाइफ बैलेंस बहुत बेहतर होता है।`,
    category_slug: "career-roadmaps",
    tags: ["Bank PO", "SSC CGL", "Career Comparison", "IBPS", "SBI PO", "Work Life Balance"],
    faqs: [
      {
        question: "Which exam has a faster recruitment cycle: Bank PO or SSC CGL?",
        answer: "Bank PO has a much faster and more predictable cycle. IBPS and SBI typically release notifications, conduct Prelims and Mains, and issue appointment letters within 6 to 8 months.",
        question_hi: "बैंक पीओ और SSC CGL में से किसकी भर्ती प्रक्रिया तेज़ है?",
        answer_hi: "बैंक पीओ की भर्ती प्रक्रिया अधिक तेज़ और समयबद्ध होती है, जो 6 से 8 महीने में पूरी हो जाती है।"
      },
      {
        question: "Can an SSC CGL employee get a permanent Delhi posting?",
        answer: "Yes. Posts like Assistant Section Officer (ASO) in Central Secretariat Service (CSS), Ministry of External Affairs (MEA), Ministry of Defence (AFHQ), and Railway Board are primarily stationed in New Delhi for the majority of their service.",
        question_hi: "क्या SSC CGL में दिल्ली में स्थायी पोस्टिंग मिल सकती है?",
        answer_hi: "हाँ, केंद्रीय सचिवालय (CSS), विदेश मंत्रालय (MEA) आदि पदों पर अधिकांश सेवाकाल दिल्ली में ही व्यतीत होता है।"
      }
    ],
    reading_time_minutes: 7,
    status: "published",
    author_name: "SuchnaSetu Career Editorial Desk",
    author_role: "Banking & Central Administrative Career Counselor",
    featured_image: null,
    view_count: 4120,
    published_at: "2026-09-23T09:00:00.000Z",
    created_at: "2026-09-23T09:00:00.000Z",
    updated_at: "2026-09-25T17:00:00.000Z",
  },
];
