import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Quote,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, LegalDocument, Jurisdiction } from '../types';
import { askDocumentAPI } from '../services/api';

interface AskLexiChatProps {
  document: LegalDocument;
  jurisdiction: Jurisdiction;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
}

export const AskLexiChat: React.FC<AskLexiChatProps> = ({
  document,
  jurisdiction,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `I am ready to inspect "${document.title}". Every response is strictly grounded in the verbatim text of this document. If a topic is not explicitly mentioned or defined in the agreement, I will state that clearly rather than inferring or speculating.`,
      confidence: 'High',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        'What are the payment deadlines and remedies?',
        'Who owns the intellectual property and code deliverables?',
        'What are the termination conditions and notice periods?',
        'Is there a post-contract non-compete restriction?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initial question from other tabs
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage(initialQuestion);
      if (onClearInitialQuestion) onClearInitialQuestion();
    }
  }, [initialQuestion]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const response = await askDocumentAPI(
        document.rawText,
        textToSend,
        document.title,
        jurisdiction
      );

      const assistantMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: response.content || 'Analysis completed.',
        evidence: response.evidence || [],
        confidence: response.confidence || 'High',
        isNotFoundInDoc: response.isNotFoundInDoc,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: response.suggestedQuestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error', err);
      const errorMessage: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content:
          'I encountered a temporary connection interruption while searching the document. Please try asking again.',
        confidence: 'Low',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content: `Session refreshed. Ask any question strictly grounded in "${document.title}".`,
        confidence: 'High',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: [
          'What happens if I terminate early?',
          'What is my maximum liability exposure?',
          'Are there any automatic renewal clauses?',
        ],
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[520px] flex flex-col bg-white border border-[#E2E2DE] rounded-xl overflow-hidden shadow-xs my-6">
      {/* Header */}
      <div className="p-4 bg-[#F8F8F5] hairline-b flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans font-semibold text-sm text-[#141413]">
              Ask Lexi
            </h3>
            <span className="text-[#C4C4BE]" aria-hidden="true">·</span>
            <span className="font-mono text-xs text-emerald-800">
              Grounded in Contract Text
            </span>
          </div>
          <p className="text-xs text-[#6B6A66] truncate max-w-[360px] sm:max-w-[480px]">
            Target Document: <span className="font-medium text-[#141413]">{document.title}</span>
          </p>
        </div>

        <button
          onClick={handleResetChat}
          className="px-2.5 py-1 rounded text-[#4A4946] hover:text-[#141413] hover:bg-white transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-[#E2E2DE]"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Contract Q&A conversation thread"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF9F6]"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex gap-3 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Clean label */}
                <div
                  className={`w-7 h-7 rounded text-[11px] font-mono shrink-0 flex items-center justify-center font-semibold ${
                    isAssistant
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-[#141413] text-white'
                  }`}
                >
                  {isAssistant ? 'LX' : 'YOU'}
                </div>

                {/* Message Body */}
                <div className={`space-y-2 max-w-[85%] ${isAssistant ? 'text-left' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-lg text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-white border border-[#E2E2DE] text-[#2C2C2A] shadow-xs'
                        : 'bg-[#141413] text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Anti-hallucination note when not in doc */}
                    {msg.isNotFoundInDoc && (
                      <div className="mt-3 p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          This topic is not explicitly mentioned or defined anywhere in this contract.
                        </span>
                      </div>
                    )}

                    {/* Evidence Quotes */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="mt-3.5 pt-3 hairline-t space-y-2 text-left">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#6B6A66] flex items-center gap-1.5">
                          <Quote className="w-3 h-3 text-[#1E3A8A]" />
                          Source Verification ({msg.evidence[0].section})
                        </span>
                        {msg.evidence.map((ev, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded bg-[#F8F8F5] border border-[#E8E8E4] text-[#4A4946] font-serif text-xs italic"
                          >
                            "{ev.text}"
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & Confidence */}
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#A3A29E] font-mono">
                      <span>{msg.timestamp}</span>
                      {msg.confidence && (
                        <span className="text-emerald-800 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Grounded in Text
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Suggested Question Chips */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sq)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-[#F2F2EE] border border-[#E2E2DE] text-[#4A4946] hover:text-[#141413] text-xs font-medium transition-colors text-left cursor-pointer"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-7 h-7 rounded bg-[#1E3A8A] text-white font-mono text-[11px] font-semibold flex items-center justify-center">
              LX
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E2E2DE] text-xs text-[#4A4946] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] animate-ping" />
              <span>Searching contract text and extracting verified citations...</span>
            </div>
          </motion.div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white hairline-t shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            aria-label="Ask a question about this contract"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this contract (e.g. Can the client terminate without cause?)"
            className="flex-1 px-3 py-2 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] placeholder:text-[#A3A29E] focus:outline-none focus:border-[#141413]"
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!input.trim() || isLoading}
            className="px-3.5 py-2 rounded bg-[#141413] hover:bg-[#2C2C2A] disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </form>
        <p className="text-[10px] font-mono text-[#6B6A66] text-center mt-2">
          Strictly grounded in contract text. Cites exact excerpts without external speculation.
        </p>
      </div>
    </div>
  );
};
