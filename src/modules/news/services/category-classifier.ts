import { NewsCategorySlug } from "../types/category";

interface ClassificationInput {
  title: string;
  summary?: string | null;
  content?: string | null;
  sourceDefaultCategory?: string | null;
  sourceUrl?: string | null;
  tags?: string[] | null;
}

interface CategoryRule {
  category: NewsCategorySlug;
  keywords: string[];
  patterns?: RegExp[];
  weight: number;
}

const CATEGORY_RULES: CategoryRule[] = [
  // 1. SPORTS & ATHLETICS
  {
    category: "sports",
    weight: 1.4,
    keywords: [
      "cricket", "bcci", "ipl", "t20", "odi", "test match", "wicket", "century",
      "rohit sharma", "virat kohli", "bumrah", "hardik pandya", "shubman gill",
      "football", "fifa", "isl", "messi", "ronaldo", "premier league",
      "hockey", "olympics", "paralympics", "asian games", "commonwealth",
      "gold medal", "silver medal", "bronze medal", "podium",
      "badminton", "pv sindhu", "lakshya sen", "satwik", "chirag",
      "chess", "gukesh", "praggnanandhaa", "viswanathan anand", "fide",
      "tennis", "wimbledon", "us open", "french open", "australian open",
      "wrestling", "vinesh phogat", "bajrang punia", "boxing", "athletics",
      "neeraj chopra", "javelin", "archery", "shooting", "tournament",
      "championship", "coach", "umpire", "referee", "stadium", "match",
      // Hindi terms
      "खेल", "क्रिकेट", "बीसीसीआई", "आईपीएल", "टेस्ट मैच", "वनडे", "टी20", "विश्व कप",
      "ट्रॉफी", "रोहित शर्मा", "विराट कोहली", "फुटबॉल", "फीफा", "हॉकी", "ओलंपिक",
      "पदक", "स्वर्ण पदक", "बैडमिंटन", "शतरंज", "कुश्ती", "मुक्केबाजी", "नीरज चोपड़ा"
    ],
    patterns: [
      /\b(?:cricketer|batsman|bowler|wicketkeeper|all-rounder)\b/i,
      /\b(?:scored \d+ runs|won by \d+ wickets|won by \d+ runs)\b/i,
      /\b(?:clinch(?:es|ed)? (?:gold|silver|bronze|title|trophy))\b/i,
    ],
  },

  // 2. EDUCATION & ACADEMICS
  {
    category: "education",
    weight: 1.3,
    keywords: [
      "cbse", "icse", "ugc", "aicte", "nta", "neet", "jee main", "jee advanced",
      "cuet", "board exam", "class 10", "class 12", "exam results", "result declared",
      "admit card", "hall ticket", "answer key", "counselling", "cutoff",
      "syllabus", "curriculum", "university", "college", "school", "campus",
      "student", "students", "scholarship", "fellowship", "phd", "ugc net",
      "iit", "iim", "nit", "iiit", "ncert", "higher education",
      "teacher recruitment", "tet", "ctet", "b.ed", "d.el.ed", "degree", "diploma",
      // Hindi terms
      "शिक्षा", "सीबीएसई", "यूजीसी", "एनटीए", "नीट", "जेईई", "बोर्ड परीक्षा",
      "कक्षा 10", "कक्षा 12", "परीक्षा परिणाम", "प्रवेश पत्र", "उत्तर कुंजी", "कटऑफ",
      "पाठ्यक्रम", "प्रवेश", "विश्वविद्यालय", "कॉलेज", "स्कूल", "छात्र", "छात्रा",
      "छात्रवृत्ति", "आईआईटी", "आईआईएम", "एनसीईआरटी", "उच्च शिक्षा", "शिक्षक भर्ती"
    ],
    patterns: [
      /\b(?:admit card|results? declared|answer key released)\b/i,
      /\b(?:class 10th?|class 12th?|board examinations?)\b/i,
      /\b(?:neet ug|neet pg|jee main|cuet ug)\b/i,
    ],
  },

  // 3. ENTERTAINMENT & CULTURE
  {
    category: "entertainment",
    weight: 1.3,
    keywords: [
      "bollywood", "hollywood", "tollywood", "kollywood", "cinema", "movie",
      "film", "films", "trailer", "teaser", "box office", "actor", "actress",
      "director", "producer", "superstar", "celebrity", "ott", "netflix",
      "amazon prime", "disney+ hotstar", "web series", "song", "music video",
      "album", "concert", "national film awards", "oscar", "oscars", "grammy",
      "cannes", "film festival", "theatre", "art exhibition", "cultural dance",
      // Hindi terms
      "मनोरंजन", "बॉलीवुड", "सिनेमा", "फिल्म", "मूवी", "ट्रेलर", "टीज़र", "बॉक्स ऑफिस",
      "अभिनेता", "अभिनेत्री", "निर्देशक", "सुपरस्टार", "सेलिब्रिटी", "ओटीटी", "नेटफ्लिक्स",
      "गाना", "संगीत", "राष्ट्रीय फिल्म पुरस्कार", "ऑस्कर", "उत्सव", "कलाकार", "कला", "नाटक"
    ],
    patterns: [
      /\b(?:box office collection|day \d+ box office|trailer out now)\b/i,
      /\b(?:ott release date|streaming on)\b/i,
    ],
  },

  // 4. HEALTH & PUBLIC SAFETY
  {
    category: "health",
    weight: 1.3,
    keywords: [
      "hospital", "doctor", "doctors", "patient", "patients", "medical college",
      "aiims", "disease", "infection", "epidemic", "pandemic", "virus", "viral",
      "covid", "coronavirus", "dengue", "malaria", "chikungunya", "cholera",
      "vaccine", "vaccination", "immunization", "icmr", "who", "health ministry",
      "mental health", "depression", "cancer", "diabetes", "cardiac", "heart attack",
      "surgery", "transplant", "drug", "medicine", "pharmaceutical", "clinical trial",
      "ayushman bharat", "wellness", "diet", "nutrition", "sanitation", "pollution aqi",
      // Hindi terms
      "स्वास्थ्य", "चिकित्सा", "अस्पताल", "डॉक्टर", "मरीज", "बीमारी", "वायरस",
      "संक्रमण", "महामारी", "कोविड", "डेंगू", "मलेरिया", "टीका", "टीकाकरण",
      "आईसीएमआर", "दवा", "औषधि", "कैंसर", "मधुमेह", "हृदय रोग", "सर्जरी", "आरोग्य"
    ],
    patterns: [
      /\b(?:outbreak of|surge in cases|health advisory|air quality index|aqi severe)\b/i,
    ],
  },

  // 5. TECHNOLOGY & SCIENCE
  {
    category: "technology",
    weight: 1.25,
    keywords: [
      "technology", "artificial intelligence", "genai", "generative ai", "chatgpt",
      "openai", "deep learning", "machine learning", "cybersecurity", "cyberattack",
      "hacker", "ransomware", "data breach", "privacy", "isro", "nasa", "satellite",
      "rocket", "gaganyaan", "chandrayaan", "aditya-l1", "spacecraft", "astronomy",
      "5g", "6g", "telecom", "semiconductor", "microchip", "fab", "smartphone",
      "apple", "iphone", "google", "android", "microsoft", "nvidia", "quantum computing",
      "digital india", "software", "app", "algorithm", "fintech",
      // Hindi terms
      "प्रौद्योगिकी", "तकनीक", "एआई", "आर्टिफिशियल इंटेलिजेंस", "अंतरिक्ष", "इसरो", "नासा",
      "उपग्रह", "रॉकेट", "गगनयान", "चंद्रयान", "साइबर", "साइबर अपराध", "5जी", "6जी",
      "टेलीकॉम", "स्मार्टफोन", "डिजिटल इंडिया", "सॉफ्टवेयर", "विज्ञान", "वैज्ञानिक"
    ],
    patterns: [
      /\b(?:isro launches|satellite placed|semiconductor plant|ai model)\b/i,
    ],
  },

  // 6. BUSINESS & ECONOMY
  {
    category: "business",
    weight: 1.25,
    keywords: [
      "economy", "economic", "gdp", "growth rate", "inflation", "cpi", "wpi",
      "rbi", "reserve bank", "repo rate", "monetary policy", "sensex", "nifty",
      "bse", "nse", "stock market", "share market", "wall street", "rupee", "dollar",
      "bank", "banking", "sbi", "hdfc", "icici", "pnb", "loan", "interest rate",
      "tax", "income tax", "gst", "gst collection", "finance ministry", "union budget",
      "fiscal deficit", "fdi", "investment", "mutual fund", "ipo", "listing",
      "export", "import", "trade deficit", "sebi", "startup", "unicorn", "funding",
      "corporate", "company", "merger", "acquisition", "revenue", "profit",
      // Hindi terms
      "अर्थव्यवस्था", "आर्थिक", "जीडीपी", "महंगाई", "आरबीआई", "रेपो रेट", "सेंसेक्स",
      "निफ्टी", "शेयर बाजार", "रुपया", "डॉलर", "बैंक", "बैंकिंग", "ऋण", "ब्याज दर",
      "आयकर", "जीएसटी", "वित्त मंत्रालय", "बजट", "निवेश", "निर्यात", "आयात", "सेबी", "व्यापार"
    ],
    patterns: [
      /\b(?:repo rate|sensex surges|nifty falls|gst revenue|quarterly results)\b/i,
      /\b(?:ipo opens|market capitali[sz]ation|all-time high)\b/i,
    ],
  },

  // 7. WORLD & FOREIGN AFFAIRS
  {
    category: "world",
    weight: 1.25,
    keywords: [
      "world", "international", "global", "foreign ministry", "external affairs",
      "diplomacy", "diplomatic", "bilateral", "summit", "united nations", "un security council",
      "unsc", "un general assembly", "white house", "pentagon", "kremlin",
      "united states", "america", "washington", "joe biden", "donald trump", "kamala harris",
      "china", "beijing", "xi jinping", "taiwan",
      "russia", "moscow", "vladimir putin", "ukraine", "kyiv", "zelenskyy",
      "israel", "tel aviv", "jerusalem", "gaza", "palestine", "hamas", "hezbollah", "lebanon", "iran",
      "pakistan", "islamabad", "bangladesh", "dhaka", "sri lanka", "colombo", "nepal", "kathmandu",
      "europe", "european union", "uk", "london", "prime minister starmer",
      "ceasefire", "treaty", "g20", "g7", "brics", "asean", "quad",
      // Hindi terms
      "विदेश", "अंतरराष्ट्रीय", "वैश्विक", "कूटनीति", "संयुक्त राष्ट्र", "सुरक्षा परिषद",
      "अमेरिका", "चीन", "रूस", "यूक्रेन", "इजरायल", "गाजा", "फिलीस्तीन", "ईरान",
      "पाकिस्तान", "बांग्लादेश", "नेपाल", "यूरोप", "व्हाइट हाउस", "बाइडेन", "ट्रंप",
      "पुतिन", "युद्धविराम", "ब्रिक्स", "द्विपक्षीय"
    ],
    patterns: [
      /\b(?:external affairs minister|bilateral talks|foreign policy|border tensions)\b/i,
      /\b(?:un general assembly|security council meeting|ceasefire agreement)\b/i,
    ],
  },

  // 8. POLITICS & ELECTIONS
  {
    category: "politics",
    weight: 1.2,
    keywords: [
      "election", "elections", "assembly election", "lok sabha", "rajya sabha",
      "vidhan sabha", "bypoll", "by-election", "voter", "voters", "voting",
      "polling booth", "evm", "election commission", "eci", "poll schedule",
      "bjp", "congress", "aap", "tmc", "samajwadi party", "bsp", "jdu", "rjd",
      "shiv sena", "ncp", "dmk", "aiadmk", "brs", "bjd", "cpim",
      "narendra modi", "rahul gandhi", "amit shah", "mallikarjun kharge", "arvind kejriwal",
      "political party", "rally", "campaign", "seat-sharing", "alliance", "coalition",
      "nda", "india alliance", "india bloc", "mla", "mp", "member of parliament",
      "opposition leader", "spokesperson", "manifesto", "vote share", "party chief",
      // Hindi terms
      "राजनीति", "चुनाव", "उपचुनाव", "विधानसभा चुनाव", "लोकसभा", "राज्यसभा", "विधानसभा",
      "मतदान", "मतदाता", "ईवीएम", "चुनाव आयोग", "भाजपा", "कांग्रेस", "आप", "सपा",
      "बसपा", "जदयू", "राजद", "शिवसेना", "सांसद", "विधायक", "विपक्ष", "गठबंधन",
      "रैली", "चुनावी", "प्रचार", "घोषणापत्र"
    ],
    patterns: [
      /\b(?:poll dates|assembly polls|seat sharing|vote counting|won the seat)\b/i,
      /\b(?:bjp-led|congress-led|india bloc|opposition parties)\b/i,
    ],
  },

  // 9. GOVERNANCE & PUBLIC SCHEMES
  {
    category: "governance",
    weight: 1.15,
    keywords: [
      "cabinet", "union cabinet", "cabinet approves", "cabinet committee", "pib",
      "press information bureau", "gazette", "official notification", "ministry of",
      "prime minister's office", "pmo", "supreme court", "high court", "chief justice",
      "cji", "bench", "verdict", "dopt", "upsc", "cbi", "enforcement directorate", "ed summons",
      "niti aayog", "civil services", "citizen charter", "aadhaar", "uidai",
      "ration card", "pm-kisan", "pm awas yojana", "ayushman card", "dbt",
      "government scheme", "public scheme", "welfare scheme", "ordinance",
      "parliament session", "bill passed", "act", "legislation", "constitutional",
      "policy decision", "government circular", "vigilance", "rti", "right to information",
      // Hindi terms
      "शासन", "मंत्रिमंडल", "कैबिनेट", "कैबिनेट मंजूरी", "अधिसूचना", "राजपत्र",
      "मंत्रालय", "प्रधानमंत्री कार्यालय", "सुप्रीम कोर्ट", "उच्च न्यायालय", "फैसला",
      "मुख्य न्यायाधीश", "योजना", "पीएम किसान", "राशन कार्ड", "आधार कार्ड", "सरकारी नीति",
      "अध्यादेश", "विधेयक", "संसद सत्र", "नागरिक चार्टर", "लोक कल्याण"
    ],
    patterns: [
      /\b(?:cabinet approves|union cabinet clears|supreme court rules|cji says)\b/i,
      /\b(?:gazette notification|welfare scheme launched|direct benefit transfer)\b/i,
    ],
  },

  // 10. STATES & REGIONAL AFFAIRS
  {
    category: "states",
    weight: 1.1,
    keywords: [
      "uttar pradesh", "bihar", "delhi", "maharashtra", "karnataka", "tamil nadu",
      "west bengal", "rajasthan", "gujarat", "punjab", "haryana", "madhya pradesh",
      "kerala", "telangana", "andhra pradesh", "odisha", "assam", "jharkhand",
      "chhattisgarh", "uttarakhand", "himachal pradesh", "jammu and kashmir",
      "lucknow", "patna", "mumbai", "bengaluru", "chennai", "kolkata", "hyderabad",
      "jaipur", "ahmedabad", "chandigarh", "bhopal", "dehradun", "ranchi", "shimla",
      "municipal corporation", "district magistrate", "dm", "police commissioner",
      "state cabinet", "state government", "high court bench",
      // Hindi terms
      "उत्तर प्रदेश", "बिहार", "दिल्ली", "महाराष्ट्र", "कर्नाटक", "तमिलनाडु",
      "पश्चिम बंगाल", "राजस्थान", "गुजरात", "पंजाब", "हरियाणा", "मध्य प्रदेश",
      "केरल", "तेलंगाना", "आंध्र प्रदेश", "ओडिशा", "असम", "झारखंड", "छत्तीसगढ़",
      "उत्तराखंड", "हिमाचल", "जम्मू-कश्मीर", "लखनऊ", "पटना", "मुंबई", "कोलकाता"
    ],
    patterns: [
      /\b(?:state government announces|district administration|municipal corporation)\b/i,
    ],
  },
];

