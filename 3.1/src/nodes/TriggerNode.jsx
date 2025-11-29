import React from 'react';
import { Handle, Position } from '@xyflow/react';

const TriggerNode = ({ data }) => {
    return (
        <div className="trigger-node">
            <Handle type="target" position={Position.Left} style={{ background: '#06b6d4' }} />

            <div className="node-header">
                <div className="node-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div className="node-title">Trigger</div>
            </div>

            <div className="node-content">
                <div className="condition-badge">
                    <span className="asset">{data.asset}</span>
                    <span className="operator">{data.operator}</span>
                    <span className="value">{data.value}</span>
                </div>
                <div className="node-type">{data.type}</div>
            </div>

            <Handle type="source" position={Position.Right} style={{ background: '#06b6d4' }} />

            <style jsx>{`
        .trigger-node {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          border: 2px solid #06b6d4;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
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
        
        .condition-badge {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 15px;
        }
        
        .asset {
          font-weight: 800;
        }
        
        .operator {
          font-weight: 700;
          font-size: 16px;
        }
        
        .value {
          font-weight: 800;
        }
        
        .node-type {
          font-size: 11px;
          opacity: 0.9;
          font-weight: 500;
        }
      `}</style>
        </div>
    );
};

export default TriggerNode;
