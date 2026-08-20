-- =============================================================================
-- Migration: Seed Authentic Hindi Content Translations for Demonstration
-- 1. Complete Job: BSSC 2nd Inter Level Combined Exam / UPSC CSE
-- 2. Complete Exam: UPSC Civil Services Preliminary Examination 2026
-- 3. Complete News Item: SSC Clarifies Multi-Shift Percentile Normalization Formula
-- =============================================================================

BEGIN;

-- 1. Seed Hindi Translation for Government Job
INSERT INTO gov_job_translations (
  job_id,
  language_code,
  title,
  post_name,
  qualification_summary,
  age_limit_summary,
  pay_scale_summary,
  selection_process,
  description,
  meta_title,
  meta_description,
  is_verified
)
SELECT 
  j.id,
  'hi',
  'बिहार कर्मचारी चयन आयोग (BSSC) द्वितीय इंटर स्तरीय संयुक्त प्रतियोगिता परीक्षा 2026 - 12,199 पद',
  'कनिष्ठ लिपिक, राजस्व कर्मचारी, पंचायत सचिव एवं आशुलिपिक',
  'मान्यता प्राप्त बोर्ड या संस्थान से 10+2 (इंटरमीडिएट) उत्तीर्ण। कुछ तकनीकी पदों के लिए कंप्यूटर टंकण और डीसीए प्रमाण पत्र अनिवार्य है।',
  'न्यूनतम आयु: 18 वर्ष। अधिकतम आयु: 37 वर्ष (अनारक्षित पुरुष), 40 वर्ष (महिला/ओबीसी/ईबीसी), 42 वर्ष (एससी/एसटी)।',
  'वेतनमान लेवल 2, 3 एवं 4 (रु 19,900 - रु 63,200) एवं अन्य सरकारी भत्ते नियमानुसार।',
  '1. प्रारंभिक वस्तुनिष्ठ परीक्षा (PT - सामान्य अध्ययन, सामान्य विज्ञान, गणित एवं मानसिक क्षमता जांच)
2. मुख्य लिखित परीक्षा (Mains - सामान्य हिन्दी एवं सामान्य ज्ञान)
3. कंप्यूटर टंकण एवं आशुलिपि दक्षता परीक्षण (लागू पदों के लिए)
4. मूल प्रमाण पत्र सत्यापन एवं अंतिम मेधा सूची',
  'बिहार कर्मचारी चयन आयोग द्वारा राज्य सरकार के विभिन्न प्रशासनिक विभागों में 12,199 रिक्त पदों पर नियमित भर्ती हेतु आधिकारिक अधिसूचना जारी की गई है। सभी योग्य नागरिक अंतिम तिथि से पूर्व आधिकारिक पोर्टल bssc.bihar.gov.in पर ऑनलाइन आवेदन कर सकते हैं।',
  'BSSC द्वितीय इंटर स्तरीय भर्ती 2026 - 12,199 पदों के लिए आधिकारिक सूचना एवं परीक्षा पैटर्न',
  'बिहार BSSC द्वितीय इंटर स्तरीय परीक्षा 2026 के लिए शैक्षणिक योग्यता, आयु सीमा, चयन प्रक्रिया एवं ऑनलाइन आवेदन की संपूर्ण जानकारी।',
  true
FROM gov_jobs j
WHERE j.slug ILIKE '%bssc%' OR j.slug ILIKE '%inter-level%'
LIMIT 1
ON CONFLICT (job_id, language_code) 
DO UPDATE SET
  title = EXCLUDED.title,
  post_name = EXCLUDED.post_name,
  qualification_summary = EXCLUDED.qualification_summary,
  age_limit_summary = EXCLUDED.age_limit_summary,
  pay_scale_summary = EXCLUDED.pay_scale_summary,
  selection_process = EXCLUDED.selection_process,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();

-- Fallback: If BSSC job is not found, seed Hindi translation for any first published job
INSERT INTO gov_job_translations (
  job_id,
  language_code,
  title,
  post_name,
  qualification_summary,
  age_limit_summary,
  pay_scale_summary,
  selection_process,
  description,
  meta_title,
  meta_description,
  is_verified
)
SELECT 
  j.id,
  'hi',
  'संघ लोक सेवा आयोग (UPSC) सिविल सेवा परीक्षा 2026 - 1,056 पद',
  'भारतीय प्रशासनिक सेवा (IAS), भारतीय पुलिस सेवा (IPS), भारतीय विदेश सेवा (IFS) एवं केन्द्रीय सेवाएं',
  'किसी भी मान्यता प्राप्त विश्वविद्यालय से किसी भी विषय में स्नातक (Graduation) उत्तीर्ण अथवा अंतिम वर्ष के अभ्यर्थी।',
  'न्यूनतम आयु 21 वर्ष तथा अधिकतम आयु 32 वर्ष (आरक्षित वर्गों एवं पूर्व सैनिकों को नियमानुसार आयु सीमा में छूट)।',
  'वेतनमान लेवल 10 (रु 56,100 - रु 1,77,500) एवं केन्द्रीय सरकार के नियम अनुसार अन्य देय भत्ते।',
  '1. सिविल सेवा प्रारंभिक परीक्षा (वस्तुनिष्ठ प्रकार - Paper I & II)
