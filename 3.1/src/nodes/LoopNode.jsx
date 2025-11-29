import React from 'react';
import { Handle, Position } from '@xyflow/react';

const LoopNode = ({ data }) => {
    return (
        <div className="loop-node">
            <Handle type="target" position={Position.Left} style={{ background: '#8b5cf6' }} />

            <div className="node-header">
                <div className="node-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
                <div className="node-title">Loop</div>
            </div>

            <div className="node-content">
                <div className="loop-type">
                    {data.iterationType || 'forEach'}
                </div>

                {data.target && (
                    <div className="loop-target">
                        → {typeof data.target === 'string' ? data.target : 'items'}
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Right} style={{ background: '#8b5cf6' }} />

            <style jsx>{`
        .loop-node {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          border: 2px solid #8b5cf6;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
          color: white;
        }
        
        .node-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .node-icon {
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .node-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .node-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .loop-type {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .loop-target {
          font-size: 13px;
          opacity: 0.95;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
};

export default LoopNode;
