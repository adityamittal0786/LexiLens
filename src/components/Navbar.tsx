import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Upload,
  ArrowUpRight,
  ChevronLeft,
  FileText,
  Languages,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, LegalDocument, AppLanguage } from '../types';
import { realtimeSync, ConnectionStatus } from '../services/realtimeSync';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeDoc: LegalDocument | null;
  onOpenUpload: () => void;
  onLoadDemo: () => void;
  language?: AppLanguage;
  onSelectLanguage?: (lang: AppLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeDoc,
  onOpenUpload,
  onLoadDemo,
  language = 'en',
  onSelectLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<ConnectionStatus>(realtimeSync.status);
  const [collaboratorsCount, setCollaboratorsCount] = useState<number>(realtimeSync.activeCollaborators);

  useEffect(() => {
    return realtimeSync.onStatusChange((status, count) => {
      setSyncStatus(status);
      setCollaboratorsCount(count);
    });
  }, []);

  const handleNavClick = (sectionId: string) => {
    if (activeTab !== 'overview') {
      setActiveTab('overview');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isInsideApp = activeTab !== 'overview';

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md hairline-b">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-7">
        <div className="flex items-center justify-between h-13 sm:h-14">
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="group flex items-center gap-2 text-left cursor-pointer focus:outline-none"
              aria-label="LexiLens Home"
            >
              <span className="text-base sm:text-lg font-semibold tracking-tight text-[#141413] group-hover:text-[#1E3A8A] transition-colors font-sans">
                LexiLens
              </span>
              <span className="hidden xl:inline text-[11px] font-mono text-[#8C8B85] tracking-tight">
                · Document Intelligence
              </span>
            </button>

            {/* In-app breadcrumb indicator when deep in workspace */}
            {isInsideApp && (
              <div className="hidden lg:flex items-center gap-1.5 pl-2 hairline-l text-xs text-[#6B6A66]">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="hover:text-[#141413] flex items-center gap-1 font-medium transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>
                <span className="text-[#C4C4BE]" aria-hidden="true">/</span>
                <span className="font-semibold text-[#141413] capitalize font-mono text-[11px]">
                  {activeTab === 'workspace'
                    ? 'Review Workspace'
                    : activeTab === 'compare'
                    ? 'Version Comparison'
                    : activeTab === 'ask'
                    ? 'Ask Lexi'
                    : activeTab === 'checklist'
                    ? 'Action Checklist'
                    : 'Lawyer Brief'}
                </span>
              </div>
            )}
          </div>

          {/* Center Navigation: Clean Effortless Hierarchy */}
          {!isInsideApp ? (
            /* Main Landing Navigation (Simplified per user instruction: Product | How it works | Features | Security) */
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              <button
                onClick={() => handleNavClick('product')}
                className="text-xs font-medium text-[#6B6A66] hover:text-[#141413] transition-colors cursor-pointer py-1"
              >
                Product
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="text-xs font-medium text-[#6B6A66] hover:text-[#141413] transition-colors cursor-pointer py-1"
              >
                How it works
              </button>
              <button
                onClick={() => handleNavClick('features')}
                className="text-xs font-medium text-[#6B6A66] hover:text-[#141413] transition-colors cursor-pointer py-1"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('security')}
                className="text-xs font-medium text-[#6B6A66] hover:text-[#141413] transition-colors cursor-pointer py-1"
              >
                Security
              </button>
            </nav>
          ) : (
            /* In-Product Workspace Mode Switcher: compact and clean */
            <nav className="hidden md:flex items-center bg-[#F2F2EE] p-0.5 rounded-lg border border-[#E2E2DE] text-xs">
              <button
                onClick={() => setActiveTab('workspace')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'workspace'
                    ? 'bg-white text-[#141413] font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {language === 'hi' ? 'समीक्षा' : 'Review'}
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'compare'
                    ? 'bg-white text-[#141413] font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {language === 'hi' ? 'तुलना' : 'Compare'}
              </button>
              <button
                onClick={() => setActiveTab('ask')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'ask'
                    ? 'bg-white text-[#141413] font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {language === 'hi' ? 'लेक्सी से पूछें' : 'Ask Lexi'}
              </button>
              <button
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'checklist'
                    ? 'bg-white text-[#141413] font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {language === 'hi' ? 'जांच सूची' : 'Checklist'}
              </button>
              <button
                onClick={() => setActiveTab('brief')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'brief'
                    ? 'bg-white text-[#141413] font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
              >
                {language === 'hi' ? 'सारांश' : 'Summary'}
              </button>
            </nav>
          )}

          {/* Right Actions: Primary "Try LexiLens" + Secondary Demo + Language Switcher */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Real-time status indicator */}
            <div
              className="flex items-center gap-1.5 text-[11px] text-[#6B6A66] font-mono mr-1"
              title={
                syncStatus === 'connected'
                  ? `Live connected (${collaboratorsCount} active session)`
                  : 'Sync offline'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'connected'
                    ? 'bg-emerald-600'
                    : 'bg-zinc-400'
                }`}
              />
              <span className="hidden xl:inline">{syncStatus === 'connected' ? 'Live' : 'Offline'}</span>
            </div>

            {/* Language Switcher: EN / हिन्दी / Bilingual */}
            <div
              className="flex items-center bg-[#F2F2EE] p-0.5 rounded-md border border-[#E2E2DE] text-[11px] font-medium"
              role="group"
              aria-label="Language selector"
            >
              <Languages className="w-3 h-3 text-[#6B6A66] ml-1.5 mr-0.5" />
              <button
                type="button"
                onClick={() => onSelectLanguage?.('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-[#141413] font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
                title="View in English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage?.('hi')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-[#141413] text-white font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
                title="हिन्दी में देखें (View in Hindi)"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage?.('bilingual')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-all cursor-pointer ${
                  language === 'bilingual'
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'text-[#6B6A66] hover:text-[#141413]'
                }`}
                title="द्विभाषी दृश्य (English + हिन्दी)"
              >
                Dual
              </button>
            </div>

            <button
              onClick={onLoadDemo}
              className="px-2.5 py-1.5 text-xs font-medium text-[#4A4946] hover:text-[#141413] border border-[#E2E2DE] hover:border-[#141413]/30 rounded-md transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'डेमो अनुबंध' : 'Explore Demo'}
            </button>

            <button
              onClick={onOpenUpload}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#141413] hover:bg-[#2C2C2A] rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'अनुबंध जांचें' : 'Try LexiLens'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1.5">
            {/* Mobile Language Toggle */}
            <div className="flex items-center bg-[#F2F2EE] p-0.5 rounded border border-[#E2E2DE] text-[10px]">
              <button
                type="button"
                onClick={() => onSelectLanguage?.('en')}
                className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-white font-bold' : 'text-[#6B6A66]'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onSelectLanguage?.('hi')}
                className={`px-1.5 py-0.5 rounded ${language === 'hi' ? 'bg-[#141413] text-white font-bold' : 'text-[#6B6A66]'}`}
              >
                हिन्दी
              </button>
            </div>
            <button
              onClick={onOpenUpload}
              className="p-1.5 text-xs font-medium text-white bg-[#141413] rounded-md"
              aria-label="Upload document"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#4A4946] hover:text-[#141413] focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-[#FBFBFA] hairline-b px-4 py-3 space-y-1.5"
          >
            {!isInsideApp ? (
              <>
                <button
                  onClick={() => {
                    handleNavClick('product');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#4A4946] hover:text-[#141413] hover:bg-[#F2F2EE] rounded-md transition-colors text-left"
                >
                  <span>Product</span>
                </button>
                <button
                  onClick={() => {
                    handleNavClick('how-it-works');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#4A4946] hover:text-[#141413] hover:bg-[#F2F2EE] rounded-md transition-colors text-left"
                >
                  <span>How it works</span>
                </button>
                <button
                  onClick={() => {
                    handleNavClick('features');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#4A4946] hover:text-[#141413] hover:bg-[#F2F2EE] rounded-md transition-colors text-left"
                >
                  <span>Features</span>
                </button>
                <button
                  onClick={() => {
                    handleNavClick('security');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#4A4946] hover:text-[#141413] hover:bg-[#F2F2EE] rounded-md transition-colors text-left"
                >
                  <span>Security</span>
                </button>
                <div className="pt-2 hairline-t">
                  <button
                    onClick={() => {
                      setActiveTab('workspace');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#1E3A8A] hover:bg-[#F2F2EE] rounded-md transition-colors text-left"
                  >
                    <span>Open Workspace</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setActiveTab('overview');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#141413] bg-[#F2F2EE] rounded-md transition-colors text-left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>← Back to Overview</span>
                </button>
                {[
                  { id: 'workspace' as ActiveTab, label: 'Review Workspace' },
                  { id: 'compare' as ActiveTab, label: 'Version Comparison' },
                  { id: 'ask' as ActiveTab, label: 'Ask Lexi' },
                  { id: 'checklist' as ActiveTab, label: 'Action Checklist' },
                  { id: 'brief' as ActiveTab, label: 'Lawyer Brief' },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${
                        isActive
                          ? 'text-[#141413] bg-[#E8E8E4] font-semibold'
                          : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F8F8F5]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <ArrowUpRight className="w-3.5 h-3.5 text-[#141413]" />}
                    </button>
                  );
                })}
              </>
            )}

            <div className="pt-2 hairline-t flex gap-2">
              <button
                onClick={() => {
                  onLoadDemo();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-medium text-[#4A4946] border border-[#E2E2DE] rounded-md text-center"
              >
                Explore Demo
              </button>
              <button
                onClick={() => {
                  onOpenUpload();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-medium text-white bg-[#141413] rounded-md text-center"
              >
                Try LexiLens
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
