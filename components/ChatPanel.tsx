import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Send, Bot, User, Sparkles, StopCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ExampleCard = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-bg-secondary p-4 rounded-xl border border-border-subtle hover:border-accent-primary hover:translate-y-[-2px] transition-all text-left group w-full"
  >
    <p className="text-sm text-text-primary group-hover:text-accent-primary transition-colors">"{text}"</p>
  </button>
);

export const ChatPanel = () => {
  const { messages, addMessage, isGenerating, startSimulation, viewMode } = useStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    startSimulation(input);
    setInput('');
  };

  const handleExampleClick = (text: string) => {
    startSimulation(text);
  };

  const isExpanded = viewMode === 'chat-only';

  return (
    <div className="flex flex-col h-full bg-bg-primary relative overflow-hidden">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        
        {/* Welcome State */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center max-w-2xl mx-auto text-center animate-in fade-in duration-500">
            <div className="mb-8 relative">
              <div className="w-20 h-20 bg-accent-primary/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                <Bot size={40} className="text-accent-primary" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Cardano AI Agent Builder</h1>
              <p className="text-text-secondary">Describe your workflow in plain English. I'll build the blockchain logic for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <ExampleCard text="Swap 100 ADA to DJED on the best DEX" onClick={() => handleExampleClick("Swap 100 ADA to DJED on the best DEX")} />
              <ExampleCard text="Mint an NFT when a form is submitted" onClick={() => handleExampleClick("Mint an NFT when a form is submitted")} />
              <ExampleCard text="Monitor ADA price and stake automatically" onClick={() => handleExampleClick("Monitor ADA price and stake automatically")} />
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`
              max-w-[85%] rounded-2xl p-4 
              ${msg.role === 'user' 
                ? 'bg-accent-primary text-white rounded-br-none' 
                : 'bg-bg-secondary text-text-primary border border-border-subtle rounded-bl-none'}
            `}>
              <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                 {msg.role === 'assistant' ? <Bot size={12}/> : <User size={12}/>}
                 <span>{msg.role === 'assistant' ? 'Agent8' : 'You'}</span>
              </div>
              <div className="prose prose-invert prose-sm leading-relaxed">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isGenerating && (
           <div className="flex justify-start animate-in fade-in">
             <div className="bg-bg-secondary p-4 rounded-2xl rounded-bl-none border border-border-subtle flex items-center gap-2">
                <Sparkles size={16} className="text-accent-secondary animate-pulse" />
                <span className="text-sm text-text-secondary">Generating workflow...</span>
             </div>
           </div>
        )}
        
        {/* Spacer for sticky input */}
        <div className="h-4"></div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-bg-primary/80 backdrop-blur-md border-t border-border-subtle">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="w-full bg-bg-secondary text-text-primary pl-4 pr-12 py-4 rounded-xl border border-border-subtle focus:border-accent-primary focus:ring-1 focus:ring-accent-primary focus:outline-none transition-all shadow-lg placeholder:text-text-secondary/50"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() && !isGenerating}
            className={`
              absolute right-2 top-2 p-2 rounded-lg transition-colors
              ${isGenerating 
                ? 'bg-accent-error text-white hover:bg-red-600' 
                : 'bg-accent-primary text-white hover:bg-blue-600 disabled:bg-gray-700 disabled:opacity-50'}
            `}
          >
            {isGenerating ? <StopCircle size={20} /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};
