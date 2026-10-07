import { AppLanguage, ExtractedClause, PotentialIssue, DocumentAnalysis } from '../types';

/**
 * High-quality Hindi (हिंदी) and English UI localization dictionary
 */
export const UI_STRINGS = {
  en: {
    appName: 'LexiLens',
    tagline: 'Document Intelligence for Everyday Humans',
    switchLang: '🇮🇳 हिंदी में देखें',
    nav: {
      overview: 'Overview',
      review: 'Review Workspace',
      compare: 'Compare Versions',
      ask: 'Ask Lexi',
      checklist: 'Checklist',
      summary: 'Summary & Dossier',
      upload: 'Upload Contract',
      demo: 'Explore Demo',
    },
    guide: {
      title: 'Plain-English Contract Breakdown',
      subtitle: 'Translated for everyday humans: no legal jargon, just what you need to know before signing.',
      verdict: 'Fairness Verdict',
      bottomLineTitle: 'The 10-Second Bottom Line',
      theGood: '🟢 The Good (Protections)',
      theGoodDesc: 'Terms that protect your rights, establish clear payments, and define obligations.',
      theSneaky: '🟡 The Sneaky (Watch Out)',
      theSneakyDesc: 'Fine-print clauses and surprise waivers that could catch you off-guard.',
      theRedFlags: '🔴 The Red Flags (Negotiate)',
      theRedFlagsDesc: 'Unilateral, risky terms you should consider pushing back on before signing.',
      pushbackTitle: 'How to Push Back (Without Being Awkward)',
      pushbackSubtitle: 'Polite, professional email drafts you can copy and send to the other party right now.',
      copyDraft: 'Copy Email Draft',
      copied: 'Copied to Clipboard!',
      faqsTitle: 'Common Questions Everyday Users Ask About This Contract',
      faqsSubtitle: 'Click any question to get an instant, text-grounded answer with verbatim contract evidence.',
    },
    workspace: {
      plainEnglishMode: 'Plain English',
      legaleseMode: 'Original Legalese',
      searchPlaceholder: 'Search clauses, topics, or keywords...',
      allClauses: 'All Clauses',
      filterLabel: 'Filter',
      affects: 'Who Carries Burden',
      watchOut: 'Watch out / Risk',
      originalQuote: 'Original Contract Text',
      inspectInDoc: 'Inspect in Document',
      tabs: {
        summary: 'Executive Summary',
        plainGuide: 'Plain Language Guide',
        clauses: 'Clauses',
        watchouts: 'Watch-outs',
        xray: 'Legal X-Ray',
        beforeSign: 'Before You Sign',
        history: 'Version History',
      },
    },
    ask: {
      title: 'Ask Lexi (Document Assistant)',
      subtitle: 'Ask anything about your contract in English or Hindi. Answers are strictly grounded in text.',
      placeholder: 'Ask any question (e.g. When do I get paid? Can I terminate?)...',
      send: 'Ask',
    },
  },
  hi: {
    appName: 'LexiLens',
    tagline: 'आम लोगों के लिए सरल कानूनी समझ',
    switchLang: '🌐 View in English',
    nav: {
      overview: 'अवलोकन',
      review: 'समीक्षा (Review)',
      compare: 'तुलना (Compare)',
      ask: 'लेक्सी से पूछें',
      checklist: 'चेकलिस्ट',
      summary: 'दस्तावेज़ सारांश',
      upload: 'अनुबंध अपलोड करें',
      demo: 'डेमो देखें',
    },
    guide: {
      title: 'सरल हिंदी अनुबंध गाइड',
      subtitle: 'आम लोगों के लिए आसान भाषा में: कोई कानूनी उलझन नहीं, हस्ताक्षर से पहले जो जानना बेहद ज़रूरी है।',
      verdict: 'अनुबंध का निष्कर्ष',
      bottomLineTitle: '10-सेकंड का मुख्य निचोड़ (Main Summary)',
      theGood: '🟢 अच्छी शर्तें (आपके अधिकार व सुरक्षा)',
      theGoodDesc: 'वे शर्तें जो आपके अधिकारों की रक्षा करती हैं, काम का दायरा और समय पर भुगतान तय करती हैं।',
      theSneaky: '🟡 चालाकी भरी शर्तें (बारीक बातें)',
      theSneakyDesc: 'छिपी हुई बारीक शर्तें जैसे पेनल्टी में 90 दिन की छूट, जो बाद में आपके लिए परेशानी बन सकती हैं।',
      theRedFlags: '🔴 नुकसानदेह शर्तें (हस्ताक्षर से पहले बदलें)',
      theRedFlagsDesc: 'एकतरफा शर्तें (जैसे असीमित देनदारी या गैर-प्रतिस्पर्धा) जिन्हें साइन करने से पहले बदलना चाहिए।',
      pushbackTitle: 'शालीनता से बदलाव कैसे मांगें (बिना किसी झिझक के)',
      pushbackSubtitle: 'तैयार संदेश और ईमेल ड्राफ्ट जिन्हें आप कॉपी करके तुरंत क्लाइंट या कंपनी को भेज सकते हैं।',
      copyDraft: 'मैसेज कॉपी करें',
      copied: 'कॉपी हो गया! (Copied)',
      faqsTitle: 'आम लोग इस अनुबंध के बारे में जो सवाल पूछते हैं',
      faqsSubtitle: 'किसी भी सवाल पर क्लिक करें और अनुबंध के सटीक प्रमाण के साथ उत्तर पाएं।',
    },
    workspace: {
      plainEnglishMode: 'सरल हिंदी मोड: चालू',
      legaleseMode: 'मूल अंग्रेजी पाठ',
      searchPlaceholder: 'शर्तें, विषय या कीवर्ड खोजें...',
      allClauses: 'सभी शर्तें',
      filterLabel: 'फ़िल्टर',
      affects: 'किसका दायित्व है',
      watchOut: 'सावधानी / जोखिम',
      originalQuote: 'अनुबंध का मूल अंग्रेजी पाठ',
      inspectInDoc: 'दस्तावेज़ में देखें',
      tabs: {
        summary: 'कार्यकारी सारांश',
        plainGuide: 'सरल हिंदी गाइड',
        clauses: 'अनुबंध की शर्तें',
        watchouts: 'जोखिम व सावधानियां',
        xray: 'लीगल एक्स-रे',
        beforeSign: 'हस्ताक्षर से पहले जांच',
        history: 'संशोधन इतिहास',
      },
    },
    ask: {
      title: 'लेक्सी से पूछें (AI कानूनी सहायक)',
      subtitle: 'अनुबंध के बारे में हिंदी या हिंग्लिश में कुछ भी पूछें। सभी उत्तर अनुबंध के लिखित प्रमाण पर आधारित हैं।',
      placeholder: 'हिंदी में पूछें (उदा. मुझे पैसे कब मिलेंगे? क्या मुझे बिना वजह हटाया जा सकता है?)...',
      send: 'पूछें',
    },
  },
};

