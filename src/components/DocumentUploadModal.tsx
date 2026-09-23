import React, { useState } from 'react';
import {
  Upload,
  FileText,
  X,
  FileUp,
  ClipboardPaste,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CONTRACT_V1_TEXT, CONTRACT_V2_TEXT } from '../data/sampleContracts';
import { Jurisdiction } from '../types';
import { validateDocumentFile, sanitizeFileName, sanitizeDocumentText } from '../utils/security';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (text: string, title: string, type: string, jurisdiction: Jurisdiction) => Promise<void>;
  currentJurisdiction: Jurisdiction;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  currentJurisdiction,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file' | 'sample'>('paste');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Service Agreement');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>(currentJurisdiction);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    setUploadError(null);
    const validation = validateDocumentFile(file.name, file.size, file.type);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file.');
      return;
    }

    const safeName = validation.sanitizedFileName || sanitizeFileName(file.name);
    setFileName(safeName);
    setTitle(safeName.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onerror = () => {
      setUploadError('Failed to read file contents. Please verify file is not corrupted.');
    };
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const cleanContent = sanitizeDocumentText(content);
      if (!cleanContent || cleanContent.trim().length === 0) {
        setUploadError('The uploaded file appears to be empty or contains no readable text.');
        return;
      }
      setText(cleanContent);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleSelectSample = (sampleKey: 'v1' | 'v2' | 'nda' | 'lease') => {
    if (sampleKey === 'v1') {
      setTitle('Master Services Agreement (v1.0 Baseline)');
      setText(CONTRACT_V1_TEXT);
      setDocType('Master Services Agreement');
    } else if (sampleKey === 'v2') {
      setTitle('Master Services Agreement (v2.0 Revised Draft)');
      setText(CONTRACT_V2_TEXT);
      setDocType('Master Services Agreement');
    } else if (sampleKey === 'nda') {
      setTitle('Standard Bilateral Non-Disclosure Agreement');
      setText(`MUTUAL NON-DISCLOSURE AGREEMENT
1. Confidential Information: All proprietary technical, financial, and product materials disclosed by either party.
2. Standard of Care: Receiving party shall exercise reasonable care, not less than degree of care used to protect own confidential information.
3. Term: 3 years from date of disclosure.
4. Exclusions: Publicly known, already in possession without breach, independently developed.
5. Governing Law: State of California.`);
      setDocType('Non-Disclosure Agreement');
    } else {
      setTitle('Commercial Office Lease Agreement');
      setText(`COMMERCIAL REAL ESTATE LEASE AGREEMENT
1. Premises: Suite 400, Commercial Tower, MG Road, Bengaluru.
2. Base Rent: ₹1,50,000 per month payable on 1st of each calendar month.
3. Security Deposit: ₹9,00,000 refundable within 30 days after lease expiry.
4. Maintenance & Utilities: Lessee responsible for common area maintenance (₹15,000/mo).
5. Lock-in Period: 24 months with no early termination permitted during lock-in.`);
      setDocType('Commercial Lease');
    }
    setActiveTab('paste');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      await onAnalyze(
        text,
        title.trim() || 'Uploaded Legal Document',
        docType,
        jurisdiction
      );
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#141413]/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="bg-white border border-[#E2E2DE] rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-[#F8F8F5] hairline-b flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif text-lg text-[#141413]">
              Analyze a Document
            </h3>
            <p className="text-xs text-[#6B6A66] mt-0.5">
              Inspect clauses, identify obligations, and review fine print before signing.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded text-[#6B6A66] hover:text-[#141413] hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Mode Selector */}
        <div className="flex items-center p-1 bg-[#F2F2EE] hairline-b gap-1 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#6B6A66] hover:text-[#141413]'
            }`}
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'file'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#6B6A66] hover:text-[#141413]'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <button
            onClick={() => setActiveTab('sample')}
            className={`flex-1 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-white text-[#141413] shadow-xs'
                : 'text-[#6B6A66] hover:text-[#141413]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sample Contracts</span>
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'sample' && (
            <div className="space-y-2.5">
              <span className="text-xs text-[#6B6A66] block font-mono">
                Choose a pre-formatted sample agreement to test immediately:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectSample('v1')}
                  className="p-3 rounded border border-[#E2E2DE] hover:border-[#141413] bg-white hover:bg-[#F8F8F5] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-xs text-[#141413] block">
                    Master Services Agreement (v1.0)
                  </span>
                  <span className="text-[11px] text-[#6B6A66] mt-0.5 block">
                    Baseline consulting contract with 8 clauses
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSample('v2')}
                  className="p-3 rounded border border-[#E2E2DE] hover:border-[#141413] bg-white hover:bg-[#F8F8F5] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-xs text-[#141413] block">
                    Revised Proposal (v2.0 Draft)
                  </span>
                  <span className="text-[11px] text-[#6B6A66] mt-0.5 block">
                    Counter-offer with altered terms
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSample('nda')}
                  className="p-3 rounded border border-[#E2E2DE] hover:border-[#141413] bg-white hover:bg-[#F8F8F5] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-xs text-[#141413] block">
                    Mutual NDA
                  </span>
                  <span className="text-[11px] text-[#6B6A66] mt-0.5 block">
                    Standard bilateral confidentiality agreement
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSample('lease')}
                  className="p-3 rounded border border-[#E2E2DE] hover:border-[#141413] bg-white hover:bg-[#F8F8F5] text-left transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-xs text-[#141413] block">
                    Commercial Lease
                  </span>
                  <span className="text-[11px] text-[#6B6A66] mt-0.5 block">
                    Office tenancy with lock-in period
                  </span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'file' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`p-6 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer ${
                dragOver
                  ? 'border-[#141413] bg-[#F8F8F5]'
                  : 'border-[#E2E2DE] hover:border-[#C4C4BE] bg-white'
              }`}
            >
              <input
                type="file"
                id="file-upload-input"
                onChange={handleFileUpload}
                accept=".txt,.md,.doc,.docx"
                className="hidden"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block space-y-2">
                <FileUp className="w-6 h-6 text-[#6B6A66] mx-auto" />
                <span className="font-medium text-xs text-[#141413] block">
                  Click to choose a file or drag and drop here
                </span>
                <span className="text-[11px] text-[#6B6A66] block">
                  Accepts plain text, markdown, and Word documents (up to 5MB)
                </span>
              </label>
              {fileName && (
                <div className="mt-3 inline-block px-3 py-1 rounded bg-[#F8F8F5] border border-[#E2E2DE] text-xs font-mono text-[#141413]">
                  Selected: {fileName}
                </div>
              )}
            </div>
          )}

          {uploadError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {uploadError}
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#141413] block mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Services Agreement"
                className="w-full px-3 py-1.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#141413] block mb-1">
                Contract Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
              >
                <option value="Consulting & Services Agreement">Consulting & Services Agreement</option>
                <option value="Non-Disclosure Agreement (NDA)">Non-Disclosure Agreement (NDA)</option>
                <option value="Employment Agreement">Employment Agreement</option>
                <option value="Software License / SaaS Agreement">Software License / SaaS Agreement</option>
                <option value="Real Estate / Lease Agreement">Real Estate / Lease Agreement</option>
                <option value="Vendor / Supply Agreement">Vendor / Supply Agreement</option>
                <option value="Other Legal Contract">Other Legal Contract</option>
              </select>
            </div>
          </div>

          {/* Jurisdiction Selector */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141413] block mb-1">
              Legal Framework Reference
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
              className="w-full px-3 py-1.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
            >
              <option value="doc_only">Document-Only Analysis (Neutral text-grounded reading)</option>
              <option value="india">India (Indian Contract Act 1872 & Arbitration Act 1996)</option>
              <option value="us">United States (UCC & Common Law principles)</option>
              <option value="uk">United Kingdom (English Common Law & Consumer Rights Act)</option>
              <option value="general">General Common Law Principles</option>
            </select>
          </div>

          {/* Raw Contract Text Field */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#141413] block mb-1">
              Contract Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the full text of the agreement here..."
              rows={8}
              className="w-full p-3 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] font-serif focus:outline-none focus:border-[#141413] leading-relaxed"
            />
          </div>

          {/* Safety & Grounding Assurance */}
          <div className="p-3 rounded bg-[#F8F8F5] border border-[#E2E2DE] text-xs text-[#4A4946] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              LexiLens reviews this document for clauses, obligations, and potential risks. All findings are strictly grounded in verbatim text.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!text.trim() || isProcessing}
              className="w-full py-2.5 rounded bg-[#141413] hover:bg-[#2C2C2A] disabled:opacity-40 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Inspecting clauses and commitments...</span>
                </>
              ) : (
                <>
                  <span>Begin Document Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
