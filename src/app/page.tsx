// pages/index.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { generateMnemonic, validateMnemonic } from 'bip39-web-crypto'
import { Separator } from '@/components/ui/separator'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletSelector } from '@/components/walletSelector'
import { MnemonicDisplay } from '@/components/mnemonicDisplay'
import { WalletList } from '@/components/walletList'
import { fadeIn } from '@/lib/animations'
import { Keys } from '@/types'

export default function Home() {
  const [mnemonic, setMnemonic] = useState('')
  const [inputString, setInputString] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [keys, setKeys] = useState<Keys[]>([])
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<string[]>([])
  const [visibleMnemonic, setVisibleMnemonic] = useState<boolean>(false)
  const [network, setNetwork] = useState<string>('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('mnemonic')) {
      setMnemonic(localStorage.getItem('mnemonic') as string)
      setKeys(JSON.parse(localStorage.getItem('keys') as string))
      setNetwork(localStorage.getItem('network') as string)
      setCurrentIndex(Number(localStorage.getItem('activeTab')))
    }
  }, [])

  async function generateMnem() {
    toast.success('Mnemonic generated')
    const code = await generateMnemonic()
    localStorage.setItem('mnemonic', code)
    setMnemonic(code)
  }

  async function connectWallet() {
    const validate = await validateMnemonic(inputString)
    if (validate) {
      toast.success('Wallet imported')
      setMnemonic(inputString)
    } else {
      setError('Invalid mnemonic')
    }
  }

  function savedToLocalStorage() {
    localStorage.setItem('mnemonic', mnemonic)
    localStorage.setItem('keys', JSON.stringify(keys))
    localStorage.setItem('network', network)
    localStorage.setItem('currentIndex', currentIndex.toString())
  }

  function handleSave() {
    savedToLocalStorage()
    toast.success('Wallet saved')
    router.push('/wallet')
  }

  function handleDelete() {
    setKeys(keys.filter((key) => key.privateKey !== visiblePrivateKeys[0]))
    setVisiblePrivateKeys([])
    setCurrentIndex(0)
    toast.success('Wallet deleted')
    savedToLocalStorage()
  }

  useEffect(savedToLocalStorage, [mnemonic, keys, currentIndex, network])

  return (
    <div className="mt-10">
      <div className="mx-auto max-w-7xl">
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="mb-8">
          <h1 className="text-4xl font-bold">Crypto Wallet</h1>
          <p className="text-lg text-slate-700 dark:text-white/70">
            A simple wallet for cryptocurrencies
          </p>
        </motion.div>
        <AnimatePresence mode="wait">
          {!mnemonic ? (
            <WalletSelector
              network={network}
              setNetwork={setNetwork}
              inputString={inputString}
              setInputString={setInputString}
              error={error}
              setError={setError}
              generateMnem={generateMnem}
              connectWallet={connectWallet}
            />
          ) : (
            <>
              <MnemonicDisplay
                mnemonic={mnemonic}
                setMnemonic={setMnemonic}
                visibleMnemonic={visibleMnemonic}
                setVisibleMnemonic={setVisibleMnemonic}
              />
              <WalletList
                mnemonic={mnemonic}
                network={network}
                keys={keys}
                setKeys={setKeys}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                visiblePrivateKeys={visiblePrivateKeys}
                setVisiblePrivateKeys={setVisiblePrivateKeys}
              />
            </>
          )}
        </AnimatePresence>
        {keys?.length > 0 && (
          <>
            <Separator className="my-5" />
            <motion.div variants={fadeIn} className="flex justify-end gap-3">
              <Button onClick={handleSave}>
                <Save />
                Save
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