/**
 * Hindi translations for known clauses across sample & common contracts
 */
export function getHindiClauseTranslation(clause: ExtractedClause): {
  titleHindi: string;
  plainHindi: string;
  potentialConcernHindi?: string;
  whoItAffectsHindi: string;
} {
  const cat = clause.category;
  const title = clause.title.toLowerCase();

  // 1. Payment Clauses
  if (cat === 'Payment' || title.includes('payment') || title.includes('fee') || title.includes('compensation') || title.includes('rent')) {
    if (title.includes('late') || title.includes('interest') || title.includes('penalty')) {
      return {
        titleHindi: 'विलंब शुल्क और ब्याज में छूट (Late Payment Waiver)',
        plainHindi: 'क्लाइंट को बिल मिलने के 30 दिनों में भुगतान करना होगा। हालांकि, यदि वे 90 दिनों तक भी देरी करते हैं, तो उन पर कोई ब्याज या जुर्माना नहीं लगेगा।',
        potentialConcernHindi: '90 दिन की बहुत लंबी मोहलत दी गई है। पैसे मिलने में 3 महीने तक की देरी हो सकती है।',
        whoItAffectsHindi: 'ठेकेदार/फ्रीलांसर (आप)',
      };
    }
    return {
      titleHindi: 'परियोजना शुल्क और भुगतान का समय (Fees & Milestones)',
      plainHindi: 'परियोजना की कुल तय फीस ₹50,000 है। 50% काम शुरू होने पर और 50% काम पूरा होने पर देय है। इनवॉइस मिलने पर 30 दिनों (Net-30) में भुगतान होना चाहिए।',
      potentialConcernHindi: 'सुनिश्चित करें कि काम की डिलीवरी के तुरंत बाद अंतिम इनवॉइस जारी हो।',
      whoItAffectsHindi: 'दोनों पक्ष (क्लाइंट और आप)',
    };
  }

  // 2. Scope & Obligations
  if (cat === 'General' || title.includes('scope') || title.includes('obligations') || title.includes('services')) {
    return {
      titleHindi: 'सेवाओं का दायरा और समय-सीमा (Scope of Services)',
      plainHindi: 'आपको अनुबंध में तय माइलस्टोन्स (Milestones) के अनुसार सॉफ्टवेयर डेवलपमेंट और एपीआई सेवाएं पूरी करनी होंगी।',
      potentialConcernHindi: 'अतिरिक्त काम (Scope Creep) के लिए अलग से भुगतान का नियम स्पष्ट होना चाहिए।',
      whoItAffectsHindi: 'ठेकेदार / कर्मचारी (आप)',
    };
  }

  // 3. Termination
  if (cat === 'Termination' || title.includes('terminat')) {
    return {
      titleHindi: 'अनुबंध की समाप्ति और नोटिस अवधि (Termination Notice)',
      plainHindi: 'कोई भी पक्ष 30 दिन का लिखित नोटिस देकर बिना किसी कारण के यह अनुबंध खत्म कर सकता है। नोटिस मिलते ही आपको काम तुरंत रोककर अब तक का काम सौंपना होगा।',
      potentialConcernHindi: 'क्लाइंट कभी भी 30 दिन का नोटिस देकर प्रोजेक्ट रोक सकता है। सुनिश्चित करें कि अब तक के काम के पूरे पैसे मिलें।',
      whoItAffectsHindi: 'दोनों पक्ष',
    };
  }

  // 4. Intellectual Property
  if (cat === 'Intellectual Property' || title.includes('intellectual') || title.includes('ip') || title.includes('work product') || title.includes('ownership')) {
    return {
      titleHindi: 'बनाए गए काम का मालिकाना हक (IP Ownership)',
      plainHindi: 'आपके द्वारा बनाया गया सारा कोड और डिज़ाइन तुरंत क्लाइंट की संपत्ति बन जाएगा—भले ही उन्होंने आपको अंतिम भुगतान किया हो या नहीं।',
      potentialConcernHindi: '🚨 बड़ा जोखिम: यदि क्लाइंट ने आखिरी इनवॉइस का भुगतान नहीं किया, तो भी वे आपके बनाए काम के मालिक बन जाएंगे। मांगें कि मालिकाना हक पूरा पैसा मिलने पर ही मिले।',
      whoItAffectsHindi: 'ठेकेदार (आपके अधिकार छिनते हैं)',
    };
  }

  // 5. Confidentiality
  if (cat === 'Confidentiality' || title.includes('confident')) {
    return {
      titleHindi: 'गोपनीयता की शर्त (Confidentiality)',
      plainHindi: 'अनुबंध खत्म होने के बाद 2 साल तक आपको क्लाइंट की व्यावसायिक और तकनीकी गोपनीय जानकारी गुप्त रखनी होगी।',
      potentialConcernHindi: 'यह एक सामान्य व्यावसायिक शर्त है। बस यह ध्यान रखें कि आपकी अपनी पुरानी जानकारी इसमें शामिल न हो।',
      whoItAffectsHindi: 'दोनों पक्ष',
    };
  }

  // 6. Non-Compete
  if (cat === 'Non-compete' || title.includes('non-compete') || title.includes('restraint') || title.includes('restrict')) {
    return {
      titleHindi: 'काम करने पर रोक / गैर-प्रतिस्पर्धा (Non-Compete Trap)',
      plainHindi: 'अनुबंध खत्म होने के 12 महीनों तक आप क्लाइंट के किसी भी ग्राहक या वेंडर के साथ स्वतंत्र रूप से काम नहीं कर सकते।',
      potentialConcernHindi: '🚨 गंभीर जोखिम: यह आपकी कमाई और आजीविका को 1 साल के लिए रोक सकता है। भारतीय अनुबंध अधिनियम (धारा 27) के तहत भी यह अवैध हो सकता है। इसे तुरंत हटाने की मांग करें।',
      whoItAffectsHindi: 'ठेकेदार (आपकी आजीविका सीमित होती है)',
    };
  }

  // 7. Liability & Indemnity
  if (cat === 'Liability' || cat === 'Indemnification' || title.includes('liability') || title.includes('indemn')) {
    return {
      titleHindi: 'असीमित व्यक्तिगत देनदारी और हर्जाना (Unlimited Liability)',
      plainHindi: 'यदि परियोजना से संबंधित कोई भी विवाद या कानूनी खर्च आता है, तो आपको क्लाइंट के सारे कानूनी खर्च और नुकसान की भरपाई बिना किसी सीमा के करनी होगी।',
      potentialConcernHindi: '🚨 बहुत खतरनाक शर्त: कोई अधिकतम सीमा नहीं है। एक गलती से आपकी पूरी जमा-पूंजी दांव पर लग सकती है। इसे कुल मिली फीस तक सीमित करने की मांग करें।',
      whoItAffectsHindi: 'ठेकेदार (आप पर असीमित जोखिम)',
    };
  }

  // 8. Dispute Resolution / Governing Law
  if (cat === 'Dispute resolution' || cat === 'Governing law' || title.includes('dispute') || title.includes('arbitrat') || title.includes('law')) {
    return {
      titleHindi: 'विवाद समाधान और मध्यस्थता (Arbitration & Governing Law)',
      plainHindi: 'यदि दोनों पक्षों में कोई विवाद होता है, तो मामला अदालत जाने के बजाय बेंगलुरु में एकल मध्यस्थ (Arbitrator) के सामने सुलझाया जाएगा।',
      potentialConcernHindi: 'मध्यस्थता (Arbitration) का खर्च काफी महंगा हो सकता है। तय करें कि शुरुआती खर्च दोनों बराबर बांटें।',
      whoItAffectsHindi: 'दोनों पक्ष',
    };
  }

  // Default fallback translation
  return {
    titleHindi: clause.title,
    plainHindi: clause.plainEnglish,
    potentialConcernHindi: clause.potentialConcern,
    whoItAffectsHindi: clause.whoItAffects,
  };
}

