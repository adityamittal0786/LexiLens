import React, { useState } from 'react';
import {
  GitCompare,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ComparisonResult, LegalDocument } from '../types';
import { SAMPLE_COMPARISON_RESULT } from '../data/sampleContracts';
import { compareDocumentsAPI } from '../services/api';

interface ComparisonWorkspaceProps {
  documents: LegalDocument[];
  onOpenUpload: () => void;
}

export const ComparisonWorkspace: React.FC<ComparisonWorkspaceProps> = ({
  documents,
}) => {
  const [docAId, setDocAId] = useState<string>(documents[0]?.id || 'doc-demo-v1');
  const [docBId, setDocBId] = useState<string>(documents[1]?.id || 'doc-demo-v2');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult>(SAMPLE_COMPARISON_RESULT);
  const [isComparing, setIsComparing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const docA = documents.find((d) => d.id === docAId) || documents[0];
  const docB = documents.find((d) => d.id === docBId) || documents[1];

  const handleRunComparison = async () => {
    if (!docA || !docB) return;
    setIsComparing(true);
    try {
      const result = await compareDocumentsAPI(docA.rawText, docB.rawText, docA.title, docB.title);
      setComparisonResult(result);
    } catch (err) {
      console.error('Comparison error', err);
    } finally {
      setIsComparing(false);
    }
  };

  const handleLoadV1V2Demo = () => {
    setDocAId('doc-demo-v1');
    setDocBId('doc-demo-v2');
    setComparisonResult(SAMPLE_COMPARISON_RESULT);
  };

  const categories = ['all', ...Array.from(new Set(comparisonResult.differences.map((d) => d.category)))];

  const filteredDiffs =
    filterCategory === 'all'
      ? comparisonResult.differences
      : comparisonResult.differences.filter((d) => d.category === filterCategory);

  const getChangeBadge = (type: string) => {
    switch (type) {
      case 'added':
        return {
          icon: PlusCircle,
          text: 'Added in Revision B',
          className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'removed':
        return {
          icon: MinusCircle,
          text: 'Removed in Revision B',
          className: 'bg-rose-50 text-rose-800 border-rose-200',
        };
      case 'modified':
        return {
          icon: RefreshCw,
          text: 'Modified Term',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      default:
        return {
          icon: CheckCircle2,
          text: 'Unchanged',
          className: 'bg-[#F2F2EE] text-[#4A4946] border-[#E2E2DE]',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-lg bg-white border border-[#E2E2DE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] font-semibold block mb-1">
            Redline Comparison
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141413]">
            Compare Document Versions
          </h2>
          <p className="text-xs text-[#6B6A66] mt-1 max-w-2xl leading-relaxed">
            Side-by-side analysis of two contract revisions. Identify added obligations, removed protections, and shifted risk distributions.
          </p>
        </div>

        {/* Demo trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadV1V2Demo}
            className="px-3.5 py-1.5 rounded bg-white hover:bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] text-xs font-medium transition-colors cursor-pointer"
          >
            Load Demo (v1.0 vs v2.0)
          </button>
        </div>
      </div>

      {/* Document Selection Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-5 rounded-lg border border-[#E2E2DE] shadow-xs">
        {/* Doc A Picker */}
        <div className="md:col-span-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141413] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]" />
              Document A (Original Baseline)
            </label>
            <span className="text-[10px] text-[#6B6A66] font-mono">Reference</span>
          </div>
          <select
            value={docAId}
            onChange={(e) => setDocAId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>

        {/* Center Comparison Arrow & CTA */}
        <div className="md:col-span-2 flex flex-col items-center justify-center pt-2">
          <button
            onClick={handleRunComparison}
            disabled={isComparing}
            className="px-4 py-2 rounded bg-[#141413] hover:bg-[#2C2C2A] disabled:opacity-50 text-white font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            {isComparing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <GitCompare className="w-3.5 h-3.5" />
            )}
            <span>Compare</span>
          </button>
        </div>

        {/* Doc B Picker */}
        <div className="md:col-span-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141413] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Document B (Revised / Counter)
            </label>
            <span className="text-[10px] text-[#6B6A66] font-mono">Counter-Proposal</span>
          </div>
          <select
            value={docBId}
            onChange={(e) => setDocBId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Intelligence Snapshot Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6B6A66]">Added Clauses</span>
            <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <span className="text-2xl font-mono font-medium text-[#141413]">
            {comparisonResult.stats.added}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6B6A66]">Removed Clauses</span>
            <MinusCircle className="w-3.5 h-3.5 text-rose-700" />
          </div>
          <span className="text-2xl font-mono font-medium text-[#141413]">
            {comparisonResult.stats.removed}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6B6A66]">Modified Terms</span>
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <span className="text-2xl font-mono font-medium text-[#141413]">
            {comparisonResult.stats.modified}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#6B6A66]">Unchanged Terms</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#6B6A66]" />
          </div>
          <span className="text-2xl font-mono font-medium text-[#141413]">
            {comparisonResult.stats.unchanged}
          </span>
        </div>
      </div>

      {/* Executive Comparison Summary */}
      <div className="p-5 rounded-lg bg-white border border-[#E2E2DE] shadow-xs space-y-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] font-semibold block">
          Executive Comparison Finding
        </span>
        <p className="text-xs text-[#2C2C2A] leading-relaxed font-sans">
          {comparisonResult.executiveComparison}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[#6B6A66] text-xs font-mono mr-1">Filter:</span>
        {categories.map((cat) => {
          const isActive = filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#141413] text-white font-medium'
                  : 'bg-white border border-[#E2E2DE] text-[#4A4946] hover:text-[#141413]'
              }`}
            >
              {cat === 'all' ? 'All Differences' : cat}
            </button>
          );
        })}
      </div>

      {/* Differences List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredDiffs.map((diff) => {
            const badge = getChangeBadge(diff.changeType);
            const Icon = badge.icon;

            return (
              <motion.div
                key={diff.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="p-5 rounded-lg bg-white border border-[#E2E2DE] space-y-4 shadow-xs"
              >
                {/* Diff Card Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-3 hairline-b">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${badge.className}`}
                    >
                      <Icon className="w-3 h-3" />
                      {badge.text}
                    </span>
                    <h3 className="font-semibold text-sm text-[#141413]">
                      {diff.clauseTitle}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#6B6A66] bg-[#F8F8F5] px-2 py-0.5 rounded border border-[#E2E2DE]">
                    {diff.category}
                  </span>
                </div>

                {/* Side-by-Side Excerpts (Doc A vs Doc B) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Document A Excerpt */}
                  <div className="p-3.5 rounded bg-[#FAF9F6] border border-[#E8E8E4] space-y-1">
                    <span className="text-[10px] font-mono text-[#6B6A66] uppercase block">
                      {comparisonResult.docATitle}
                    </span>
                    <p className="text-xs text-[#4A4946] italic font-serif leading-relaxed">
                      {diff.docAQuote ? `"${diff.docAQuote}"` : '(Clause was not present in this version)'}
                    </p>
                  </div>

                  {/* Document B Excerpt */}
                  <div className="p-3.5 rounded bg-[#F2F4F8] border border-[#C7D4EA] space-y-1">
                    <span className="text-[10px] font-mono text-[#1E3A8A] uppercase block font-semibold">
                      {comparisonResult.docBTitle}
                    </span>
                    <p className="text-xs text-[#141413] italic font-serif leading-relaxed">
                      {diff.docBQuote ? `"${diff.docBQuote}"` : '(Clause removed in this revision)'}
                    </p>
                  </div>
                </div>

                {/* Plain-Language Explanation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded bg-[#F8F8F5] border border-[#E8E8E4]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6A66] block mb-1">
                      What Changed
                    </span>
                    <p className="text-[#2C2C2A] leading-relaxed">
                      {diff.whatChanged}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-[#F8F8F5] border border-[#E8E8E4]">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6A66] block mb-1">
                      Plain English
                    </span>
                    <p className="text-[#2C2C2A] leading-relaxed">
                      {diff.plainMeaning}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-amber-50/50 border border-amber-200">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-900 block mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      Significance
                    </span>
                    <p className="text-[#141413] leading-relaxed text-xs">
                      {diff.potentialSignificance}
                    </p>
                  </div>
                </div>

                {/* Questions to Consider Prompt */}
                {diff.questionsToConsider && (
                  <div className="p-3 rounded bg-[#F8F8F5] border border-[#E8E8E4] text-xs text-[#4A4946] flex items-start gap-2.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#141413] block mb-0.5">
                        Recommended clarification to ask counterparty:
                      </span>
                      <p className="text-[#4A4946] italic font-serif">"{diff.questionsToConsider}"</p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
