"use client";

import dynamic from "next/dynamic";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";

// dynamic import to avoid SSR issues for ConnectWalletList
const ConnectWalletList = dynamic(
  () =>
    import("@cardano-foundation/cardano-connect-with-wallet").then(
      (mod) => mod.ConnectWalletList,
    ),
  { ssr: false },
);

export default function WalletLoginButton() {
  const { isConnected, stakeAddress, connect, disconnect } = useCardano();

  const handleConnectEternl = () => {
    // name must match the wallet id exposed in window.cardano, e.g. 'eternl'
    connect("eternl", () => {
      console.log("Connected to Eternl");
    });
  };

  if (isConnected) {
    return (
      <div className="space-y-2">
        <p>Connected as: {stakeAddress}</p>
        <button
          className="rounded-full border px-4 py-2"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Generic list of wallets (includes Eternl if installed) */}
      <ConnectWalletList />
      {/* Or explicit Eternl button */}
      <button
        className="rounded-full bg-black px-4 py-2 text-white"
        onClick={handleConnectEternl}
      >
        Connect Eternl
      </button>
    </div>
  );
}
