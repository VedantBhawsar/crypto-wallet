'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'
import { SiSolana } from 'react-icons/si'
import { motion } from 'framer-motion'

function getWallets() {
  const response = localStorage.getItem('keys')
  if (!response) return []
  const wallets = JSON.parse(response)
  return wallets
}

interface WalletTypes {
  publicKey: string
  privateKey: string
  network: 'solana' | 'ethereum'
}

export default function WalletPage() {
  const wallets = getWallets()

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="">
      <motion.div
        className="max-w-7xl mx-auto "
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 className="text-3xl font-bold mt-5" variants={itemVariants}>
          Your Wallets
        </motion.h1>

        <motion.div className="mt-7">
          {wallets &&
            wallets.map((wallet: WalletTypes, index: number) => (
              <motion.div
                initial={{
                  y: 30,
                }}
                animate={{
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
                viewport={{
                  once: false,
                }}
                key={index}
                className="flex flex-col gap-2 border-2 p-8 rounded-xl shadow-sm hover:bg-gray-100 hover:dark:bg-white/5 transition-colors duration-300 mb-5"
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
                <Link
                  href={`/wallet/${wallet.publicKey}?network=${wallet.network}`}
                  className="mt-2 font-semibold text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white underline underline-offset-2 cursor-pointer w-fit"
                >
                  {wallet.publicKey}
                </Link>
              </motion.div>
            ))}
        </motion.div>

        <motion.div
          className="mt-5 flex"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
          }}
          transition={{ delay: 2 }}
        >
          <Link href={'/'} className="mx-auto">
            <Button variant={'outline'}>
              <Plus />
              Create a wallet
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
