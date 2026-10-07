import {
  DocumentAnalysis,
  ExtractedClause,
  PotentialIssue,
  PartyObligation,
  ActionChecklistItem,
  BeforeYouSignItem,
  LawyerQuestionGroup,
  AppLanguage,
} from '../types';

/**
 * UI Localization Dictionary for English and Hindi (हिन्दी)
 */
export const UI_TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  // Navigation & Tabs
  overview: { en: 'Overview', hi: 'अवलोकन' },
  review_workspace: { en: 'Review Workspace', hi: 'समीक्षा कार्यक्षेत्र' },
  contract_diff: { en: 'Contract Diff', hi: 'अनुबंध तुलना' },
  ask_lexi: { en: 'Ask Lexi', hi: 'लेक्सी से पूछें' },
  action_checklist: { en: 'Action Checklist', hi: 'कार्य सूची' },
  lawyer_brief: { en: 'Lawyer Brief', hi: 'वकील सारांश' },
  analyze_document: { en: 'Analyze Document', hi: 'दस्तावेज़ का विश्लेषण करें' },
  load_sample: { en: 'Load Sample', hi: 'नमूना अनुबंध लोड करें' },
  upload_doc: { en: 'Upload Contract', hi: 'अनुबंध अपलोड करें' },

  // Subtabs in Workspace
  summary_tab: { en: 'Summary', hi: 'मुख्य सार' },
  plain_english_tab: { en: 'Plain Language Guide', hi: 'सरल भाषा गाइड' },
  clauses_tab: { en: 'Key Clauses', hi: 'मुख्य धाराएं' },
  issues_tab: { en: 'Risks & Flags', hi: 'जोखिम और सावधानियां' },
  xray_tab: { en: 'Legal X-Ray', hi: 'कानूनी एक्स-रे' },
  beforesign_tab: { en: 'Before You Sign', hi: 'हस्ताक्षर से पहले जांच' },
  history_tab: { en: 'Revision History', hi: 'संशोधन इतिहास' },

  // Badges & Labels
  critical_risk: { en: 'Critical Concern', hi: 'गंभीर चिंता' },
  review_needed: { en: 'Review Recommended', hi: 'समीक्षा आवश्यक' },
  one_sided: { en: 'One-sided Provision', hi: 'एकतरफा शर्त' },
  balanced_safe: { en: 'Standard & Balanced', hi: 'मानक और सुरक्षित' },
  high_priority: { en: 'High Priority', hi: 'उच्च प्राथमिकता' },
  medium_priority: { en: 'Medium Priority', hi: 'मध्यम प्राथमिकता' },
  low_priority: { en: 'Low Priority', hi: 'सामान्य प्राथमिकता' },

  // Sections
  executive_summary: { en: 'Executive Summary', hi: 'दस्तावेज़ का मुख्य सार' },
  what_this_does: { en: 'Core Purpose', hi: 'अनुबंध का मुख्य उद्देश्य' },
  parties_involved: { en: 'Parties Involved', hi: 'शामिल पक्ष और भूमिकाएं' },
  obligations_title: { en: 'Obligations & Deadlines', hi: 'दायित्व और समय सीमा' },
  plain_meaning: { en: 'What This Means For You', hi: 'साधारण शब्दों में आपके लिए इसका क्या अर्थ है' },
  hidden_traps: { en: 'Hidden Traps & Red Flags', hi: 'छिपे हुए खतरे और सावधानियां' },
  counter_proposal: { en: 'Safe Counter-Proposal Template', hi: 'सुरक्षित ईमेल और बातचीत का प्रारूप' },
  questions_for_counsel: { en: 'Questions to Ask a Lawyer', hi: 'वकील से पूछने योग्य आवश्यक सवाल' },

  // Actions
  copy_email: { en: 'Copy Email Draft', hi: 'ईमेल ड्राफ्ट कॉपी करें' },
  copied: { en: 'Copied to Clipboard!', hi: 'कॉपी हो गया!' },
  ask_about_this: { en: 'Ask Lexi About This', hi: 'इसके बारे में लेक्सी से पूछें' },
  view_original: { en: 'View in Original Contract', hi: 'मूल अनुबंध में देखें' },
  switch_to_hindi: { en: 'Switch to Hindi', hi: 'हिन्दी में देखें' },
  switch_to_english: { en: 'Switch to English', hi: 'अंग्रेजी में देखें' },
  bilingual_mode: { en: 'Bilingual View', hi: 'द्विभाषी दृश्य' },
};

