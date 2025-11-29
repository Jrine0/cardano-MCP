import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Wallet, ArrowRightLeft, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import { WalletNodeData, DEXNodeData, NFTNodeData } from '../types';
import { useStore } from '../store';

const StatusIndicator = ({ status }: { status?: string }) => {
  if (status === 'running') return <Loader2 className="w-4 h-4 text-accent-primary animate-spin" />;
  if (status === 'success') return <CheckCircle className="w-4 h-4 text-accent-success" />;
  if (status === 'error') return <AlertCircle className="w-4 h-4 text-accent-error" />;
  return null;
};

// Common Input Style
const inputClass = "nodrag w-full bg-bg-primary/50 border border-transparent hover:border-border-subtle focus:border-accent-primary focus:bg-bg-primary rounded px-2 py-1 text-xs text-text-primary focus:outline-none transition-all";
const selectClass = "nodrag w-full bg-bg-primary/50 border border-transparent hover:border-border-subtle focus:border-accent-primary focus:bg-bg-primary rounded px-2 py-1 text-xs text-text-primary focus:outline-none transition-all appearance-none cursor-pointer";

// --- Wallet Node ---
export const WalletNode = memo(({ id, data, selected }: NodeProps<WalletNodeData>) => {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <>
      <Handle type="source" position={Position.Bottom} className="!bg-accent-secondary !w-3 !h-3" />
      <div className={`
        relative min-w-[240px] bg-bg-secondary rounded-xl border-2 transition-all duration-300
        ${selected 
            ? 'border-accent-primary ring-2 ring-accent-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-[1.02]' 
            : 'border-border-subtle hover:border-text-secondary'}
      `}>
         <div className="px-4 py-3 border-b border-border-subtle flex justify-between items-center bg-accent-secondary/10 rounded-t-xl">
            <div className="flex items-center gap-2 text-accent-secondary">
                <Wallet size={16} />
                <span className="font-semibold text-sm">Wallet</span>
            </div>
            <StatusIndicator status={data.status} />
         </div>
         <div className="p-4 space-y-3">
            <div>
                 <label className="text-[10px] text-text-secondary uppercase tracking-wider block mb-1">Provider</label>
                 <select 
                    className={selectClass}
                    value={data.walletProvider || 'nami'}
                    onChange={(e) => updateNodeData(id, { walletProvider: e.target.value })}
                 >
                     <option value="nami">Nami</option>
                     <option value="eternl">Eternl</option>
                     <option value="lace">Lace</option>
                 </select>
            </div>
            
            <div>
                 <label className="text-[10px] text-text-secondary uppercase tracking-wider block mb-1">Address</label>
                 <div className="bg-bg-primary/30 p-1 rounded flex items-center justify-between border border-border-subtle">
                    <input 
                        className="bg-transparent text-xs font-mono text-text-primary w-full focus:outline-none px-1"
                        value={data.address || ''}
                        onChange={(e) => updateNodeData(id, { address: e.target.value })}
                        placeholder="addr1..."
                    />
                    <span className={`w-2 h-2 rounded-full shrink-0 ml-2 ${data.address ? 'bg-accent-success' : 'bg-gray-600'}`}></span>
                 </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border-subtle/50">
                <span className="text-xs text-text-secondary">Balance</span>
                <span className="font-mono text-accent-primary font-bold">{data.balance || '0 ₳'}</span>
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
      <Handle type="target" position={Position.Top} className="!bg-accent-primary !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-accent-primary !w-3 !h-3" />
      <div className={`
        relative min-w-[260px] bg-bg-secondary rounded-xl border-2 transition-all duration-300
        ${selected 
            ? 'border-accent-primary ring-2 ring-accent-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-[1.02]' 
            : 'border-border-subtle'}
      `}>
         <div className="px-4 py-3 border-b border-border-subtle flex justify-between items-center bg-accent-primary/10 rounded-t-xl">
            <div className="flex items-center gap-2 text-accent-primary">
                <ArrowRightLeft size={16} />
                <span className="font-semibold text-sm">Swap</span>
            </div>
            <StatusIndicator status={data.status} />
         </div>
         <div className="p-4 space-y-3">
            <div>
                <label className="text-[10px] text-text-secondary uppercase tracking-wider block mb-1">Protocol</label>
                <select 
                    className={selectClass}
                    value={data.protocol || 'minswap'}
                    onChange={(e) => updateNodeData(id, { protocol: e.target.value })}
                >
                    <option value="minswap">Minswap</option>
                    <option value="sundaeswap">SundaeSwap</option>
                    <option value="genius">Genius Yield</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-bg-primary/30 p-2 rounded border border-border-subtle">
                    <div className="text-[10px] text-text-secondary mb-1">From</div>
                    <div className="font-bold text-sm">ADA</div>
                </div>
                <div className="bg-bg-primary/30 p-2 rounded border border-border-subtle">
                    <div className="text-[10px] text-text-secondary mb-1">To</div>
                    <input 
                        className="bg-transparent font-bold text-sm w-full focus:outline-none text-text-primary"
                        value={(data.pair || '').split('/')[1] || 'DJED'}
                        onChange={(e) => updateNodeData(id, { pair: `ADA/${e.target.value.toUpperCase()}` })}
                        placeholder="TOKEN"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                    <span>Amount:</span>
                    <input 
                        className="nodrag bg-bg-primary/50 w-20 rounded px-1 py-0.5 text-text-primary border border-transparent focus:border-accent-primary focus:outline-none"
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
      <Handle type="target" position={Position.Top} className="!bg-pink-500 !w-3 !h-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-pink-500 !w-3 !h-3" />
       <div className={`
        relative min-w-[240px] bg-bg-secondary rounded-xl border-2 transition-all duration-300
        ${selected 
            ? 'border-accent-primary ring-2 ring-accent-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-[1.02]' 
            : 'border-border-subtle'}
      `}>
         <div className="px-4 py-3 border-b border-border-subtle flex justify-between items-center bg-pink-500/10 rounded-t-xl">
            <div className="flex items-center gap-2 text-pink-500">
                <ImageIcon size={16} />
                <span className="font-semibold text-sm">Mint NFT</span>
            </div>
            <StatusIndicator status={data.status} />
         </div>
         <div className="p-4 flex flex-col gap-3">
            <div className="flex gap-3">
                <div className="w-16 h-16 bg-bg-tertiary rounded-lg flex items-center justify-center border border-border-subtle overflow-hidden shrink-0 group relative">
                    <img src={`https://picsum.photos/seed/${id}/200`} alt="NFT" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon size={12} />
                    </div>
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-text-secondary uppercase tracking-wider block">Collection Name</label>
                    <input 
                        className={inputClass}
                        value={data.collectionName || ''}
                        onChange={(e) => updateNodeData(id, { collectionName: e.target.value })}
                        placeholder="Collection Name"
                    />
                </div>
            </div>
            <div className="text-xs text-text-secondary bg-bg-primary/20 p-2 rounded">
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
        <Handle type="target" position={Position.Top} className="!bg-accent-success !w-3 !h-3" />
         <div className={`
          relative min-w-[200px] bg-bg-secondary rounded-xl border-2 transition-all duration-300
          ${selected 
            ? 'border-accent-primary ring-2 ring-accent-primary/20 shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-[1.02]' 
            : 'border-border-subtle'}
        `}>
           <div className="px-4 py-3 border-b border-border-subtle flex justify-between items-center bg-accent-success/10 rounded-t-xl">
              <div className="flex items-center gap-2 text-accent-success">
                  <Mail size={16} />
                  <span className="font-semibold text-sm">Notify</span>
              </div>
              <StatusIndicator status={data.status} />
           </div>
           <div className="p-4 text-xs text-text-secondary">
              Sends email upon completion.
           </div>
        </div>
      </>
    );
  });