export type NodeType =
  | "buy"
  | "sell"
  | "condition"
  | "wait"
  | "limit"
  | "alert";

export interface TradingNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    amount?: number;
    asset?: string;
    condition?: string;
    operator?: string;
    value?: number;
    duration?: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  nodes: TradingNode[];
  edges: Edge[];
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}