/**
 * Hindi translation for potential issues
 */
export function getHindiIssueTranslation(issue: PotentialIssue): {
  titleHindi: string;
  descriptionHindi: string;
  whyItMattersHindi: string;
} {
  const t = issue.title.toLowerCase();
  if (t.includes('uncapped') || t.includes('liability')) {
    return {
      titleHindi: 'असीमित व्यक्तिगत देनदारी (Uncapped Liability)',
      descriptionHindi: 'अनुबंध में आपकी देनदारी की कोई सीमा नहीं है। क्लाइंट को हुए किसी भी नुकसान या मुकदमे का पूरा खर्चा आपकी जेब से जा सकता है।',
      whyItMattersHindi: 'यह आपके व्यक्तिगत बैंक खाते और संपत्ति को सीधे कानूनी जोखिम में डालता है।',
    };
  }
  if (t.includes('non-compete')) {
    return {
      titleHindi: '12 महीने तक काम करने पर रोक (Non-Compete)',
      descriptionHindi: 'काम खत्म होने के बाद 1 साल तक आप क्लाइंट से जुड़े अन्य लोगों या कंपनियों के लिए काम नहीं कर सकते।',
      whyItMattersHindi: 'यह आपकी भविष्य की कमाई और नए प्रोजेक्ट्स लेने की स्वतंत्रता को रोकता है।',
    };
  }
  if (t.includes('intellectual property') || t.includes('ip') || t.includes('transfer')) {
    return {
      titleHindi: 'भुगतान से पहले ही काम का मालिकाना हक चला जाना',
      descriptionHindi: 'कोड और डिज़ाइन बनाते ही क्लाइंट के नाम हो जाते हैं, भले ही अंतिम भुगतान न हुआ हो।',
      whyItMattersHindi: 'यदि क्लाइंट ने पैसे देने से मना कर दिया, तो भी वे आपके बनाए काम को बिना रुकावट इस्तेमाल कर सकते हैं।',
    };
  }
  if (t.includes('payment') || t.includes('waiver') || t.includes('90')) {
    return {
      titleHindi: 'देरी से भुगतान पर 90 दिन की छूट (Payment Delay Waiver)',
      descriptionHindi: 'क्लाइंट इनवॉइस मिलने के 90 दिन बाद तक भी बिना किसी ब्याज या जुर्माने के भुगतान टाल सकता है।',
      whyItMattersHindi: 'समय पर पैसा न मिलने से आपका कैशफ्लो और बजट बिगड़ सकता है।',
    };
  }
  return {
    titleHindi: issue.title,
    descriptionHindi: issue.description,
    whyItMattersHindi: issue.whyItMatters,
  };
}

