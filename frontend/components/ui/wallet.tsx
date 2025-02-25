'use client'

import { useState } from "react"
// import useWallet from "../hooks/useWallet"
import { successToast } from "@/lib/utils/toast"
import {
  AddressButton,
  ConnectWalletButton,
  DisconnectWalletButton,
} from "@/components/ui/button"
import Image from "next/image"
import Loading from "@/components/ui/loading"
// import useAppStore from "../store"

const Wallet = () => {
//   const { loading } = useAppStore()
  const { loading } = {
    loading: false,
  }
//   const { isConnected, walletAddress, connect, disconnect } = useWallet()
  const { isConnected, walletAddress, connect, disconnect } = {
    isConnected: false,
    walletAddress: "",
    connect: () => {},
    disconnect: () => {},
  }
  const [isHovered, setIsHovered] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress || "")
    successToast("Address copied to clipboard")
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      {isConnected ? (
        <div className="flex items-center gap-2">
          {!isHovered && (
            <button onClick={copyAddress}>
              <Image
                src="/icons/copy.svg"
                height={18}
                width={18}
                alt="Copy icon"
              />
            </button>
          )}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered ? (
              <DisconnectWalletButton onClick={disconnect} />
            ) : (
              <div className="flex items-center gap-2">
                <AddressButton address={walletAddress || ""} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <ConnectWalletButton onClick={connect} />
      )}
    </>
  )
}

export default Wallet
