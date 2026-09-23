import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Layers,
  FileCheck2,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Building,
  User,
  Quote,
  History,
  Copy,
  Check,
  Scale,
  CreditCard,
  Calendar,
  Shield,
  Columns,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LegalDocument,
  DocumentAnalysis,
  ExtractedClause,
  PotentialIssue,
  PartyObligation,
  XRayNode,
  DocumentVersion,
} from '../types';
import { DocumentViewer } from './DocumentViewer';
import { EvidenceDrawer } from './EvidenceDrawer';
import { LegalXRayView } from './LegalXRayView';
import { BeforeYouSignScorecard } from './BeforeYouSignScorecard';
import { VersionHistory } from './VersionHistory';

interface AnalysisWorkspaceProps {
  document: LegalDocument;
  analysis: DocumentAnalysis;
  onAskQuestion: (question: string) => void;
  onOpenChecklist: () => void;
  onOpenBrief: () => void;
  onUpdateDocument?: (updatedDoc: LegalDocument, newVersion: DocumentVersion) => void;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  document,
  analysis,
  onAskQuestion,
  onOpenChecklist,
  onOpenBrief,
  onUpdateDocument,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'summary' | 'clauses' | 'issues' | 'xray' | 'beforesign' | 'history'
  >('summary');
  const [clauseCategoryFilter, setClauseCategoryFilter] = useState<string>('all');
  const [clauseSearchQuery, setClauseSearchQuery] = useState<string>('');
  const [issuesFilter, setIssuesFilter] = useState<string>('all');
  const [selectedItemForEvidence, setSelectedItemForEvidence] = useState<ExtractedClause | PotentialIssue | null>(null);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  // Layout view mode: 'split' (doc + findings) vs 'findings-only' vs 'doc-only'
  const [viewMode, setViewMode] = useState<'split' | 'findings-only' | 'doc-only'>('split');

  // Session-based version history initialization
  const baselineVersion: DocumentVersion = {
    id: 'ver-baseline',
    versionNumber: 'v1.0',
    timestamp: document.uploadedAt || 'Session Start',
    title: 'Original Baseline Agreement',
    description: 'Initial document state upon upload and comprehensive analysis.',
    author: 'Original Baseline',
    text: document.rawText,
    diffSummary: 'Baseline document uploaded into LexiLens workspace',
  };

  const [versions, setVersions] = useState<DocumentVersion[]>(() => {
    if (document.versions && document.versions.length > 0) {
      return document.versions;
    }
    return [baselineVersion];
  });

  const [currentVersionId, setCurrentVersionId] = useState<string>(
    versions[0]?.id || baselineVersion.id
  );

  // Handle restoring a previous version
  const handleRestoreVersion = (versionToRestore: DocumentVersion) => {
    setCurrentVersionId(versionToRestore.id);
    const updatedDoc: LegalDocument = {
      ...document,
      rawText: versionToRestore.text,
      wordCount: versionToRestore.text.trim().split(/\s+/).length,
      versions,
    };
    if (onUpdateDocument) {
      onUpdateDocument(updatedDoc, versionToRestore);
    }
    setHighlightedText(null);
  };

  // Handle applying an AI suggested clause modification
  const handleApplyAISuggestion = (
    title: string,
    clauseRef: string,
    oldSnippet: string,
    newSnippet: string,
    description: string
  ) => {
    let updatedText = document.rawText;
    if (updatedText.includes(oldSnippet)) {
      updatedText = updatedText.replace(oldSnippet, newSnippet);
    } else {
      updatedText = `${updatedText}\n\n[REVISION - ${clauseRef} AMENDMENT]:\n${newSnippet}`;
    }

    const newVerNum = `v1.${versions.length}`;
    const newVersion: DocumentVersion = {
      id: 'ver-' + Date.now(),
      versionNumber: newVerNum,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      description,
      author: 'Proposed Revision',
      sourceClause: clauseRef,
      text: updatedText,
      diffSummary: `Modified ${clauseRef}: Applied balanced proposed revision.`,
    };

    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    setCurrentVersionId(newVersion.id);

    const updatedDoc: LegalDocument = {
      ...document,
      rawText: updatedText,
      wordCount: updatedText.trim().split(/\s+/).length,
      versions: updatedVersions,
    };

    if (onUpdateDocument) {
      onUpdateDocument(updatedDoc, newVersion);
    }

    handleJumpToDocument(newSnippet.substring(0, 60), clauseRef);
  };

