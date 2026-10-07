import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Copy,
  Check,
  FileText,
  Highlighter,
  Languages,
  Loader2,
} from 'lucide-react';
import { AppLanguage, LegalDocument } from '../types';
import { translateTextAPI } from '../services/api';

interface DocumentViewerProps {
  document: LegalDocument;
  highlightedText?: string | null;
  highlightedSection?: string | null;
  onClearHighlight?: () => void;
  language?: AppLanguage;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  highlightedText,
  highlightedSection,
  onClearHighlight,
  language = 'en',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [copied, setCopied] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const showHindi = language !== 'en';
  const displayText =
    language === 'bilingual' && translatedText
      ? `${document.rawText}\n\n--- हिन्दी अनुवाद ---\n${translatedText}`
      : showHindi && translatedText
      ? translatedText
      : document.rawText;
  const displayLines = displayText.split('\n');

  useEffect(() => {
    if (!showHindi || translatedText !== null || isTranslating) return;
    setIsTranslating(true);
    setTranslationError(null);
    translateTextAPI(document.rawText)
      .then(setTranslatedText)
      .catch((error: Error) => setTranslationError(error.message))
      .finally(() => setIsTranslating(false));
  }, [document.rawText, isTranslating, showHindi, translatedText]);

  // Auto-scroll to highlighted text or section
  useEffect(() => {
    if (!contentRef.current) return;

    if (highlightedText) {
      const marks = contentRef.current.querySelectorAll('mark.clause-active-highlight');
      if (marks.length > 0) {
        marks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (highlightedSection) {
      const sectionEl = contentRef.current.querySelector(`[data-section="${highlightedSection}"]`);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [highlightedText, highlightedSection]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(document.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Count search matches
  const matchCount = searchQuery
    ? displayLines.filter((l) => l.toLowerCase().includes(searchQuery.toLowerCase())).length
    : 0;

  // Render text with search highlighting and clause active highlighting
  const renderLine = (line: string, index: number) => {
    const isHeader =
      /^SECTION\s+\d+|^\d+\.\s+|[A-Z\s]{4,}:/i.test(line.trim()) &&
      line.trim().length < 80;

    const isMatch =
      highlightedText &&
      highlightedText.length > 10 &&
      line.toLowerCase().includes(highlightedText.substring(0, 30).toLowerCase());

    return (
      <div
        key={index}
        className={`flex items-start group hover:bg-[#FAF9F6] transition-colors py-0.5 px-3 ${
          isMatch
            ? 'bg-[#F2F4F8] border-l-2 border-[#1E3A8A] pl-3'
            : ''
        }`}
      >
        {showLineNumbers && (
          <span className="w-9 select-none font-mono text-[11px] text-[#A3A29E] group-hover:text-[#6B6A66] shrink-0 text-right pr-3 pt-0.5 font-normal">
            {index + 1}
          </span>
        )}
        <div className="flex-1 font-serif text-[#2C2C2A] leading-relaxed break-words whitespace-pre-wrap">
          {isHeader ? (
            <span className="font-sans font-semibold text-[#141413] tracking-wide text-xs sm:text-sm block mt-2 mb-0.5 pb-1 border-b border-[#E8E8E4]">
              {line}
            </span>
          ) : isMatch ? (
            <mark className="clause-active-highlight bg-[#E8EDF5] text-[#1E3A8A] px-1 py-0.5 font-medium rounded-sm inline-block">
              {line}
            </mark>
          ) : searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase()) ? (
            highlightSearch(line, searchQuery)
          ) : (
            line
          )}
        </div>
      </div>
    );
  };

  const highlightSearch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 text-amber-900 px-0.5 font-medium">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border border-[#E2E2DE] rounded-lg overflow-hidden shadow-xs">
      {/* Top Header Controls */}
      <div className="p-3 bg-[#F8F8F5] hairline-b flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#141413] font-semibold block">
              YOUR DOCUMENT
            </span>
            <h3 className="font-sans font-semibold text-xs text-[#141413] truncate" title={document.title}>
              {document.title}
            </h3>
            <p className="text-[11px] font-mono text-[#6B6A66] truncate">
              {document.wordCount} words · {showHindi ? 'Hindi translation' : 'Verbatim Source'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Font size toggle */}
            <div className="flex items-center bg-white rounded border border-[#E2E2DE] text-xs">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 text-[10px] cursor-pointer transition-colors ${
                  fontSize === 'sm'
                    ? 'bg-[#141413] text-white font-medium'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 text-[10px] cursor-pointer transition-colors ${
                  fontSize === 'base'
                    ? 'bg-[#141413] text-white font-medium'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
                title="Normal text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 text-[10px] cursor-pointer transition-colors ${
                  fontSize === 'lg'
                    ? 'bg-[#141413] text-white font-medium'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopyAll}
              className="p-1 rounded bg-white text-[#6B6A66] hover:text-[#141413] border border-[#E2E2DE] text-xs transition-colors cursor-pointer"
              title="Copy entire contract text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showHindi && (
          <div className="flex items-center gap-2 text-[11px] text-[#6B6A66]">
            <Languages className="w-3.5 h-3.5" />
            {isTranslating ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Translating into simple Hindi…
              </span>
            ) : translationError ? (
              <span className="text-amber-700">{translationError} Showing the original text.</span>
            ) : (
              <span>{language === 'bilingual' ? 'English source and Hindi translation' : 'सरल हिन्दी अनुवाद'}</span>
            )}
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#A3A29E] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search keywords in text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-16 py-1 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] placeholder:text-[#A3A29E] focus:outline-none focus:border-[#141413]"
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-[#6B6A66]">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#6B6A66] hover:text-[#141413] text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Active Highlight Banner */}
        {highlightedText && (
          <div className="flex items-center justify-between bg-[#F2F4F8] border border-[#C7D4EA] px-2.5 py-1 rounded text-[11px] text-[#1E3A8A]">
            <span className="flex items-center gap-1.5 truncate">
              <Highlighter className="w-3 h-3 text-[#1E3A8A] shrink-0" />
              <span className="truncate font-medium">Highlighted clause in verbatim text</span>
            </span>
            {onClearHighlight && (
              <button
                onClick={onClearHighlight}
                className="text-[#1E3A8A] hover:underline font-semibold cursor-pointer text-xs ml-2"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Document Content Body */}
      <div
        ref={contentRef}
        className={`flex-1 overflow-y-auto p-4 space-y-0.5 select-text bg-white ${
          fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
        }`}
      >
        {displayLines.map((line, idx) => renderLine(line, idx))}
      </div>

      {/* Bottom Footer Info */}
      <div className="px-3 py-1.5 bg-[#F8F8F5] hairline-t flex items-center justify-between text-[11px] text-[#6B6A66]">
        <label className="flex items-center gap-1.5 cursor-pointer select-none font-mono">
          <input
            type="checkbox"
            checked={showLineNumbers}
            onChange={(e) => setShowLineNumbers(e.target.checked)}
            className="rounded border-[#C4C4BE] text-[#141413] focus:ring-0 w-3 h-3 cursor-pointer"
          />
          <span>Line Numbers</span>
        </label>
        <span className="font-mono text-[10px] text-[#A3A29E]">Document Verbatim View</span>
      </div>
    </div>
  );
};
