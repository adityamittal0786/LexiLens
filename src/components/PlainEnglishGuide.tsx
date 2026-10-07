import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Send,
  Lightbulb,
  Scale,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';
import { DocumentAnalysis, ExtractedClause, PotentialIssue, AppLanguage } from '../types';

interface PlainEnglishGuideProps {
  analysis: DocumentAnalysis;
  onAskQuestion: (question: string) => void;
  onOpenChecklist: () => void;
  language?: AppLanguage;
}

export const PlainEnglishGuide: React.FC<PlainEnglishGuideProps> = ({
  analysis,
  onAskQuestion,
  onOpenChecklist,
  language = 'en',
}) => {
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<'good' | 'bad' | 'sneaky'>('sneaky');
  const [activeTemplateTab, setActiveTemplateTab] = useState<string>('liability');

  // Categorize clauses into Good, Sneaky, and Red Flags
  const issues = analysis.potentialIssues || [];
  const clauses = analysis.clauses || [];

  const redFlags = issues.filter(
    (i) =>
      i.findingType === 'One-sided provision' ||
      i.category === 'Liability' ||
      i.title.toLowerCase().includes('uncapped') ||
      i.title.toLowerCase().includes('non-compete')
  );

  const sneakyTraps = issues.filter(
    (i) =>
      !redFlags.includes(i) &&
      (i.findingType === 'Worth reviewing' ||
        i.findingType === 'Ambiguous language' ||
        i.title.toLowerCase().includes('waiver') ||
        i.title.toLowerCase().includes('interest') ||
        i.title.toLowerCase().includes('termination'))
  );

  const greenFlags = clauses.filter(
    (c) =>
      c.category === 'Payment' ||
      c.category === 'Confidentiality' ||
      c.category === 'General'
  ).slice(0, 4);

  // Negotiation templates that everyday people can copy-paste
  const negotiationTemplates = [
    {
      id: 'liability',
      title: 'Cap Your Personal Liability',
      clauseRef: 'Liability & Indemnification',
      urgency: 'Critical',
      problemSummary: 'The current draft imposes unlimited liability on you without any financial cap.',
      suggestedChange:
        'Add a standard mutual cap limiting total liability to the fees received under the agreement.',
      subject: `Proposed Update to Liability Provision — ${analysis.documentTitle}`,
      emailBody: `Hi [Name],

Thanks for sending over the draft for ${analysis.documentTitle}.

I have reviewed the terms and everything looks great overall. I have one standard commercial adjustment regarding Section ${
        analysis.potentialIssues?.find((i) => i.category === 'Liability')?.location || 'on Liability'
      }:

Currently, my liability under the agreement is uncapped. To maintain standard industry parity and satisfy my professional coverage guidelines, could we add a mutual liability cap limiting each party's aggregate liability to the total fees paid under this agreement (or a 12-month trailing amount)?

Proposed wording:
"In no event shall either party's aggregate liability arising out of or related to this Agreement exceed the total fees paid or payable by Client to Contractor in the preceding twelve (12) months."

Let me know if that works for you, and I will be glad to sign right away.

Best regards,
[Your Name]`,
    },
    {
      id: 'ip',
      title: 'Protect Work Until Paid',
      clauseRef: 'Intellectual Property & Ownership',
      urgency: 'Important',
      problemSummary: 'Ownership currently transfers immediately upon creation, even before invoices are paid.',
      suggestedChange: 'Make IP transfer effective strictly upon receipt of full payment.',
      subject: `Clarification on IP Transfer Condition — ${analysis.documentTitle}`,
      emailBody: `Hi [Name],

I am looking over the draft and excited to move forward.

Regarding Section on Intellectual Property, I noticed work product is assigned immediately upon creation. To align with standard delivery practices, I typically transfer complete ownership and assignment upon receipt of full and final payment for each milestone.

Could we update this clause to:
"Upon receipt of full and final payment for the applicable deliverables, Contractor unconditionally assigns all rights, title, and interest in such work product to Client."

This ensures complete legal ownership transfers to you immediately upon invoice settlement. Let me know if that works!

Warm regards,
[Your Name]`,
    },
    {
      id: 'payment',
      title: 'Standardize Payment Timeline',
      clauseRef: 'Invoicing & Late Payment Terms',
      urgency: 'Moderate',
      problemSummary: 'Payment timeline may be overly long or delays interest penalties for up to 90 days.',
      suggestedChange: 'Ensure strict Net-30 payment terms and standard late interest.',
      subject: `Quick Note on Invoicing & Payment Terms — ${analysis.documentTitle}`,
      emailBody: `Hi [Name],

Hope you are having a productive week.

Reviewing the payment schedule in ${analysis.documentTitle}, I wanted to confirm if we can align on standard Net-30 payment terms following invoice submission.

Also, to ensure accounting consistency on both sides, could we remove the extended 90-day penalty grace period and specify that undisputed invoices are settled within thirty (30) calendar days?

Thanks for your understanding, and looking forward to kicking off!

Best,
[Your Name]`,
    },
    {
      id: 'noncompete',
      title: 'Remove or Narrow Non-Compete',
      clauseRef: 'Restrictive Covenants & Non-Compete',
      urgency: 'High',
      problemSummary: 'A 12-month restriction prevents you from working with any related client or vendor.',
      suggestedChange: 'Remove post-termination non-compete or limit strictly to direct project trade secrets.',
      subject: `Discussion on Post-Contract Restraints — ${analysis.documentTitle}`,
      emailBody: `Hi [Name],

Reviewing the agreement, I noticed Section on Restrictive Covenants includes a 12-month post-contract non-compete.

As an independent professional serving multiple clients in this domain, a broad non-compete restricts my core livelihood. I am 100% committed to maintaining strict confidentiality of all your proprietary information and never soliciting your direct team members.

Could we remove the post-termination non-compete clause, or narrow it strictly to protect specific proprietary trade secrets?

Proposed change: Strike Section on post-termination non-compete while keeping all confidentiality provisions in full effect.

Appreciate your flexibility on this!

Best,
[Your Name]`,
    },
  ];

  const activeTemplate =
    negotiationTemplates.find((t) => t.id === activeTemplateTab) || negotiationTemplates[0];

  const handleCopyTemplate = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 3000);
  };

  // Plain-English FAQs for normal humans
  const plainEnglishFaqs = [
    {
      q: 'What happens if the client delays or refuses to pay?',
      prompt: 'What are my remedies and late payment rights if the client delays paying invoices?',
    },
    {
      q: 'Can either of us terminate this contract early?',
      prompt: 'How much notice is required to terminate this agreement without cause?',
    },
    {
      q: 'Am I personally on the hook if something goes wrong?',
      prompt: 'What are the liability caps and indemnification obligations under this contract?',
    },
    {
      q: 'Can I work with other clients or competitors after this?',
      prompt: 'Does this contract contain a non-compete or restriction on working with others?',
    },
    {
      q: 'Who owns the designs, code, or work product created?',
      prompt: 'Who owns the intellectual property and when does ownership transfer?',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Normal Human Translation Hero Banner */}
      <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-medium text-[#141413]">
                {language === 'hi'
                  ? 'सरल भाषा में अनुबंध विश्लेषण (Plain Language Guide)'
                  : language === 'bilingual'
                  ? 'Plain-English Breakdown · सरल हिन्दी व्याख्या'
                  : 'Plain-English Contract Breakdown'}
              </h2>
              <p className="text-xs text-[#6B6A66] mt-0.5">
                {language === 'hi'
                  ? 'आम नागरिकों के लिए सरल व्याख्या: कोई कानूनी जटिलता नहीं, बस वह सब जो आपको हस्ताक्षर से पहले जानना चाहिए।'
                  : 'Translated for everyday humans: no legal jargon, just what you need to know before signing.'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white border border-amber-300 text-amber-900 shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-amber-700" />
            <span>
              {language === 'hi' ? 'निष्पक्षता मूल्यांकन: ' : 'Fairness Verdict: '}
              {redFlags.length === 0
                ? language === 'hi' ? 'संतुलित (Balanced)' : 'Balanced'
                : redFlags.length <= 2
                ? language === 'hi' ? 'सावधानी आवश्यक (Review Needed)' : 'Review Needed'
                : language === 'hi' ? 'गंभीर जोखिम (High Risk)' : 'High Risk'}
            </span>
          </span>
        </div>

        {/* TL;DR Executive Takeaway */}
        <div className="p-3.5 bg-white border border-[#E2E2DE] rounded-lg text-xs sm:text-sm text-[#2C2C2A] leading-relaxed">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] block font-semibold mb-1">
            {language === 'hi' ? '10-सेकंड में मुख्य निष्कर्ष (The Bottom Line)' : 'The 10-Second Bottom Line'}
          </span>
          {language === 'hi' ? (
            <p className="font-medium text-[#141413]">
              {analysis.executiveSummaryHindi || analysis.executiveSummary || analysis.whatThisDocumentDoes}
            </p>
          ) : language === 'bilingual' ? (
            <div className="space-y-1.5">
              <p className="font-medium text-[#141413]">
                {analysis.executiveSummaryHindi || analysis.executiveSummary}
              </p>
              <p className="text-xs text-[#6B6A66] italic">
                {analysis.executiveSummary}
              </p>
            </div>
          ) : (
            <p>{analysis.executiveSummary || analysis.whatThisDocumentDoes}</p>
          )}
        </div>
      </div>

      {/* 2. The Good, The Bad & The Sneaky (3-Column Verdict Board) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* The Good */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="font-semibold text-xs font-mono uppercase tracking-wider text-emerald-950">
                {language === 'hi' ? '🟢 अच्छी बातें (सुरक्षा)' : '🟢 The Good (Protections)'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
              {greenFlags.length} {language === 'hi' ? 'बिंदु' : 'points'}
            </span>
          </div>
          <p className="text-xs text-emerald-900/90 leading-relaxed">
            {language === 'hi'
              ? 'मानक शर्तें जो आपके अधिकारों की रक्षा करती हैं और स्पष्ट व्यावसायिक नियम तय करती हैं।'
              : 'Standard terms that protect your rights and establish clear mutual expectations.'}
          </p>
          <div className="space-y-2">
            {greenFlags.map((c, i) => (
              <div key={i} className="p-2.5 rounded bg-white border border-emerald-200/60 text-xs space-y-1">
                <span className="font-semibold text-emerald-950 block">
                  {language !== 'en' && c.titleHindi ? c.titleHindi : c.title}
                </span>
                <p className="text-[#4A4946] text-[11px] leading-relaxed">
                  {language !== 'en' && c.plainHindi ? c.plainHindi : c.plainEnglish}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* The Sneaky */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h3 className="font-semibold text-xs font-mono uppercase tracking-wider text-amber-950">
                {language === 'hi' ? '🟡 छिपे हुए खतरे (सावधान)' : '🟡 The Sneaky (Watch Out)'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
              {sneakyTraps.length} {language === 'hi' ? 'शर्तें' : 'traps'}
            </span>
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            {language === 'hi'
              ? 'छिपी हुई बारीक शर्तें या असंतुलित नियम जो बाद में आपके लिए परेशानी खड़ी कर सकते हैं।'
              : 'Hidden fine print or unbalanced clauses that could catch you off-guard later.'}
          </p>
          <div className="space-y-2">
            {sneakyTraps.length > 0 ? (
              sneakyTraps.map((t, i) => (
                <div key={i} className="p-2.5 rounded bg-white border border-amber-200/70 text-xs space-y-1">
                  <span className="font-semibold text-amber-950 block">
                    {language !== 'en' && t.titleHindi ? t.titleHindi : t.title}
                  </span>
                  <p className="text-[#4A4946] text-[11px] leading-relaxed">
                    {language !== 'en' && t.descriptionHindi ? t.descriptionHindi : t.description}
                  </p>
                  <span className="text-[10px] text-amber-800 font-mono block">
                    📍 {t.location}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 bg-white rounded border border-amber-200/50 text-xs text-[#6B6A66] italic">
                {language === 'hi'
                  ? 'मानक प्रावधानों में कोई बड़ा छिपा हुआ खतरा नहीं मिला।'
                  : 'No major hidden traps identified in standard provisions.'}
              </div>
            )}
          </div>
        </div>

        {/* The Red Flags */}
        <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              <h3 className="font-semibold text-xs font-mono uppercase tracking-wider text-rose-950">
                {language === 'hi' ? '🔴 गंभीर लाल झंडी (बदलाव आवश्यक)' : '🔴 The Red Flags (Negotiate)'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded">
              {redFlags.length} {language === 'hi' ? 'गंभीर बिंदु' : 'dealbreakers'}
            </span>
          </div>
          <p className="text-xs text-rose-900/90 leading-relaxed">
            {language === 'hi'
              ? 'अत्यंत एकतरफा या भारी देयता वाली शर्तें जिन्हें हस्ताक्षर करने से पहले बातचीत करके बदलवाना चाहिए।'
              : 'Unilateral obligations you should consider pushing back on before signing.'}
          </p>
          <div className="space-y-2">
            {redFlags.length > 0 ? (
              redFlags.map((r, i) => (
                <div key={i} className="p-2.5 rounded bg-white border border-rose-200/70 text-xs space-y-1">
                  <span className="font-semibold text-rose-950 block">
                    {language !== 'en' && r.titleHindi ? r.titleHindi : r.title}
                  </span>
                  <p className="text-[#4A4946] text-[11px] leading-relaxed">
                    {language !== 'en' && r.descriptionHindi ? r.descriptionHindi : r.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-rose-800 font-mono text-[10px]">📍 {r.location}</span>
                    <button
                      onClick={() => onAskQuestion(r.suggestedQuestion || `How should I negotiate ${r.title}?`)}
                      className="text-rose-800 hover:underline font-medium text-[11px] cursor-pointer"
                    >
                      {language === 'hi' ? 'लेक्सी से पूछें →' : 'Ask Lexi →'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 bg-white rounded border border-rose-200/50 text-xs text-emerald-800">
                {language === 'hi'
                  ? '✨ कोई गंभीर लाल झंडी नहीं मिली! शर्तें मानक प्रतीत होती हैं।'
                  : '✨ No critical red flags detected! Terms appear reasonably standard.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. "How to Push Back" — Ready-to-Send Negotiation Email Templates */}
      <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#E2E2DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#141413] text-white flex items-center justify-center">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-medium text-[#141413]">
                {language === 'hi'
                  ? 'बातचीत कैसे करें (बिना किसी संकोच के)'
                  : 'How to Push Back (Without Being Awkward)'}
              </h3>
              <p className="text-xs text-[#6B6A66]">
                {language === 'hi'
                  ? 'विनम्र, पेशेवर ईमेल ड्राफ्ट जिन्हें आप सीधे कॉपी करके दूसरे पक्ष को भेज सकते हैं।'
                  : 'Polite, professional email drafts you can copy and send to the other party right now.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            {language === 'hi' ? '1-क्लिक कॉपी हेतु तैयार' : '1-Click Copy Ready'}
          </span>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {negotiationTemplates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setActiveTemplateTab(tmpl.id)}
              className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-colors cursor-pointer border ${
                activeTemplateTab === tmpl.id
                  ? 'bg-[#141413] text-white border-[#141413]'
                  : 'bg-[#F8F8F5] text-[#4A4946] border-[#E2E2DE] hover:border-[#141413]/30'
              }`}
            >
              {tmpl.title}
            </button>
          ))}
        </div>

        {/* Selected Email Card */}
        <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E8E8E4] space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] font-mono text-[#6B6A66] uppercase tracking-wider block">
                {language === 'hi' ? 'लक्षित शर्त: ' : 'Target Provision: '} {activeTemplate.clauseRef}
              </span>
              <p className="text-xs text-[#2C2C2A] font-medium mt-0.5">
                {activeTemplate.problemSummary}
              </p>
            </div>
            <button
              onClick={() => handleCopyTemplate(activeTemplate.id, activeTemplate.emailBody)}
              className="px-3 py-1.5 rounded bg-white border border-[#141413] text-xs font-medium text-[#141413] hover:bg-[#141413] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedTemplateId === activeTemplate.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{language === 'hi' ? 'कॉपी हो गया!' : 'Copied to Clipboard!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'ईमेल कॉपी करें' : 'Copy Email Draft'}</span>
                </>
              )}
            </button>
          </div>

          {/* Email Body Preview */}
          <div className="space-y-1.5">
            <div className="p-2 bg-white border border-[#E2E2DE] rounded text-xs text-[#6B6A66]">
              <span className="font-mono font-medium text-[#141413]">Subject:</span> {activeTemplate.subject}
            </div>
            <pre className="p-3.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] font-sans whitespace-pre-wrap leading-relaxed select-all">
              {activeTemplate.emailBody}
            </pre>
          </div>
        </div>
      </div>

      {/* 4. Common Questions Normal Users Ask */}
      <div className="p-5 rounded-xl bg-white border border-[#E2E2DE] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#141413]" />
          <h3 className="font-serif text-sm sm:text-base font-medium text-[#141413]">
            {language === 'hi'
              ? 'इस अनुबंध के बारे में सामान्य प्रश्न (Common Questions)'
              : 'Common Questions Everyday Users Ask About This Contract'}
          </h3>
        </div>
        <p className="text-xs text-[#6B6A66]">
          {language === 'hi'
            ? 'अनुबंध के सटीक पाठ और साक्ष्य के साथ तत्काल उत्तर पाने के लिए किसी भी प्रश्न पर क्लिक करें।'
            : 'Click any question to get an instant, text-grounded answer with verbatim contract evidence.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {plainEnglishFaqs.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => onAskQuestion(faq.prompt)}
              className="p-3 rounded-lg border border-[#E2E2DE] bg-[#FAF9F6] hover:bg-white hover:border-[#141413] text-left transition-all group flex items-start justify-between gap-2 cursor-pointer"
            >
              <span className="text-xs text-[#141413] font-medium leading-relaxed group-hover:text-black">
                {faq.q}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B6A66] group-hover:text-[#141413] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
