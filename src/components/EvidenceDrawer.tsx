import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Quote,
  MapPin,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { ExtractedClause, PotentialIssue, ConfidenceLevel } from '../types';

interface EvidenceDrawerProps {
  selectedItem: ExtractedClause | PotentialIssue | null;
  onClose: () => void;
  onJumpToDocument: (quote: string, sectionRef: string) => void;
  onAskQuestionAboutItem: (question: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  selectedItem,
  onClose,
  onJumpToDocument,
  onAskQuestionAboutItem,
}) => {
  const [copied, setCopied] = useState(false);

  if (!selectedItem) return null;

  const isIssue = 'findingType' in selectedItem;
  const quote = isIssue ? selectedItem.evidence : selectedItem.quote;
  const location = isIssue ? selectedItem.location : selectedItem.docReference;
  const confidence = selectedItem.confidence;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceBadge = (conf: ConfidenceLevel) => {
    switch (conf) {
      case 'High':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-[#F2F2EE] text-[#4A4946] border-[#E2E2DE]';
    }
  };

  return (
    <div className="h-full bg-white border-l border-[#E2E2DE] flex flex-col shadow-lg animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="p-3.5 bg-[#F8F8F5] hairline-b flex items-center justify-between">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#6B6A66] block">
            Clause Inspection
          </span>
          <h4 className="text-xs font-semibold text-[#141413] truncate" title={selectedItem.title}>
            {selectedItem.title}
          </h4>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-[#6B6A66] hover:text-[#141413] hover:bg-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Badge Row */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          {isIssue && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-900 border border-amber-300">
              {selectedItem.findingType}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded text-[10px] border ${getConfidenceBadge(confidence)}`}>
            {confidence} Clarity
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-[#F8F8F5] text-[#6B6A66] border border-[#E2E2DE] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#A3A29E]" />
            {location}
          </span>
        </div>

        {/* Verbatim Document Evidence Quote */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] flex items-center gap-1">
              <Quote className="w-3 h-3 text-[#1E3A8A]" />
              Verbatim Text Excerpt
            </label>
            <button
              onClick={handleCopyQuote}
              className="text-[11px] text-[#6B6A66] hover:text-[#141413] flex items-center gap-1 cursor-pointer font-mono"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-800" />
                  <span className="text-emerald-800 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3 bg-[#F8F8F5] rounded border border-[#E8E8E4] text-[#2C2C2A] text-xs leading-relaxed font-serif">
            <p className="italic">"{quote}"</p>
            <button
              onClick={() => onJumpToDocument(quote, location)}
              className="mt-2.5 inline-flex items-center gap-1 text-xs text-[#1E3A8A] hover:underline font-medium cursor-pointer font-sans"
            >
              <span>Jump to Section in Document</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Plain Language Interpretation */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] block">
            Plain-English Meaning
          </label>
          <div className="p-3 bg-white rounded border border-[#E2E2DE] text-[#2C2C2A] leading-relaxed">
            {isIssue ? selectedItem.description : selectedItem.plainEnglish}
          </div>
        </div>

        {/* Why It Matters / Potential Concern */}
        {(isIssue || selectedItem.potentialConcern) && (
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-700" />
              Significance & Risk
            </label>
            <div className="p-3 bg-amber-50/40 rounded border border-amber-200 text-[#141413] leading-relaxed text-xs">
              {isIssue ? selectedItem.whyItMatters : selectedItem.potentialConcern}
            </div>
          </div>
        )}

        {/* Suggested Question to Ask a Lawyer or Client */}
        {isIssue && selectedItem.suggestedQuestion && (
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-[#1E3A8A]" />
              Clarification to Consider
            </label>
            <div className="p-3 bg-white rounded border border-[#E2E2DE] text-[#2C2C2A] leading-relaxed text-xs shadow-xs space-y-2.5">
              <p className="italic font-serif text-[#141413]">
                "{selectedItem.suggestedQuestion}"
              </p>
              <button
                onClick={() => onAskQuestionAboutItem(selectedItem.suggestedQuestion)}
                className="w-full py-1.5 px-3 rounded bg-[#141413] hover:bg-[#2C2C2A] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Lexi About This</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#F8F8F5] hairline-t text-[11px] font-mono text-[#6B6A66] flex items-center justify-between">
        <span>Grounded Citation</span>
        <span className="text-[#141413] font-medium">LexiLens</span>
      </div>
    </div>
  );
};
