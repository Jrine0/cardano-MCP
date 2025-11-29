'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WalletLoginButton from '@/components/WalletLoginButton';
import { useCardano } from '@cardano-foundation/cardano-connect-with-wallet';

export default function LoginPage() {
  const router = useRouter();
  const { isConnected, stakeAddress } = useCardano();

  // If already connected, go to /builders
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('walletLoggedIn', 'true');
      router.replace('/builders');
    }
  }, [isConnected, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">Login with your wallet</h1>
        <p>Connect Eternl or another Cardano wallet to continue.</p>
        <WalletLoginButton />
        {isConnected && (
          <div className="mt-4 text-green-600 font-semibold">
            Connected as: {stakeAddress}
          </div>
        )}
      </div>
    </main>
  );
}
