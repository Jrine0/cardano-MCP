import { Node, Edge } from '@xyflow/react';

export type ViewMode = 'chat-only' | 'split-view';
export type Tab = 'workflow' | 'preview';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  nodeId?: string;
}

// Custom Node Data Interfaces
export interface BaseNodeData extends Record<string, unknown> {
  label?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
}

export interface WalletNodeData extends BaseNodeData {
  address?: string;
  balance?: string;
  walletProvider?: 'nami' | 'eternl' | 'lace';
  isConnected?: boolean;
}

export interface DEXNodeData extends BaseNodeData {
  protocol: 'minswap' | 'sundaeswap' | 'genius';
  pair: string;
  amount: string;
  slippage?: string;
}

export interface NFTNodeData extends BaseNodeData {
  collectionName: string;
  assetName?: string;
  imageUrl?: string;
  metadata?: string;
}

export interface StakingNodeData extends BaseNodeData {
  poolId?: string;
  amount?: string;
  apy?: string;
}

export interface SmartContractNodeData extends BaseNodeData {
  contractAddress?: string;
  functionName?: string;
  datum?: string;
}

// Extend React Flow Node
export type AppNode = Node<
  | BaseNodeData 
  | WalletNodeData 
  | DEXNodeData 
  | NFTNodeData 
  | StakingNodeData 
  | SmartContractNodeData
>;

export interface AppSettings {
  openaiKey: string;
  perplexityKey: string;
  cardanoRpcUrl: string;
}

export interface AppState {
  viewMode: ViewMode;
  rightPanelCollapsed: boolean;
  activeTab: Tab;
  messages: Message[];
  nodes: AppNode[];
  edges: Edge[];
  logs: LogEntry[];
  isGenerating: boolean;
  isSettingsOpen: boolean;
  settings: AppSettings;
  
  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setNodes: (nodes: AppNode[]) => void;
  addNode: (node: AppNode) => void;
  updateNodeStatus: (nodeId: string, status: BaseNodeData['status']) => void;
  updateNodeData: (nodeId: string, data: Record<string, any>) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  toggleViewMode: () => void;
  setTab: (tab: Tab) => void;
  toggleCollapse: () => void;
  startSimulation: (prompt: string) => void;
  executeWorkflow: () => void;
  toggleSettings: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}