import type { Metadata } from "next";
import React from "react";
// import Navbar from "@/components/ui/navbar";
// import Footer from "./Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoroFinance - Smart Accounting & Payments for Stellar Projects",
  description: "SoroFinance helps you manage your project's finances, automate payments, and simplify budget management.",
  keywords: ["Stellar", "blockchain", "finance", "payments", "accounting", "automation", "budgeting", "SCF", "cryptocurrency"],
  authors: [{ name: "SoroFinance Team" }],
  openGraph: {
    title: "SoroFinance - Smart Accounting & Payments for Stellar Projects",
    description: "Manage project finances, automate payments, and optimize budget management with SoroFinance.",
    type: "website",
    locale: "en_US",
    siteName: "SoroFinance",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoroFinance - Smart Project Finance Management",
    description: "Automate payments and manage project finances on Stellar with SoroFinance.",
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
    <html lang="en">
      <body>
      {children}
      </body>
    </html>
  );
};
// const RootLayout = ({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) => {
//   return (
//     <html lang="en">
//       <body>
//         <div className={`flex flex-col justify-between min-h-screen`}>
//           <div className="flex flex-col">
//             <div className="sticky top-0 z-10 bg-html-background">
//               <div className="min-w-[1024px] max-w-[1440px] mx-auto">
//                 <Navbar />
//               </div>
//               <div className="h-[1px] bg-[#EBF2F7]" />
//             </div>
//             <main className={`${"min-w-[1024px] max-w-[1440px]"} mx-auto pb-10`}>
//               {children}
//             </main>
//           </div>
//           {/* <Footer /> */}
//         </div>
//       </body>
//     </html>
//   );
// };

export default RootLayout;