export class CategoryClassifier {
  /**
   * Deterministically classifies an article into one of the 11 valid news categories.
   */
  public static classify(input: ClassificationInput): NewsCategorySlug {
    const combinedText = [
      input.title || "",
      input.summary || "",
      input.tags?.join(" ") || "",
      (input.content || "").slice(0, 1000),
    ].join(" ").toLowerCase();

    // 1. Check URL path patterns (e.g. /sports/, /education/, /world/, /business/)
    if (input.sourceUrl) {
      const urlLower = input.sourceUrl.toLowerCase();
      if (urlLower.includes("/sport/") || urlLower.includes("/sports/")) return "sports";
      if (urlLower.includes("/education/") || urlLower.includes("/jobs-careers/")) return "education";
      if (urlLower.includes("/entertainment/") || urlLower.includes("/cinema/") || urlLower.includes("/bollywood/")) return "entertainment";
      if (urlLower.includes("/world/") || urlLower.includes("/international/")) return "world";
      if (urlLower.includes("/business/") || urlLower.includes("/economy/") || urlLower.includes("/markets/")) return "business";
      if (urlLower.includes("/tech/") || urlLower.includes("/technology/") || urlLower.includes("/gadgets/")) return "technology";
      if (urlLower.includes("/health/") || urlLower.includes("/lifestyle/health/")) return "health";
      if (urlLower.includes("/politics/")) return "politics";
    }

    // 2. Score each category using keywords and regex patterns
    const scores = new Map<NewsCategorySlug, number>();

    for (const rule of CATEGORY_RULES) {
      let score = 0;

      // Keyword matches
      for (const kw of rule.keywords) {
        if (combinedText.includes(kw)) {
          // Extra weight if found in title
          const inTitle = (input.title || "").toLowerCase().includes(kw);
          score += (inTitle ? 3.5 : 1.0) * rule.weight;
        }
      }

      // Pattern matches
      if (rule.patterns) {
        for (const pattern of rule.patterns) {
          if (pattern.test(combinedText)) {
            score += 4.0 * rule.weight;
          }
        }
      }

      scores.set(rule.category, score);
    }

    // 3. Find category with maximum score
    let bestCategory: NewsCategorySlug | null = null;
    let maxScore = 0;

    for (const [cat, score] of scores.entries()) {
      if (score > maxScore) {
        maxScore = score;
        bestCategory = cat;
      }
    }

    // If strong classification confidence achieved (score >= 2.0)
    if (bestCategory && maxScore >= 2.0) {
      return bestCategory;
    }

    // 4. Source default category if specified and not just generic "india"
    if (input.sourceDefaultCategory && input.sourceDefaultCategory !== "india") {
      const def = input.sourceDefaultCategory.toLowerCase() as NewsCategorySlug;
      if (scores.has(def)) {
        return def;
      }
    }

    // 5. Default fallback to "india"
    return "india";
  }
}