/**
 * Hindi Negotiation message templates for WhatsApp / Email
 */
export const HINDI_NEGOTIATION_TEMPLATES = [
  {
    id: 'liability',
    title: 'देनदारी सीमित करने का निवेदन (Cap Liability)',
    clauseRef: 'Liability & Indemnification',
    urgency: 'अति आवश्यक (Critical)',
    subject: 'अनुबंध में देनदारी सीमा के संबंध में सुझाव (Liability Clause Update)',
    emailBody: `नमस्ते [नाम जी],

अनुबंध का ड्राफ्ट भेजने के लिए धन्यवाद। मैंने सभी शर्तों को ध्यान से देखा है और अधिकांश बातें बिल्कुल स्पष्ट हैं।

लायबिलिटी (Liability) की धारा के संबंध में मेरा एक छोटा सा निवेदन है:
वर्तमान ड्राफ्ट में ठेकेदार/फ्रीलांसर के रूप में मेरी देनदारी असीमित (Uncapped) रखी गई है। मानक व्यावसायिक नियमों के अनुसार, क्या हम इसे इस अनुबंध के तहत प्राप्त कुल फीस तक सीमित करने की एक लाइन जोड़ सकते हैं?

सुझाया गया संशोधन:
"दोनों पक्षों की कुल अधिकतम देनदारी इस अनुबंध के तहत प्राप्त कुल भुगतान राशि (या ₹50,000) से अधिक नहीं होगी।"

कृपया पुष्टि करें, इसके बाद मैं तुरंत हस्ताक्षर करके भेजने के लिए तैयार हूं।

सादर,
[आपका नाम]`,
  },
  {
    id: 'ip',
    title: 'पूरा पैसा मिलने पर ही मालिकाना हक देना (IP on Payment)',
    clauseRef: 'Intellectual Property',
    urgency: 'ज़रूरी (Important)',
    subject: 'काम के मालिकाना हक (IP Transfer) के संबंध में स्पष्टीकरण',
    emailBody: `नमस्ते [नाम जी],

उम्मीद है आप सकुशल होंगे।

बौद्धिक संपदा (Intellectual Property) की धारा के संबंध में एक छोटा सा स्पष्टीकरण चाहिए था। ड्राफ्ट में लिखा है कि काम बनते ही मालिकाना हक ट्रांसफर हो जाएगा। हमारी सामान्य प्रक्रिया के अनुसार, पूरे काम का आधिकारिक मालिकाना हक अंतिम इनवॉइस का भुगतान प्राप्त होने पर ट्रांसफर होता है।

क्या हम इसे इस तरह लिख सकते हैं:
"अंतिम भुगतान प्राप्त होने के तुरंत बाद इस प्रोजेक्ट के सभी कॉपीराइट और अधिकार बिना शर्त क्लाइंट के नाम ट्रांसफर कर दिए जाएंगे।"

इससे काम पूरा होने और भुगतान होते ही आपको पूर्ण कानूनी अधिकार मिल जाएंगे।

धन्यवाद,
[आपका नाम]`,
  },
  {
    id: 'noncompete',
    title: '12 महीने की गैर-प्रतिस्पर्धा शर्त हटाना (Remove Non-Compete)',
    clauseRef: 'Non-Compete',
    urgency: 'उच्च प्राथमिकता (High)',
    subject: 'गैर-प्रतिस्पर्धा शर्त (Non-Compete) पर चर्चा',
    emailBody: `नमस्ते [नाम जी],

अनुबंध की धारा 6.1 में अनुबंध समाप्ति के बाद 12 महीने तक अन्य ग्राहकों के साथ काम न करने की शर्त है।

एक स्वतंत्र पेशेवर (Independent Professional) के रूप में, यह शर्त मेरी आजीविका और भविष्य के काम को बहुत सीमित करती है। मैं विश्वास दिलाता हूं कि आपकी सभी गोपनीय जानकारियों की 100% सुरक्षा करूंगा और कभी भी आपके आंतरिक कर्मचारियों से संपर्क नहीं करूंगा।

क्या हम इस 12 महीने की गैर-प्रतिस्पर्धा शर्त को हटा सकते हैं?

आपके सहयोग की प्रतीक्षा में।

सादर,
[आपका नाम]`,
  },
];

