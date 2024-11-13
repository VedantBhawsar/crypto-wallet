// components/WalletCard.tsx
'use client'
import { motion } from 'framer-motion'
import { Copy, Eye, EyeClosed } from 'lucide-react'
import { FaEthereum } from 'react-icons/fa'
import { SiSolana } from 'react-icons/si'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/deleteDialog'
import { walletCardAnimation } from '@/lib/animations'
import { Keys } from '@/types'

interface WalletCardProps {
  index: number
  walletKey: Keys
  network: string
  visiblePrivateKeys: string[]
  setVisiblePrivateKeys: (keys: string[]) => void
  onDelete: () => void
}

export function WalletCard({
  index,
  walletKey,
  network,
  visiblePrivateKeys,
  setVisiblePrivateKeys,
  onDelete,
}: WalletCardProps) {
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  function togglePrivateKeyVisibility() {
    // @ts-ignore
    setVisiblePrivateKeys((prev: string[]) => {
      if (prev.includes(walletKey.privateKey))
        return prev.filter((k: string) => k !== walletKey.privateKey)
      else return [...prev, walletKey.privateKey]
    })
  }

  return (
    <motion.div
      variants={walletCardAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 border rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl font-semibold flex items-center gap-2">
          {network === 'solana' ? <SiSolana /> : <FaEthereum />} Wallet {index + 1}
        </span>
        <DeleteDialog onDelete={onDelete} title="Delete Wallet" />
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:!bg-white/5 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Private Key</span>
            <Button size="icon" variant="ghost" onClick={togglePrivateKeyVisibility}>
              {visiblePrivateKeys.includes(walletKey.privateKey) ? (
                <Eye className="size-4" />
              ) : (
                <EyeClosed className="size-4" />
              )}
            </Button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-sm break-all"
          >
            {visiblePrivateKeys.includes(walletKey.privateKey)
              ? walletKey.privateKey
              : '•'.repeat(40)}
          </motion.div>
        </div>

        <div className="p-4 bg-gray-50 dark:!bg-white/5 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Public Key</span>
            <Button size="icon" variant="ghost" onClick={() => handleCopy(walletKey.publicKey)}>
              <Copy className="size-4" />
            </Button>
          </div>
          <div className="font-mono text-sm break-all">{walletKey.publicKey}</div>
        </div>
      </div>
    </motion.div>
  )
}
