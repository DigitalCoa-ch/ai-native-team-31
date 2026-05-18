import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilyOffice AI — AI-Native Wealth Coordination Agent",
  description:
    "Unify portfolio data, estate documents, and family risk preferences into one autonomous AI agent that delivers real-time wealth intelligence and personalized recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}