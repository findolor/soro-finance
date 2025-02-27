'use client'

import { FC } from 'react'
import useWallet from '@/lib/hooks/useWallet'

const TestPage: FC = () => {
  const { connect, disconnect, walletAddress, isConnected } = useWallet()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">
        Wallet Test Page
      </h1>
      
      <div className="flex flex-col items-center gap-4">
        {isConnected ? (
          <>
            <p className="text-lg text-gray-600">
              Connected: {walletAddress}
            </p>
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
    </div>
  )
}

export default TestPage
