import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet Init",
  description: "Cardano wallet login demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
