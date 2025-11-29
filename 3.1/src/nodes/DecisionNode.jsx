import React from 'react';
import { Handle, Position } from '@xyflow/react';

const DecisionNode = ({ data }) => {
    return (
        <div className="decision-node">
            <Handle type="target" position={Position.Top} style={{ background: '#f59e0b' }} />

            <div className="node-header">
                <div className="node-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="node-title">Decision</div>
            </div>

            <div className="node-content">
                <div className="condition-display">
                    {data.condition}
                </div>

                {data.branches && (
                    <div className="branches-count">
                        {data.branches.length} branches
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} id="then" style={{ background: '#10b981', left: '30%' }} />
            <Handle type="source" position={Position.Bottom} id="else" style={{ background: '#ef4444', left: '70%' }} />

            <style jsx>{`
        .decision-node {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          border: 2px solid #f59e0b;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
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
          gap: 8px;
        }
        
        .condition-display {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .branches-count {
          font-size: 12px;
          opacity: 0.9;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
};

export default DecisionNode;