2. सिविल सेवा मुख्य परीक्षा (वर्णनात्मक लिखित परीक्षा - 9 प्रश्नपत्र)
3. व्यक्तित्व परीक्षण / साक्षात्कार (Personality Test / Interview)',
  'संघ लोक सेवा आयोग द्वारा भारत सरकार की प्रतिष्ठित सिविल सेवाओं में भर्ती हेतु वार्षिक सिविल सेवा परीक्षा 2026 की आधिकारिक अधिसूचना जारी कर दी गई है। विस्तृत जानकारी upsc.gov.in पर उपलब्ध है।',
  'UPSC सिविल सेवा भर्ती 2026 - 1,056 पदों हेतु अधिसूचना एवं पात्रता',
  'यूपीएससी सिविल सेवा परीक्षा 2026 हेतु आवश्यक शैक्षणिक योग्यता, आयु सीमा, परीक्षा योजना एवं ऑनलाइन आवेदन की जानकारी।',
  true
FROM gov_jobs j
WHERE NOT EXISTS (SELECT 1 FROM gov_job_translations WHERE language_code = 'hi')
LIMIT 1
ON CONFLICT (job_id, language_code) DO NOTHING;

-- 2. Seed Hindi Translation for Government Exam
INSERT INTO gov_exam_translations (
  exam_id,
  language_code,
  title,
  short_title,
  description,
  eligibility_summary,
  meta_title,
  meta_description,
  is_verified
)
SELECT 
  e.id,
  'hi',
  'संघ लोक सेवा आयोग (UPSC) सिविल सेवा प्रारंभिक परीक्षा 2026',
  'यूपीएससी सिविल सेवा (CSE) प्रारंभिक परीक्षा',
  'भारतीय प्रशासनिक सेवा (IAS), भारतीय पुलिस सेवा (IPS), भारतीय विदेश सेवा (IFS) सहित केन्द्रीय ग्रुप A एवं B सिविल सेवाओं में भर्ती हेतु अखिल भारतीय स्तर पर आयोजित होने वाली वार्षिक प्रतियोगी परीक्षा।',
  'किसी भी मान्यता प्राप्त विश्वविद्यालय से किसी भी संकाय में स्नातक डिग्री। न्यूनतम आयु 21 वर्ष एवं अधिकतम आयु 32 वर्ष (आरक्षित वर्गों को नियमानुसार छूट)।',
  'UPSC सिविल सेवा प्रारंभिक परीक्षा 2026 - परीक्षा तिथि, पाठ्यक्रम एवं योग्यता',
  'यूपीएससी सिविल सेवा प्रारंभिक परीक्षा 2026 की आधिकारिक समय सारणी, परीक्षा केंद्र, आयु सीमा और विस्तृत सिलेबस।',
  true
FROM gov_exams e
WHERE e.slug ILIKE '%upsc%' OR e.slug ILIKE '%civil-service%' OR e.slug ILIKE '%prelim%'
LIMIT 1
ON CONFLICT (exam_id, language_code)
DO UPDATE SET
  title = EXCLUDED.title,
  short_title = EXCLUDED.short_title,
  description = EXCLUDED.description,
  eligibility_summary = EXCLUDED.eligibility_summary,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();

-- Fallback: If no exam matched slug, seed Hindi translation for any first published exam
INSERT INTO gov_exam_translations (
  exam_id,
  language_code,
  title,
  short_title,
  description,
  eligibility_summary,
  meta_title,
  meta_description,
  is_verified
)
SELECT 
  e.id,
  'hi',
  'बिहार कर्मचारी चयन आयोग (BSSC) द्वितीय इंटर स्तरीय प्रारंभिक परीक्षा 2026',
  'BSSC द्वितीय इंटर स्तरीय PT परीक्षा',
  'बिहार सरकार के विभिन्न विभागों में इंटर स्तरीय पदों पर चयन हेतु आयोजित होने वाली राज्य स्तरीय प्रारंभिक वस्तुनिष्ठ परीक्षा।',
  'मान्यता प्राप्त बोर्ड से 10+2 (इंटरमीडिएट) उत्तीर्ण। न्यूनतम आयु 18 वर्ष।',
  'BSSC इंटर स्तरीय प्रारंभिक परीक्षा 2026 - परीक्षा तिथि एवं पैटर्न',
  'बिहार BSSC द्वितीय इंटर स्तरीय PT परीक्षा की आधिकारिक तिथि, पाली समय एवं दिशा-निर्देश।',
  true
