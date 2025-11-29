import { create } from 'zustand';
import { AppState, Message, AppNode, LogEntry } from './types';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { nanoid } from 'nanoid';

// Helper to generate mock nodes based on prompt
const generateMockWorkflow = (prompt: string): { nodes: AppNode[]; edges: any[] } => {
  const nodes: AppNode[] = [];
  const edges: any[] = [];
  const centerX = 250;
  let currentY = 50;

  // Always start with a wallet
  const walletId = 'node-wallet-1';
  nodes.push({
    id: walletId,
    type: 'wallet',
    position: { x: centerX - 150, y: currentY },
    data: { label: 'Cardano Wallet', status: 'idle', walletProvider: 'nami', balance: '1,450 ₳', address: 'addr1...8x92' },
  });
  currentY += 150;

  if (prompt.toLowerCase().includes('swap') || prompt.toLowerCase().includes('dex')) {
    const dexId = 'node-dex-1';
    nodes.push({
      id: dexId,
      type: 'dex',
      position: { x: centerX, y: currentY },
      data: { label: 'Minswap Swap', status: 'idle', protocol: 'minswap', pair: 'ADA/DJED', amount: '100' },
    });
    edges.push({ id: `e-${walletId}-${dexId}`, source: walletId, target: dexId, animated: true, style: { stroke: '#3B82F6' } });
    currentY += 150;
  }

  if (prompt.toLowerCase().includes('nft') || prompt.toLowerCase().includes('mint')) {
    const nftId = 'node-nft-1';
    nodes.push({
      id: nftId,
      type: 'nft',
      position: { x: centerX, y: currentY },
      data: { label: 'Mint Collection', status: 'idle', collectionName: 'Agent8 Genesis', id: nanoid() },
    });
     // Connect to previous node (either wallet or dex)
    const sourceId = nodes.length > 2 ? nodes[nodes.length - 2].id : walletId;
    edges.push({ id: `e-${sourceId}-${nftId}`, source: sourceId, target: nftId, animated: true, style: { stroke: '#EC4899' } });
    currentY += 150;
  }
  
  // Default to a trigger/email node if generic
  if (nodes.length < 3) {
      const emailId = 'node-email-1';
      nodes.push({
          id: emailId,
          type: 'email',
          position: { x: centerX, y: currentY },
          data: { label: 'Notify User', status: 'idle' }
      });
      const sourceId = nodes[nodes.length - 2].id;
      edges.push({ id: `e-${sourceId}-${emailId}`, source: sourceId, target: emailId, animated: true, style: { stroke: '#10B981' } });
  }

  return { nodes, edges };
};

export const useStore = create<AppState>((set, get) => ({
  viewMode: 'chat-only',
  rightPanelCollapsed: false,
  activeTab: 'workflow',
  messages: [],
  nodes: [],
  edges: [],
  logs: [],
  isGenerating: false,

  addMessage: (msg) => {
    const newMessage: Message = {
      ...msg,
      id: nanoid(),
      timestamp: Date.now(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  setNodes: (nodes) => set({ nodes }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  
  updateNodeStatus: (nodeId, status) => {
    set((state) => ({
      nodes: state.nodes.map((n) => 
        n.id === nodeId ? { ...n, data: { ...n.data, status } } : n
      )
    }));
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) => 
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      )
    }));
  },

  onNodesChange: (changes) => set((state) => ({ 
    nodes: applyNodeChanges(changes, state.nodes) as AppNode[] 
  })),
  
  onEdgesChange: (changes) => set((state) => ({ 
    edges: applyEdgeChanges(changes, state.edges) 
  })),
  
  onConnect: (connection) => set((state) => ({ 
    edges: addEdge({ ...connection, animated: true, style: { stroke: '#8B92A8' } }, state.edges) 
  })),

  toggleViewMode: () => set((state) => ({ 
    viewMode: state.viewMode === 'chat-only' ? 'split-view' : 'chat-only' 
  })),

  setTab: (activeTab) => set({ activeTab }),
  
  toggleCollapse: () => set((state) => ({ 
    rightPanelCollapsed: !state.rightPanelCollapsed 
  })),

  startSimulation: async (prompt) => {
    const state = get();
    state.addMessage({ role: 'user', content: prompt });
    set({ isGenerating: true });

    // 1. Simulate "thinking" delay and switch view
    setTimeout(() => {
       if (get().viewMode === 'chat-only') {
           set({ viewMode: 'split-view' });
       }
    }, 800);

    // 2. Generate response text
    setTimeout(() => {
        const responseText = `I've designed a Cardano workflow for you based on "${prompt}".\n\nIt includes:\n- **Wallet Connection** (Nami)\n- **Logic Execution**\n- **Completion Notification**\n\nYou can configure the specific parameters in the workflow panel.`;
        
        state.addMessage({ role: 'assistant', content: responseText });
        
        // 3. Generate Workflow Nodes
        const { nodes, edges } = generateMockWorkflow(prompt);
        
        // Add nodes incrementally for effect
        set({ nodes: [], edges: [] });
        
        let i = 0;
        const interval = setInterval(() => {
            if (i >= nodes.length) {
                clearInterval(interval);
                set({ isGenerating: false, edges }); // Add edges at the end
                return;
            }
            const node = nodes[i];
            get().addNode(node);
            
            // Log creation
            set(s => ({ logs: [...s.logs, {
                id: nanoid(),
                timestamp: Date.now(),
                level: 'info',
                message: `Created node: ${node.data.label}`,
                nodeId: node.id
            }]}));

            i++;
        }, 600);

    }, 1500);
  },

  executeWorkflow: () => {
      const { nodes } = get();
      set({ activeTab: 'preview', logs: [] });
      
      let i = 0;
      
      const runNode = () => {
          if (i >= nodes.length) return;
          
          const node = nodes[i];
          // Set running
          get().updateNodeStatus(node.id, 'running');
          
          set(s => ({ logs: [...s.logs, {
              id: nanoid(),
              timestamp: Date.now(),
              level: 'info',
              message: `Executing ${node.data.label}...`,
              nodeId: node.id
          }]}));

          setTimeout(() => {
              // Set success
              get().updateNodeStatus(node.id, 'success');
              
              set(s => ({ logs: [...s.logs, {
                  id: nanoid(),
                  timestamp: Date.now(),
                  level: 'success',
                  message: `Successfully executed ${node.data.label}`,
                  nodeId: node.id
              }]}));

              i++;
              runNode();
          }, 1000);
      };

      runNode();
  }
}));