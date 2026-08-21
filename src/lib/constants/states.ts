export interface IndianState {
  code: string;
  name: string;
  hindiName: string;
  capital: string;
  pscName: string;
  pscAcronym: string;
  isUT?: boolean;
}

export const INDIAN_STATES: IndianState[] = [
  { code: "UP", name: "Uttar Pradesh", hindiName: "उत्तर प्रदेश", capital: "Lucknow", pscName: "Uttar Pradesh Public Service Commission", pscAcronym: "UPPSC" },
  { code: "BR", name: "Bihar", hindiName: "बिहार", capital: "Patna", pscName: "Bihar Public Service Commission", pscAcronym: "BPSC" },
  { code: "DL", name: "Delhi", hindiName: "दिल्ली", capital: "New Delhi", pscName: "Delhi Subordinate Services Selection Board", pscAcronym: "DSSSB", isUT: true },
  { code: "MP", name: "Madhya Pradesh", hindiName: "मध्य प्रदेश", capital: "Bhopal", pscName: "Madhya Pradesh Public Service Commission", pscAcronym: "MPPSC" },
  { code: "RJ", name: "Rajasthan", hindiName: "राजस्थान", capital: "Jaipur", pscName: "Rajasthan Public Service Commission", pscAcronym: "RPSC" },
  { code: "JH", name: "Jharkhand", hindiName: "झारखंड", capital: "Ranchi", pscName: "Jharkhand Public Service Commission", pscAcronym: "JPSC" },
  { code: "UK", name: "Uttarakhand", hindiName: "उत्तराखंड", capital: "Dehradun", pscName: "Uttarakhand Public Service Commission", pscAcronym: "UKPSC" },
  { code: "HR", name: "Haryana", hindiName: "हरियाणा", capital: "Chandigarh", pscName: "Haryana Public Service Commission", pscAcronym: "HPSC" },
  { code: "PB", name: "Punjab", hindiName: "पंजाब", capital: "Chandigarh", pscName: "Punjab Public Service Commission", pscAcronym: "PPSC" },
  { code: "WB", name: "West Bengal", hindiName: "पश्चिम बंगाल", capital: "Kolkata", pscName: "West Bengal Public Service Commission", pscAcronym: "WBPSC" },
  { code: "OD", name: "Odisha", hindiName: "ओडिशा", capital: "Bhubaneswar", pscName: "Odisha Public Service Commission", pscAcronym: "OPSC" },
  { code: "MH", name: "Maharashtra", hindiName: "महाराष्ट्र", capital: "Mumbai", pscName: "Maharashtra Public Service Commission", pscAcronym: "MPSC" },
  { code: "GJ", name: "Gujarat", hindiName: "गुजरात", capital: "Gandhinagar", pscName: "Gujarat Public Service Commission", pscAcronym: "GPSC" },
  { code: "KA", name: "Karnataka", hindiName: "कर्नाटक", capital: "Bengaluru", pscName: "Karnataka Public Service Commission", pscAcronym: "KPSC" },
  { code: "TN", name: "Tamil Nadu", hindiName: "तमिलनाडु", capital: "Chennai", pscName: "Tamil Nadu Public Service Commission", pscAcronym: "TNPSC" },
  { code: "AP", name: "Andhra Pradesh", hindiName: "आंध्र प्रदेश", capital: "Amaravati", pscName: "Andhra Pradesh Public Service Commission", pscAcronym: "APPSC" },
  { code: "TS", name: "Telangana", hindiName: "तेलंगाना", capital: "Hyderabad", pscName: "Telangana State Public Service Commission", pscAcronym: "TSPSC" },
  { code: "KL", name: "Kerala", hindiName: "केरल", capital: "Thiruvananthapuram", pscName: "Kerala Public Service Commission", pscAcronym: "Kerala PSC" },
  { code: "AS", name: "Assam", hindiName: "असम", capital: "Dispur", pscName: "Assam Public Service Commission", pscAcronym: "APSC" },
  { code: "HP", name: "Himachal Pradesh", hindiName: "हिमाचल प्रदेश", capital: "Shimla", pscName: "Himachal Pradesh Public Service Commission", pscAcronym: "HPPSC" },
  { code: "CG", name: "Chhattisgarh", hindiName: "छत्तीसगढ़", capital: "Raipur", pscName: "Chhattisgarh Public Service Commission", pscAcronym: "CGPSC" },
  { code: "JK", name: "Jammu and Kashmir", hindiName: "जम्मू और कश्मीर", capital: "Srinagar / Jammu", pscName: "Jammu and Kashmir Public Service Commission", pscAcronym: "JKPSC", isUT: true },
  { code: "GA", name: "Goa", hindiName: "गोवा", capital: "Panaji", pscName: "Goa Public Service Commission", pscAcronym: "GPSC" },
  { code: "TR", name: "Tripura", hindiName: "त्रिपुरा", capital: "Agartala", pscName: "Tripura Public Service Commission", pscAcronym: "TPSC" },
  { code: "MN", name: "Manipur", hindiName: "मणिपुर", capital: "Imphal", pscName: "Manipur Public Service Commission", pscAcronym: "MPSC" },
  { code: "ML", name: "Meghalaya", hindiName: "मेघालय", capital: "Shillong", pscName: "Meghalaya Public Service Commission", pscAcronym: "MPSC" },
  { code: "NL", name: "Nagaland", hindiName: "नागालैंड", capital: "Kohima", pscName: "Nagaland Public Service Commission", pscAcronym: "NPSC" },
  { code: "MZ", name: "Mizoram", hindiName: "मिजोरम", capital: "Aizawl", pscName: "Mizoram Public Service Commission", pscAcronym: "MPSC" },
  { code: "AR", name: "Arunachal Pradesh", hindiName: "अरुणाचल प्रदेश", capital: "Itanagar", pscName: "Arunachal Pradesh Public Service Commission", pscAcronym: "APPSC" },
  { code: "SK", name: "Sikkim", hindiName: "सिक्किम", capital: "Gangtok", pscName: "Sikkim Public Service Commission", pscAcronym: "SPSC" },
  { code: "CH", name: "Chandigarh", hindiName: "चंडीगढ़", capital: "Chandigarh", pscName: "Chandigarh Administration Recruitment", pscAcronym: "CHD", isUT: true },
  { code: "PY", name: "Puducherry", hindiName: "पुदुचेरी", capital: "Puducherry", pscName: "Puducherry Public Service Commission", pscAcronym: "PPSC", isUT: true },
  { code: "LA", name: "Ladakh", hindiName: "लद्दाख", capital: "Leh", pscName: "Ladakh Administration / SSC Selection Posts", pscAcronym: "Ladakh", isUT: true },
];

export function getStateByCode(code: string): IndianState | undefined {
  const upper = code.trim().toUpperCase();
  return INDIAN_STATES.find(
    (s) => s.code === upper || s.name.toLowerCase() === code.toLowerCase()
  );
}