  // Handle creating a manual edit
  const handleCreateManualEdit = (
    title: string,
    newFullText: string,
    description: string,
    sourceClause?: string
  ) => {
    const newVerNum = `v1.${versions.length}`;
    const newVersion: DocumentVersion = {
      id: 'ver-' + Date.now(),
      versionNumber: newVerNum,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      description,
      author: 'Manual Edit',
      sourceClause,
      text: newFullText,
      diffSummary: description,
    };

    const updatedVersions = [newVersion, ...versions];
    setVersions(updatedVersions);
    setCurrentVersionId(newVersion.id);

    const updatedDoc: LegalDocument = {
      ...document,
      rawText: newFullText,
      wordCount: newFullText.trim().split(/\s+/).length,
      versions: updatedVersions,
    };

    if (onUpdateDocument) {
      onUpdateDocument(updatedDoc, newVersion);
    }
  };

  // Jump from finding to document viewer
  const handleJumpToDocument = (quote: string, sectionRef: string) => {
    setHighlightedText(quote);
    setHighlightedSection(sectionRef);
    if (viewMode === 'findings-only') {
      setViewMode('split');
    }
  };

  const handleClearHighlight = () => {
    setHighlightedText(null);
    setHighlightedSection(null);
  };

  const handleSelectClause = (clause: ExtractedClause) => {
    setSelectedItemForEvidence(clause);
    handleJumpToDocument(clause.quote, clause.docReference);
    setShowRightDrawer(true);
  };

  const handleSelectIssue = (issue: PotentialIssue) => {
    setSelectedItemForEvidence(issue);
    handleJumpToDocument(issue.evidence, issue.location);
    setShowRightDrawer(true);
  };

  const handleSelectXRayNode = (node: XRayNode) => {
    const matchingClause = analysis.clauses.find((c) =>
      c.docReference.toLowerCase().includes(node.sectionRef.toLowerCase())
    );
    if (matchingClause) {
      handleSelectClause(matchingClause);
    } else {
      setHighlightedSection(node.sectionRef);
    }
  };

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  // Categories present in this document
  const categories = ['all', ...Array.from(new Set(analysis.clauses.map((c) => c.category)))];

