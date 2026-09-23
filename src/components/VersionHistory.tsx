import React, { useState } from 'react';
import {
  History,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Clock,
  GitCommit,
  Copy,
  Check,
  Eye,
  X,
  Scale,
} from 'lucide-react';
import { DocumentVersion, LegalDocument } from '../types';

interface VersionHistoryProps {
  document: LegalDocument;
  versions: DocumentVersion[];
  currentVersionId: string;
  onRestoreVersion: (version: DocumentVersion) => void;
  onApplyAISuggestion: (
    title: string,
    clauseRef: string,
    oldTextSnippet: string,
    newTextSnippet: string,
    description: string
  ) => void;
  onCreateManualEdit: (
    title: string,
    newFullText: string,
    description: string,
    sourceClause?: string
  ) => void;
  onHighlightClauseInViewer?: (text: string, sectionRef: string) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  document,
  versions,
  currentVersionId,
  onRestoreVersion,
  onApplyAISuggestion,
  onCreateManualEdit,
  onHighlightClauseInViewer,
}) => {
  const [selectedVersionForDiff, setSelectedVersionForDiff] = useState<DocumentVersion | null>(null);
  const [isManualEditOpen, setIsManualEditOpen] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualClauseRef, setManualClauseRef] = useState('');
  const [manualEditedText, setManualEditedText] = useState(document.rawText);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pre-configured balanced modifications tailored to the active contract
  const balancedClauseRevisions = [
    {
      id: 'sug-liability',
      title: 'Cap Contractor Liability to Total Project Fees (₹50,000)',
      targetClause: 'Section 7.2',
      category: 'Liability Exposure',
      rationale:
        'Replaces unilateral uncapped contractor liability with a standard commercial liability cap equal to fees paid under the agreement.',
      oldSnippet:
        "Contractor's liability under this Agreement shall be unlimited.",
      newSnippet:
        "7.2 Mutual Limitation of Liability: Notwithstanding anything to the contrary, Contractor's aggregate cumulative liability arising out of or related to this Agreement shall be strictly capped at the total fees actually received by Contractor hereunder (₹50,000). Neither party shall be liable for indirect or consequential damages.",
    },
    {
      id: 'sug-ip-contingent',
      title: 'Make IP Transfer Contingent Upon Full Payment',
      targetClause: 'Section 4.1',
      category: 'Intellectual Property',
      rationale:
        'Prevents client from acquiring full IP ownership before paying final invoice. Transfer takes effect only upon receipt of full cleared funds.',
      oldSnippet:
        'irrespective of whether final invoice settlement has occurred',
      newSnippet:
        '4.1 Ownership Transfer: Subject to and conditioned upon Contractor’s receipt of full and final cleared payment of all fees due hereunder, Contractor unconditionally assigns all right, title, and interest in deliverables to Client.',
    },
    {
      id: 'sug-non-compete',
      title: 'Delete 12-Month Post-Termination Non-Compete (Sec. 27 Indian Contract Act)',
      targetClause: 'Section 6.1',
      category: 'Restrictive Covenant',
      rationale:
        'Removes post-contract restraint of trade which causes disputes and may be void under Section 27 of the Indian Contract Act, 1872.',
      oldSnippet:
        'Contractor shall not directly or indirectly provide software engineering services to any competitor of Client within the territory of Karnataka for twelve (12) months following termination.',
      newSnippet:
        '6.1 [Stricken]: Restrictive non-compete provisions are deleted in their entirety. Contractor remains bound only by standard confidentiality obligations under Section 5 regarding proprietary trade secrets.',
    },
    {
      id: 'sug-late-payment',
      title: 'Replace 90-Day Late Holiday with 1.5% Monthly Interest',
      targetClause: 'Section 2.3',
      category: 'Payment Terms',
      rationale:
        'Removes 90-day late penalty waiver and institutes standard commercial late fee interest of 1.5% per month past Net-30.',
      oldSnippet:
        'shall not be subject to statutory interest penalties unless delayed beyond ninety (90) days',
      newSnippet:
        '2.3 Late Payment Interest: Any undisputed invoice balance delinquent past thirty (30) days shall accrue interest at 1.5% per month until settled in full.',
    },
  ];

  const handleCopyText = (ver: DocumentVersion) => {
    navigator.clipboard.writeText(ver.text);
    setCopiedId(ver.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenManualModal = () => {
    setManualEditedText(document.rawText);
    setManualTitle('');
    setManualDesc('');
    setManualClauseRef('');
    setIsManualEditOpen(true);
  };

  const handleCommitManualEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualEditedText.trim()) return;

    onCreateManualEdit(
      manualTitle.trim(),
      manualEditedText,
      manualDesc.trim() || 'Manual modification committed by user.',
      manualClauseRef.trim() || undefined
    );
    setIsManualEditOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-lg bg-white border border-[#E2E2DE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#141413]">
                Document Version History
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F8F8F5] text-[#6B6A66] border border-[#E2E2DE]">
                {versions.length} {versions.length === 1 ? 'Version' : 'Versions'}
              </span>
            </div>
            <p className="text-xs text-[#6B6A66] mt-0.5">
              Review audit history, test balanced clause amendments, or restore previous drafts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenManualModal}
            className="px-3.5 py-2 rounded bg-[#141413] hover:bg-[#2C2C2A] text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Create Manual Revision</span>
          </button>
        </div>
      </div>

      {/* Balanced Clause Revisions Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#1E3A8A]" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] font-semibold">
              Balanced Clause Revisions (Ready to Apply)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-[#6B6A66]">
            Creates a new version in your session history
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {balancedClauseRevisions.map((sug) => {
            const alreadyApplied = document.rawText.includes(sug.newSnippet.substring(0, 40));

            return (
              <div
                key={sug.id}
                className={`p-4 rounded-lg border transition-colors flex flex-col justify-between gap-3 shadow-xs ${
                  alreadyApplied
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-[#E2E2DE] hover:border-[#141413]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F8F5] text-[#6B6A66] border border-[#E2E2DE]">
                      {sug.targetClause} • {sug.category}
                    </span>
                    {alreadyApplied && (
                      <span className="text-[11px] font-mono font-medium text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Applied
                      </span>
                    )}
                  </div>

                  <h5 className="text-xs font-semibold text-[#141413] leading-snug">
                    {sug.title}
                  </h5>

                  <p className="text-xs text-[#4A4946] leading-relaxed">
                    {sug.rationale}
                  </p>

                  {/* Snippet comparison preview */}
                  <div className="mt-2 space-y-1.5 text-xs">
                    <div className="p-2.5 rounded bg-rose-50/60 border border-rose-200 text-[#141413]">
                      <span className="font-mono text-[10px] text-rose-800 uppercase block mb-0.5">Original Wording</span>
                      <p className="italic font-serif text-[11px]">"{sug.oldSnippet}"</p>
                    </div>
                    <div className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200 text-[#141413]">
                      <span className="font-mono text-[10px] text-emerald-800 uppercase block mb-0.5">Balanced Counter-Proposal</span>
                      <p className="italic font-serif text-[11px]">"{sug.newSnippet}"</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 hairline-t flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (onHighlightClauseInViewer) {
                        onHighlightClauseInViewer(sug.oldSnippet, sug.targetClause);
                      }
                    }}
                    className="text-xs text-[#6B6A66] hover:text-[#141413] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Find in Document</span>
                  </button>

                  <button
                    onClick={() =>
                      onApplyAISuggestion(
                        sug.title,
                        sug.targetClause,
                        sug.oldSnippet,
                        sug.newSnippet,
                        sug.rationale
                      )
                    }
                    disabled={alreadyApplied}
                    className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      alreadyApplied
                        ? 'bg-[#F2F2EE] text-[#A3A29E] cursor-not-allowed border border-[#E2E2DE]'
                        : 'bg-[#141413] hover:bg-[#2C2C2A] text-white'
                    }`}
                  >
                    <span>{alreadyApplied ? 'Applied' : 'Apply Revision'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Version Timeline List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-[#141413]" />
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#6B6A66] font-semibold">
              Revision Log ({versions.length})
            </h4>
          </div>
          <span className="text-[11px] font-mono text-[#6B6A66]">
            Session history
          </span>
        </div>

        <div className="space-y-3">
          {versions.map((ver) => {
            const isCurrent = ver.id === currentVersionId;

            return (
              <div
                key={ver.id}
                className={`p-4 rounded-lg border transition-colors shadow-xs ${
                  isCurrent
                    ? 'bg-white border-2 border-[#141413]'
                    : 'bg-white border-[#E2E2DE] hover:border-[#141413]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-semibold bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE]">
                      {ver.versionNumber}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 ${
                        ver.author === 'Original Baseline'
                          ? 'bg-[#F8F8F5] text-[#6B6A66] border-[#E2E2DE]'
                          : ver.author === 'Proposed Revision' || ver.author === 'AI Suggestion'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-[#F8F8F5] text-[#141413] border-[#E2E2DE]'
                      }`}
                    >
                      {ver.author === 'Manual Edit' && <Edit3 className="w-3 h-3 text-[#6B6A66]" />}
                      {ver.author === 'AI Suggestion' ? 'Proposed Revision' : ver.author}
                    </span>

                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        ACTIVE
                      </span>
                    )}

                    <h4 className="text-xs font-semibold text-[#141413]">{ver.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6B6A66]">
                    <Clock className="w-3 h-3 text-[#A3A29E]" />
                    <span>{ver.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-[#4A4946] leading-relaxed mb-2">
                  {ver.description}
                </p>

                {ver.sourceClause && (
                  <div className="text-[11px] font-mono text-[#6B6A66] mb-2.5">
                    Targeted Clause: <span className="font-semibold text-[#141413]">{ver.sourceClause}</span>
                  </div>
                )}

                {/* Diff summary line if available */}
                {ver.diffSummary && (
                  <div className="p-2.5 rounded bg-[#F8F8F5] border border-[#E8E8E4] text-xs text-[#4A4946] mb-3">
                    <span className="font-mono text-[#141413] font-semibold mr-2">Change:</span>
                    {ver.diffSummary}
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="pt-2.5 hairline-t flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVersionForDiff(ver)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect Full Text</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(ver)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-[#F8F8F5] text-[#6B6A66] hover:text-[#141413] border border-[#E2E2DE] text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy document text at this revision"
                    >
                      {copiedId === ver.id ? (
                        <Check className="w-3 h-3 text-emerald-800" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#A3A29E]" />
                      )}
                      <span>{copiedId === ver.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => onRestoreVersion(ver)}
                      className="px-3 py-1 rounded bg-white hover:bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore This Version</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Text Modal */}
      {selectedVersionForDiff && (
        <div className="fixed inset-0 z-50 bg-[#141413]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E2DE] rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="p-4 bg-[#F8F8F5] hairline-b flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div>
                  <h4 className="font-semibold text-xs text-[#141413]">
                    {selectedVersionForDiff.versionNumber}: {selectedVersionForDiff.title}
                  </h4>
                  <p className="text-[11px] font-mono text-[#6B6A66]">
                    Created by {selectedVersionForDiff.author === 'AI Suggestion' ? 'Proposed Revision' : selectedVersionForDiff.author} on {selectedVersionForDiff.timestamp}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVersionForDiff(null)}
                className="p-1 rounded text-[#6B6A66] hover:text-[#141413] hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-serif text-xs text-[#2C2C2A] whitespace-pre-wrap leading-relaxed bg-white">
              {selectedVersionForDiff.text}
            </div>

            <div className="p-3 bg-[#F8F8F5] hairline-t flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-[#6B6A66]">
                {selectedVersionForDiff.text.split(/\s+/).length} Words Total
              </span>
              <div className="flex items-center gap-2">
                {selectedVersionForDiff.id !== currentVersionId && (
                  <button
                    onClick={() => {
                      onRestoreVersion(selectedVersionForDiff);
                      setSelectedVersionForDiff(null);
                    }}
                    className="px-3 py-1.5 rounded bg-[#141413] text-white font-medium text-xs flex items-center gap-1 cursor-pointer hover:bg-[#2C2C2A]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore This Version</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedVersionForDiff(null)}
                  className="px-3 py-1.5 rounded bg-white border border-[#E2E2DE] text-[#141413] font-medium text-xs cursor-pointer hover:bg-[#F8F8F5]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Edit Modal */}
      {isManualEditOpen && (
        <div className="fixed inset-0 z-50 bg-[#141413]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E2DE] rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="p-4 bg-[#F8F8F5] hairline-b flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-semibold text-xs text-[#141413]">
                  Create Manual Document Revision
                </h4>
                <p className="text-[11px] font-mono text-[#6B6A66]">
                  Modify clauses and commit a new version to the session history.
                </p>
              </div>

              <button
                onClick={() => setIsManualEditOpen(false)}
                className="p-1 rounded text-[#6B6A66] hover:text-[#141413] hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCommitManualEdit} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#141413] block mb-1">
                    Revision Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amended payment terms to Net-15"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#141413] block mb-1">
                    Clause Reference (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Section 2.2, Section 7"
                    value={manualClauseRef}
                    onChange={(e) => setManualClauseRef(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#141413] block mb-1">
                  Reason for Revision / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Counter-proposal negotiated with client on call"
                  value={manualDesc}
                  onChange={(e) => setManualDesc(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[#141413] block mb-1">
                  Document Text
                </label>
                <textarea
                  required
                  rows={12}
                  value={manualEditedText}
                  onChange={(e) => setManualEditedText(e.target.value)}
                  className="w-full p-3 bg-white border border-[#E2E2DE] rounded font-serif text-xs text-[#2C2C2A] focus:outline-none focus:border-[#141413] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualEditOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-white hover:bg-[#F8F8F5] border border-[#E2E2DE] text-[#4A4946] text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#141413] hover:bg-[#2C2C2A] text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <GitCommit className="w-3.5 h-3.5" />
                  <span>Save Revision</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
