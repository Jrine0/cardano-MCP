import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ActionNode = ({ data }) => {
    const isLong = data.side === 'long';
    const isShort = data.side === 'short';

    const getGradient = () => {
        if (isLong) return 'linear-gradient(135deg, #059669, #10b981)';
        if (isShort) return 'linear-gradient(135deg, #dc2626, #ef4444)';
        return 'linear-gradient(135deg, #7c3aed, #a855f7)';
    };

    const getBorderColor = () => {
        if (isLong) return '#10b981';
        if (isShort) return '#ef4444';
        return '#a855f7';
    };

    return (
        <div className="action-node" style={{ background: getGradient(), borderColor: getBorderColor() }}>
            <Handle type="target" position={Position.Left} style={{ background: getBorderColor() }} />

            <div className="node-header">
                <div className="node-icon">
                    {data.type === 'TradeAction' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <div className="node-title">
                    {data.type === 'TradeAction' ? 'Trade' : 'Action'}
                </div>
            </div>

            <div className="node-content">
                {data.side && (
                    <div className="trade-side">
                        {data.side.toUpperCase()}
                    </div>
                )}

                <div className="trade-details">
                    {data.asset && <span className="asset">{data.asset}</span>}
                    {data.amount && <span className="amount">×{data.amount}</span>}
                    {data.leverage && <span className="leverage">{data.leverage}x</span>}
                </div>

                <div className="node-type">{data.type}</div>
            </div>

            <Handle type="source" position={Position.Right} style={{ background: getBorderColor() }} />

            <style jsx>{`
        .action-node {
          border: 2px solid;
          border-radius: 12px;
          padding: 16px;
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
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
        
        .trade-side {
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 13px;
          text-align: center;
          letter-spacing: 1px;
        }
        
        .trade-details {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 15px;
        }
        
        .asset {
          font-weight: 800;
        }
        
        .amount {
          font-weight: 700;
          opacity: 0.95;
        }
        
        .leverage {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 800;
          font-size: 13px;
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

export default ActionNode;
