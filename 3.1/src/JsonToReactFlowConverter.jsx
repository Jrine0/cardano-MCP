import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  MiniMap,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import NotificationNode from './nodes/NotificationNode';
import DecisionNode from './nodes/DecisionNode';
import LoopNode from './nodes/LoopNode';

// NEW: Production middleware pipeline
import { JSONAnalyzer, WorkflowTransformer, LayoutEngine } from './middleware';

const JsonToReactFlowConverter = ({ initialJSON = '', showUI = true }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [jsonInput, setJsonInput] = useState(initialJSON);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Register ALL custom node types
  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    tradeAction: ActionNode,
    notification: NotificationNode,
    decision: DecisionNode,
    loop: LoopNode,
    action: ActionNode, // Generic actions use ActionNode
  }), []);

  const convertJsonToNodes = useCallback((jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);

      console.log('🚀 NEW MIDDLEWARE PIPELINE: Starting conversion...');

      // STAGE 1: JSON ANALYZER - Deep structure analysis
      const analyzer = new JSONAnalyzer();
      const analysis = analyzer.analyze(parsed);

      console.log('📊 Analysis complete:', {
        flowType: analysis.flowType,
        complexity: analysis.complexity.score,
        nodeCount: analysis.metadata.nodeCount,
        patterns: {
          triggers: analysis.patterns.triggers.length,
          actions: analysis.patterns.actions.length,
          conditionals: analysis.patterns.conditionals.length,
          loops: analysis.patterns.loops.length
        }
      });

      // STAGE 2: WORKFLOW TRANSFORMER - Convert to standardized format
      const transformer = new WorkflowTransformer();
      const workflow = transformer.transform(analysis);

      console.log('🔄 Transformation complete:', {
        nodes: workflow.nodes.length,
        edges: workflow.edges.length,
        layout: workflow.layout
      });

      // STAGE 3: LAYOUT ENGINE - Automatic positioning with dagre
      const layoutEngine = new LayoutEngine('dagre');
      const positioned = layoutEngine.layout(workflow);

      console.log('✨ Layout complete:', {
        bounds: positioned.bounds,
        algorithm: 'dagre (NO HARDCODED POSITIONS!)'
      });

      // STAGE 4: RENDER - Set nodes and edges
      setNodes(positioned.nodes);
      setEdges(positioned.edges);

      setError('');
      console.log('✅ CONVERSION SUCCESS: Workflow rendered with automatic layout!');

    } catch (err) {
      console.error('❌ Conversion failed:', err);
      setError(`Conversion Error: ${err.message}`);

      // Show more detailed error info in console
      if (err.stack) {
        console.error('Stack trace:', err.stack);
      }
    }
  }, [setNodes, setEdges]);

  // Auto-convert initialJSON on mount or when it changes
  React.useEffect(() => {
    if (initialJSON) {
      setJsonInput(initialJSON);
      convertJsonToNodes(initialJSON);
    }
  }, [initialJSON, convertJsonToNodes]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setJsonInput(content);
        convertJsonToNodes(content);
      };
      reader.readAsText(file);
    } else {
      setError('Please upload a valid JSON file');
    }
  }, [convertJsonToNodes]);

  const handleJsonChange = useCallback((e) => {
    const value = e.target.value;
    setJsonInput(value);

    if (value.trim()) {
      convertJsonToNodes(value);
    }
  }, [convertJsonToNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setJsonInput(content);
        convertJsonToNodes(content);
      };
      reader.readAsText(file);
    }
  }, [convertJsonToNodes]);

  return (
    <div className="lovable-container">
      {/* Split Screen Layout */}
      <div className="lovable-split">

        {/* Left Panel - Editor */}
        <div className="lovable-editor">
          <div className="editor-header">
            <div className="header-content">
              <h1 className="editor-title">JSON to React Flow</h1>
              <p className="editor-subtitle">Convert your JSON to interactive flow diagrams instantly</p>
            </div>
          </div>

          <div className="editor-content">
            {/* File Upload Area */}
            <div
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon-wrapper">
                <svg
                  className="upload-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="upload-text">Drop your JSON file here or</p>
              <label className="upload-button">
                <span className="button-text">Browse Files</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* JSON Editor */}
            <div className="json-editor-container">
              <div className="editor-toolbar">
                <div className="toolbar-left">
                  <span className="toolbar-label">JSON Editor</span>
                </div>
                <div className="toolbar-right">
                  <span className="toolbar-hint">Live preview →</span>
                </div>
              </div>
              <textarea
                value={jsonInput}
                onChange={handleJsonChange}
                placeholder={`Paste your JSON here or try this example:\n\n[\n  {\n    "id": "1",\n    "label": "Start",\n    "position": {"x": 100, "y": 100},\n    "type": "input"\n  },\n  {\n    "id": "2",\n    "label": "Process",\n    "position": {"x": 300, "y": 100}\n  }\n]`}
                className="json-textarea"
                spellCheck="false"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="error-banner">
                <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lovable-preview">
          <div className="preview-header">
            <span className="preview-title">Live Preview</span>
            <div className="preview-stats">
              <span className="stat-badge">
                <span className="stat-number">{nodes.length}</span> nodes
              </span>
              <span className="stat-badge">
                <span className="stat-number">{edges.length}</span> edges
              </span>
            </div>
          </div>

          <div className="preview-canvas">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="react-flow-instance"
            >
              <Controls className="flow-controls" />
              <Background color="#333333" gap={16} />
              <MiniMap
                className="flow-minimap"
                nodeColor="#a855f7"
                maskColor="rgba(0, 0, 0, 0.2)"
              />
              <Panel position="top-left" className="flow-panel">
                <div className="panel-info">
                  {nodes.length === 0 ? (
                    <p className="empty-state">
                      <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Import JSON to visualize your flow
                    </p>
                  ) : (
                    <p className="success-state">
                      <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Flow rendered successfully
                    </p>
                  )}
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .lovable-container {
          width: 100vw;
          height: 100vh;
          background: #0a0a0a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #e5e7eb;
          overflow: hidden;
        }

        .lovable-split {
          display: grid;
          grid-template-columns: 45% 55%;
          height: 100%;
          gap: 0;
        }

        /* Left Editor Panel */
        .lovable-editor {
          background: #0a0a0a;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-header {
          padding: 32px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.02), transparent);
        }

        .header-content {
          max-width: 100%;
        }

        .editor-title {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .editor-subtitle {
          font-size: 16px;
          color: #9ca3af;
          margin: 0;
          font-weight: 400;
          line-height: 1.5;
        }

        .editor-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px 40px;
        }

        /* Custom Scrollbar */
        .editor-content::-webkit-scrollbar {
          width: 8px;
        }

        .editor-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .editor-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .editor-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Upload Area */
        .upload-area {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 48px 32px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.02);
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .upload-area::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(135deg, transparent, rgba(168, 85, 247, 0.2), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .upload-area:hover {
          border-color: rgba(168, 85, 247, 0.5);
          background: rgba(168, 85, 247, 0.05);
          transform: translateY(-2px);
        }

        .upload-area:hover::before {
          opacity: 1;
        }

        .upload-area.dragging {
          border-color: #a855f7;
          background: rgba(168, 85, 247, 0.1);
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
        }

        .upload-icon-wrapper {
          margin-bottom: 16px;
        }

        .upload-icon {
          width: 56px;
          height: 56px;
          color: #a855f7;
          margin: 0 auto;
          filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.3));
        }

        .upload-text {
          font-size: 16px;
          color: #9ca3af;
          margin: 0 0 20px 0;
          font-weight: 400;
        }

        .upload-button {
          display: inline-block;
          padding: 14px 32px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          color: white;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
          position: relative;
          overflow: hidden;
        }

        .upload-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ec4899, #a855f7);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(168, 85, 247, 0.6);
        }

        .upload-button:hover::before {
          opacity: 1;
        }

        .button-text {
          position: relative;
          z-index: 1;
        }

        .upload-button:active {
          transform: translateY(0);
        }

        /* JSON Editor */
        .json-editor-container {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(10px);
        }

        .editor-toolbar {
          background: rgba(255, 255, 255, 0.03);
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .toolbar-left,
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toolbar-label {
          font-size: 14px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .toolbar-hint {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .json-textarea {
          width: 100%;
          min-height: 400px;
          padding: 20px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.7;
          border: none;
          resize: vertical;
          background: rgba(0, 0, 0, 0.3);
          color: #e5e7eb;
          outline: none;
        }

        .json-textarea::placeholder {
          color: #6b7280;
          line-height: 1.7;
        }

        .json-textarea::-webkit-scrollbar {
          width: 8px;
        }

        .json-textarea::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .json-textarea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        /* Error Banner */
        .error-banner {
          margin-top: 20px;
          padding: 16px 20px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #fca5a5;
          backdrop-filter: blur(10px);
        }

        .error-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: #ef4444;
        }

        /* Right Preview Panel */
        .lovable-preview {
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .preview-header {
          padding: 32px 40px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-title {
          font-size: 16px;
          font-weight: 600;
          color: #e5e7eb;
        }

        .preview-stats {
          display: flex;
          gap: 12px;
        }

        .stat-badge {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          font-size: 14px;
          color: #9ca3af;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          transition: all 0.2s;
        }

        .stat-badge:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(168, 85, 247, 0.3);
        }

        .stat-number {
          color: #a855f7;
          font-weight: 700;
        }

        .preview-canvas {
          flex: 1;
          position: relative;
          background: #0a0a0a;
        }

        .react-flow-instance {
          background: #0a0a0a;
        }

        .flow-controls {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .flow-controls button {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          transition: all 0.2s;
        }

        .flow-controls button:hover {
          background: rgba(168, 85, 247, 0.1);
          color: #a855f7;
        }

        .flow-controls button:last-child {
          border-bottom: none;
        }

        .flow-minimap {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .flow-panel {
          background: rgba(255, 255, 255, 0.05);
          padding: 14px 20px;
          border-radius: 12px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .panel-info {
          font-size: 14px;
        }

        .panel-info p {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-icon,
        .success-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .empty-state {
          color: #6b7280;
          font-weight: 500;
        }

        .success-state {
          color: #10b981;
          font-weight: 600;
        }

        .success-icon {
          color: #10b981;
        }

        .info-icon {
          color: #6b7280;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .lovable-split {
            grid-template-columns: 1fr;
            grid-template-rows: 50% 50%;
          }

          .lovable-editor {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .editor-header,
          .preview-header {
            padding: 20px 24px;
          }

          .editor-content {
            padding: 20px 24px;
          }

          .editor-title {
            font-size: 24px;
          }

          .editor-subtitle {
            font-size: 14px;
          }

          .json-textarea {
            min-height: 250px;
          }

          .upload-area {
            padding: 32px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default JsonToReactFlowConverter;