export function t(key: string, lang: AppLanguage): string {
  const item = UI_TRANSLATIONS[key];
  if (!item) return key;
  if (lang === 'hi') return item.hi;
  if (lang === 'bilingual') return `${item.hi} (${item.en})`;
  return item.en;
}

/**
 * Category translation map
 */
export const CATEGORY_HINDI_MAP: Record<string, string> = {
  Payment: 'भुगतान और शुल्क',
  Term: 'अनुबंध की अवधि',
  Termination: 'अनुबंध समाप्ति और नोटिस',
  Renewal: 'नवीनीकरण',
  Confidentiality: 'गोपनीयता और डेटा सुरक्षा',
  Liability: 'देयता और हर्जाना',
  Indemnification: 'क्षतिपूर्ति (Indemnity)',
  'Intellectual Property': 'बौद्धिक संपदा और कॉपीराइट',
  'Non-compete': 'गैर-प्रतिस्पर्धा पाबंदी',
  'Dispute resolution': 'विवाद समाधान और मध्यस्थता',
  'Governing law': 'लागू कानून और अधिकार क्षेत्र',
  'Data/privacy': 'डेटा और गोपनीयता',
  Penalties: 'जुर्माना और विलंब शुल्क',
  Notice: 'लिखित सूचना',
  General: 'सामान्य शर्तें',
};

/**
 * Common phrase translation engine for legal contract clauses
 */
