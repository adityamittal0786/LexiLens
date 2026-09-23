import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ActiveTab,
  LegalDocument,
  DocumentAnalysis,
  Jurisdiction,
  ActionChecklistItem,
  DocumentVersion,
} from './types';
import {
  INITIAL_DEMO_DOCUMENTS,
  SAMPLE_V1_ANALYSIS,
  CONTRACT_V1_TEXT,
  CONTRACT_V2_TEXT,
} from './data/sampleContracts';
import { analyzeDocumentAPI } from './services/api';
import { realtimeSync } from './services/realtimeSync';
import { LegalSafetyBanner } from './components/LegalSafetyBanner';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { AnalysisWorkspace } from './components/AnalysisWorkspace';
import { ComparisonWorkspace } from './components/ComparisonWorkspace';
import { AskLexiChat } from './components/AskLexiChat';
import { ActionCenter } from './components/ActionCenter';
import { LawyerBriefModal } from './components/LawyerBriefModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';

export default function App() {
  const [documents, setDocuments] = useState<LegalDocument[]>(INITIAL_DEMO_DOCUMENTS);
  const [activeDocId, setActiveDocId] = useState<string>(INITIAL_DEMO_DOCUMENTS[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('doc_only');
  const [analysis, setAnalysis] = useState<DocumentAnalysis>(SAMPLE_V1_ANALYSIS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time synchronization subscription for document revisions across tabs
  useEffect(() => {
    return realtimeSync.subscribe((event) => {
      if (event.type === 'VERSION_CREATED' && event.payload) {
        const { documentId, version, updatedText } = event.payload;
        setDocuments((prevDocs) =>
          prevDocs.map((doc) => {
            if (doc.id === documentId) {
              const existingVersions = doc.versions || [];
              const versionExists = existingVersions.some((v) => v.id === version.id);
              return {
                ...doc,
                rawText: updatedText || doc.rawText,
                versions: versionExists ? existingVersions : [version, ...existingVersions],
              };
            }
            return doc;
          })
        );
        showToast(`Real-time sync: Revision ${version.versionNumber} applied`);
      }
    });
  }, []);

  // Switch active document and analyze
  const handleSelectDocument = async (doc: LegalDocument) => {
    setActiveDocId(doc.id);
    setIsAnalyzing(true);
    try {
      const result = await analyzeDocumentAPI(
        doc.rawText,
        doc.title,
        doc.documentType,
        jurisdiction
      );
      setAnalysis(result);
      showToast(`Analyzed ${doc.title}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upload or paste new document
  const handleUploadAndAnalyze = async (
    text: string,
    title: string,
    type: string,
    jur: Jurisdiction
  ) => {
    setIsAnalyzing(true);
    try {
      const newDoc: LegalDocument = {
        id: 'doc-' + Date.now(),
        title,
        documentType: type,
        rawText: text,
        uploadedAt: 'Just now',
        wordCount: text.trim().split(/\s+/).length,
      };

      setDocuments([newDoc, ...documents]);
      setActiveDocId(newDoc.id);
      setJurisdiction(jur);

      const result = await analyzeDocumentAPI(text, title, type, jur);
      setAnalysis(result);
      setActiveTab('workspace');
      showToast('Document analyzed successfully!');
    } catch (err) {
      console.error(err);
      showToast('Analysis completed with standard heuristics.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 1-Click Load Negotiation Demo
  const handleLoadDemo = () => {
    setActiveDocId('doc-demo-v1');
    setAnalysis(SAMPLE_V1_ANALYSIS);
    setActiveTab('workspace');
    showToast('Loaded Freelance Services Agreement (Demo V1)');
  };

  // Deep interaction from finding card to Q&A
  const handleAskQuestionFromFinding = (question: string) => {
    setChatInitialQuestion(question);
    setActiveTab('ask');
  };

  // Handle document revisions from Version History
  const handleUpdateDocument = (updatedDoc: LegalDocument, newVersion: DocumentVersion) => {
    setDocuments((prevDocs) =>
      prevDocs.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
    realtimeSync.broadcast('VERSION_CREATED', {
      documentId: updatedDoc.id,
      version: newVersion,
      updatedText: updatedDoc.rawText,
    });
    showToast(
      newVersion.author === 'Original Baseline'
        ? `Restored document to ${newVersion.versionNumber}`
        : `Revision ${newVersion.versionNumber} saved: ${newVersion.title}`
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#141413] flex flex-col font-sans selection:bg-[#141413] selection:text-white relative">
      {/* 1. Legal Ethics & Jurisdiction Safety Banner */}
      <LegalSafetyBanner
        jurisdiction={jurisdiction}
        onSelectJurisdiction={(j) => {
          setJurisdiction(j);
          showToast(`Jurisdiction set to ${j === 'doc_only' ? 'Document-Only' : j.toUpperCase()}`);
        }}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDoc={activeDoc}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onLoadDemo={handleLoadDemo}
      />

      {/* 3. Toast Notification Pill */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 bg-[#141413] text-white text-xs px-4 py-2.5 rounded-md shadow-lg border border-[#2C2C2A] flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-slate-100">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Active Tab Router View with Smooth Motion Transitions */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
          >
            {activeTab === 'overview' && (
              <OverviewDashboard
                documents={documents}
                activeDocument={activeDoc}
                analysis={analysis}
                onSelectDocument={handleSelectDocument}
                onOpenUpload={() => setIsUploadModalOpen(true)}
                onNavigateTab={setActiveTab}
                onLoadDemo={handleLoadDemo}
              />
            )}

            {activeTab === 'workspace' && (
              <AnalysisWorkspace
                document={activeDoc}
                analysis={analysis}
                onAskQuestion={handleAskQuestionFromFinding}
                onOpenChecklist={() => setActiveTab('checklist')}
                onOpenBrief={() => setActiveTab('brief')}
                onUpdateDocument={handleUpdateDocument}
              />
            )}

            {activeTab === 'compare' && (
              <ComparisonWorkspace
                documents={documents}
                onOpenUpload={() => setIsUploadModalOpen(true)}
              />
            )}

            {activeTab === 'ask' && (
              <AskLexiChat
                document={activeDoc}
                jurisdiction={jurisdiction}
                initialQuestion={chatInitialQuestion}
                onClearInitialQuestion={() => setChatInitialQuestion(null)}
              />
            )}

            {activeTab === 'checklist' && (
              <ActionCenter
                analysis={analysis}
              />
            )}

            {activeTab === 'brief' && (
              <LawyerBriefModal
                analysis={analysis}
                onBackToWorkspace={() => setActiveTab('workspace')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal & Premium Swiss Editorial Footer */}
      <footer
        role="contentinfo"
        aria-label="Product navigation and legal disclaimer"
        className="hairline-t bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#6B6A66]"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-2 max-w-sm">
              <span className="font-semibold text-base text-[#141413] tracking-tight block">
                LexiLens
              </span>
              <p className="text-xs text-[#4A4946] font-serif italic text-base">
                Understand the fine print. Before it matters.
              </p>
            </div>

            {/* Nav Columns */}
            <div className="flex flex-wrap gap-8 sm:gap-12 text-xs">
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold block">
                  Product
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('workspace')}
                      className="hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Review Workspace
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('compare')}
                      className="hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Contract Diff
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('ask')}
                      className="hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Ask Lexi
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold block">
                  How it Works
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className="hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Legal X-Ray
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('checklist')}
                      className="hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Before You Sign
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('brief')}
                      className="hover:text-[#141413] transition-colors cursor-pointer"
                    >
                      Lawyer Brief
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold block">
                  Security
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <span className="text-[#4A4946]">Document-Grounded Only</span>
                  </li>
                  <li>
                    <span className="text-[#4A4946]">Ephemeral Processing</span>
                  </li>
                  <li>
                    <span className="text-[#4A4946]">Prompt-Injection Defense</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#141413] font-semibold block">
                  Legal
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <span className="text-[#4A4946]">Information, not advice</span>
                  </li>
                  <li>
                    <span className="text-[#4A4946]">WCAG 2.2 AA</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 hairline-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#6B6A66]">
            <p className="max-w-xl text-[11px] leading-relaxed">
              Legal information and document-analysis assistance — <strong>not legal advice</strong>.
              Always consult a qualified legal professional before signing binding agreements.
            </p>
            <div className="text-[11px] font-mono text-[#6B6A66] shrink-0">
              © 2026 LexiLens. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Document Upload & Paste Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAnalyze={handleUploadAndAnalyze}
        currentJurisdiction={jurisdiction}
      />
    </div>
  );
}