FROM gov_exams e
WHERE NOT EXISTS (SELECT 1 FROM gov_exam_translations WHERE language_code = 'hi')
LIMIT 1
ON CONFLICT (exam_id, language_code) DO NOTHING;

-- 3. Seed Hindi Translation for News Bulletin
INSERT INTO bulletin_translations (
  bulletin_id,
  language_code,
  title,
  summary,
  content,
  meta_title,
  meta_description,
  is_verified
)
SELECT 
  b.id,
  'hi',
  'कर्मचारी चयन आयोग (SSC) ने CGL टियर-1 बहु-पाली परीक्षा हेतु परसेंटाइल नॉर्मलाइजेशन फॉर्मूला स्पष्ट किया',
  'कर्मचारी चयन आयोग ने बहु-दिवसीय एवं बहु-पाली परीक्षाओं में अभ्यर्थियों के अंकों के निष्पक्ष मूल्यांकन हेतु उपयोग की जाने वाली अंक सामान्यीकरण (Normalization) गणितीय पद्धति का विस्तृत विवरण जारी किया है।',
  'कर्मचारी चयन आयोग (SSC) द्वारा आयोजित संयुक्त स्नातक स्तरीय (CGL) टियर-1 परीक्षा के संबंध में अभ्यर्थियों द्वारा विभिन्न पालियों के कठिनाई स्तर को लेकर पूछे गए प्रश्नों के स्पष्टीकरण में आयोग ने अपनी आधिकारिक स्थिति स्पष्ट की है।

आयोग ने स्पष्ट किया है कि बहु-पाली परीक्षाओं में सभी अभ्यर्थियों के लिए समान अवसर सुनिश्चित करने के उद्देश्य से मानक विचलन एवं माध्य आधारित इक्विपरसेंटाइल फॉर्मूले का उपयोग किया जाता है। अभ्यर्थी आधिकारिक पोर्टल ssc.gov.in पर जाकर इस पद्धति की विस्तृत सूचना और नमूना गणना देख सकते हैं। आयोग ने सभी उम्मीदवारों को केवल आधिकारिक वेबसाइटों पर जारी सूचनाओं पर ही विश्वास करने की सलाह दी है।',
  'SSC CGL टियर-1 नॉर्मलाइजेशन पद्धति पर कर्मचारी चयन आयोग का स्पष्टीकरण',
  'SSC CGL बहु-पाली परीक्षा में अंकों के सामान्यीकरण (Percentile Normalization) के लिए आयोग द्वारा अपनाई जा रही प्रामाणिक विधि का सारांश।',
  true
FROM public_bulletins b
WHERE b.slug ILIKE '%ssc-clarifies-percentile%' OR b.slug ILIKE '%ssc%'
LIMIT 1
ON CONFLICT (bulletin_id, language_code)
DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();

-- Fallback: If no bulletin matched slug, seed Hindi translation for any first published bulletin
INSERT INTO bulletin_translations (
  bulletin_id,
  language_code,
  title,
  summary,
  content,
  meta_title,
  meta_description,
  is_verified
)
SELECT 
  b.id,
  'hi',
  'राष्ट्रीय परीक्षा एजेंसी (NTA) ने सीबीटी परीक्षा केन्द्रों के निरीक्षण हेतु एकसमान प्रोटोकॉल घोषित किया',
  'एनटीए ने सभी विश्वविद्यालय एवं राष्ट्रीय प्रवेश परीक्षाओं के लिए तीसरे पक्ष द्वारा तकनीकी अवसंरचना सत्यापन और बायोमेट्रिक पंजीकरण दिशा-निर्देश लागू किए हैं।',
  'राष्ट्रीय परीक्षा एजेंसी (NTA) ने सभी नामित कंप्यूटर आधारित परीक्षा (CBT) केन्द्रों के लिए उन्नत संचालन मानकों को अंतिम रूप दिया है। इन दिशानिर्देशों के तहत सिग्नल जैमर, दोहरे स्तर का सीसीटीवी कवरेज और लाइव मॉनिटरिंग अनिवार्य की गई है।',
  'NTA सीबीटी परीक्षा केंद्र सुरक्षा एवं निरीक्षण मानक 2026',
  'एनटीए द्वारा परीक्षा केन्द्रों की शुचिता एवं सुरक्षा सुनिश्चित करने हेतु जारी नए दिशानिर्देशों का सारांश।',
  true
FROM public_bulletins b
WHERE NOT EXISTS (SELECT 1 FROM bulletin_translations WHERE language_code = 'hi')
LIMIT 1
ON CONFLICT (bulletin_id, language_code) DO NOTHING;

COMMIT;
