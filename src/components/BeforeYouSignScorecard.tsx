import React from 'react';
import {
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  FileCheck2,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BeforeYouSignItem } from '../types';

interface BeforeYouSignScorecardProps {
  items: BeforeYouSignItem[];
  onSelectClause: (clauseRef: string) => void;
  onAskLawyerQuestion: (prompt: string) => void;
}

export const BeforeYouSignScorecard: React.FC<BeforeYouSignScorecardProps> = ({
  items,
  onSelectClause,
  onAskLawyerQuestion,
}) => {
  const getStatusBadge = (status: BeforeYouSignItem['status']) => {
    switch (status) {
      case 'clear':
        return {
          icon: CheckCircle2,
          text: 'Verified Clear',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'needs_clarification':
        return {
          icon: HelpCircle,
          text: 'Needs Clarification',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'review_recommended':
        return {
          icon: AlertTriangle,
          text: 'Review Recommended',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
        };
    }
  };

  const clearCount = items.filter((i) => i.status === 'clear').length;
  const clarifyCount = items.filter((i) => i.status === 'needs_clarification').length;
  const reviewCount = items.filter((i) => i.status === 'review_recommended').length;

  return (
    <div className="space-y-4">
      {/* Header Overview Card */}
      <div className="p-5 rounded-lg bg-white border border-[#E2E2DE] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#141413]">
                Before You Sign Scorecard
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F8F8F5] text-[#6B6A66] border border-[#E2E2DE]">
                Checklist
              </span>
            </div>
            <p className="text-xs text-[#6B6A66] mt-0.5">
              Fundamental pre-execution questions verified against contract text.
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded bg-emerald-50/60 border border-emerald-200 text-center min-w-[70px]">
            <span className="block text-sm font-mono font-semibold text-emerald-800">{clearCount}</span>
            <span className="text-[10px] text-emerald-700 font-mono uppercase">Clear</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-amber-50/60 border border-amber-200 text-center min-w-[70px]">
            <span className="block text-sm font-mono font-semibold text-amber-800">{clarifyCount}</span>
            <span className="text-[10px] text-amber-700 font-mono uppercase">Clarify</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-rose-50/60 border border-rose-200 text-center min-w-[70px]">
            <span className="block text-sm font-mono font-semibold text-rose-800">{reviewCount}</span>
            <span className="text-[10px] text-rose-700 font-mono uppercase">Review</span>
          </div>
        </div>
      </div>

      {/* Grid of Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item, idx) => {
          const badge = getStatusBadge(item.status);
          const Icon = badge.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: idx * 0.03 }}
              className="p-4 rounded-lg bg-white border border-[#E2E2DE] hover:border-[#141413] transition-colors flex flex-col justify-between gap-3 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6B6A66]">
                    {item.topic}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${badge.badgeClass}`}
                  >
                    <Icon className="w-3 h-3" />
                    {badge.text}
                  </span>
                </div>

                <p className="text-xs text-[#141413] font-semibold mb-1.5 leading-snug">
                  {item.question}
                </p>

                <p className="text-xs text-[#4A4946] leading-relaxed">
                  {item.finding}
                </p>
              </div>

              {/* Action Footer */}
              <div className="pt-2.5 hairline-t flex items-center justify-between gap-2 text-[11px]">
                <button
                  onClick={() => onSelectClause(item.clauseRef)}
                  className="flex items-center gap-1 text-[#6B6A66] hover:text-[#141413] font-mono transition-colors cursor-pointer"
                >
                  <span>In Document: {item.clauseRef}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {item.lawyerPrompt && (
                  <button
                    onClick={() => onAskLawyerQuestion(item.lawyerPrompt)}
                    className="flex items-center gap-1 text-[#1E3A8A] hover:underline font-medium transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Ask Lexi</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
