import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Upload,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, LegalDocument } from '../types';
import { realtimeSync, ConnectionStatus } from '../services/realtimeSync';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeDoc: LegalDocument | null;
  onOpenUpload: () => void;
  onLoadDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeDoc,
  onOpenUpload,
  onLoadDemo,
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

  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview' },
    { id: 'workspace' as ActiveTab, label: 'Review' },
    { id: 'compare' as ActiveTab, label: 'Compare' },
    { id: 'ask' as ActiveTab, label: 'Ask Lexi' },
    { id: 'checklist' as ActiveTab, label: 'Checklist' },
    { id: 'brief' as ActiveTab, label: 'Summary' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md hairline-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="text-lg font-semibold tracking-tight text-[#141413] hover:text-[#1E3A8A] transition-colors cursor-pointer text-left font-sans"
              aria-label="LexiLens Home"
            >
              LexiLens
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-xs font-medium transition-colors cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-[#141413] font-semibold'
                      : 'text-[#6B6A66] hover:text-[#141413]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#141413]"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Live session synchronization indicator */}
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
              <span className="hidden lg:inline">{syncStatus === 'connected' ? 'Live' : 'Offline'}</span>
            </div>

            <button
              onClick={onLoadDemo}
              className="px-3 py-1.5 text-xs font-medium text-[#4A4946] hover:text-[#141413] border border-[#E2E2DE] hover:border-[#141413]/30 rounded-md transition-colors cursor-pointer"
            >
              Explore Demo
            </button>

            <button
              onClick={onOpenUpload}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#141413] hover:bg-[#2C2C2A] rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Analyze Document</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="p-1.5 text-xs font-medium text-white bg-[#141413] rounded-md"
              aria-label="Upload document"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A4946] hover:text-[#141413] focus:outline-none"
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
            {navItems.map((item) => {
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
                      ? 'text-[#141413] bg-[#F2F2EE] font-semibold'
                      : 'text-[#6B6A66] hover:text-[#141413] hover:bg-[#F8F8F5]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <ArrowUpRight className="w-3.5 h-3.5 text-[#141413]" />}
                </button>
              );
            })}
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
                Analyze Document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
