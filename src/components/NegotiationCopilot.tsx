import React, { useMemo, useState } from 'react';
import { Check, Copy, Gauge, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';
import { DocumentAnalysis, AppLanguage, PotentialIssue } from '../types';

interface NegotiationCopilotProps {
  analysis: DocumentAnalysis;
  language?: AppLanguage;
  onAskQuestion: (question: string) => void;
}

const getIssuePlan = (issue: PotentialIssue, language: AppLanguage) => {
  const hindi = language === 'hi';
  const title = hindi && issue.titleHindi ? issue.titleHindi : issue.title;
  const description = hindi && issue.descriptionHindi ? issue.descriptionHindi : issue.description;
  const question = hindi && issue.suggestedQuestionHindi ? issue.suggestedQuestionHindi : issue.suggestedQuestion;
  const highImpact = issue.confidence === 'High' || issue.findingType === 'One-sided provision';

  return {
    title,
    description,
    question: question || (hindi ? 'इस प्रावधान को स्पष्ट करने के लिए सामने वाले पक्ष से पूछें।' : 'Ask the other party to clarify this provision.'),
    leverage: highImpact ? (hindi ? 'उच्च प्रभाव' : 'High leverage') : (hindi ? 'मध्यम प्रभाव' : 'Medium leverage'),
    objective: hindi
      ? 'इस शर्त को संतुलित, स्पष्ट और दोनों पक्षों के लिए उचित बनाना।'
      : 'Make this term balanced, specific, and workable for both parties.',
    fallback: hindi
      ? 'यदि बदलाव स्वीकार न हो, तो लिखित स्पष्टीकरण, सीमा या अपवाद जोड़ने का अनुरोध करें।'
      : 'If they reject the change, ask for a written clarification, limit, or exception.',
    wording: hindi
      ? `धारा "${title}" के संबंध में क्या हम इसे इस तरह स्पष्ट कर सकते हैं कि जिम्मेदारी और जोखिम उचित रूप से दोनों पक्षों में बंटे रहें?`
      : `Regarding "${issue.title}", could we revise this so responsibility and risk are allocated fairly between both parties?`,
  };
};

export const NegotiationCopilot: React.FC<NegotiationCopilotProps> = ({
  analysis,
  language = 'en',
  onAskQuestion,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const isHindi = language === 'hi';
  const issues = useMemo(() => analysis.potentialIssues || [], [analysis.potentialIssues]);
  const plans = issues.map((issue) => ({ issue, plan: getIssuePlan(issue, language) }));

  const copyText = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-amber-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-indigo-900 p-2 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-indigo-800">
              {isHindi ? 'साक्ष्य-आधारित बातचीत सहायक' : 'Evidence-linked negotiation intelligence'}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[#141413]">
              {isHindi ? 'सिर्फ जोखिम नहीं — अगला कदम भी' : 'Know what to change, what to ask, and what to accept.'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#4A4946]">
              {isHindi
                ? 'यह स्क्रीन दस्तावेज़ में मिले जोखिमों को बातचीत की रणनीति में बदलती है। हर सुझाव मूल अनुबंध की खोजी गई शर्त से जुड़ा है।'
                : 'LexiLens turns detected risks into a practical negotiation plan. Every recommendation stays linked to a finding from this document instead of inventing generic legal advice.'}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            [isHindi ? 'पहचानें' : '1. Identify', isHindi ? 'कौन-सी शर्त असंतुलित है' : 'What is actually risky'],
            [isHindi ? 'बात करें' : '2. Negotiate', isHindi ? 'क्या बदलने को कहना है' : 'What to ask for'],
            [isHindi ? 'सुरक्षित रखें' : '3. Protect', isHindi ? 'यदि मना हो तो विकल्प' : 'Your fallback position'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-lg border border-indigo-100 bg-white/80 p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-800">{label}</p>
              <p className="mt-1 text-xs text-[#4A4946]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-lg border border-[#E2E2DE] bg-white p-6 text-sm text-[#4A4946]">
          {isHindi ? 'इस दस्तावेज़ में बातचीत के लिए कोई विशेष जोखिम नहीं मिला।' : 'No specific negotiation issue was identified in this document.'}
        </div>
      ) : (
        plans.map(({ issue, plan }, index) => (
          <article key={issue.id} className="rounded-xl border border-[#E2E2DE] bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#141413] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#141413]">{plan.title}</h3>
                  <p className="mt-1 text-xs text-[#6B6A66]">{issue.location} · {issue.findingType}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-900">
                <Gauge className="h-3 w-3" /> {plan.leverage}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="rounded-lg bg-[#F8F8F5] p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B6A66]">{isHindi ? 'समस्या' : 'The issue'}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2C2A]">{plan.description}</p>
              </div>
              <div className="rounded-lg bg-indigo-50/60 p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-800">{isHindi ? 'बातचीत का लक्ष्य' : 'Negotiation objective'}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2C2A]">{plan.objective}</p>
              </div>
              <div className="rounded-lg bg-emerald-50/60 p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-800">{isHindi ? 'बैकअप योजना' : 'Fallback position'}</p>
                <p className="mt-1 text-xs leading-relaxed text-[#2C2C2A]">{plan.fallback}</p>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-[#E2E2DE] p-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B6A66]">{isHindi ? 'कॉपी करने योग्य भाषा' : 'Copy-ready wording'}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#2C2C2A]">“{plan.wording}”</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => copyText(issue.id, plan.wording)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#141413] px-2.5 py-1.5 text-[11px] font-medium text-white"
                >
                  {copied === issue.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied === issue.id ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'भाषा कॉपी करें' : 'Copy wording')}
                </button>
                <button
                  onClick={() => onAskQuestion(plan.question)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E2DE] px-2.5 py-1.5 text-[11px] font-medium text-[#141413]"
                >
                  <MessageSquare className="h-3 w-3" /> {isHindi ? 'लेक्सी से पूछें' : 'Ask Lexi'}
                </button>
              </div>
            </div>
          </article>
        ))
      )}
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-950">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{isHindi ? 'यह बातचीत की तैयारी है, कानूनी सलाह नहीं। हस्ताक्षर से पहले योग्य वकील से महत्वपूर्ण बदलावों की समीक्षा कराएं।' : 'This is negotiation preparation, not legal advice. Have material changes reviewed by a qualified lawyer before signing.'}</span>
      </div>
    </div>
  );
};
