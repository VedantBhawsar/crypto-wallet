'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'
import { SiSolana } from 'react-icons/si'

interface WalletProps {
  children?: React.ReactDOM
}

function getWallets() {
  const response = localStorage.getItem('keys')
  if (!response) return []
  const wallets = JSON.parse(response)
  return wallets
}

interface walletTypes {
  publicKey: string
  privateKey: string
  network: 'solana' | 'ethereum'
}

export default function WalletPage({}: WalletProps) {
  const wallets = getWallets()

  console.log(wallets)

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mt-5">Your Wallets</h1>
        <div className="mt-7">
          {wallets &&
            wallets.map((wallet: walletTypes, index: string) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-2  p-8 rounded-xl shadow-sm hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="text-xl font-semibold capitalize flex items-center">
                  {wallet.network === 'solana' ? (
                    <SiSolana className="mr-2" />
                  ) : (
                    <FaEthereum className="mr-2" />
                  )}

                  <span>
                    {wallet.network} Wallet {index + 1}
                  </span>
                </div>
                {/* <p className="text-sm text-gray-700 dark:text-gray-200">{wallet.privateKey}</p> */}
                <Link
                  href={`/wallet/${wallet.publicKey}?network=${wallet.network}`}
                  className="mt-2 font-semibold text-gray-600 hover:text-black underline underline-offset-2 cursor-pointer"
                >
                  {wallet.publicKey}
                </Link>
              </div>
            ))}
        </div>
        <div className="mt-5 flex ">
          <Link href={'/'} className="mx-auto">
            <Button variant={'outline'}>
              <Plus />
              Create a wallet
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