/**
 * Pre-configured conversational questions in Hindi for Ask Lexi
 */
export const HINDI_FAQS = [
  {
    q: 'मुझे पैसे कब और कैसे मिलेंगे?',
    prompt: 'इस अनुबंध के तहत मुझे पैसे कब और किस तरह से मिलेंगे?',
  },
  {
    q: 'क्या क्लाइंट मुझे बिना किसी कारण के हटा सकता है?',
    prompt: 'क्या क्लाइंट इस अनुबंध को बिना कारण समाप्त कर सकता है और कितना नोटिस चाहिए?',
  },
  {
    q: 'अगर कोई नुकसान हुआ तो क्या मुझे अपनी जेब से पैसे भरने पड़ेंगे?',
    prompt: 'इस अनुबंध में देनदारी (Liability) और हर्जाने की क्या शर्तें हैं?',
  },
  {
    q: 'काम पूरा होने के बाद क्या मैं किसी और के साथ काम कर सकता हूं?',
    prompt: 'क्या इस अनुबंध में कोई नॉन-कम्पीट या काम करने पर रोक लगाने वाली शर्त है?',
  },
  {
    q: 'मेरे बनाए कोड या डिज़ाइन का असली मालिक कौन रहेगा?',
    prompt: 'बौद्धिक संपदा (IP) का मालिकाना हक किसके पास रहेगा और कब ट्रांसफर होगा?',
  },
];
