import React, { useState, useCallback } from 'react';
import ChatInterface from './components/ChatInterface';
import JsonToReactFlowConverter from './JsonToReactFlowConverter';
import LLMService from './services/LLMService';

const ChatWorkflowBuilder = () => {
    const [messages, setMessages] = useState([]);
    const [workflowJSON, setWorkflowJSON] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [llmProvider, setLlmProvider] = useState('gemini'); // Change to your preferred provider

    const handleSendMessage = useCallback(async (userInput) => {
        // Add user message
        setMessages(prev => [...prev, {
            role: 'user',
            content: userInput
        }]);

        setIsLoading(true);

        try {
            // Call LLM service
            const llmService = new LLMService(llmProvider);
            const result = await llmService.generateWorkflow(userInput);

            if (result.success) {
                // Add AI response
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: result.message
                }]);

                // Update workflow canvas with generated JSON
                setWorkflowJSON(JSON.stringify(result.workflow, null, 2));
            } else {
                // Handle error
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `❌ ${result.message}\n\nPlease make sure you have set your API key in the .env file:\n\nVITE_${llmProvider.toUpperCase()}_API_KEY=your-api-key-here`
                }]);
            }
        } catch (error) {
            console.error('Error generating workflow:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Error: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [llmProvider]);

    return (
        <div className="app-container">
            <div className="split-layout">
                {/* Left Panel - Chat Interface */}
                <div className="chat-panel">
                    <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                </div>

                {/* Right Panel - Workflow Canvas */}
                <div className="canvas-panel">
                    {workflowJSON ? (
                        <JsonToReactFlowConverter initialJSON={workflowJSON} />
                    ) : (
                        <div className="canvas-empty-state">
                            <div className="empty-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <h2>Workflow Preview</h2>
                            <p>Your generated workflow will appear here</p>
                            <p className="hint">Start by describing your workflow in the chat →</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        .app-container {
          width: 100vw;
          height: 100vh;
          background: #0a0a0a;
          overflow: hidden;
        }

        .split-layout {
          display: flex;
          height: 100%;
        }

        .chat-panel {
          width: 450px;
          flex-shrink: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          background: #0a0a0a;
        }

        .canvas-panel {
          flex: 1;
          background: #0f0f0f;
          position: relative;
        }

        .canvas-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #e5e7eb;
          text-align: center;
          padding: 40px;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2));
          border: 2px solid rgba(168, 85, 247, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: #a855f7;
        }

        .canvas-empty-state h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #ffffff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .canvas-empty-state p {
          font-size: 16px;
          color: #9ca3af;
          margin: 0 0 8px 0;
        }

        .hint {
          font-size: 14px;
          color: #6b7280;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .split-layout {
            flex-direction: column;
          }

          .chat-panel {
            width: 100%;
            height: 50%;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .canvas-panel {
            height: 50%;
          }
        }
      `}</style>
        </div>
    );
};

export default ChatWorkflowBuilder;
