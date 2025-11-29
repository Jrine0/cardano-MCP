import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, BackgroundVariant, addEdge, Connection } from '@xyflow/react';
import { useStore } from '../store';
import { WalletNode, DEXNode, NFTNode, EmailNode } from './CustomNodes';

export const WorkflowPanel = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();

  const nodeTypes = useMemo(() => ({
    wallet: WalletNode,
    dex: DEXNode,
    nft: NFTNode,
    email: EmailNode
  }), []);

  return (
    <div className="h-full w-full bg-bg-primary">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params: Connection) => onConnect(params)}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#0A0E14]"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1} 
          color="#2D3548" 
        />
        <Controls 
          className="!bg-bg-secondary !border-border-subtle [&>button]:!fill-text-secondary [&>button]:!border-border-subtle hover:[&>button]:!bg-bg-tertiary" 
        />
      </ReactFlow>
    </div>
  );
};