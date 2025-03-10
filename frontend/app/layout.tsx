import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SoroFinance - Smart Accounting & Payments for Stellar Projects",
  description:
    "SoroFinance helps you manage your project's finances, automate payments, and simplify budget management.",
  keywords: [
    "Stellar",
    "blockchain",
    "finance",
    "payments",
    "accounting",
    "automation",
    "budgeting",
    "SCF",
    "cryptocurrency",
  ],
  authors: [{ name: "SoroFinance Team" }],
  openGraph: {
    title: "SoroFinance - Smart Accounting & Payments for Stellar Projects",
    description:
      "Manage project finances, automate payments, and optimize budget management with SoroFinance.",
    type: "website",
    locale: "en_US",
    siteName: "SoroFinance",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoroFinance - Smart Project Finance Management",
    description:
      "Automate payments and manage project finances on Stellar with SoroFinance.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  themeColor: "#070303",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="dark">
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
