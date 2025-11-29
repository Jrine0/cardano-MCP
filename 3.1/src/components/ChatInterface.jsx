import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const examplePrompts = [
        "Make me an NFT minter on Solana",
        "Alert me when BTC hits $50k",
        "Buy 10 SOL with 5x leverage when price > $150",
        "Create a daily portfolio summary bot"
    ];

    const handleExampleClick = (prompt) => {
        if (!isLoading) {
            onSendMessage(prompt);
        }
    };

    return (
        <div className="chat-interface">
            {/* Header */}
            <div className="chat-header">
                <div className="header-content">
                    <h1 className="chat-title">Workflow Builder AI</h1>
                    <p className="chat-subtitle">Describe your workflow in plain English</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3>Get Started</h3>
                        <p>Try one of these examples or type your own:</p>

                        <div className="example-prompts">
                            {examplePrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    className="example-prompt"
                                    onClick={() => handleExampleClick(prompt)}
                                    disabled={isLoading}
                                >
                                    <span className="prompt-icon">✨</span>
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                            >
                                <div className="message-avatar">
                                    {message.role === 'user' ? (
                                        <div className="avatar user-avatar">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="avatar ai-avatar">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="message-content">
                                    <div className="message-text">
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="message ai-message">
                                <div className="message-avatar">
                                    <div className="avatar ai-avatar">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="chat-input-container">
                <form onSubmit={handleSubmit} className="chat-input-form">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your workflow... (e.g., 'Make me a trading bot')"
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="send-button"
                        disabled={!input.trim() || isLoading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>

            <style jsx>{`
        .chat-interface {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0a0a0a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .chat-header {
          padding: 24px 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
        }

        .chat-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #ffffff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .chat-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #e5e7eb;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: white;
        }

        .empty-state h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          font-size: 14px;
          color: #9ca3af;
          margin: 0 0 32px 0;
        }

        .example-prompts {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 500px;
          width: 100%;
        }

        .example-prompt {
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }

        .example-prompt:hover:not(:disabled) {
          background: rgba(168, 85, 247, 0.1);
          border-color: #a855f7;
          transform: translateY(-2px);
        }

        .example-prompt:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .prompt-icon {
          font-size: 18px;
        }

        .message {
          display: flex;
          gap: 12px;
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-avatar {
          background: linear-gradient(135deg, #a855f7, #ec4899);
        }

        .ai-avatar {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }

        .message-content {
          flex: 1;
          min-width: 0;
        }

        .message-text {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .user-message .message-text {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          color: white;
          border-radius: 18px 18px 4px 18px;
        }

        .ai-message .message-text {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e5e7eb;
          border-radius: 18px 18px 18px 4px;
        }

        .typing-indicator {
          display: flex;
          gap: 6px;
          padding: 12px 16px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a855f7;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .chat-input-container {
          padding: 24px 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: #0a0a0a;
        }

        .chat-input-form {
          display: flex;
          gap: 12px;
          max-width: 100%;
        }

        .chat-input {
          flex: 1;
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #e5e7eb;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .chat-input:focus {
          outline: none;
          border-color: #a855f7;
          background: rgba(255, 255, 255, 0.08);
        }

        .chat-input::placeholder {
          color: #6b7280;
        }

        .chat-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-button {
          padding: 14px 20px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default ChatInterface;
