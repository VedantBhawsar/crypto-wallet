'use client'

import React, { useEffect } from 'react'

interface WalletContextType {
  wallet: string | null
  setWallet: (wallet: string) => void
}

const WalletContext = React.createContext<WalletContextType>({
  wallet: null,
  setWallet: () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = React.useState<string | null>(null)

  useEffect(() => {
    const wallet = localStorage.getItem('wallet')
  })

  return (
    <WalletContext.Provider
      value={{
        setWallet,
        wallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
