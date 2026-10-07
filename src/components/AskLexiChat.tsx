import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Quote,
  Sparkles,
  CreditCard,
  Lightbulb,
  AlertTriangle,
  FileText,
  DoorOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, LegalDocument, Jurisdiction, AppLanguage } from '../types';
import { askDocumentAPI } from '../services/api';

interface AskLexiChatProps {
  document: LegalDocument;
  jurisdiction: Jurisdiction;
  initialQuestion?: string | null;
  onClearInitialQuestion?: () => void;
  language?: AppLanguage;
}

const CANONICAL_QUESTIONS = [
  {
    label: 'What am I agreeing to?',
    icon: FileText,
    badge: 'Overview',
    prompt: 'What am I agreeing to under this contract?',
  },
  {
    label: 'When can I terminate this?',
    icon: DoorOpen,
    badge: 'Exit Rights',
    prompt: 'When and how can I terminate this agreement?',
  },
  {
    label: 'What payments do I have to make?',
    icon: CreditCard,
    badge: 'Fees & Invoicing',
    prompt: 'What payments do I have to make and what are the timelines?',
  },
  {
    label: 'Who owns the work?',
    icon: Lightbulb,
    badge: 'IP Transfer',
    prompt: 'Who owns the intellectual property and code created?',
  },
  {
    label: 'What happens if something goes wrong?',
    icon: AlertTriangle,
    badge: 'Risk & Dispute',
    prompt: 'What happens if something goes wrong or there is a dispute?',
  },
];

const CANONICAL_QUESTIONS_HINDI = [
  {
    label: 'मैं किन बातों पर सहमत हो रहा हूँ?',
    icon: FileText,
    badge: 'मुख्य सार',
    prompt: 'इस अनुबंध का मुख्य सार और मेरे लिए क्या नियम हैं, सरल हिन्दी में समझाइए?',
  },
  {
    label: 'भुगतान कब और कैसे मिलेगा?',
    icon: CreditCard,
    badge: 'पैसा और फीस',
    prompt: 'इस अनुबंध में भुगतान की शर्तें और समयसीमा क्या है?',
  },
  {
    label: 'क्या कोई बड़ा जोखिम या नुकसान है?',
    icon: AlertTriangle,
    badge: 'जोखिम जांच',
    prompt: 'क्या इस अनुबंध में कोई असीमित देयता या एकतरफा जोखिम भरी शर्त है?',
  },
  {
    label: 'काम छोड़ने या अनुबंध खत्म करने के नियम?',
    icon: DoorOpen,
    badge: 'समाप्ति अधिकार',
    prompt: 'यदि मैं इस अनुबंध को समाप्त करना चाहूँ, तो कितने दिन का नोटिस देना होगा?',
  },
  {
    label: 'काम और कोड का असली मालिक कौन होगा?',
    icon: Lightbulb,
    badge: 'मालिकाना हक',
    prompt: 'क्या बौद्धिक संपदा और कोड का अधिकार पूरा भुगतान मिलने के बाद ही ट्रांसफर होगा?',
  },
];

export const AskLexiChat: React.FC<AskLexiChatProps> = ({
  document,
  jurisdiction,
  initialQuestion,
  onClearInitialQuestion,
  language = 'en',
}) => {
  const isHindi = language === 'hi';
  const isBilingual = language === 'bilingual';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: isHindi
        ? `नमस्ते! मैं "${document.title}" के विश्लेषण हेतु तैयार हूँ। आप कोई भी सवाल पूछ सकते हैं — जैसे भुगतान कब मिलेगा, क्या कोई जोखिम भरी शर्त है, या काम छोड़ने के क्या नियम हैं। प्रत्येक उत्तर सीधे इस अनुबंध के पाठ पर आधारित होगा।`
        : isBilingual
        ? `I am ready to inspect "${document.title}". (हिन्दी): मैं इस अनुबंध के बारे में आपके सभी सवालों के जवाब देने के लिए तैयार हूँ। Every response is strictly grounded in the verbatim text of this document.`
        : `I am ready to inspect "${document.title}". Every response is strictly grounded in the verbatim text of this document. If a topic is not explicitly mentioned or defined in the agreement, I will state that clearly rather than inferring or speculating.`,
      confidence: 'High',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: isHindi
        ? [
            'इस अनुबंध का मुख्य सार क्या है?',
            'भुगतान कब और कैसे मिलेगा?',
            'क्या कोई बड़ा जोखिम या लाल झंडी है?',
            'काम छोड़ने के क्या नियम हैं?',
          ]
        : [
            'What am I agreeing to?',
            'When can I terminate this?',
            'What payments do I have to make?',
            'Who owns the work?',
            'What happens if something goes wrong?',
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
          'What am I agreeing to?',
          'When can I terminate this?',
          'What payments do I have to make?',
          'Who owns the work?',
          'What happens if something goes wrong?',
        ],
      },
    ]);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto h-[calc(100vh-100px)] min-h-0 flex flex-col bg-white border-y lg:border-x border-[#E2E2DE] rounded-none lg:rounded-xl overflow-hidden shadow-xs">
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

      {/* 1-CLICK QUICK ACCESS SUGGESTED QUESTIONS */}
      <div className="bg-[#FAF9F6] px-4 py-2.5 hairline-b flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#6B6A66] shrink-0 font-medium mr-1">
          <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>{isHindi ? 'त्वरित प्रश्न:' : 'Quick 1-Click:'}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {(isHindi ? CANONICAL_QUESTIONS_HINDI : CANONICAL_QUESTIONS).map((cq) => {
            const Icon = cq.icon;
            return (
              <button
                key={cq.label}
                onClick={() => handleSendMessage(cq.prompt || cq.label)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#141413] hover:text-white border border-[#E2E2DE] text-[#2C2C2A] text-xs font-medium transition-all shadow-2xs whitespace-nowrap cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-1.5 group"
                title={`Run inquiry: "${cq.label}"`}
              >
                <Icon className="w-3 h-3 text-[#1E3A8A] group-hover:text-white transition-colors" />
                <span>{cq.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Thread */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Contract Q&A conversation thread"
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded bg-[#141413] text-white font-mono text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    LX
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#141413] text-white font-medium rounded-tr-none'
                        : 'bg-white border border-[#E2E2DE] text-[#141413] rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Not Found in Document Notice */}
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
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#6B6A66] flex items-center gap-1.5 font-semibold">
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
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-[#F2F2EE] border border-[#E2E2DE] text-[#4A4946] hover:text-[#141413] text-xs font-medium transition-colors text-left cursor-pointer active:scale-95"
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
            placeholder={
              isHindi
                ? 'इस दस्तावेज़ के बारे में कोई भी सवाल पूछें (जैसे फीस, समाप्ति, जोखिम)...'
                : 'Ask anything about this contract (or click any quick question above)...'
            }
            className="flex-1 px-3 py-2 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] placeholder:text-[#A3A29E] focus:outline-none focus:border-[#141413]"
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!input.trim() || isLoading}
            className="px-3.5 py-2 rounded bg-[#141413] hover:bg-[#2C2C2A] disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isHindi ? 'पूछें' : 'Ask'}</span>
          </button>
        </form>
        <p className="text-[10px] font-mono text-[#6B6A66] text-center mt-2">
          {isHindi
            ? 'अनुबंध के पाठ पर आधारित सटीक उत्तर · बिना किसी बाहरी अनुमान के प्रामाणिक संदर्भ'
            : 'Strictly grounded in contract text. Cites exact excerpts without external speculation.'}
        </p>
      </div>
    </div>
  );
};
