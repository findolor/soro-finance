import type { Metadata } from "next";
import React from "react";
import Navbar from "@/components/ui/navbar";
// import Footer from "./Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <div className={`flex flex-col justify-between min-h-screen`}>
          <div className="flex flex-col">
            <div className="sticky top-0 z-10">
              <div className="max-w-[1024px] mx-auto bg-background">
                <Navbar />
              </div>
              <div className="h-[1px] bg-[#EBF2F7]" />
            </div>
            <main className={`${"max-w-[1024px]"} mx-auto pb-10`}>
              {children}
            </main>
          </div>
          {/* <Footer /> */}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
