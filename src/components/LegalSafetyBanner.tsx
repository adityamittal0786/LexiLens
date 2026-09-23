import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Jurisdiction } from '../types';

interface LegalSafetyBannerProps {
  jurisdiction: Jurisdiction;
  onSelectJurisdiction: (j: Jurisdiction) => void;
}

export const LegalSafetyBanner: React.FC<LegalSafetyBannerProps> = ({
  jurisdiction,
  onSelectJurisdiction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getJurisdictionLabel = (j: Jurisdiction) => {
    switch (j) {
      case 'india':
        return 'India (Contract & Arbitration Laws)';
      case 'us':
        return 'United States (UCC & Common Law)';
      case 'uk':
        return 'United Kingdom (English Common Law)';
      case 'general':
        return 'General International Principles';
      default:
        return 'Document-Only (Neutral text reading)';
    }
  };

  return (
    <aside
      aria-label="Legal safety and jurisdiction notice"
      className="bg-[#F8F8F5] hairline-b text-xs text-[#6B6A66] py-2 px-4 relative z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-[#141413] uppercase tracking-wider">
            Notice
          </span>
          <span className="text-[#C4C4BE]" aria-hidden="true">·</span>
          <p className="text-[#4A4946] text-xs">
            LexiLens provides legal information and document-analysis assistance, <span className="font-semibold text-[#141413]">not legal advice</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6B6A66]">Framework:</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#141413] hover:text-[#1E3A8A] font-medium flex items-center gap-1 cursor-pointer underline decoration-[#C4C4BE] underline-offset-2"
          >
            <span>{getJurisdictionLabel(jurisdiction).split('(')[0].trim()}</span>
            <ChevronRight
              className={`w-3 h-3 text-[#6B6A66] transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="max-w-7xl mx-auto mt-2 pt-2.5 hairline-t text-[#4A4946] grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
              <div className="p-3 bg-white border border-[#E2E2DE] rounded-md text-xs space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] block">
                  Verification Principle
                </span>
                <p className="text-xs text-[#4A4946] leading-relaxed">
                  LexiLens reviews what is actually written in the agreement. Every summary and
                  potential concern is anchored to verbatim text. It never fabricates citations.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#E2E2DE] rounded-md text-xs space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] block">
                  Select Legal Framework
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(['doc_only', 'india', 'us', 'uk', 'general'] as Jurisdiction[]).map((j) => {
                    const isSelected = jurisdiction === j;
                    return (
                      <button
                        key={j}
                        onClick={() => {
                          onSelectJurisdiction(j);
                          setIsExpanded(false);
                        }}
                        className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#141413] text-white border-[#141413]'
                            : 'bg-white text-[#4A4946] border-[#E2E2DE] hover:border-[#141413]/30'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                        <span>
                          {j === 'doc_only'
                            ? 'Document-Only'
                            : j === 'india'
                            ? 'India'
                            : j === 'us'
                            ? 'United States'
                            : j === 'uk'
                            ? 'United Kingdom'
                            : 'General International'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
