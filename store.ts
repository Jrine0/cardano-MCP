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
  const p = prompt.toLowerCase();

  // 1. Always start with a wallet
  const walletId = 'node-wallet-1';
  nodes.push({
    id: walletId,
    type: 'wallet',
    position: { x: centerX - 140, y: currentY },
    data: { 
        label: 'Cardano Wallet', 
        status: 'idle', 
        walletProvider: 'nami', 
        balance: '1,450 ₳', 
        address: 'addr1...8x92',
        isConnected: false 
    },
  });
  currentY += 180;
  let lastId = walletId;

  // 2. Logic based on keywords
  
  // -- DEX / SWAP --
  if (p.includes('swap') || p.includes('dex') || p.includes('trade')) {
    const dexId = `node-dex-${nanoid()}`;
    nodes.push({
      id: dexId,
      type: 'dex',
      position: { x: centerX, y: currentY },
      data: { label: 'DEX Swap', status: 'idle', protocol: 'minswap', pair: 'ADA/DJED', amount: '100', slippage: '0.5' },
    });
    edges.push({ id: `e-${lastId}-${dexId}`, source: lastId, target: dexId, animated: true, style: { stroke: '#3B82F6', strokeWidth: 2 } });
    lastId = dexId;
    currentY += 180;
  }

  // -- NFT / MINT --
  if (p.includes('nft') || p.includes('mint') || p.includes('collection')) {
    const nftId = `node-nft-${nanoid()}`;
    nodes.push({
      id: nftId,
      type: 'nft',
      position: { x: centerX, y: currentY },
      data: { label: 'Mint Collection', status: 'idle', collectionName: 'Agent8 Genesis', assetName: 'Agent #001' },
    });
    edges.push({ id: `e-${lastId}-${nftId}`, source: lastId, target: nftId, animated: true, style: { stroke: '#EC4899', strokeWidth: 2 } });
    lastId = nftId;
    currentY += 180;
  }
  
  // -- STAKING --
  if (p.includes('stake') || p.includes('staking') || p.includes('delegate') || p.includes('pool')) {
    const stakeId = `node-stake-${nanoid()}`;
    nodes.push({
      id: stakeId,
      type: 'staking',
      position: { x: centerX, y: currentY },
      data: { label: 'Stake ADA', status: 'idle', poolId: 'pool189...xyz', amount: '1000', apy: '3.5' },
    });
    edges.push({ id: `e-${lastId}-${stakeId}`, source: lastId, target: stakeId, animated: true, style: { stroke: '#F97316', strokeWidth: 2 } });
    lastId = stakeId;
    currentY += 180;
  }
  
  // -- SMART CONTRACT --
  if (p.includes('contract') || p.includes('script') || p.includes('vesting') || p.includes('dao')) {
    const contractId = `node-contract-${nanoid()}`;
    nodes.push({
      id: contractId,
      type: 'contract',
      position: { x: centerX, y: currentY },
      data: { label: 'Smart Contract', status: 'idle', contractAddress: 'addr1_script...', functionName: 'vesting' },
    });
    edges.push({ id: `e-${lastId}-${contractId}`, source: lastId, target: contractId, animated: true, style: { stroke: '#06B6D4', strokeWidth: 2 } });
    lastId = contractId;
    currentY += 180;
  }
  
  // 3. Terminator Node (Email/Notification)
  // Only add if not too simple, or if specifically requested, or default.
  const emailId = 'node-email-1';
  nodes.push({
      id: emailId,
      type: 'email',
      position: { x: centerX, y: currentY },
      data: { label: 'Notify User', status: 'idle' }
  });
  edges.push({ id: `e-${lastId}-${emailId}`, source: lastId, target: emailId, animated: true, style: { stroke: '#10B981', strokeWidth: 2 } });

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
  isSettingsOpen: false,
  settings: {
    openaiKey: '',
    perplexityKey: '',
    cardanoRpcUrl: 'https://cardano-mainnet.blockfrost.io/api/v0',
  },

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
    edges: addEdge({ ...connection, animated: true, style: { stroke: '#8B92A8', strokeWidth: 2 } }, state.edges) 
  })),

  toggleViewMode: () => set((state) => ({ 
    viewMode: state.viewMode === 'chat-only' ? 'split-view' : 'chat-only' 
  })),

  setTab: (activeTab) => set({ activeTab }),
  
  toggleCollapse: () => set((state) => ({ 
    rightPanelCollapsed: !state.rightPanelCollapsed 
  })),
  
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),

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
        let responseText = `I've designed a Cardano workflow for you based on "${prompt}".\n\n`;
        const p = prompt.toLowerCase();
        
        if (p.includes('swap')) responseText += `- **DEX Swap** (Minswap)\n`;
        if (p.includes('nft')) responseText += `- **NFT Minting** (CIP-25)\n`;
        if (p.includes('stake')) responseText += `- **Staking Delegation**\n`;
        if (p.includes('contract')) responseText += `- **Smart Contract Interaction**\n`;
        
        responseText += `- **Notification**\n\nYou can configure the specific parameters in the workflow panel.`;
        
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
        }, 500);

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