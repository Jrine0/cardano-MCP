import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Workflow, Wallet } from 'lucide-react';

interface StartScreenProps {
  onPromptSubmit: (prompt: string) => void;
}

const examplePrompts = [
  {
    icon: Zap,
    title: "Swap & Stake",
    description: "Swap 100 ADA for DJED and stake the rewards",
    prompt: "Swap 100 ADA for DJED on Minswap, then stake 500 ADA in a high-yield pool"
  },
  {
    icon: Sparkles,
    title: "Mint NFT Collection",
    description: "Create and mint a new NFT collection",
    prompt: "Mint an NFT collection called 'Cardano Legends' with 10 pieces"
  },
  {
    icon: Workflow,
    title: "DeFi Strategy",
    description: "Automated DeFi workflow with notifications",
    prompt: "Swap ADA to DJED, provide liquidity on Minswap, and notify me when complete"
  },
  {
    icon: Wallet,
    title: "Stake & Delegate",
    description: "Delegate ADA to stake pool",
    prompt: "Connect my wallet and delegate 1000 ADA to a stake pool with 4%+ APY"
  }
];

export const StartScreen: React.FC<StartScreenProps> = ({ onPromptSubmit }) => {
  const [inputValue, setInputValue] = React.useState('');
  const [isHovered, setIsHovered] = React.useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onPromptSubmit(inputValue);
      setInputValue('');
    }
  };

  const handleExampleClick = (prompt: string) => {
    onPromptSubmit(prompt);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-bg-secondary px-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              agent8
            </h1>
          </motion.div>
          
          <motion.p
            className="text-2xl text-foreground font-medium mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Build Cardano workflows with AI
          </motion.p>
          
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Describe what you want to do in plain English
          </motion.p>
        </motion.div>

        {/* Chat Input */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your Cardano workflow..."
              className="w-full px-6 py-5 bg-card border-2 border-border hover:border-primary/50 focus:border-primary rounded-2xl text-foreground placeholder-muted-foreground text-lg transition-all duration-200 outline-none shadow-lg shadow-black/5"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Generate
            </button>
          </div>
        </motion.form>

        {/* Example Prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-sm text-muted-foreground text-center mb-6">
            Or try one of these examples
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examplePrompts.map((example, index) => {
              const Icon = example.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => handleExampleClick(example.prompt)}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group relative text-left p-5 bg-card border border-border hover:border-primary/50 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isHovered === index
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                        : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 transition-colors duration-200 ${
                        isHovered === index ? 'text-white' : 'text-muted-foreground'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-foreground font-semibold mb-1 group-hover:text-primary transition-colors">
                        {example.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {example.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Free AI Model</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Real-time Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Visual Workflow Editor</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
