"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const loggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("walletLoggedIn") === "true";

    if (!loggedIn) {
      router.replace("/login");
      return;
    }

    // Defer state update to avoid the warning
    Promise.resolve().then(() => setChecking(false));
  }, [router, pathname]);

  if (checking) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
