import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Wallet, 
  ArrowRightLeft, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Coins, 
  FileCode,
  ChevronDown,
  Copy,
  ExternalLink
} from 'lucide-react';
import { WalletNodeData, DEXNodeData, NFTNodeData, StakingNodeData, SmartContractNodeData } from '../types';
import { useStore } from '../store';

// --- Shared Components ---

const StatusIndicator = ({ status }: { status?: string }) => {
  if (status === 'running') return <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />;
  if (status === 'success') return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
  if (status === 'error') return <AlertCircle className="w-3.5 h-3.5 text-destructive" />;
  return <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />;
};

interface NodeContainerProps {
  children: React.ReactNode;
  selected?: boolean;
  headerColor: string;
  icon: any;
  title: string;
  status?: string;
}

const NodeContainer = ({ 
  children, 
  selected, 
  headerColor, 
  icon: Icon, 
  title, 
  status 
}: NodeContainerProps) => {
  return (
    <div className={`
      relative bg-card rounded-xl border shadow-sm transition-all duration-300 group
      ${selected ? 'border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/5' : 'border-border'}
      hover:shadow-md hover:border-primary/30 min-w-[260px]
    `}>
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/50 flex justify-between items-center bg-muted/20 rounded-t-xl backdrop-blur-sm">
        <div className={`flex items-center gap-2 ${headerColor}`}>
          <Icon size={14} className="stroke-[2.5px]" />
          <span className="font-semibold text-xs tracking-wide">{title}</span>
        </div>
        <StatusIndicator status={status} />
      </div>
      
      {/* Content */}
      <div className="p-3.5 space-y-3">
        {children}
      </div>
    </div>
  );
};

interface LabelProps {
  children: React.ReactNode;
}

const Label = ({ children }: LabelProps) => (
  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5 ml-0.5">
    {children}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className="nodrag w-full bg-background/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50 hover:bg-background"
    {...props}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select 
      className="nodrag w-full appearance-none bg-background/50 border border-input rounded-md px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all hover:bg-background cursor-pointer"
      {...props}
    />
    <ChevronDown className="absolute right-2.5 top-2 pointer-events-none text-muted-foreground" size={12} />
  </div>
);

// --- Node Implementations ---

export const WalletNode = memo(({ id, data, selected }: NodeProps<WalletNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <NodeContainer 
        selected={selected} 
        headerColor="text-purple-500" 
        icon={Wallet} 
        title="Cardano Wallet" 
        status={data.status}
      >
        <div>
           <Label>Wallet Provider</Label>
           <Select
              value={data.walletProvider || 'nami'}
              onChange={(e) => updateNodeData(id, { walletProvider: e.target.value })}
           >
               <option value="nami">Nami</option>
               <option value="eternl">Eternl</option>
               <option value="lace">Lace</option>
               <option value="gerowallet">GeroWallet</option>
           </Select>
        </div>

        <div>
           <Label>Connected Address</Label>
           <div className="relative">
             <Input 
                value={data.address || ''}
                readOnly
                placeholder="Not connected"
                className="!pr-7 font-mono text-[10px]"
             />
             <Copy size={10} className="absolute right-2 top-2.5 text-muted-foreground cursor-pointer hover:text-foreground" />
           </div>
        </div>

        {/* Connect Button Simulation */}
        {!data.isConnected ? (
          <button 
            onClick={() => updateNodeData(id, { isConnected: true, address: 'addr1...8x92', balance: '1,450.00 ₳' })}
            className="w-full mt-1 py-1.5 rounded-md bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 text-xs font-medium border border-purple-500/20 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex justify-between items-center pt-2 border-t border-border/50">
             <span className="text-[10px] text-muted-foreground">Balance</span>
             <span className="font-mono text-sm font-bold text-foreground">{data.balance || '0 ₳'}</span>
          </div>
        )}
      </NodeContainer>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
    </>
  );
});

export const DEXNode = memo(({ id, data, selected }: NodeProps<DEXNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
      <NodeContainer 
        selected={selected} 
        headerColor="text-blue-500" 
        icon={ArrowRightLeft} 
        title="DEX Swap" 
        status={data.status}
      >
        <div>
            <Label>DEX Protocol</Label>
            <Select
                value={data.protocol || 'minswap'}
                onChange={(e) => updateNodeData(id, { protocol: e.target.value })}
            >
                <option value="minswap">Minswap</option>
                <option value="sundaeswap">SundaeSwap</option>
                <option value="genius">Genius Yield</option>
                <option value="wingriders">WingRiders</option>
            </Select>
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
            <div>
               <Label>Sell (ADA)</Label>
               <Input 
                 type="number"
                 value={data.amount || ''}
                 onChange={(e) => updateNodeData(id, { amount: e.target.value })}
                 placeholder="0.00"
               />
            </div>
            <div className="pb-2 text-muted-foreground">
               <ArrowRightLeft size={14} />
            </div>
            <div>
               <Label>Buy</Label>
               <Input 
                 value={(data.pair || '').split('/')[1] || 'TOKEN'}
                 onChange={(e) => updateNodeData(id, { pair: `ADA/${e.target.value.toUpperCase()}` })}
                 placeholder="TOKEN"
               />
            </div>
        </div>

        <div className="flex justify-between items-center pt-1">
             <span className="text-[10px] text-muted-foreground">Slippage Tolerance</span>
             <span className="text-[10px] font-mono bg-secondary/50 px-1.5 py-0.5 rounded text-foreground">
                {data.slippage || '1.0'}%
             </span>
        </div>
      </NodeContainer>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
    </>
  );
});

