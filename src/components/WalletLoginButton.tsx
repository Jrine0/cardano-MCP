"use client";

import { useRouter } from "next/navigation";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";
import { useState, useEffect } from "react";

export default function WalletLoginButton() {
  const { isConnected, stakeAddress, disconnect, connect } = useCardano();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await connect("eternl", () => {
        console.log("Connected to Eternl");
      });
      localStorage.setItem("walletLoggedIn", "true");
      router.push("/builders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      localStorage.setItem("walletLoggedIn", "true");
    }
  }, [isConnected]);

  if (isConnected) {
    return (
      <div className="space-y-2">
        <p>Connected as: {stakeAddress}</p>
        <button
          onClick={() => {
            localStorage.removeItem("walletLoggedIn");
            disconnect();
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? "Connecting..." : "Login with wallet"}
    </button>
  );
}