  const filteredClauses = analysis.clauses.filter((c) => {
    const matchesCat = clauseCategoryFilter === 'all' || c.category === clauseCategoryFilter;
    const matchesSearch =
      !clauseSearchQuery ||
      c.title.toLowerCase().includes(clauseSearchQuery.toLowerCase()) ||
      c.plainEnglish.toLowerCase().includes(clauseSearchQuery.toLowerCase()) ||
      c.quote.toLowerCase().includes(clauseSearchQuery.toLowerCase()) ||
      c.docReference.toLowerCase().includes(clauseSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredIssues = analysis.potentialIssues.filter((issue) => {
    if (issuesFilter === 'all') return true;
    if (issuesFilter === 'one-sided') return issue.findingType === 'One-sided provision';
    if (issuesFilter === 'concern') return issue.findingType === 'Potential concern';
    return true;
  });

  return (
    <div className="h-[calc(100vh-100px)] min-h-[600px] flex flex-col bg-[#FBFBFA]">
      {/* Top Workspace Action Strip */}
      <div className="bg-white hairline-b px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        {/* Document Identifier */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded bg-[#F8F8F5] border border-[#E2E2DE] flex items-center justify-center text-[#141413] shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm text-[#141413] truncate max-w-[200px] sm:max-w-[280px]">
                {analysis.documentTitle}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F2F4F8] text-[#1E3A8A] border border-[#C7D4EA] shrink-0">
                {versions.find((v) => v.id === currentVersionId)?.versionNumber || 'v1.0'}
              </span>
            </div>
            <p className="text-[11px] text-[#6B6A66] font-mono truncate">
              {analysis.documentType} · {document.wordCount} words
            </p>
          </div>
        </div>

        {/* Center Subtabs Navigation: Clean hairline tabs */}
        <div className="flex items-center gap-1 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('summary')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'summary'
                ? 'bg-[#141413] text-white'
                : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F2F2EE]'
            }`}
          >
            <span>Executive Summary</span>
          </button>

          <button
            onClick={() => setActiveSubTab('clauses')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'clauses'
                ? 'bg-[#141413] text-white'
                : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F2F2EE]'
            }`}
          >
            <span>Clauses</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                activeSubTab === 'clauses' ? 'bg-white/20 text-white' : 'bg-[#E8E8E4] text-[#4A4946]'
              }`}
            >
              {analysis.clauses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('issues')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'issues'
                ? 'bg-[#141413] text-white'
                : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F2F2EE]'
            }`}
          >
            <span>Watch-outs</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                activeSubTab === 'issues'
                  ? 'bg-amber-400 text-slate-900 font-semibold'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {analysis.potentialIssues.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('xray')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'xray'
                ? 'bg-[#141413] text-white'
                : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F2F2EE]'
            }`}
          >
            <span>Legal X-Ray</span>
          </button>

          <button
            onClick={() => setActiveSubTab('beforesign')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'beforesign'
                ? 'bg-[#141413] text-white'
                : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F2F2EE]'
            }`}
          >
            <span>Before You Sign</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-[#141413] text-white'
                : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F2F2EE]'
            }`}
          >
            <span>Revisions</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                activeSubTab === 'history' ? 'bg-white/20 text-white' : 'bg-[#E8E8E4] text-[#4A4946]'
              }`}
            >
              {versions.length}
            </span>
          </button>
        </div>

        {/* Right Shortcuts & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Split Mode Toggle */}
          <div className="hidden sm:flex items-center bg-[#F2F2EE] p-0.5 rounded border border-[#E2E2DE] text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                viewMode === 'split'
                  ? 'bg-white text-[#141413] font-semibold shadow-xs'
                  : 'text-[#6B6A66] hover:text-[#141413]'
              }`}
              title="Show contract text and analysis side-by-side"
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('findings-only')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                viewMode === 'findings-only'
                  ? 'bg-white text-[#141413] font-semibold shadow-xs'
                  : 'text-[#6B6A66] hover:text-[#141413]'
              }`}
              title="Show analysis cards across full screen"
            >
              Full Cards
            </button>
          </div>

          <button
            onClick={onOpenBrief}
            className="px-3.5 py-1.5 rounded-md bg-[#141413] hover:bg-[#2C2C2A] text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Lawyer Brief</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* PANEL 1: Left Document Viewer */}
        {viewMode !== 'findings-only' && (
          <div
            className={`${
              viewMode === 'doc-only'
                ? 'col-span-12'
                : 'hidden lg:block lg:col-span-5'
            } h-full overflow-hidden p-3`}
          >
            <DocumentViewer
              document={document}
              highlightedText={highlightedText}
              highlightedSection={highlightedSection}
              onClearHighlight={handleClearHighlight}
            />
          </div>
        )}

        {/* PANEL 2: Center Analysis Findings */}
        {viewMode !== 'doc-only' && (
          <div
            className={`${
              viewMode === 'findings-only'
                ? showRightDrawer && selectedItemForEvidence
                  ? 'lg:col-span-9 col-span-12'
                  : 'col-span-12'
                : showRightDrawer && selectedItemForEvidence
                ? 'lg:col-span-4 col-span-12'
                : 'lg:col-span-7 col-span-12'
            } h-full overflow-y-auto p-4 sm:p-5 space-y-5`}
          >
            <AnimatePresence mode="wait">
              {/* SUBTAB 1: Summary & Vitals */}
              {activeSubTab === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  {/* Agreement Vitals Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6B6A66] mb-1">
                        <Scale className="w-3.5 h-3.5 text-[#141413]" />
                        Jurisdiction
                      </div>
                      <p className="text-xs font-semibold text-[#141413]">
                        {analysis.jurisdiction === 'india'
                          ? 'India (Karnataka)'
                          : analysis.jurisdiction === 'us'
                          ? 'United States'
                          : analysis.jurisdiction === 'uk'
                          ? 'United Kingdom'
                          : 'Governing Contract Law'}
                      </p>
                      <span className="text-[10px] font-mono text-[#A3A29E]">Governing Law</span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6B6A66] mb-1">
                        <CreditCard className="w-3.5 h-3.5 text-[#141413]" />
                        Payment Term
                      </div>
                      <p className="text-xs font-semibold text-[#141413]">
                        Net 15 Days
                      </p>
                      <span className="text-[10px] font-mono text-[#A3A29E]">Monthly Invoices</span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6B6A66] mb-1">
                        <Calendar className="w-3.5 h-3.5 text-[#141413]" />
                        Notice Period
                      </div>
                      <p className="text-xs font-semibold text-[#141413]">
                        30 Days Written
                      </p>
                      <span className="text-[10px] font-mono text-[#A3A29E]">Early Termination</span>
                    </div>

                    <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 shadow-xs">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-800 mb-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                        Liability Exposure
                      </div>
                      <p className="text-xs font-semibold text-amber-950">
                        Uncapped (One-Sided)
                      </p>
                      <span className="text-[10px] font-mono text-amber-800">Requires Revision</span>
                    </div>
                  </div>

                  {/* Executive Summary Card */}
                  <div className="p-5 sm:p-6 rounded-lg bg-white border border-[#E2E2DE] shadow-xs">
                    <div className="flex items-center justify-between mb-3 hairline-b pb-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#141413] font-semibold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#141413]" />
                        Document Overview
                      </span>
                      <span className="text-[10px] font-mono text-[#6B6A66] bg-[#F8F8F5] px-2 py-0.5 rounded border border-[#E2E2DE]">
                        Plain English
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#2C2C2A] leading-relaxed">
                      {analysis.executiveSummary}
                    </p>
                    <div className="mt-4 p-3.5 rounded bg-[#F8F8F5] border border-[#E8E8E4] flex items-start gap-2.5 text-xs text-[#2C2C2A]">
                      <span className="font-semibold text-[#141413] shrink-0 font-mono text-[11px] uppercase">Core function:</span>
                      <span className="leading-relaxed">{analysis.whatThisDocumentDoes}</span>
                    </div>
                  </div>

                  {/* Identified Parties */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis.parties.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-lg bg-white border border-[#E2E2DE] flex items-start gap-3 shadow-xs"
                      >
                        <div className="p-2 rounded bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] shrink-0">
                          {idx === 0 ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6A66] block mb-0.5">
                            {p.shortLabel}
                          </span>
                          <h4 className="text-xs font-semibold text-[#141413] truncate">{p.name}</h4>
                          <p className="text-[11px] text-[#6B6A66] mt-0.5">{p.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Key Obligations: Side by Side (Party A vs Party B) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#141413]" />
                        Contractual Obligations by Party
                      </h3>
                      <span className="text-[11px] font-mono text-[#6B6A66]">Commitments & timelines</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Party A Obligations */}
                      <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] space-y-3 shadow-xs">
                        <div className="flex items-center gap-2 pb-2 hairline-b">
                          <div className="w-5 h-5 rounded bg-[#F8F8F5] flex items-center justify-center text-[#141413] border border-[#E2E2DE]">
                            <Building className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-[#141413]">
                            {analysis.parties[0]?.shortLabel || 'Party A'} Responsibilities
                          </span>
                        </div>

                        <div className="space-y-2">
                          {analysis.partyAObligations.map((ob) => (
                            <div
                              key={ob.id}
                              className="p-3 rounded bg-[#F8F8F5] border border-[#E8E8E4] text-xs hover:border-[#141413] transition-colors"
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <span className="font-medium text-[#141413]">{ob.title}</span>
                                <span className="text-[10px] text-[#6B6A66] font-mono">
                                  {ob.sectionRef}
                                </span>
                              </div>
                              <p className="text-[#4A4946] text-xs leading-relaxed mb-2">
                                {ob.obligation}
                              </p>
                              {ob.deadline && (
                                <div className="text-[11px] text-[#6B6A66] font-mono">
                                  <span className="text-[#141413] font-medium">Deadline:</span> {ob.deadline}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Party B Obligations */}
                      <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] space-y-3 shadow-xs">
                        <div className="flex items-center gap-2 pb-2 hairline-b">
                          <div className="w-5 h-5 rounded bg-[#F8F8F5] flex items-center justify-center text-[#141413] border border-[#E2E2DE]">
                            <User className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-[#141413]">
                            {analysis.parties[1]?.shortLabel || 'Party B'} Responsibilities
                          </span>
                        </div>

                        <div className="space-y-2">
                          {analysis.partyBObligations.map((ob) => (
                            <div
                              key={ob.id}
                              className="p-3 rounded bg-[#F8F8F5] border border-[#E8E8E4] text-xs hover:border-[#141413] transition-colors"
                            >
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <span className="font-medium text-[#141413]">{ob.title}</span>
                                <span className="text-[10px] text-[#6B6A66] font-mono">
                                  {ob.sectionRef}
                                </span>
                              </div>
                              <p className="text-[#4A4946] text-xs leading-relaxed mb-2">
                                {ob.obligation}
                              </p>
                              {ob.deadline && (
                                <div className="text-[11px] text-[#6B6A66] font-mono">
                                  <span className="text-[#141413] font-medium">Deadline:</span> {ob.deadline}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Missing Information Banner */}
                  {analysis.missingInformation.length > 0 && (
                    <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 space-y-2 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                        <HelpCircle className="w-4 h-4 text-amber-700" />
                        <span>Noted omissions or unaddressed terms in this draft</span>
                      </div>
                      <ul className="space-y-1 text-xs text-amber-900 pl-4 list-disc marker:text-amber-600">
                        {analysis.missingInformation.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SUBTAB 2: Clause Explorer */}
              {activeSubTab === 'clauses' && (
                <motion.div
                  key="clauses"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {/* Search and Category Filter */}
                  <div className="space-y-2.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-[#A3A29E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search clauses, topics, or keywords..."
                        value={clauseSearchQuery}
                        onChange={(e) => setClauseSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-8 py-1.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] placeholder:text-[#A3A29E] focus:outline-none focus:border-[#141413]"
                      />
                      {clauseSearchQuery && (
                        <button
                          onClick={() => setClauseSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A3A29E] hover:text-[#141413] text-xs font-mono"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      <span className="text-[#6B6A66] font-mono text-[10px] uppercase mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Filter:
                      </span>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setClauseCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                            clauseCategoryFilter === cat
                              ? 'bg-[#141413] text-white font-medium'
                              : 'bg-white text-[#4A4946] border border-[#E2E2DE] hover:border-[#141413]'
                          }`}
                        >
                          {cat === 'all' ? 'All Clauses' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clause Cards List */}
                  <div className="space-y-3">
                    {filteredClauses.map((clause) => (
                      <div
                        key={clause.id}
                        onClick={() => handleSelectClause(clause)}
                        className={`p-4 rounded-lg bg-white border transition-colors cursor-pointer shadow-xs ${
                          selectedItemForEvidence?.id === clause.id
                            ? 'border-[#141413] ring-1 ring-[#141413]'
                            : 'border-[#E2E2DE] hover:border-[#141413]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs sm:text-sm text-[#141413]">
                              {clause.title}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F8F8F5] text-[#6B6A66] border border-[#E2E2DE]">
                              {clause.category}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#6B6A66] bg-[#F8F8F5] px-2 py-0.5 rounded border border-[#E2E2DE]">
                            {clause.docReference}
                          </span>
                        </div>

                        {/* Plain English Translation Card */}
                        <div className="p-3 rounded bg-[#F8F8F5] border border-[#E8E8E4] mb-2.5 text-xs text-[#2C2C2A] leading-relaxed">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6A66] block mb-0.5">
                            Plain English Meaning
                          </span>
                          {clause.plainEnglish}
                        </div>

                        {/* Original Contract Quote */}
                        <div className="p-2.5 bg-[#FAF9F6] rounded border border-[#E8E8E4] text-[11px] text-[#4A4946] italic font-serif mb-2.5 line-clamp-2">
                          "{clause.quote}"
                        </div>

                        <div className="pt-2 hairline-t flex items-center justify-between text-[11px] text-[#6B6A66]">
                          <span className="font-mono">Affects: <strong className="text-[#141413] font-semibold">{clause.whoItAffects}</strong></span>
                          <span className="text-[#1E3A8A] flex items-center gap-1 font-medium hover:underline">
                            Inspect in Document <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}

                    {filteredClauses.length === 0 && (
                      <div className="p-8 text-center bg-white rounded-lg border border-[#E2E2DE] text-xs text-[#6B6A66]">
                        No clauses match your filter or search query.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* SUBTAB 3: Potential Issues / Risk Intelligence */}
              {activeSubTab === 'issues' && (
                <motion.div
                  key="issues"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 text-xs text-amber-950 shadow-xs">
                    <p className="font-semibold mb-1 flex items-center gap-1.5 text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      Document Risk Assessment ({analysis.potentialIssues.length} Watch-outs Identified)
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Highlighted clauses reflect one-sided liability, broad IP transfers, or missing protections. Ready-to-use clarification questions are provided for counsel or counter-parties.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <button
                      onClick={() => setIssuesFilter('all')}
                      className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                        issuesFilter === 'all'
                          ? 'bg-[#141413] text-white font-medium'
                          : 'bg-white text-[#4A4946] border border-[#E2E2DE] hover:border-[#141413]'
                      }`}
                    >
                      All ({analysis.potentialIssues.length})
                    </button>
                    <button
                      onClick={() => setIssuesFilter('one-sided')}
                      className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                        issuesFilter === 'one-sided'
                          ? 'bg-rose-800 text-white font-medium'
                          : 'bg-white text-[#4A4946] border border-[#E2E2DE] hover:border-[#141413]'
                      }`}
                    >
                      One-Sided Provisions
                    </button>
                    <button
                      onClick={() => setIssuesFilter('concern')}
                      className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                        issuesFilter === 'concern'
                          ? 'bg-amber-800 text-white font-medium'
                          : 'bg-white text-[#4A4946] border border-[#E2E2DE] hover:border-[#141413]'
                      }`}
                    >
                      Potential Concerns
                    </button>
                  </div>

                  <div className="space-y-3">
                    {filteredIssues.map((issue) => (
                      <div
                        key={issue.id}
                        onClick={() => handleSelectIssue(issue)}
                        className={`p-4 rounded-lg bg-white border transition-colors cursor-pointer shadow-xs ${
                          selectedItemForEvidence?.id === issue.id
                            ? 'border-[#141413] ring-1 ring-[#141413]'
                            : 'border-[#E2E2DE] hover:border-[#141413]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                              issue.findingType === 'One-sided provision' || issue.findingType === 'Potential concern'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}>
                              {issue.findingType}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-[#141413]">{issue.title}</h4>
                          </div>
                          <span className="text-[10px] font-mono text-[#6B6A66] bg-[#F8F8F5] px-2 py-0.5 rounded border border-[#E2E2DE]">
                            {issue.location}
                          </span>
                        </div>

                        <p className="text-xs text-[#4A4946] leading-relaxed mb-2.5">
                          {issue.description}
                        </p>

                        <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950 mb-2.5">
                          <strong className="font-semibold text-amber-900 block mb-0.5 font-mono text-[10px] uppercase">Why this matters:</strong>
                          {issue.whyItMatters}
                        </div>

                        {issue.suggestedQuestion && (
                          <div className="p-2.5 rounded bg-[#F8F8F5] border border-[#E8E8E4] text-[11px] text-[#2C2C2A] flex items-start justify-between gap-2 mb-2.5">
                            <div className="flex items-start gap-2 min-w-0">
                              <Quote className="w-3.5 h-3.5 text-[#6B6A66] shrink-0 mt-0.5" />
                              <div>
                                <span className="font-mono text-[10px] uppercase text-[#6B6A66] block mb-0.5">Proposed Clarification Question:</span>
                                <p className="italic font-serif text-[#141413]">"{issue.suggestedQuestion}"</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyQuestion(issue.id, issue.suggestedQuestion);
                              }}
                              className="px-2 py-1 rounded bg-white border border-[#E2E2DE] hover:bg-[#F8F8F5] text-[#141413] text-[10px] font-mono shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Copy negotiation question"
                            >
                              {copiedQuestionId === issue.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-800" />
                                  <span className="text-emerald-800">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-[#6B6A66]" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        <div className="pt-2 hairline-t flex items-center justify-between text-[11px] text-[#6B6A66]">
                          <span className="font-mono">Assessment: <strong className="text-[#141413] font-semibold">{issue.confidence}</strong></span>
                          <span className="text-[#1E3A8A] flex items-center gap-1 font-medium">
                            Highlight in Contract <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SUBTAB 4: Legal X-Ray */}
              {activeSubTab === 'xray' && (
                <motion.div
                  key="xray"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <LegalXRayView
                    nodes={analysis.legalXRayTree}
                    onSelectNode={handleSelectXRayNode}
                  />
                </motion.div>
              )}

              {/* SUBTAB 5: Before You Sign Scorecard */}
              {activeSubTab === 'beforesign' && (
                <motion.div
                  key="beforesign"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <BeforeYouSignScorecard
                    items={analysis.beforeYouSignScorecard}
                    onSelectClause={(ref) => setHighlightedSection(ref)}
                    onAskLawyerQuestion={(prompt) => onAskQuestion(prompt)}
                  />
                </motion.div>
              )}

              {/* SUBTAB 6: Version History & Revisions */}
              {activeSubTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <VersionHistory
                    document={document}
                    versions={versions}
                    currentVersionId={currentVersionId}
                    onRestoreVersion={handleRestoreVersion}
                    onApplyAISuggestion={handleApplyAISuggestion}
                    onCreateManualEdit={handleCreateManualEdit}
                    onHighlightClauseInViewer={handleJumpToDocument}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PANEL 3: Right Context / Evidence Drawer */}
        {showRightDrawer && selectedItemForEvidence && activeSubTab !== 'history' && viewMode !== 'doc-only' && (
          <div className="col-span-12 lg:col-span-3 h-full overflow-hidden border-l border-slate-200 bg-white">
            <EvidenceDrawer
              selectedItem={selectedItemForEvidence}
              onClose={() => setSelectedItemForEvidence(null)}
              onJumpToDocument={handleJumpToDocument}
              onAskQuestionAboutItem={(q) => onAskQuestion(q)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
