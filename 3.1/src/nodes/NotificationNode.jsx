import React from 'react';
import { Handle, Position } from '@xyflow/react';

const NotificationNode = ({ data }) => {
    return (
        <div className="notification-node">
            <Handle type="target" position={Position.Left} style={{ background: '#a855f7' }} />

            <div className="node-header">
                <div className="node-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <div className="node-title">Notification</div>
            </div>

            <div className="node-content">
                <div className="notification-channel">
                    <span className="channel-icon">📧</span>
                    <span className="channel">{data.channel}</span>
                </div>

                {data.to && (
                    <div className="notification-recipient">
                        → {data.to}
                    </div>
                )}

                {data.message && (
                    <div className="notification-message">
                        "{data.message}"
                    </div>
                )}

                <div className="node-type">{data.type}</div>
            </div>

            <Handle type="source" position={Position.Right} style={{ background: '#a855f7' }} />

            <style jsx>{`
        .notification-node {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          border: 2px solid #a855f7;
          border-radius: 12px;
          padding: 16px;
          min-width: 220px;
          box-shadow: 0 4px 20px rgba(168, 85, 247, 0.3);
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
        
        .notification-channel {
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
        
        .channel-icon {
          font-size: 18px;
        }
        
        .channel {
          font-weight: 700;
          text-transform: capitalize;
        }
        
        .notification-recipient {
          font-size: 13px;
          opacity: 0.95;
          font-weight: 500;
          padding-left: 4px;
        }
        
        .notification-message {
          background: rgba(255, 255, 255, 0.15);
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-style: italic;
          opacity: 0.9;
          line-height: 1.4;
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

export default NotificationNode;
