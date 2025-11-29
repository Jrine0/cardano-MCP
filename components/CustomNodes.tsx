import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Wallet, ArrowRightLeft, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import { WalletNodeData, DEXNodeData, NFTNodeData } from '../types';
import { useStore } from '../store';

const StatusIndicator = ({ status }: { status?: string }) => {
  if (status === 'running') return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
  if (status === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'error') return <AlertCircle className="w-4 h-4 text-destructive" />;
  return null;
};

// Common UI styles
const nodeBaseClass = "relative bg-card rounded-lg border shadow-sm transition-all duration-200";
const nodeSelectedClass = "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10";
const nodeHoverClass = "hover:border-primary/50";
const inputClass = "nodrag w-full bg-background border border-input rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all";

// --- Wallet Node ---
export const WalletNode = memo(({ id, data, selected }: NodeProps<WalletNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !w-3 !h-3 !border-2 !border-background" />
      <div className={`
        ${nodeBaseClass} min-w-[240px] 
        ${selected ? nodeSelectedClass : 'border-border'} ${nodeHoverClass}
      `}>
         <div className="px-3 py-2 border-b border-border flex justify-between items-center bg-muted/30 rounded-t-lg">
            <div className="flex items-center gap-2 text-purple-400">
                <Wallet size={14} />
                <span className="font-semibold text-xs uppercase tracking-wide">Wallet</span>
            </div>
            <StatusIndicator status={data.status} />
         </div>
         <div className="p-3 space-y-3">
            <div>
                 <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Provider</label>
                 <select 
                    className={inputClass}
                    value={data.walletProvider || 'nami'}
                    onChange={(e) => updateNodeData(id, { walletProvider: e.target.value })}
                 >
                     <option value="nami">Nami</option>
                     <option value="eternl">Eternl</option>
                     <option value="lace">Lace</option>
                 </select>
            </div>
            
            <div>
                 <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Address</label>
                 <div className="flex items-center gap-2">
                    <input 
                        className={inputClass}
                        value={data.address || ''}
                        onChange={(e) => updateNodeData(id, { address: e.target.value })}
                        placeholder="addr1..."
                    />
                 </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground">Balance</span>
                <span className="font-mono text-sm font-bold text-foreground">{data.balance || '0 ₳'}</span>
            </div>
         </div>
      </div>
    </>
  );
});

// --- DEX Swap Node ---
export const DEXNode = memo(({ id, data, selected }: NodeProps<DEXNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <div className={`
        ${nodeBaseClass} min-w-[260px] 
        ${selected ? nodeSelectedClass : 'border-border'} ${nodeHoverClass}
      `}>
         <div className="px-3 py-2 border-b border-border flex justify-between items-center bg-muted/30 rounded-t-lg">
            <div className="flex items-center gap-2 text-primary">
                <ArrowRightLeft size={14} />
                <span className="font-semibold text-xs uppercase tracking-wide">Swap</span>
            </div>
            <StatusIndicator status={data.status} />
         </div>
         <div className="p-3 space-y-3">
            <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Protocol</label>
                <select 
                    className={inputClass}
                    value={data.protocol || 'minswap'}
                    onChange={(e) => updateNodeData(id, { protocol: e.target.value })}
                >
                    <option value="minswap">Minswap</option>
                    <option value="sundaeswap">SundaeSwap</option>
                    <option value="genius">Genius Yield</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/50 p-2 rounded border border-border">
                    <div className="text-[10px] text-muted-foreground mb-1">From</div>
                    <div className="font-bold text-sm">ADA</div>
                </div>
                <div className="bg-secondary/50 p-2 rounded border border-border">
                    <div className="text-[10px] text-muted-foreground mb-1">To</div>
                    <input 
                        className="bg-transparent font-bold text-sm w-full focus:outline-none text-foreground placeholder:text-muted-foreground"
                        value={(data.pair || '').split('/')[1] || 'DJED'}
                        onChange={(e) => updateNodeData(id, { pair: `ADA/${e.target.value.toUpperCase()}` })}
                        placeholder="TOKEN"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span>Amt:</span>
                    <input 
                        className="nodrag bg-background w-16 rounded px-1 py-0.5 border border-input focus:ring-1 focus:ring-primary focus:outline-none text-foreground"
                        value={data.amount || 0}
                        onChange={(e) => updateNodeData(id, { amount: e.target.value })}
                        type="number"
                    />
                </div>
                <span>Slippage: 1%</span>
            </div>
         </div>
      </div>
    </>
  );
});

// --- NFT Node ---
export const NFTNode = memo(({ id, data, selected }: NodeProps<NFTNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-pink-500 !w-3 !h-3 !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-pink-500 !w-3 !h-3 !border-2 !border-background" />
       <div className={`
        ${nodeBaseClass} min-w-[240px] 
        ${selected ? nodeSelectedClass : 'border-border'} ${nodeHoverClass}
      `}>
         <div className="px-3 py-2 border-b border-border flex justify-between items-center bg-muted/30 rounded-t-lg">
            <div className="flex items-center gap-2 text-pink-500">
                <ImageIcon size={14} />
                <span className="font-semibold text-xs uppercase tracking-wide">Mint NFT</span>
            </div>
            <StatusIndicator status={data.status} />
         </div>
         <div className="p-3 flex flex-col gap-3">
            <div className="flex gap-3">
                <div className="w-14 h-14 bg-secondary rounded-md flex items-center justify-center border border-border overflow-hidden shrink-0">
                    <img src={`https://picsum.photos/seed/${id}/200`} alt="NFT" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider block">Collection</label>
                    <input 
                        className={inputClass}
                        value={data.collectionName || ''}
                        onChange={(e) => updateNodeData(id, { collectionName: e.target.value })}
                        placeholder="Name"
                    />
                </div>
            </div>
            <div className="text-[10px] text-muted-foreground bg-secondary/30 p-2 rounded border border-border">
                Metadata auto-generated from workflow context.
            </div>
         </div>
      </div>
    </>
  );
});

// --- Email/Notification Node ---
export const EmailNode = memo(({ id, data, selected }: NodeProps<any>) => {
    return (
      <>
        <Handle type="target" position={Position.Top} className="!bg-green-500 !w-3 !h-3 !border-2 !border-background" />
         <div className={`
          ${nodeBaseClass} min-w-[200px] 
          ${selected ? nodeSelectedClass : 'border-border'} ${nodeHoverClass}
        `}>
           <div className="px-3 py-2 border-b border-border flex justify-between items-center bg-muted/30 rounded-t-lg">
              <div className="flex items-center gap-2 text-green-500">
                  <Mail size={14} />
                  <span className="font-semibold text-xs uppercase tracking-wide">Notify</span>
              </div>
              <StatusIndicator status={data.status} />
           </div>
           <div className="p-3 text-xs text-muted-foreground">
              Sends email upon completion.
           </div>
        </div>
      </>
    );
  });