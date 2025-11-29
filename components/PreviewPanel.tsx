import React from 'react';
import { useStore } from '../store';
import { Play, Terminal, Check, AlertTriangle, Info } from 'lucide-react';

export const PreviewPanel = () => {
  const { logs, executeWorkflow, nodes, isGenerating } = useStore();

  const getLogIcon = (level: string) => {
    switch(level) {
      case 'success': return <Check size={14} className="text-accent-success" />;
      case 'error': return <AlertTriangle size={14} className="text-accent-error" />;
      default: return <Info size={14} className="text-accent-primary" />;
    }
  };

  // Generate a mock JSON output based on current nodes
  const workflowJson = {
      workflow_id: "wf_8x92m",
      created_at: new Date().toISOString(),
      nodes: nodes.map(n => ({
          id: n.id,
          type: n.type,
          config: n.data
      }))
  };

  return (
    <div className="flex flex-col h-full bg-bg-primary">
      {/* Toolbar */}
      <div className="p-4 border-b border-border-subtle bg-bg-secondary/50 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-text-secondary flex items-center gap-2">
            <Terminal size={16} /> Execution Console
        </h3>
        <button 
          onClick={executeWorkflow}
          disabled={nodes.length === 0 || isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-accent-success/10 text-accent-success hover:bg-accent-success/20 border border-accent-success/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={16} fill="currentColor" />
          Run Workflow
        </button>
      </div>

      {/* Split Log / Output View */}
      <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Live Logs */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
             {logs.length === 0 && (
                 <div className="text-text-secondary/30 italic text-center mt-10">
                     Ready to execute. Click "Run Workflow" to start.
                 </div>
             )}
             {logs.map((log) => (
                 <div key={log.id} className="flex gap-3 items-start animate-in slide-in-from-left-2">
                     <span className="text-text-secondary/50 text-xs mt-1">
                         {new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}
                     </span>
                     <div className={`p-1 rounded bg-bg-tertiary border border-border-subtle`}>
                         {getLogIcon(log.level)}
                     </div>
                     <span className={`${
                         log.level === 'success' ? 'text-accent-success' : 
                         log.level === 'error' ? 'text-accent-error' : 'text-text-primary'
                     }`}>
                         {log.message}
                     </span>
                 </div>
             ))}
          </div>

          {/* JSON Output Viewer (Bottom half) */}
          <div className="h-1/3 border-t border-border-subtle bg-bg-tertiary/30 flex flex-col">
              <div className="px-4 py-2 text-xs font-semibold text-text-secondary bg-bg-secondary/80 border-b border-border-subtle">
                  OUTPUT.JSON
              </div>
              <div className="flex-1 overflow-auto p-4">
                  <pre className="text-xs font-mono text-text-secondary/80">
                      <code dangerouslySetInnerHTML={{ 
                          __html: JSON.stringify(workflowJson, null, 2)
                            .replace(/"keys"/g, '<span class="text-accent-secondary">"keys"</span>')
                            .replace(/: "([^"]+)"/g, ': "<span class="text-accent-success">$1</span>"')
                       }} />
                  </pre>
              </div>
          </div>
      </div>
    </div>
  );
};
