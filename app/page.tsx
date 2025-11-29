"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Welcome to WalletInit</h1>
        <p>Connect your Cardano wallet and start building.</p>

        <button
          className="rounded-full bg-black px-6 py-2 text-white"
          onClick={() => router.push("/login")}
        >
          Go to Login
        </button>
      </div>
    </main>
  );
}
