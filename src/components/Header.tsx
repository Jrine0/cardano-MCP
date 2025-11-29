"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCardano } from "@cardano-foundation/cardano-connect-with-wallet";

export default function Header() {
  const router = useRouter();
  const { disconnect } = useCardano();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("walletLoggedIn");
    disconnect();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b">
      <button className="font-bold" onClick={() => router.push("/builders")}>
        WalletInit
      </button>

      <div className="relative">
        <button
          className="rounded-full border px-4 py-2"
          onClick={() => setOpen((o) => !o)}
        >
          Profile
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow">
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                router.push("/home");
              }}
            >
              Home
            </button>
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                router.push("/settings");
              }}
            >
              Settings
            </button>
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
