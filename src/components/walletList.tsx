// components/WalletList.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Keypair } from '@solana/web3.js'
import { mnemonicToSeed } from 'bip39-web-crypto'
import bs58 from 'bs58'
import { derivePath } from 'ed25519-hd-key'
import { ethers } from 'ethers'
import nacl from 'tweetnacl'
import { Button } from '@/components/ui/button'
import { WalletCard } from '@/components/walletCard'
import { DeleteDialog } from '@/components/deleteDialog'
import { walletCardAnimation, fadeIn, staggerContainer } from '@/lib/animations'
import { Keys } from '@/types'

interface WalletListProps {
  network: string
  keys: Keys[]
  setKeys: (keys: Keys[]) => void
  currentIndex: number
  setCurrentIndex: (index: number) => void
  visiblePrivateKeys: string[]
  setVisiblePrivateKeys: (keys: string[]) => void
  mnemonic: string
}

export function WalletList({
  network,
  keys,
  setKeys,
  currentIndex,
  setCurrentIndex,
  visiblePrivateKeys,
  setVisiblePrivateKeys,
  mnemonic,
}: WalletListProps) {
  async function handleSolWallet() {
    const seed = mnemonicToSeed(mnemonic)
    const path = `m/44'/501'/${currentIndex}'/0'`
    const derivedSeed = derivePath(path, (await seed).toString('hex')).key
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    const keypair = Keypair.fromSecretKey(secret)
    setCurrentIndex(currentIndex + 1)

    // @ts-ignore
    setKeys((prev) => [
      ...prev,
      {
        privateKey: bs58.encode(secret),
        publicKey: keypair.publicKey.toBase58(),
        network: network,
      },
    ])
  }

  async function handleEthWallet() {
    const seed = mnemonicToSeed(mnemonic)
    const path = `m/44'/501'/${currentIndex}'/0'`
    const derivedSeed = derivePath(path, (await seed).toString('hex')).key
    const privateKey = Buffer.from(derivedSeed).toString('hex')
    const wallet = new ethers.Wallet(privateKey)
    setCurrentIndex(currentIndex + 1)

    // @ts-ignore
    setKeys((prev) => [
      ...prev,
      {
        privateKey,
        publicKey: wallet.address,
        network: network,
      },
    ])
  }

  function handleKeyDelete(privateKey: string) {
    localStorage.setItem(
      'keys',
      JSON.stringify(keys.filter((key) => key.privateKey !== privateKey)),
    )
    // @ts-ignore
    setVisiblePrivateKeys((prev) => prev.filter((key) => key !== privateKey))
    // @ts-ignore
    setKeys((prev) => prev.filter((key) => key.privateKey !== privateKey))
    toast.success('Wallet deleted')
  }

  function handleDelete() {
    setKeys([])
    setCurrentIndex(0)
    setVisiblePrivateKeys([])
    localStorage.removeItem('keys')
    toast.success('All wallets deleted')
  }
  return (
    <motion.div variants={walletCardAnimation} className="space-y-8">
      <motion.div variants={walletCardAnimation} className="flex justify-between items-center mt-7">
        <h2 className="text-2xl font-bold">Your Wallets</h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => (network === 'solana' ? handleSolWallet() : handleEthWallet())}
          >
            <Plus /> Wallet
          </Button>
          <DeleteDialog onDelete={handleDelete} title="Remove All Wallets" />
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <AnimatePresence>
          {keys?.length === 0 ? (
            <motion.div
              className="h-40 w-full flex justify-center items-center border shadow-sm rounded-lg flex-col gap-3"
              variants={fadeIn}
            >
              <p>No wallet added</p>
              <Button
                onClick={() => (network === 'solana' ? handleSolWallet() : handleEthWallet())}
                variant="outline"
              >
                Add Wallet
              </Button>
            </motion.div>
          ) : (
            keys.map((key, index) => (
              <WalletCard
                key={index}
                index={index}
                walletKey={key}
                network={network}
                visiblePrivateKeys={visiblePrivateKeys}
                setVisiblePrivateKeys={setVisiblePrivateKeys}
                onDelete={() => handleKeyDelete(key.privateKey)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