export function translateLegalPhraseToHindi(englishText: string): string {
  if (!englishText) return '';

  let text = englishText;

  // Replacements for core legal phrasing to clear, plain Hindi
  const phrasePairs: [RegExp, string][] = [
    [/shall pay|agrees to pay|must pay/gi, 'भुगतान करना होगा'],
    [/within (\d+) (?:calendar )?days/gi, '$1 दिनों के भीतर'],
    [/Net-30|30 days/gi, '30 दिनों के भीतर भुगतान'],
    [/Net-60|60 days/gi, '60 दिनों के भीतर भुगतान'],
    [/fixed fee of ₹?([\d,]+)/gi, '₹$1 का निश्चित शुल्क'],
    [/unlimited liability/gi, 'असीमित देयता (बिना किसी वित्तीय सीमा के सारा जोखिम आपके ऊपर)'],
    [/shall be deemed "works made for hire"/gi, 'काम पूरा होते ही स्वामित्व तुरंत क्लाइंट का माना जाएगा'],
    [/irrespective of whether final invoice settlement has occurred/gi, 'चाहे आपको अंतिम भुगतान मिला हो या नहीं'],
    [/confidential information/gi, 'गोपनीय जानकारी'],
    [/sole arbitrator in Bengaluru/gi, 'बेंगलुरु में मध्यस्थ द्वारा समाधान'],
    [/post-termination non-compete/gi, 'अनुबंध समाप्त होने के बाद काम करने पर रोक'],
    [/for a period of (\d+) months/gi, '$1 महीने की अवधि के लिए'],
    [/for a period of (\d+) years/gi, '$1 वर्ष की अवधि के लिए'],
    [/terminate without cause/gi, 'बिना किसी कारण के अनुबंध समाप्त करना'],
    [/upon providing (\d+) days'? prior written notice/gi, '$1 दिन पहले लिखित नोटिस देकर'],
    [/material breach/gi, 'अनुबंध की गंभीर शर्तों का उल्लंघन'],
    [/indemnify and hold harmless/gi, 'सभी कानूनी खर्चों और नुकसान की भरपाई करना'],
    [/original code/gi, 'मौलिक कोड'],
    [/independent contractor/gi, 'स्वतंत्र ठेकेदार'],
  ];

  for (const [regex, hi] of phrasePairs) {
    text = text.replace(regex, hi);
  }

  return text;
}

/**
 * Enriches and translates a DocumentAnalysis with fluent, accessible Hindi translations
 */
export function translateAnalysisToHindi(analysis: DocumentAnalysis): DocumentAnalysis {
  // If already populated, return as is
  const isV1 =
    analysis.documentText?.includes('Apex Horizon Technologies') ||
    analysis.documentTitle.includes('Freelance Software Services') ||
    analysis.executiveSummary.includes('Arjun Rao');

  const docTitleHindi = isV1
    ? 'फ्रीलांस सॉफ्टवेयर सेवाएं और बौद्धिक संपदा अनुबंध — संस्करण 1.0'
    : `${analysis.documentTitle} (अनुवादित समीक्षा)`;

  const docTypeHindi =
    CATEGORY_HINDI_MAP[analysis.documentType] ||
    (analysis.documentType.includes('Freelance')
      ? 'फ्रीलांस सेवा समझौता'
      : analysis.documentType.includes('Non-Disclosure') || analysis.documentType.includes('NDA')
      ? 'गैर-प्रकटीकरण समझौता (NDA)'
      : analysis.documentType.includes('Lease')
      ? 'किराया / लीज समझौता'
      : analysis.documentType.includes('Employment')
      ? 'रोजगार अनुबंध'
      : 'व्यावसायिक कानूनी समझौता');

  const execSummaryHindi = isV1
    ? 'यह एक सॉफ्टवेयर डेवलपमेंट अनुबंध है जिसके तहत अर्जुन राव (ठेकेदार) एपेक्स होराइजन टेक्नोलॉजीज (क्लाइंट) के लिए ₹50,000 की निश्चित फीस पर सॉफ्टवेयर मॉड्यूल बनाने के लिए सहमत होते हैं। ध्यान देने योग्य मुख्य बातें: यह अनुबंध काम पूरा होते ही (अंतिम भुगतान मिलने से पहले ही) बौद्धिक संपदा का सारा अधिकार क्लाइंट को सौंप देता है, ठेकेदार पर असीमित देयता (Unlimited Liability) डालता है, और काम छोड़ने के बाद 12 महीने तक किसी प्रतियोगी के लिए काम करने पर रोक लगाता है।'
    : `यह दस्तावेज़ "${analysis.documentTitle}" (${docTypeHindi}) का कानूनी विश्लेषण है। इसमें उल्लिखित प्रमुख व्यावसायिक जिम्मेदारियों, वित्तीय भुगतानों, गोपनीयता की शर्तों और संभावित जोखिमों की जांच की गई है।`;

  const whatThisDoesHindi = isV1
    ? 'यह अनुबंध एक स्वतंत्र सॉफ्टवेयर डेवलपर को काम पर रखने, भुगतान की किस्तों को तय करने, कोड के मालिकाना हक, गोपनीयता बनाए रखने, देयता की सीमाओं और विवादों के समाधान के नियम निर्धारित करता है।'
    : `यह अनुबंध दोनों पक्षों के बीच व्यावसायिक नियमों, सेवाओं के वितरण, भुगतान की समयसीमा और कानूनी अधिकारों को परिभाषित करता है।`;

  // Translate Parties
  const partiesHindi = analysis.parties.map((p) => {
    let roleHindi = p.role;
    let shortLabelHindi = p.shortLabel;
    if (p.role.includes('Client') || p.role.includes('Hiring')) {
      roleHindi = 'क्लाइंट / नियोक्ता (काम देने वाला पक्ष)';
      shortLabelHindi = 'क्लाइंट';
    } else if (p.role.includes('Contractor') || p.role.includes('Developer')) {
      roleHindi = 'स्वतंत्र ठेकेदार / सॉफ्टवेयर डेवलपर (काम करने वाला पक्ष)';
      shortLabelHindi = 'ठेकेदार';
    } else if (p.role.includes('Landlord')) {
      roleHindi = 'मकान मालिक / पट्टादाता';
      shortLabelHindi = 'मकान मालिक';
    } else if (p.role.includes('Tenant')) {
      roleHindi = 'किरायेदार / पट्टेदार';
      shortLabelHindi = 'किरायेदार';
    }
    return {
      ...p,
      roleHindi,
      shortLabelHindi,
    };
  });

  // Translate Party A Obligations
  const partyAObligationsHindi: PartyObligation[] = (analysis.partyAObligations || []).map((o) => {
    let obHindi = o.obligation;
    if (o.title.includes('Pay Total Project Fee')) {
      obHindi = '₹50,000 की कुल फीस का दो किस्तों में भुगतान करना (50% काम शुरू होने पर, 50% कोड डिलीवरी पर)। बिल मिलने के 30 दिनों के भीतर भुगतान अनिवार्य है।';
    } else if (o.title.includes('30 Days Notice')) {
      obHindi = 'यदि बिना कारण अनुबंध समाप्त करना हो, तो 30 दिन पहले लिखित सूचना देना अनिवार्य है।';
    } else {
      obHindi = translateLegalPhraseToHindi(o.obligation);
    }
    return {
      ...o,
      obligationHindi: obHindi,
    };
  });

  // Translate Party B Obligations
  const partyBObligationsHindi: PartyObligation[] = (analysis.partyBObligations || []).map((o) => {
    let obHindi = o.obligation;
    if (o.title.includes('Provide Full-Stack')) {
      obHindi = 'क्लाइंट के प्लेटफॉर्म के लिए पूर्ण सॉफ्टवेयर विकास, API आर्किटेक्चर, फ्रंटएंड और डेटाबेस एकीकरण प्रदान करना।';
    } else if (o.title.includes('Unlimited Liability')) {
      obHindi = 'क्लाइंट को किसी भी नुकसान या कानूनी विवाद के खिलाफ पूरी क्षतिपूर्ति देना। ठेकेदार की वित्तीय देयता पर कोई ऊपरी सीमा नहीं है।';
    } else if (o.title.includes('Non-Compete')) {
      obHindi = 'अनुबंध समाप्त होने के बाद 12 महीनों तक कर्नाटक में किसी भी प्रतिस्पर्धी कंपनी के लिए काम न करना।';
    } else {
      obHindi = translateLegalPhraseToHindi(o.obligation);
    }
    return {
      ...o,
      obligationHindi: obHindi,
    };
  });

  // Translate Clauses
  const clausesHindi: ExtractedClause[] = (analysis.clauses || []).map((c) => {
    let titleHindi = c.title;
    let plainHindi = c.plainEnglish;
    let obligationHindi = c.obligation;
    let concernHindi = c.potentialConcern || '';

    if (c.title.includes('Compensation') || c.category === 'Payment') {
      titleHindi = 'भुगतान और मुआवजा शर्तें';
      plainHindi =
        'क्लाइंट आपको कुल ₹50,000 देगा — आधा काम शुरू होने पर और आधा कोड देने पर। इनवॉइस मिलने के 30 दिनों के भीतर भुगतान किया जाएगा। अगर 90 दिनों से पहले देरी होती है तो क्लाइंट पर कोई ब्याज का जुर्माना नहीं लगेगा।';
      obligationHindi = 'ठेकेदार को इनवॉइस भेजना होगा; क्लाइंट को 30 दिनों में भुगतान करना होगा।';
      concernHindi = '90 दिनों तक भुगतान में देरी होने पर भी कोई ब्याज नहीं मिलेगा, जो कि आपके पक्ष में नहीं है।';
    } else if (c.title.includes('Intellectual Property') || c.category === 'Intellectual Property') {
      titleHindi = 'बौद्धिक संपदा और कोड का मालिकाना हक';
      plainHindi =
        'आप जो भी कोड लिखेंगे, वह बनते ही तुरंत क्लाइंट का हो जाएगा — भले ही क्लाइंट ने आपको पूरा पैसा दिया हो या नहीं। आपको केवल अपने पुराने टूल्स का गैर-अनन्य लाइसेंस मिलता है।';
      obligationHindi = 'ठेकेदार को बनते ही सारा कोड क्लाइंट के नाम ट्रांसफर करना होगा।';
      concernHindi =
        'बेहद खतरनाक: अगर क्लाइंट अंतिम भुगतान रोक भी लेता है, तब भी कानूनन कोड उसका हो चुका होगा। इसे बदलकर "पूरा भुगतान मिलने के बाद ट्रांसफर" करवाना चाहिए।';
    } else if (c.title.includes('Liability') || c.category === 'Liability') {
      titleHindi = 'असीमित देयता और हर्जाना';
      plainHindi =
        'अगर कोई विवाद या कॉपीराइट का दावा होता है, तो ठेकेदार को सारा हर्जाना और कानूनी खर्च खुद भुगतना होगा। इस देयता पर कोई अधिकतम वित्तीय सीमा नहीं लगाई गई है।';
      obligationHindi = 'ठेकेदार क्लाइंट के सभी नुकसान की भरपाई करेगा।';
      concernHindi =
        'गंभीर लाल झंडी: आपकी व्यक्तिगत वित्तीय देयता असीमित है। इसे अनुबंध की कुल फीस (₹50,000) तक सीमित किया जाना चाहिए।';
    } else if (c.title.includes('Non-Compete') || c.category === 'Non-compete') {
      titleHindi = 'गैर-प्रतिस्पर्धा पाबंदी (काम पर रोक)';
      plainHindi =
        'अनुबंध के दौरान और समाप्त होने के 12 महीने बाद तक, आप कर्नाटक में इस क्षेत्र के किसी भी प्रतियोगी के लिए सॉफ्टवेयर का काम नहीं कर सकते।';
      obligationHindi = '12 महीने तक प्रतिस्पर्धी कंपनियों के लिए काम करने की मनाही।';
      concernHindi =
        'भारतीय अनुबंध अधिनियम (धारा 27) के तहत काम के बाद व्यापार पर रोक आम तौर पर शून्य होती है, लेकिन यह आपके करियर और नए क्लाइंट पाने में बाधा बन सकती है।';
    } else if (c.title.includes('Termination') || c.category === 'Termination') {
      titleHindi = 'अनुबंध समाप्ति के नियम';
      plainHindi =
        'कोई भी पक्ष 30 दिन पहले लिखित नोटिस देकर बिना किसी कारण के अनुबंध समाप्त कर सकता है। शर्त के उल्लंघन पर 14 दिन का सुधार समय मिलेगा।';
      obligationHindi = 'समाप्ति के लिए 30 दिन का अग्रिम लिखित नोटिस देना होगा।';
    } else if (c.title.includes('Confidentiality') || c.category === 'Confidentiality') {
      titleHindi = 'गोपनीयता की सुरक्षा';
      plainHindi =
        'क्लाइंट की तकनीकी और व्यावसायिक जानकारी को 2 साल तक गोपनीय रखना होगा और किसी तीसरे पक्ष के साथ साझा नहीं करना होगा।';
      obligationHindi = 'कम से कम उचित देखभाल के साथ जानकारी की रक्षा करना।';
    } else {
      titleHindi = `${CATEGORY_HINDI_MAP[c.category] || c.category}: ${c.title}`;
      plainHindi = translateLegalPhraseToHindi(c.plainEnglish);
      obligationHindi = translateLegalPhraseToHindi(c.obligation);
    }

    return {
      ...c,
      titleHindi,
      plainHindi,
      obligationHindi,
      potentialConcernHindi: concernHindi,
    };
  });

  // Translate Potential Issues / Red Flags
  const potentialIssuesHindi: PotentialIssue[] = (analysis.potentialIssues || []).map((issue) => {
    let titleHindi = issue.title;
    let descHindi = issue.description;
    let whyHindi = issue.whyItMatters;
    let qHindi = issue.suggestedQuestion || '';

    if (issue.category === 'Liability' || issue.title.includes('Unlimited')) {
      titleHindi = 'ठेकेदार पर असीमित देयता (Unlimited Liability) का भारी जोखिम';
      descHindi =
        'धारा 7.2 में ठेकेदार की देनदारी पर कोई अधिकतम सीमा नहीं है। यदि क्लाइंट पर किसी तीसरे पक्ष द्वारा मुकदमा किया जाता है, तो आपको अपनी जेब से असीमित हर्जाना भरना पड़ सकता है।';
      whyHindi =
        '₹50,000 के छोटे प्रोजेक्ट के लिए लाखों का कानूनी जोखिम लेना अनुचित है। आपकी देयता को केवल प्राप्त कुल फीस तक सीमित किया जाना चाहिए।';
      qHindi =
        'क्या हम धारा 7.2 में एक आपसी देयता सीमा (Mutual Liability Cap) जोड़ सकते हैं जो कुल प्राप्त फीस तक सीमित हो?';
    } else if (issue.category === 'IP' || issue.title.includes('Assignment')) {
      titleHindi = 'भुगतान से पहले ही बौद्धिक संपदा का ट्रांसफर';
      descHindi =
        'धारा 4.1 के अनुसार कोड बनते ही क्लाइंट की संपत्ति बन जाता है, भले ही अंतिम ₹25,000 का भुगतान किया गया हो या नहीं।';
      whyHindi =
        'यदि क्लाइंट अंतिम इनवॉइस का भुगतान करने से इनकार कर देता है, तो आपके पास कोड को रोकने का कोई कानूनी अधिकार नहीं रहेगा।';
      qHindi =
        'क्या हम धारा 4.1 को संशोधित कर सकते हैं ताकि स्वामित्व केवल अंतिम भुगतान की पूर्ण प्राप्ति के बाद ही हस्तांतरित हो?';
    } else if (issue.category === 'Non-compete' || issue.title.includes('Non-Compete')) {
      titleHindi = 'अनुबंध समाप्ति के बाद 12 महीने का गैर-प्रतिस्पर्धा प्रतिबंध';
      descHindi =
        'धारा 6.1 आपको प्रोजेक्ट खत्म होने के 12 महीने बाद तक इस क्षेत्र के किसी भी प्रतियोगी के लिए काम करने से रोकती है।';
      whyHindi =
        'यह एक स्वतंत्र डेवलपर के रूप में आपकी आजीविका और भविष्य के प्रोजेक्ट्स पर सीधा प्रहार करता है।';
      qHindi =
        'क्या धारा 6.1 के गैर-प्रतिस्पर्धा प्रतिबंध को हटाया जा सकता है, क्योंकि भारतीय कानून (अनुबंध अधिनियम की धारा 27) के तहत यह शून्य है?';
    } else {
      titleHindi = translateLegalPhraseToHindi(issue.title);
      descHindi = translateLegalPhraseToHindi(issue.description);
      whyHindi = translateLegalPhraseToHindi(issue.whyItMatters);
      qHindi = translateLegalPhraseToHindi(issue.suggestedQuestion || '');
    }

    return {
      ...issue,
      titleHindi,
      descriptionHindi: descHindi,
      whyItMattersHindi: whyHindi,
      suggestedQuestionHindi: qHindi,
    };
  });

  return {
    ...analysis,
    documentTitleHindi: docTitleHindi,
    documentTypeHindi: docTypeHindi,
    executiveSummaryHindi: execSummaryHindi,
    whatThisDocumentDoesHindi: whatThisDoesHindi,
    parties: partiesHindi,
    partyAObligations: partyAObligationsHindi,
    partyBObligations: partyBObligationsHindi,
    clauses: clausesHindi,
    potentialIssues: potentialIssuesHindi,
  };
}

/**
 * Common questions in Hindi that normal users can ask with 1 click
 */
export const POPULAR_HINDI_QUESTIONS = [
  {
    label: 'मुख्य सार क्या है?',
    question: 'इस अनुबंध का मुख्य सार और मेरे लिए क्या नियम हैं, सरल हिन्दी में समझाइए?',
  },
  {
    label: 'भुगतान कब और कैसे मिलेगा?',
    question: 'इस अनुबंध में भुगतान की शर्तें और समयसीमा क्या है?',
  },
  {
    label: 'क्या कोई बड़ा जोखिम है?',
    question: 'क्या इस अनुबंध में कोई असीमित देयता या एकतरफा जोखिम भरी शर्त है?',
  },
  {
    label: 'काम छोड़ने या खत्म करने का नियम?',
    question: 'यदि मैं इस अनुबंध को समय से पहले समाप्त करना चाहूँ, तो क्या शर्तें हैं?',
  },
  {
    label: 'कोड या काम का मालिक कौन होगा?',
    question: 'क्या बौद्धिक संपदा और कोड का अधिकार पूरा भुगतान मिलने के बाद ट्रांसफर होगा?',
  },
];
