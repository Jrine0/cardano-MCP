import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Send, Bot, Sparkles, StopCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const ExampleCard = ({ text, onClick, index }: { text: string; onClick: () => void, index: number }) => (
  <motion.button 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    onClick={onClick}
    className="relative group overflow-hidden bg-secondary/30 hover:bg-secondary/60 p-4 rounded-xl border border-border/50 transition-all duration-300 text-left w-full hover:border-primary/30"
  >
    <div className="flex justify-between items-center">
        <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">{text}</p>
        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
    </div>
  </motion.button>
);

export const ChatPanel = () => {
  const { messages, isGenerating, startSimulation, viewMode } = useStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    startSimulation(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative w-full">
      
      {/* Background Grid Pattern (Only visible in chat-only mode for aesthetic) */}
      {viewMode === 'chat-only' && (
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6" ref={scrollRef}>
        
        {/* Welcome State */}
        {messages.length === 0 && (
          <div className={`h-full flex flex-col justify-center items-center mx-auto text-center z-10 relative ${viewMode === 'chat-only' ? 'max-w-2xl' : 'max-w-sm'}`}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center mb-4 mx-auto border border-border/50 shadow-inner">
                <Bot size={24} className="text-foreground/80" />
              </div>
              <h1 className={`${viewMode === 'chat-only' ? 'text-3xl md:text-4xl' : 'text-2xl'} font-bold text-foreground mb-3 tracking-tight`}>
                Cardano Agent
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
                Describe your workflow. AI builds the blockchain logic.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-2 w-full">
              <ExampleCard index={0} text="Swap 100 ADA to DJED" onClick={() => startSimulation("Swap 100 ADA to DJED")} />
              <ExampleCard index={1} text="Mint NFT on form submit" onClick={() => startSimulation("Mint NFT on form submit")} />
              <ExampleCard index={2} text="Staking trigger at $1" onClick={() => startSimulation("Staking trigger at $1")} />
            </div>
          </div>
        )}

        {/* Message List */}
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                relative max-w-[90%] rounded-2xl p-3.5 shadow-sm text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-br-sm' 
                  : 'bg-secondary/40 border border-border/50 text-foreground rounded-bl-sm'}
              `}>
                {/* AI Icon for assistant messages */}
                {msg.role === 'assistant' && (
                  <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center border border-border/50 hidden md:flex">
                    <Bot size={12} className="text-muted-foreground" />
                  </div>
                )}
                
                <div className="prose prose-invert prose-sm max-w-none break-words">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isGenerating && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             className="flex justify-start pl-0 md:pl-9"
           >
             <div className="bg-secondary/20 px-3 py-2 rounded-xl rounded-bl-none border border-border/30 flex items-center gap-2">
                <Sparkles size={14} className="text-primary animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Thinking...</span>
             </div>
           </motion.div>
        )}
        
        <div className="h-4"></div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/95 backdrop-blur border-t border-border z-20">
        <form onSubmit={handleSubmit} className={`relative mx-auto ${viewMode === 'chat-only' ? 'max-w-3xl' : 'w-full'}`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your workflow..."
            rows={1}
            className="w-full bg-secondary/30 text-foreground pl-4 pr-12 py-3.5 rounded-xl border border-border/50 focus:border-primary/50 focus:bg-secondary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all resize-none shadow-sm placeholder:text-muted-foreground/60 text-sm min-h-[46px] max-h-[120px]"
            disabled={isGenerating}
            style={{ minHeight: '46px' }} 
          />
          <button
            type="submit"
            disabled={!input.trim() && !isGenerating}
            className={`
              absolute right-2 top-2 p-1.5 rounded-lg transition-all duration-200
              ${isGenerating 
                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:shadow-none'}
            `}
          >
            {isGenerating ? <StopCircle size={16} /> : (input.trim() ? <ArrowRight size={16} /> : <CornerDownLeft size={16} className="opacity-50" />)}
          </button>
        </form>
        {viewMode === 'chat-only' && (
          <p className="text-center text-[10px] text-muted-foreground mt-2 opacity-40">
            Press Enter to send
          </p>
        )}
      </div>
    </div>
  );
};