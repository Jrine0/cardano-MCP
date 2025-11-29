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
}

export interface DEXNodeData extends BaseNodeData {
  protocol: 'minswap' | 'sundaeswap' | 'genius';
  pair: string;
  amount: string;
}

export interface NFTNodeData extends BaseNodeData {
  collectionName: string;
  imageUrl?: string;
}

// Extend React Flow Node
export type AppNode = Node<BaseNodeData | WalletNodeData | DEXNodeData | NFTNodeData>;

export interface AppState {
  viewMode: ViewMode;
  rightPanelCollapsed: boolean;
  activeTab: Tab;
  messages: Message[];
  nodes: AppNode[];
  edges: Edge[];
  logs: LogEntry[];
  isGenerating: boolean;
  
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
}