import React, { useEffect, useState } from 'react';
import { Settings, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen, Maximize, Minimize, LayoutTemplate } from 'lucide-react';
import { useStore } from '../store';
import { ChatPanel } from './ChatPanel';
import { WorkflowPanel } from './WorkflowPanel';
import { PreviewPanel } from './PreviewPanel';
import { SettingsModal } from './SettingsModal';
import { StartScreen } from './StartScreen';
import { motion, AnimatePresence } from 'framer-motion';

import { WalletConnect } from './WalletConnect';

export const Layout = () => {
  const { viewMode, activeTab, setTab, rightPanelCollapsed, toggleCollapse, toggleSettings, messages, startSimulation } = useStore();
  const hasMessages = messages.length > 0;
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Responsive Check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Browser Fullscreen Handler
  const toggleBrowserFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // When view mode changes to split-view, ensure sidebar is open initially
  useEffect(() => {
    if (viewMode === 'split-view') {
      setSidebarOpen(true);
    }
  }, [viewMode]);

  // Show beautiful start screen if no messages yet
  if (!hasMessages) {
    return (
      <>
        <StartScreen onPromptSubmit={startSimulation} />
        <SettingsModal />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground font-sans overflow-hidden">

      {/* Header */}
      <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle (Only visible in split view) */}
          {viewMode === 'split-view' && !isMobile && (
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors mr-2"
              title={isSidebarOpen ? "Collapse Sidebar" : "Open Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          )}

          <div className="w-8 h-8 rounded-lg bg-secondary/80 border border-border flex items-center justify-center font-bold text-foreground shadow-sm">
            <LayoutTemplate size={18} />
          </div>
          <span className="font-semibold text-lg tracking-tight hidden sm:block">agent8</span>
        </div>

        <div className="flex items-center gap-2">
          <WalletConnect />
          <button
            onClick={toggleBrowserFullScreen}
            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground hidden sm:block"
            title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
          <button
            onClick={toggleSettings}
            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* Left Panel: Chat Sidebar */}
        <AnimatePresence initial={false} mode="layout">
          {(!isMobile || (isMobile && viewMode === 'chat-only')) && isSidebarOpen && (
            <motion.div
              initial={{ width: viewMode === 'chat-only' ? '100%' : 0, opacity: 0 }}
              animate={{
                width: isMobile
                  ? '100%'
                  : (viewMode === 'chat-only' ? '100%' : '400px'),
                opacity: 1
              }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className={`
                flex flex-col border-r border-border bg-background z-20 h-full relative
                ${viewMode === 'chat-only' ? 'w-full' : 'shrink-0'}
              `}
            >
              <ChatPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel: Workflow/Preview Canvas */}
        <AnimatePresence initial={false}>
          {(viewMode === 'split-view') && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`
                 flex-1 flex flex-col bg-muted/10 relative h-full overflow-hidden
                 ${isMobile ? 'absolute inset-0 z-30 bg-background' : ''}
              `}
            >
              {/* Mobile Header for Right Panel */}
              {isMobile && (
                <div className="h-12 border-b border-border flex items-center px-4 bg-background shrink-0">
                  <button
                    onClick={() => useStore.getState().toggleViewMode()}
                    className="text-xs font-medium text-muted-foreground flex items-center gap-1"
                  >
                    ← Back to Chat
                  </button>
                </div>
              )}

              {/* Right Panel Tabs & Controls */}
              <div className="h-12 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
                <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
                  {['workflow', 'preview'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTab(tab as any)}
                      className={`
                            px-4 py-1 text-xs font-medium rounded-md transition-all duration-200
                            ${activeTab === tab
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'}
                          `}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {!isMobile && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {rightPanelCollapsed && <span className="text-[10px] uppercase tracking-wider font-semibold">Focus Mode</span>}
                  </div>
                )}
              </div>

              {/* Canvas Content */}
              <div className="flex-1 relative overflow-hidden bg-[#0A0E14]">
                {activeTab === 'workflow' ? <WorkflowPanel /> : <PreviewPanel />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <SettingsModal />
    </div>
  );
};