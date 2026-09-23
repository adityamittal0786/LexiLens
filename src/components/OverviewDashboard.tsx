import React, { useState } from 'react';
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Upload,
  Search,
  ExternalLink,
  Sliders,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LegalDocument, DocumentAnalysis, ActiveTab } from '../types';

interface OverviewDashboardProps {
  documents: LegalDocument[];
  activeDocument: LegalDocument;
  analysis: DocumentAnalysis;
  onSelectDocument: (doc: LegalDocument) => void;
  onOpenUpload: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onLoadDemo: () => void;
}

// Sample interactive data for the hero product mockup
const HERO_CLAUSES = [
  {
    id: 'liability',
    name: 'Liability & Indemnity',
    section: 'Section 7.2',
    rawExcerpt:
      'Contractor agrees to indemnify, defend, and hold harmless the Client against any and all claims, liabilities, losses, damages, costs, and expenses (including reasonable attorney fees) without financial limitation.',
    plainEnglish:
      'You are agreeing to unlimited personal liability for any dispute or damage related to the project, while the client’s liability to you is capped at a nominal amount.',
    findingType: 'Potential concern',
    findingTone: 'text-amber-800 bg-amber-50 border-amber-200',
    affectedParty: 'Contractor (You)',
    confidence: 'High · Grounded in text',
  },
  {
    id: 'termination',
    name: 'Termination & Notice',
    section: 'Section 3.2',
    rawExcerpt:
      'Either party may terminate this Agreement without cause upon providing thirty (30) calendar days prior written notice. Upon notice, Contractor shall immediately cease work and deliver all work-in-progress.',
    plainEnglish:
      'Either side can end the contract at any time with 30 days written notice. You must stop working immediately and hand over all files produced up to that day.',
    findingType: 'Standard commercial term',
    findingTone: 'text-slate-800 bg-slate-100 border-slate-200',
    affectedParty: 'Both Parties',
    confidence: 'High · Grounded in text',
  },
  {
    id: 'payment',
    name: 'Payment & Remedies',
    section: 'Section 4.1',
    rawExcerpt:
      'Client shall pay approved invoices within thirty (30) days of receipt. Invoices not queried within 90 days shall be deemed accepted. No late interest or default penalties shall accrue.',
    plainEnglish:
      'Invoices are paid Net-30, but the client waives late payment fees or default penalties if payments are delayed.',
    findingType: 'Worth reviewing',
    findingTone: 'text-amber-800 bg-amber-50 border-amber-200',
    affectedParty: 'Contractor (You)',
    confidence: 'High · Grounded in text',
  },
  {
    id: 'noncompete',
    name: 'Restrictive Covenants',
    section: 'Section 6.1',
    rawExcerpt:
      'For twelve (12) months following termination, Contractor shall not solicit or provide competing design, development, or consulting services to any customer or vendor of Client.',
    plainEnglish:
      'A 12-month post-contract non-compete restricting your ability to work for any client contact or vendor. In many jurisdictions, this may be legally unenforceable.',
    findingType: 'One-sided provision',
    findingTone: 'text-rose-900 bg-rose-50 border-rose-200',
    affectedParty: 'Contractor (You)',
    confidence: 'High · Grounded in text',
  },
];

