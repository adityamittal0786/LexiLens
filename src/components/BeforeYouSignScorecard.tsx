import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  FileCheck2,
  MessageSquare,
  ExternalLink,
  Check,
  Filter,
  ShieldCheck,
  CreditCard,
  DoorOpen,
  ShieldAlert,
  Lightbulb,
  FileLock2,
  RefreshCw,
  Scale,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BeforeYouSignItem } from '../types';

interface BeforeYouSignScorecardProps {
  items: BeforeYouSignItem[];
  onSelectClause: (clauseRef: string) => void;
  onAskLawyerQuestion: (prompt: string) => void;
}

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  payment: CreditCard,
  termination: DoorOpen,
  liability: ShieldAlert,
  ip: Lightbulb,
  confidentiality: FileLock2,
  renewal: RefreshCw,
  governing_law: Scale,
};

const DOMAIN_LABELS: Record<string, string> = {
  payment: 'Payment terms',
  termination: 'Termination',
  liability: 'Liability',
  ip: 'Intellectual property',
  confidentiality: 'Confidentiality',
  renewal: 'Renewal',
  governing_law: 'Governing law',
};

export const BeforeYouSignScorecard: React.FC<BeforeYouSignScorecardProps> = ({
  items,
  onSelectClause,
  onAskLawyerQuestion,
}) => {
  // Track user-checked items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    // Default checked if item is already clear
    const initial: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.status === 'clear') {
        initial[item.id] = true;
      }
    });
    return initial;
  });

  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unverified' | 'action_needed'>('all');

  const toggleItemCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  // Filter items
  const filteredItems = items.filter((item) => {
    if (domainFilter !== 'all' && item.domain !== domainFilter) {
      return false;
    }
    if (statusFilter === 'unverified' && checkedItems[item.id]) {
      return false;
    }
    if (statusFilter === 'action_needed' && item.status === 'clear') {
      return false;
    }
    return true;
  });

  const totalItems = items.length;
  const verifiedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalItems > 0 ? Math.round((verifiedCount / totalItems) * 100) : 0;
  const reviewCount = items.filter((i) => i.status === 'review_recommended').length;
  const clarifyCount = items.filter((i) => i.status === 'needs_clarification').length;

  return (
    <div className="space-y-4">
      {/* Header Overview Card */}
      <div className="p-5 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-[#1E3A8A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#141413]">
                  Before You Sign Scorecard
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F2F4F8] text-[#1E3A8A] border border-[#C7D4EA]">
                  Essential Checklist
                </span>
              </div>
              <p className="text-xs text-[#6B6A66] mt-0.5 max-w-xl">
                7 core legal pillars verified against verbatim text. Inspect what to look for, why it matters, and where it appears before putting pen to paper.
              </p>
            </div>
          </div>

          {/* Progress & Stat Pill */}
          <div className="flex items-center gap-4 shrink-0 bg-[#FAF9F6] p-3 rounded-lg border border-[#E8E8E4]">
            <div>
              <div className="flex items-center justify-between gap-3 text-xs mb-1">
                <span className="font-medium text-[#141413]">Verification Progress</span>
                <span className="font-mono font-bold text-[#141413]">
                  {verifiedCount} / {totalItems} ({progressPercent}%)
                </span>
              </div>
              <div className="w-44 h-2 bg-[#E2E2DE] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progressPercent === 100
                      ? 'bg-emerald-600'
                      : progressPercent > 50
                      ? 'bg-[#1E3A8A]'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="h-8 w-px bg-[#E2E2DE]" />

            <div className="flex items-center gap-1.5">
              {reviewCount > 0 && (
                <span className="px-2 py-1 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-mono font-semibold">
                  {reviewCount} Review
                </span>
              )}
              {clarifyCount > 0 && (
                <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-semibold">
                  {clarifyCount} Clarify
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 pt-3 hairline-t flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Domain Chips */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-mono text-[#6B6A66] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Pillars:
            </span>
            <button
              onClick={() => setDomainFilter('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                domainFilter === 'all'
                  ? 'bg-[#141413] text-white'
                  : 'bg-[#F2F2EE] text-[#4A4946] hover:bg-[#E8E8E4]'
              }`}
            >
              All (7)
            </button>
            {Object.entries(DOMAIN_LABELS).map(([key, label]) => {
              const Icon = DOMAIN_ICONS[key] || FileCheck2;
              const hasItems = items.some((i) => i.domain === key);
              if (!hasItems) return null;

              return (
                <button
                  key={key}
                  onClick={() => setDomainFilter(key)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    domainFilter === key
                      ? 'bg-[#141413] text-white'
                      : 'bg-[#F2F2EE] text-[#4A4946] hover:bg-[#E8E8E4]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick status filters */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                statusFilter === 'all' ? 'text-[#141413] font-semibold underline' : 'text-[#6B6A66]'
              }`}
            >
              All items
            </button>
            <span>·</span>
            <button
              onClick={() => setStatusFilter('action_needed')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                statusFilter === 'action_needed' ? 'text-amber-800 font-semibold underline' : 'text-[#6B6A66]'
              }`}
            >
              Action needed ({reviewCount + clarifyCount})
            </button>
            <span>·</span>
            <button
              onClick={() => setStatusFilter('unverified')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                statusFilter === 'unverified' ? 'text-rose-800 font-semibold underline' : 'text-[#6B6A66]'
              }`}
            >
              Unverified ({totalItems - verifiedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 7 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <AnimatePresence>
          {filteredItems.map((item, idx) => {
            const badge = getStatusBadge(item.status);
            const StatusIcon = badge.icon;
            const DomainIcon = (item.domain && DOMAIN_ICONS[item.domain]) || FileCheck2;
            const domainTitle = (item.domain && DOMAIN_LABELS[item.domain]) || item.topic;
            const isChecked = Boolean(checkedItems[item.id]);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15, delay: idx * 0.02 }}
                className={`p-4 rounded-lg bg-white border transition-all flex flex-col justify-between gap-3 shadow-xs ${
                  isChecked
                    ? 'border-[#C8E6C9] bg-[#FAFCFA]'
                    : item.status === 'review_recommended'
                    ? 'border-rose-200 hover:border-rose-300'
                    : 'border-[#E2E2DE] hover:border-[#141413]'
                }`}
              >
                <div>
                  {/* Top Bar: Domain & Verification Checkbox */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 rounded bg-[#F2F2EE] text-[#4A4946]">
                        <DomainIcon className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6A66] font-semibold">
                        {domainTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${badge.badgeClass}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {badge.text}
                      </span>

                      {/* Interactive checkmark toggle */}
                      <button
                        onClick={(e) => toggleItemCheck(item.id, e)}
                        className={`p-1 rounded-md border text-xs cursor-pointer transition-colors flex items-center gap-1 ${
                          isChecked
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-[#A3A29E] border-[#E2E2DE] hover:border-[#141413] hover:text-[#141413]'
                        }`}
                        title={isChecked ? 'Marked as reviewed' : 'Click to mark as verified'}
                        aria-label={`Toggle verification for ${item.topic}`}
                      >
                        <Check className="w-3 h-3" />
                        <span className="text-[10px] font-mono">
                          {isChecked ? 'Verified' : 'Check off'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Core Question */}
                  <h4 className="text-xs sm:text-sm font-semibold text-[#141413] mb-2 leading-snug">
                    {item.question}
                  </h4>

                  {/* Current Finding in Document */}
                  <div className="p-2.5 rounded bg-[#F8F8F5] border border-[#E8E8E4] mb-3 text-xs">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6A66] font-semibold block mb-0.5">
                      Current Contract State:
                    </span>
                    <p className="text-[#2C2C2A] leading-relaxed">
                      {item.finding}
                    </p>
                  </div>

                  {/* 3 STRUCTURED SECTIONS */}
                  <div className="space-y-2 text-xs">
                    {/* 1. What to look for */}
                    <div className="flex items-start gap-2 bg-white p-2 rounded border border-[#EFEFEA]">
                      <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 shrink-0 mt-0.5">
                        What to look for
                      </span>
                      <p className="text-[#4A4946] leading-relaxed text-[11px]">
                        {item.whatToLookFor || 'Standard balanced terms without unilateral penalties or open-ended exposure.'}
                      </p>
                    </div>

                    {/* 2. Why it matters */}
                    <div className="flex items-start gap-2 bg-white p-2 rounded border border-[#EFEFEA]">
                      <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0 mt-0.5">
                        Why it matters
                      </span>
                      <p className="text-[#4A4946] leading-relaxed text-[11px]">
                        {item.whyItMatters || 'Unbalanced provisions shift financial, operational, or legal liability solely onto your shoulders.'}
                      </p>
                    </div>

                    {/* 3. Where it appears */}
                    <div className="flex items-start gap-2 bg-white p-2 rounded border border-[#EFEFEA]">
                      <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 shrink-0 mt-0.5">
                        Where it appears
                      </span>
                      <button
                        onClick={() => onSelectClause(item.clauseRef)}
                        className="text-[#1E3A8A] hover:underline font-mono text-[11px] text-left flex items-center gap-1 cursor-pointer"
                        title="Click to jump and highlight this clause in document"
                      >
                        <span>{item.whereItAppears || item.clauseRef}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-2.5 hairline-t flex items-center justify-between gap-2 text-[11px]">
                  <button
                    onClick={() => onSelectClause(item.clauseRef)}
                    className="flex items-center gap-1 text-[#6B6A66] hover:text-[#141413] font-mono transition-colors cursor-pointer"
                  >
                    <span>Highlight: {item.clauseRef}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  {item.lawyerPrompt && (
                    <button
                      onClick={() => onAskLawyerQuestion(item.lawyerPrompt)}
                      className="px-2.5 py-1 rounded bg-[#F2F4F8] hover:bg-[#E8EDF5] text-[#1E3A8A] font-medium transition-colors cursor-pointer flex items-center gap-1 border border-[#C7D4EA]"
                      title="Ask Lexi this pre-formatted inquiry"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Ask Lexi</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
