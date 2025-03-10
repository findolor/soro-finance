"use client";

import { FC } from "react";
import useWallet from "@/lib/hooks/useWallet";
import Link from "next/link";

const TestPage: FC = () => {
  const { connect, disconnect, walletAddress, isConnected } = useWallet();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Wallet Test Page</h1>

      <div className="flex flex-col items-center gap-4">
        {isConnected ? (
          <>
            <p className="text-lg text-gray-600">Connected: {walletAddress}</p>
            <button
              onClick={disconnect}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={connect}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <Link
        href="/projects/create"
        className="px-6 py-2 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block"
      >
        Create Project
      </Link>
    </div>
  );
};

export default TestPage;
