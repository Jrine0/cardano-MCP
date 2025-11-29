"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

type BuyNodeData = {
  amount?: number;
  asset?: string;
};

export default function BuyNode(props: NodeProps) {
  const data = props.data as BuyNodeData;

  return (
    <div
      className={cn(
        "min-w-40 max-w-[200px] p-4 rounded-2xl shadow-xl border",
        "bg-linear-to-br from-emerald to-emerald-foreground text-primary-foreground",
        "hover:scale-[1.02] transition-all duration-200 cursor-grab active:cursor-grabbing",
        "border-border backdrop-blur-sm",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-4! h-4! bg-white/20 border-0! rounded-full"
      />

      <div className="flex items-center gap-2 mb-3">
        <ShoppingCart className="w-5 h-5" />
        <div className="font-bold text-lg tracking-tight">Buy</div>
      </div>

      <div className="space-y-1 text-sm">
        <div className="font-mono text-xs">
          {data?.amount ?? 0} {data?.asset ?? ""}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4! h-4! bg-white/20 border-0! rounded-full"
        id="buy-out"
      />
    </div>
  );
}