export const NFTNode = memo(({ id, data, selected }: NodeProps<NFTNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-pink-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
      <NodeContainer 
        selected={selected} 
        headerColor="text-pink-500" 
        icon={ImageIcon} 
        title="Mint NFT" 
        status={data.status}
      >
        <div className="flex gap-3">
             <div className="w-16 h-16 bg-muted/30 rounded-lg flex items-center justify-center border border-border/50 overflow-hidden shrink-0 group-hover:border-pink-500/30 transition-colors relative">
                 {data.imageUrl ? (
                     <img src={data.imageUrl} alt="NFT" className="w-full h-full object-cover" />
                 ) : (
                     <img src={`https://picsum.photos/seed/${id}/200`} alt="NFT" className="w-full h-full object-cover opacity-80" />
                 )}
             </div>
             <div className="flex-1 space-y-2">
                 <div>
                    <Label>Asset Name</Label>
                    <Input 
                        value={data.assetName || ''}
                        onChange={(e) => updateNodeData(id, { assetName: e.target.value })}
                        placeholder="MyNFT #001"
                    />
                 </div>
             </div>
        </div>
        
        <div>
            <Label>Policy ID (Auto)</Label>
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground bg-secondary/30 px-2 py-1.5 rounded border border-border/30">
                <span className="truncate">a029...9281</span>
                <ExternalLink size={10} className="ml-auto shrink-0" />
            </div>
        </div>
      </NodeContainer>
      <Handle type="source" position={Position.Bottom} className="!bg-pink-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
    </>
  );
});

export const StakingNode = memo(({ id, data, selected }: NodeProps<StakingNodeData>) => {
    const updateNodeData = useStore((state) => state.updateNodeData);
  
    return (
      <>
        <Handle type="target" position={Position.Top} className="!bg-orange-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
        <NodeContainer 
          selected={selected} 
          headerColor="text-orange-500" 
          icon={Coins} 
          title="Stake ADA" 
          status={data.status}
        >
          <div>
              <Label>Stake Pool ID</Label>
              <Input 
                  value={data.poolId || ''}
                  onChange={(e) => updateNodeData(id, { poolId: e.target.value })}
                  placeholder="pool1..."
                  className="font-mono"
              />
          </div>
  
          <div>
              <Label>Amount to Delegate</Label>
              <Input 
                  type="number"
                  value={data.amount || ''}
                  onChange={(e) => updateNodeData(id, { amount: e.target.value })}
                  placeholder="All Available"
              />
          </div>

          <div className="flex justify-between items-center pt-1 px-1">
             <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] text-muted-foreground">Active</span>
             </div>
             <span className="text-xs font-bold text-orange-500">~{data.apy || '3.2'}% APY</span>
          </div>
        </NodeContainer>
        <Handle type="source" position={Position.Bottom} className="!bg-orange-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
      </>
    );
  });

export const SmartContractNode = memo(({ id, data, selected }: NodeProps<SmartContractNodeData>) => {
    const updateNodeData = useStore((state) => state.updateNodeData);
  
    return (
      <>
        <Handle type="target" position={Position.Top} className="!bg-cyan-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
        <NodeContainer 
          selected={selected} 
          headerColor="text-cyan-500" 
          icon={FileCode} 
          title="Smart Contract" 
          status={data.status}
        >
          <div>
              <Label>Contract Address</Label>
              <div className="flex gap-1">
                <Input 
                    value={data.contractAddress || ''}
                    onChange={(e) => updateNodeData(id, { contractAddress: e.target.value })}
                    placeholder="addr1_script..."
                    className="font-mono text-[10px]"
                />
              </div>
          </div>
  
          <div>
              <Label>Redeemer Function</Label>
              <Select
                  value={data.functionName || 'vesting'}
                  onChange={(e) => updateNodeData(id, { functionName: e.target.value })}
              >
                  <option value="vesting">Release Vesting</option>
                  <option value="marketplace">Buy Listing</option>
                  <option value="dao">Cast Vote</option>
                  <option value="custom">Custom Call</option>
              </Select>
          </div>
          
          <div className="pt-1">
            <Label>Datum (JSON)</Label>
            <textarea 
                className="nodrag w-full h-16 bg-background/50 border border-input rounded-md px-2.5 py-1.5 text-[10px] font-mono text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 resize-none hover:bg-background transition-colors"
                value={data.datum || '{\n  "constructor": 0,\n  "fields": []\n}'}
                onChange={(e) => updateNodeData(id, { datum: e.target.value })}
            />
          </div>
        </NodeContainer>
        <Handle type="source" position={Position.Bottom} className="!bg-cyan-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
      </>
    );
  });

export const EmailNode = memo(({ id, data, selected }: NodeProps<any>) => {
    return (
      <>
        <Handle type="target" position={Position.Top} className="!bg-green-500 !w-3 !h-3 !border-[3px] !border-background shadow-sm" />
        <NodeContainer 
          selected={selected} 
          headerColor="text-green-500" 
          icon={Mail} 
          title="Notification" 
          status={data.status}
        >
           <div className="text-xs text-muted-foreground leading-relaxed">
              Triggers an email notification to the registered user upon successful execution of the workflow.
           </div>
        </NodeContainer>
      </>
    );
  });
