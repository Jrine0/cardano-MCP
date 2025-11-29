import React from 'react';
import { Settings, Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useStore } from '../store';
import { ChatPanel } from './ChatPanel';
import { WorkflowPanel } from './WorkflowPanel';
import { PreviewPanel } from './PreviewPanel';

export const Layout = () => {
  const { viewMode, activeTab, setTab, rightPanelCollapsed, toggleCollapse } = useStore();

  return (
    <div className="flex flex-col h-screen w-full bg-bg-primary text-text-primary font-sans selection:bg-accent-primary/30">
      
      {/* Header */}
      <header className="h-16 border-b border-border-subtle flex items-center justify-between px-6 bg-bg-primary/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-accent-primary/20">
                8
            </div>
            <span className="font-semibold text-lg tracking-tight">agent8</span>
        </div>
        <button className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-secondary">
            <Settings size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Chat */}
        <div 
          className={`
            transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col border-r border-border-subtle bg-bg-primary z-10
            ${viewMode === 'chat-only' ? 'w-full max-w-5xl mx-auto border-r-0' : 'w-[350px] min-w-[350px]'}
            ${rightPanelCollapsed && viewMode !== 'chat-only' ? '!w-full !max-w-none' : ''}
          `}
        >
          <ChatPanel />
        </div>

        {/* Right Panel: Workflow/Preview */}
        <div 
          className={`
             flex-1 flex flex-col bg-bg-secondary relative transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
             ${viewMode === 'chat-only' ? 'translate-x-full absolute right-0 w-0 opacity-0' : 'translate-x-0 opacity-100'}
             ${rightPanelCollapsed ? 'w-0 hidden' : ''}
          `}
        >
           {/* Right Panel Header/Tabs */}
           <div className="h-12 border-b border-border-subtle bg-bg-secondary flex items-center justify-between px-4">
              <div className="flex gap-6 h-full">
                  <button 
                    onClick={() => setTab('workflow')}
                    className={`h-full text-sm font-medium border-b-2 transition-colors px-2 ${activeTab === 'workflow' ? 'border-accent-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                  >
                      Workflow
                  </button>
                  <button 
                    onClick={() => setTab('preview')}
                    className={`h-full text-sm font-medium border-b-2 transition-colors px-2 ${activeTab === 'preview' ? 'border-accent-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                  >
                      Preview
                  </button>
              </div>
              <div className="flex items-center gap-2">
                  <button onClick={toggleCollapse} className="p-1.5 hover:bg-bg-tertiary rounded text-text-secondary" title="Expand Chat">
                      {rightPanelCollapsed ? <PanelLeftClose size={18} /> : <Maximize2 size={16} />}
                  </button>
              </div>
           </div>

           {/* Content */}
           <div className="flex-1 relative">
                {activeTab === 'workflow' ? <WorkflowPanel /> : <PreviewPanel />}
           </div>
        </div>

        {/* Floating Expand Button (Visible only when split view is active but collapsed) */}
        {viewMode === 'split-view' && rightPanelCollapsed && (
             <button 
                onClick={toggleCollapse}
                className="absolute right-6 top-6 z-50 bg-bg-tertiary border border-border-subtle p-2 rounded-lg shadow-lg text-text-primary hover:text-accent-primary transition-colors"
             >
                 <PanelLeftOpen size={20} />
             </button>
        )}

      </main>
    </div>
  );
};