// Interactive diff comparison items for the Diff showcase
const DIFF_ITEMS = [
  {
    id: 'notice',
    category: 'Termination Notice',
    clauseRef: 'Section 3.2',
    before: 'Thirty (30) calendar days prior written notice.',
    after: 'Sixty (60) calendar days prior written notice.',
    changeType: 'Modified',
    summary: 'Notice period increased from 30 days to 60 days.',
    plainMeaning:
      'Gives you twice as much time to wrap up deliverables and transition projects before the contract terminates.',
  },
  {
    id: 'liability_cap',
    category: 'Liability Limitation',
    clauseRef: 'Section 7.2',
    before: 'Contractor liability shall be uncapped and unlimited for all claims.',
    after:
      'Total aggregate liability of either party shall not exceed total fees paid under this Agreement in the preceding 12 months.',
    changeType: 'Modified',
    summary: 'Replaced unilateral uncapped liability with a mutual commercial cap.',
    plainMeaning:
      'Protects your business from open-ended financial exposure in the event of unforeseen disputes.',
  },
  {
    id: 'ip_transfer',
    category: 'Intellectual Property',
    clauseRef: 'Section 5.3',
    before: 'All Works shall be assigned immediately upon creation.',
    after:
      'Assignment of Intellectual Property shall become effective strictly upon receipt of full and final payment.',
    changeType: 'Modified',
    summary: 'IP transfer condition tied directly to receipt of payment.',
    plainMeaning:
      'You retain ownership of your code and designs until invoices are fully settled.',
  },
];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  documents,
  activeDocument,
  analysis,
  onSelectDocument,
  onOpenUpload,
  onNavigateTab,
  onLoadDemo,
}) => {
  // Hero interactive mockup state
  const [selectedHeroClauseId, setSelectedHeroClauseId] = useState('liability');
  const activeHeroClause =
    HERO_CLAUSES.find((c) => c.id === selectedHeroClauseId) || HERO_CLAUSES[0];

  // Interactive Legal X-Ray layer filter state
  const [selectedXRayCategory, setSelectedXRayCategory] = useState<string>('all');

  // Interactive Diff showcase state
  const [selectedDiffId, setSelectedDiffId] = useState('notice');
  const activeDiff = DIFF_ITEMS.find((d) => d.id === selectedDiffId) || DIFF_ITEMS[0];

  // Interactive Before You Sign Checklist state
  const [checklistItems, setChecklistItems] = useState([
    {
      id: 'chk-1',
      topic: 'Payment Terms & Milestones',
      checked: true,
      detail: 'Net-30 verified, no hidden fee deductions.',
      section: 'Section 4.1',
    },
    {
      id: 'chk-2',
      topic: 'Termination Notice Period',
      checked: true,
      detail: '30-day notice identified for termination without cause.',
      section: 'Section 3.2',
    },
    {
      id: 'chk-3',
      topic: 'Liability & Indemnification Exposure',
      checked: false,
      detail: 'Uncapped liability clause identified; counsel review recommended.',
      section: 'Section 7.2',
    },
    {
      id: 'chk-4',
      topic: 'Intellectual Property Transfer Timing',
      checked: true,
      detail: 'Work product transferred upon full payment confirmation.',
      section: 'Section 5.3',
    },
    {
      id: 'chk-5',
      topic: 'Governing Law & Dispute Forum',
      checked: false,
      detail: 'Arbitration seat located in client jurisdiction.',
      section: 'Section 11.4',
    },
    {
      id: 'chk-6',
      topic: 'Questions Prepared for Legal Counsel',
      checked: false,
      detail: 'Structured brief generated with 4 prioritized questions.',
      section: 'Brief Packet',
    },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Filter clauses for Legal X-Ray section
  const xRayClauses = analysis.clauses || [];
  const filteredXRayClauses =
    selectedXRayCategory === 'all'
      ? xRayClauses
      : xRayClauses.filter((c) =>
          c.category.toLowerCase().includes(selectedXRayCategory.toLowerCase())
        );

  const checkedCount = checklistItems.filter((i) => i.checked).length;

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: Minimal, Authoritative & Editorial
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-8 sm:pt-14 lg:pt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            {/* Category Label: Unboxed text, zero pills */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#6B6A66]">
              <span>Legal Document Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Grounded Analysis</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#141413] leading-[1.05] text-balance">
              Understand the fine print. <br />
              <em className="italic font-normal text-[#1E3A8A]">Before it matters.</em>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#4A4946] leading-relaxed max-w-2xl font-sans">
              Turn complex legal documents into clear explanations, important clauses,
              evidence, and actionable questions.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenUpload}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#141413] hover:bg-[#2C2C2A] rounded-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Analyze a document</span>
              </button>

              <button
                onClick={onLoadDemo}
                className="px-5 py-2.5 text-xs font-medium text-[#141413] bg-white border border-[#E2E2DE] hover:border-[#141413]/30 rounded-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Explore demo</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6B6A66]" />
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              HERO PRODUCT VISUAL: Realistic Document-Analysis Interface
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-12 sm:mt-16">
            <div className="bg-white border border-[#E2E2DE] rounded-xl shadow-xs overflow-hidden">
              {/* Product Window Header */}
              <div className="px-4 py-3 bg-[#F8F8F5] hairline-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E4E4E0]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E4E4E0]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E4E4E0]" />
                  </div>
                  <span className="text-xs font-mono text-[#6B6A66]">
                    Master_Services_Agreement_v1.0.docx
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#6B6A66]">
                  <span className="font-mono text-[11px]">4,218 words</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">Verified Grounded</span>
                </div>
              </div>

              {/* Product Workspace Split: Document (Left) + Intelligence (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E2DE]">
                {/* Left Panel: Real Document Excerpt */}
                <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 bg-white">
                  <div className="flex items-center justify-between text-xs text-[#6B6A66] hairline-b pb-3">
                    <span className="uppercase font-mono tracking-wider text-[11px]">
                      Document Excerpt
                    </span>
                    <span>Page 4 of 12</span>
                  </div>

                  {/* Document Clauses with interactive highlights */}
                  <div className="space-y-4 font-serif text-sm leading-relaxed text-[#2C2C2A]">
                    <div
                      onClick={() => setSelectedHeroClauseId('termination')}
                      className={`p-3 rounded-md transition-all cursor-pointer border ${
                        selectedHeroClauseId === 'termination'
                          ? 'bg-[#F2F4F8] border-[#1E3A8A]/30 text-[#141413]'
                          : 'bg-white border-transparent hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="font-sans font-semibold text-xs tracking-wider uppercase text-[#141413] block mb-1">
                        3.2 Term & Termination for Convenience
                      </span>
                      <p>
                        "Either party may terminate this Agreement without cause upon providing thirty
                        (30) calendar days prior written notice. Upon notice, Contractor shall
                        immediately cease work and deliver all work-in-progress to Client."
                      </p>
                    </div>

                    <div
                      onClick={() => setSelectedHeroClauseId('payment')}
                      className={`p-3 rounded-md transition-all cursor-pointer border ${
                        selectedHeroClauseId === 'payment'
                          ? 'bg-[#F2F4F8] border-[#1E3A8A]/30 text-[#141413]'
                          : 'bg-white border-transparent hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="font-sans font-semibold text-xs tracking-wider uppercase text-[#141413] block mb-1">
                        4.1 Invoicing, Payment & No-Late-Fee Waiver
                      </span>
                      <p>
                        "Client shall pay approved invoices within thirty (30) days of receipt.
                        Invoices not queried within 90 days shall be deemed accepted. No late interest
                        or default penalties shall accrue on overdue amounts."
                      </p>
                    </div>

                    <div
                      onClick={() => setSelectedHeroClauseId('noncompete')}
                      className={`p-3 rounded-md transition-all cursor-pointer border ${
                        selectedHeroClauseId === 'noncompete'
                          ? 'bg-[#F2F4F8] border-[#1E3A8A]/30 text-[#141413]'
                          : 'bg-white border-transparent hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="font-sans font-semibold text-xs tracking-wider uppercase text-[#141413] block mb-1">
                        6.1 Post-Contract Restrictive Non-Compete
                      </span>
                      <p>
                        "For twelve (12) months following termination, Contractor shall not solicit
                        or provide competing design, development, or consulting services to any
                        customer or vendor of Client."
                      </p>
                    </div>

                    <div
                      onClick={() => setSelectedHeroClauseId('liability')}
                      className={`p-3 rounded-md transition-all cursor-pointer border ${
                        selectedHeroClauseId === 'liability'
                          ? 'bg-[#F2F4F8] border-[#1E3A8A]/30 text-[#141413]'
                          : 'bg-white border-transparent hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="font-sans font-semibold text-xs tracking-wider uppercase text-[#141413] block mb-1">
                        7.2 Uncapped Contractor Liability & Indemnification
                      </span>
                      <p>
                        "Contractor agrees to indemnify, defend, and hold harmless the Client against
                        any and all claims, liabilities, losses, damages, costs, and expenses
                        (including reasonable attorney fees) without financial limitation."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Panel: LexiLens Inspection & Plain English Insight */}
                <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FBFBFA] space-y-6">
                  <div className="flex items-center justify-between text-xs text-[#6B6A66] hairline-b pb-3">
                    <span className="uppercase font-mono tracking-wider text-[11px]">
                      Clause Inspection
                    </span>
                    <span className="font-mono text-[11px] text-emerald-800">
                      {activeHeroClause.confidence}
                    </span>
                  </div>

                  {/* Active Clause Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-sans font-semibold text-base text-[#141413]">
                        {activeHeroClause.name}
                      </h3>
                      <span className="font-mono text-xs text-[#6B6A66]">
                        {activeHeroClause.section}
                      </span>
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded ${activeHeroClause.findingTone}`}
                    >
                      {activeHeroClause.findingType}
                    </span>
                  </div>

                  {/* Plain English Translation */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#6B6A66]">
                      Plain English Meaning
                    </span>
                    <p className="text-sm text-[#2C2C2A] leading-relaxed font-sans bg-white p-3.5 border border-[#E2E2DE] rounded-md">
                      {activeHeroClause.plainEnglish}
                    </p>
                  </div>

                  {/* Party Obligations & Scope */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#6B6A66]">
                      Affected Party
                    </span>
                    <div className="p-3 bg-white border border-[#E2E2DE] rounded-md text-xs text-[#4A4946] flex items-center justify-between">
                      <span className="font-medium text-[#141413]">
                        {activeHeroClause.affectedParty}
                      </span>
                      <span className="text-[#6B6A66]">Immediate legal effect upon signing</span>
                    </div>
                  </div>

                  {/* Clause Switcher Buttons */}
                  <div className="pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] block mb-2">
                      Inspect Other Key Clauses
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {HERO_CLAUSES.map((clause) => (
                        <button
                          key={clause.id}
                          onClick={() => setSelectedHeroClauseId(clause.id)}
                          className={`px-2.5 py-1.5 text-xs text-left rounded border transition-colors ${
                            selectedHeroClauseId === clause.id
                              ? 'bg-[#141413] text-white border-[#141413]'
                              : 'bg-white text-[#4A4946] border-[#E2E2DE] hover:border-[#141413]/30'
                          }`}
                        >
                          <span className="font-mono text-[10px] block opacity-70">
                            {clause.section}
                          </span>
                          <span className="truncate block font-medium">{clause.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deep Dive Action */}
                  <div className="pt-2 hairline-t">
                    <button
                      onClick={() => onNavigateTab('workspace')}
                      className="w-full py-2 text-xs font-semibold text-[#141413] bg-white border border-[#141413] hover:bg-[#141413] hover:text-white rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Open in Full Review Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL PROBLEM SECTION: Where Traps Lie Buried
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 hairline-t hairline-b bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Narrative Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
                The Problem
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141413] leading-snug">
                Legal documents are not difficult because they contain too much text.
              </h2>
              <p className="text-base text-[#4A4946] leading-relaxed">
                They are difficult because the important commitments, liabilities, and
                restrictions are often buried deep inside routine boilerplate phrasing.
              </p>
              <p className="text-sm text-[#6B6A66] leading-relaxed">
                A single sentence tucked into Section 14 can transfer your copyright, waive your
                right to late fees, or bind your personal assets without your conscious awareness.
              </p>
            </div>

            {/* Right Excerpt Column: Swiss Editorial Contract Breakdown */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#E2E2DE] rounded-xl space-y-5">
              <div className="flex items-center justify-between text-xs text-[#6B6A66] hairline-b pb-3 font-mono">
                <span>CONTRACT_EXCERPT_ANNOTATED</span>
                <span>Boilerplate vs Reality</span>
              </div>

              {/* Editorial annotated clauses */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-[#FAF9F6] border-l-2 border-amber-600 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#141413] font-mono">LIABILITY & INDEMNITY</span>
                    <span className="text-amber-800 text-[11px] font-medium">Asymmetric Risk</span>
                  </div>
                  <p className="text-xs text-[#4A4946] italic font-serif">
                    "...contractor shall defend, indemnify and hold harmless the company from any
                    loss without cap or limitation..."
                  </p>
                  <p className="text-xs text-[#141413] pt-1">
                    <strong>Reality:</strong> You bear unlimited liability. The client's liability
                    to you is capped at $1,000.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FAF9F6] border-l-2 border-slate-600 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#141413] font-mono">INTELLECTUAL PROPERTY</span>
                    <span className="text-slate-700 text-[11px] font-medium">Unconditional Transfer</span>
                  </div>
                  <p className="text-xs text-[#4A4946] italic font-serif">
                    "...all right, title, and interest in Work Product shall vest in Client
                    immediately upon development..."
                  </p>
                  <p className="text-xs text-[#141413] pt-1">
                    <strong>Reality:</strong> You lose ownership of your code even if the client
                    defaults on payment.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FAF9F6] border-l-2 border-rose-600 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#141413] font-mono">RESTRICTIVE COVENANTS</span>
                    <span className="text-rose-800 text-[11px] font-medium">Post-Exit Restraint</span>
                  </div>
                  <p className="text-xs text-[#4A4946] italic font-serif">
                    "...contractor shall not engage with any prospective client in the same sector
                    for twenty-four months..."
                  </p>
                  <p className="text-xs text-[#141413] pt-1">
                    <strong>Reality:</strong> A 2-year restraint preventing you from working in
                    your primary domain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FROM DOCUMENT TO UNDERSTANDING: The 3-Step Transformation
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
              Transformation Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
              From dense text to structured certainty.
            </h2>
            <p className="text-sm sm:text-base text-[#4A4946]">
              LexiLens decomposes sprawling legal language into isolated clauses, verifiable
              citations, and structured questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-7 border border-[#E2E2DE] rounded-xl space-y-4">
              <span className="font-mono text-xs text-[#6B6A66] block">01 / INGESTION</span>
              <h3 className="font-sans font-semibold text-lg text-[#141413]">
                Dense Agreement Text
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4946] leading-relaxed">
                Contracts arrive as multi-page PDFs, scans, or text documents with cross-references,
                obscure legalese, and nested provisos.
              </p>
              <div className="p-3 bg-[#F8F8F5] border border-[#E8E8E4] rounded font-serif text-xs text-[#6B6A66] italic leading-tight">
                "Notwithstanding anything to the contrary in Section 14.1, the indemnitor agrees to
                waive all defenses of subrogation..."
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-7 border border-[#E2E2DE] rounded-xl space-y-4">
              <span className="font-mono text-xs text-[#1E3A8A] block">02 / DECOMPOSITION</span>
              <h3 className="font-sans font-semibold text-lg text-[#141413]">
                LexiLens Structural Analysis
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4946] leading-relaxed">
                Clauses are extracted into key categories: Payment, Term, Termination, Liability,
                IP, and Restraints. Each is mapped to exact line numbers.
              </p>
              <div className="p-3 bg-[#F2F4F8] border border-[#C7D4EA] rounded font-sans text-xs text-[#1E3A8A] font-medium leading-tight">
                Mapped: 8 core clauses · 2 asymmetric liabilities · 1 post-contract non-compete.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-7 border border-[#E2E2DE] rounded-xl space-y-4">
              <span className="font-mono text-xs text-emerald-800 block">03 / CERTAINTY</span>
              <h3 className="font-sans font-semibold text-lg text-[#141413]">
                Actionable Understanding
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4946] leading-relaxed">
                Clear plain-English explanations, a Before You Sign scorecard, and a lawyer-ready
                briefing packet with specific questions.
              </p>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded font-sans text-xs text-emerald-900 font-medium leading-tight">
                Clear plain meaning · Exact source citation · Negotiation questions prepared.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. SIGNATURE INTERACTION: Interactive Legal X-Ray
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 hairline-t hairline-b bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
                Signature Tool
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
                Legal X-Ray
              </h2>
              <p className="text-sm text-[#4A4946]">
                Filter the document by clause layers. See the exact structure hidden beneath the
                prose.
              </p>
            </div>

            {/* Segmented Filter Control */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-[#E2E2DE] rounded-lg">
              {[
                { id: 'all', label: 'All Layers' },
                { id: 'payment', label: 'Payment' },
                { id: 'termination', label: 'Termination' },
                { id: 'liability', label: 'Liability' },
                { id: 'intellectual', label: 'IP' },
                { id: 'non-compete', label: 'Non-Compete' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedXRayCategory(tab.id)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    selectedXRayCategory === tab.id
                      ? 'bg-[#141413] text-white shadow-xs'
                      : 'text-[#6B6A66] hover:text-[#141413]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive X-Ray Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredXRayClauses.slice(0, 6).map((clause) => (
              <div
                key={clause.id}
                className="bg-white p-5 border border-[#E2E2DE] rounded-lg space-y-3 flex flex-col justify-between hover:border-[#141413]/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6B6A66] font-mono">
                    <span className="uppercase">{clause.category}</span>
                    <span>{clause.docReference}</span>
                  </div>
                  <h4 className="font-sans font-semibold text-sm text-[#141413]">
                    {clause.title}
                  </h4>
                  <p className="text-xs text-[#4A4946] leading-relaxed">
                    {clause.plainEnglish}
                  </p>
                </div>

                <div className="pt-3 hairline-t space-y-2">
                  <div className="p-2 bg-[#F8F8F5] rounded text-[11px] font-serif text-[#6B6A66] italic leading-tight">
                    "{clause.quote}"
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B6A66]">
                    <span>Affects: {clause.whoItAffects}</span>
                    <span className="font-mono text-emerald-800">{clause.confidence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigateTab('workspace')}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#1E3A8A] hover:underline"
            >
              <span>Explore all {xRayClauses.length} extracted clauses in Review Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CONTRACT DIFF: Split-Screen Comparison Showcase
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
                Contract Diff
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
                Understand what changed between drafts.
              </h2>
              <p className="text-sm text-[#4A4946]">
                Side-by-side clause comparison revealing exactly what was added, removed, or
                modified between versions.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('compare')}
              className="px-4 py-2 text-xs font-medium text-[#141413] border border-[#E2E2DE] hover:border-[#141413]/30 rounded-md transition-colors self-start md:self-auto cursor-pointer flex items-center gap-1.5"
            >
              <span>Full Comparison Tool</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Diff Switcher */}
          <div className="flex gap-2 border-b border-[#E2E2DE] pb-2">
            {DIFF_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedDiffId(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  selectedDiffId === item.id
                    ? 'bg-[#141413] text-white'
                    : 'text-[#6B6A66] hover:text-[#141413] hover:bg-white'
                }`}
              >
                <span>{item.category}</span>
                <span className="font-mono text-[10px] ml-1.5 opacity-70">
                  ({item.clauseRef})
                </span>
              </button>
            ))}
          </div>

          {/* Split-Screen Diff View */}
          <div className="bg-white border border-[#E2E2DE] rounded-xl overflow-hidden">
            <div className="p-4 bg-[#F8F8F5] hairline-b flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#141413] font-sans">
                  {activeDiff.category}
                </span>
                <span className="text-[#6B6A66]">·</span>
                <span className="font-mono text-[#6B6A66]">{activeDiff.clauseRef}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-900 border border-blue-200">
                {activeDiff.changeType}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E2DE]">
              {/* Draft A */}
              <div className="p-6 space-y-3">
                <span className="text-xs font-mono uppercase text-[#6B6A66] block">
                  Version A · Original Baseline
                </span>
                <div className="p-3.5 rounded bg-rose-50/50 border border-rose-100 font-serif text-sm text-[#4A4946] leading-relaxed">
                  "{activeDiff.before}"
                </div>
              </div>

              {/* Draft B */}
              <div className="p-6 space-y-3">
                <span className="text-xs font-mono uppercase text-emerald-800 block">
                  Version B · Negotiated Draft
                </span>
                <div className="p-3.5 rounded bg-emerald-50/50 border border-emerald-100 font-serif text-sm text-[#141413] leading-relaxed">
                  "{activeDiff.after}"
                </div>
              </div>
            </div>

            {/* Plain Meaning Explanation */}
            <div className="p-5 bg-[#FAF9F6] hairline-t space-y-1">
              <span className="text-xs font-mono uppercase text-[#6B6A66]">
                Plain English Impact
              </span>
              <p className="text-xs sm:text-sm text-[#2C2C2A] font-medium leading-relaxed">
                {activeDiff.plainMeaning}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. ASK LEXI SHOWCASE: Verifiable Grounded Q&A
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 hairline-t hairline-b bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
              Document Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
              Ask Lexi. Grounded strictly in text.
            </h2>
            <p className="text-sm text-[#4A4946]">
              Ask questions directly against your agreement. Every answer cites exact clauses. If
              something is not in the contract, LexiLens tells you explicitly.
            </p>
          </div>

          <div className="bg-white border border-[#E2E2DE] rounded-xl p-6 sm:p-8 space-y-6 max-w-3xl">
            {/* User Query */}
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs px-2 py-1 bg-[#141413] text-white rounded shrink-0">
                YOU
              </span>
              <p className="text-sm font-semibold text-[#141413] pt-0.5">
                "What happens if I terminate this agreement early?"
              </p>
            </div>

            {/* LexiLens Response */}
            <div className="flex items-start gap-3 pl-4 border-l-2 border-[#1E3A8A] space-y-3">
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between text-xs text-[#6B6A66]">
                  <span className="font-mono text-[11px] font-semibold text-[#1E3A8A]">
                    LEXILENS ANSWER
                  </span>
                  <span className="font-mono text-[11px] text-emerald-800">
                    Confidence: High · Verifiable
                  </span>
                </div>

                <p className="text-sm text-[#2C2C2A] leading-relaxed">
                  Either party may terminate for convenience with <strong>30 days prior written notice</strong>.
                  If you terminate for convenience, you must deliver all work-in-progress and you
                  are entitled to payment for accepted deliverables through the termination date.
                  No early cancellation penalty applies.
                </p>

                {/* Evidence Citation */}
                <div className="p-3 bg-[#F8F8F5] border border-[#E8E8E4] rounded-md text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#6B6A66] font-mono text-[11px]">
                    <span>SOURCE VERIFICATION</span>
                    <span>Page 4 · Section 3.2</span>
                  </div>
                  <p className="font-serif italic text-[#4A4946]">
                    "Either party may terminate this Agreement without cause upon providing thirty
                    (30) calendar days prior written notice..."
                  </p>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onNavigateTab('ask')}
                className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
              >
                <span>Open interactive Q&A console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. BEFORE YOU SIGN: Practical Checklist Experience
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
                Pre-Execution Verification
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
                Before You Sign Scorecard
              </h2>
              <p className="text-sm text-[#4A4946]">
                Turn important clauses into an interactive review checklist before signing.
              </p>
            </div>

            {/* Progress counter: clean unboxed text */}
            <div className="text-xs font-mono text-[#6B6A66]">
              Status: <span className="font-bold text-[#141413]">{checkedCount} of {checklistItems.length}</span> items reviewed
            </div>
          </div>

          <div className="bg-white border border-[#E2E2DE] rounded-xl divide-y divide-[#E2E2DE]">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className="p-4 sm:p-5 flex items-start gap-4 hover:bg-[#FAF9F6] transition-colors cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    item.checked
                      ? 'bg-[#141413] border-[#141413] text-white'
                      : 'border-[#C4C4BE] bg-white'
                  }`}
                  aria-hidden="true"
                >
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        item.checked ? 'text-[#141413]' : 'text-[#2C2C2A]'
                      }`}
                    >
                      {item.topic}
                    </span>
                    <span className="font-mono text-xs text-[#6B6A66]">{item.section}</span>
                  </div>
                  <p className="text-xs text-[#4A4946]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-[#6B6A66] pt-2">
            <span>Click any item to toggle reviewed status</span>
            <button
              onClick={() => onNavigateTab('checklist')}
              className="text-[#1E3A8A] font-medium hover:underline flex items-center gap-1"
            >
              <span>Manage synchronized action tasks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TRUST & SAFETY: Calm, Grounded Security
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 hairline-t hairline-b bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
              Engineering Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
              Trust, Privacy & Grounds
            </h2>
            <p className="text-sm text-[#4A4946]">
              Designed with strict verification bounds, ephemeral memory, and zero hallucinated
              citations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 border border-[#E2E2DE] rounded-lg space-y-2">
              <span className="font-mono text-xs text-[#1E3A8A] block">01 / CITATIONS</span>
              <h4 className="font-sans font-semibold text-sm text-[#141413]">
                Grounded in Document
              </h4>
              <p className="text-xs text-[#4A4946] leading-relaxed">
                Every summary, finding, and answer is directly anchored to verbatim text. No
                invented clauses or imaginary precedents.
              </p>
            </div>

            <div className="bg-white p-5 border border-[#E2E2DE] rounded-lg space-y-2">
              <span className="font-mono text-xs text-[#1E3A8A] block">02 / PROTECTION</span>
              <h4 className="font-sans font-semibold text-sm text-[#141413]">
                Prompt-Injection Defense
              </h4>
              <p className="text-xs text-[#4A4946] leading-relaxed">
                Untrusted document content is strictly demarcated in isolated boundaries. Malicious
                overrides are detected and neutralized.
              </p>
            </div>

            <div className="bg-white p-5 border border-[#E2E2DE] rounded-lg space-y-2">
              <span className="font-mono text-xs text-[#1E3A8A] block">03 / CONFIDENTIALITY</span>
              <h4 className="font-sans font-semibold text-sm text-[#141413]">
                Ephemeral Processing
              </h4>
              <p className="text-xs text-[#4A4946] leading-relaxed">
                Uploaded contracts reside in ephemeral browser memory. Document text is never logged
                or used to train public machine-learning models.
              </p>
            </div>

            <div className="bg-white p-5 border border-[#E2E2DE] rounded-lg space-y-2">
              <span className="font-mono text-xs text-[#1E3A8A] block">04 / BOUNDS</span>
              <h4 className="font-sans font-semibold text-sm text-[#141413]">
                Uncertainty Handling
              </h4>
              <p className="text-xs text-[#4A4946] leading-relaxed">
                If a topic is absent or ambiguous, LexiLens states so plainly instead of speculating
                or filling gaps with assumptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. RESPONSIBLE LEGAL ASSISTANCE: Clear Ethical Boundaries
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E2E2DE] rounded-xl p-8 sm:p-10 space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6A66]">
                Product Boundaries
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
                Responsible Legal Assistance
              </h2>
              <p className="text-sm text-[#4A4946]">
                LexiLens is built to inform and inspect. It prepares you for conversations with
                qualified counsel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 hairline-t pt-8">
              {/* What LexiLens Does */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                  What LexiLens Does
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#2C2C2A]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <strong>UNDERSTAND:</strong> Translates dense legal jargon into plain language.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <strong>INSPECT:</strong> Detects one-sided provisions, missing terms, and caps.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <strong>COMPARE:</strong> Highlights what changed between contract versions.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <strong>PREPARE:</strong> Organizes targeted questions for your lawyer.
                  </li>
                </ul>
              </div>

              {/* What LexiLens Does Not Do */}
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] font-semibold block">
                  What LexiLens Does Not Do
                </span>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#6B6A66]">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                    <strong>REPRESENT:</strong> It does not act as legal counsel in disputes.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                    <strong>DECIDE:</strong> It does not make binding business or signing decisions.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                    <strong>REPLACE:</strong> It does not replace independent legal advice.
                  </li>
                </ul>
              </div>
            </div>

            {/* Mandatory Legal Statement */}
            <div className="p-4 bg-[#FAF9F6] border border-[#E8E8E4] rounded-lg text-xs text-[#4A4946]">
              <strong className="text-[#141413] font-semibold">Important Statement:</strong>{' '}
              LexiLens provides legal information and document-analysis assistance, not legal
              advice. Always consult a qualified legal professional before executing binding
              agreements.
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. RECENT DOCUMENTS & DEMO LAUNCHER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-sans font-semibold text-lg text-[#141413]">
                Available Agreements
              </h3>
              <p className="text-xs text-[#6B6A66]">
                Loaded contracts ready for inspection, comparison, or grounded query.
              </p>
            </div>

            <button
              onClick={onOpenUpload}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#141413] hover:bg-[#2C2C2A] rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const isActive = doc.id === activeDocument.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className={`p-5 rounded-lg border transition-all cursor-pointer bg-white space-y-3 ${
                    isActive
                      ? 'border-[#141413] shadow-xs'
                      : 'border-[#E2E2DE] hover:border-[#141413]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#6B6A66] uppercase">
                      {doc.documentType}
                    </span>
                    {isActive ? (
                      <span className="font-mono text-[11px] text-emerald-800 font-medium">
                        Active in Workspace
                      </span>
                    ) : (
                      <span className="text-xs text-[#6B6A66]">Click to activate</span>
                    )}
                  </div>

                  <h4 className="font-sans font-semibold text-base text-[#141413]">
                    {doc.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-[#6B6A66] font-mono">
                    <span>{doc.wordCount} words</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.uploadedAt}</span>
                  </div>

                  <div className="pt-2 hairline-t flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDocument(doc);
                        onNavigateTab('workspace');
                      }}
                      className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateTab('compare');
                      }}
                      className="text-xs text-[#6B6A66] hover:text-[#141413]"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
