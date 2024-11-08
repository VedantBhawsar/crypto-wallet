'use client'
import { TrashIcon } from '@radix-ui/react-icons'
import { Keypair } from '@solana/web3.js'
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from 'bip39-web-crypto'
import bs58 from 'bs58'
import { derivePath } from 'ed25519-hd-key'
import { ethers } from 'ethers'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy, Download, Eye, EyeClosed, Plus, Save, Trash, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { SiSolana } from 'react-icons/si'
import { toast } from 'sonner'
import nacl from 'tweetnacl'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const wordAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: {
    backgroundColor: '#e5e7eb',
    transition: { duration: 0.2 },
  },
}

const walletCardAnimation = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -30,
    transition: { duration: 0.3 },
  },
}

interface Keys {
  privateKey: string
  publicKey: string
  network: string
}

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

  async function creatFile() {
    toast.success('Creating text file')
    const blob = new Blob([mnemonic], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'secret-key.txt'
    link.href = url
    link.click()
  }

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key)
    toast.success('Copied to clipboard')
  }

  async function handleSolWallet() {
    const seed = mnemonicToSeed(mnemonic)
    const path = `m/44'/501'/1'/0'`
    const derivedSeed = derivePath(path, (await seed).toString('hex')).key
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    const keypair = Keypair.fromSecretKey(secret)
    setCurrentIndex(currentIndex + 1)

    setKeys((prev) => {
      return [
        ...prev,
        {
          privateKey: bs58.encode(secret),
          publicKey: keypair.publicKey.toBase58(),
          network: network,
        },
      ]
    })
  }

  async function handleEthWallet() {
    const seed = mnemonicToSeed(mnemonic)
    const path = `m/44'/501'/${currentIndex}'/0'`
    const derivedSeed = derivePath(path, (await seed).toString('hex')).key
    const privateKey = Buffer.from(derivedSeed).toString('hex')
    const wallet = new ethers.Wallet(privateKey)
    setCurrentIndex(currentIndex + 1)

    setKeys((prev) => [
      ...prev,
      {
        privateKey,
        publicKey: wallet.address,
        network: network,
      },
    ])
  }

  function handleDelete() {
    toast.success('Wallets deleted')
    setMnemonic('')
    setKeys([])
    setCurrentIndex(0)
    setVisiblePrivateKeys([])
    localStorage.removeItem('mnemonic')
    localStorage.removeItem('keys')
  }

  function handleKeyDelete(privateKey: string) {
    localStorage.setItem(
      'keys',
      JSON.stringify(keys.filter((key) => key.privateKey !== privateKey)),
    )
    setVisiblePrivateKeys((prev) => prev.filter((key) => key !== privateKey))
    setKeys((prev) => prev.filter((key) => key.privateKey !== privateKey))
    setCurrentIndex((prev) => prev - 1)
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

  useEffect(savedToLocalStorage, [mnemonic, keys, currentIndex, network])

  async function connectWallet() {
    const validate = await validateMnemonic(inputString)
    if (validate) {
      toast.success('Wallet imported')
      setMnemonic(inputString)
    } else {
      setError('Invalid mnemonic')
    }
  }

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
            <motion.div
              key="wallet-selector"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-7"
            >
              <Tabs
                defaultValue={network}
                className="w-full"
                onValueChange={(e) => {
                  setNetwork(e)
                }}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="ethereum">
                    <FaEthereum className="mr-2" />
                    Ethereum
                  </TabsTrigger>
                  <TabsTrigger value="solana">
                    <SiSolana className="mr-2" />
                    Solana
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ethereum">
                  <motion.div variants={fadeIn} className="space-y-4">
                    <h2 className="text-2xl font-bold">Ethereum Wallet</h2>
                    <div className="flex gap-4">
                      <div className="w-full">
                        <Input
                          placeholder="Enter your secret phrase (or leave blank to generate)"
                          className="flex-1"
                          value={inputString}
                          onChange={(e) => {
                            setError('')
                            setInputString(e.target.value)
                          }}
                        />
                        {error && <Label className="ml-1 text-red-500">{error}</Label>}
                      </div>
                      {inputString.length > 0 ? (
                        <Button onClick={connectWallet} variant={'outline'}>
                          Connect
                        </Button>
                      ) : (
                        <Button onClick={generateMnem}>Generate</Button>
                      )}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="solana">
                  <motion.div variants={fadeIn} className="space-y-4">
                    <h2 className="text-2xl font-bold">Solana Wallet</h2>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Enter your secret phrase (or leave blank to generate)"
                        className="flex-1"
                      />
                      <Button onClick={generateMnem}>Generate</Button>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="mnemonic-display"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <motion.div
                variants={walletCardAnimation}
                className="rounded-lg border p-8 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Your Secret Key</h2>
                    <p className="text-gray-600 dark:text-white/70 mb-6">
                      Save these words in a safe place.
                    </p>
                  </div>
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={() => {
                      setVisibleMnemonic((prev) => !prev)
                    }}
                  >
                    {visibleMnemonic ? <EyeClosed /> : <Eye />}
                  </Button>
                </div>

                {visibleMnemonic && (
                  <div>
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      className="grid grid-cols-3 gap-3 mb-6"
                    >
                      {mnemonic.split(' ').map((word, index) => (
                        <MnemonicWordButton
                          key={index}
                          word={word}
                          index={index}
                          onClick={() => handleCopy(word)}
                        />
                      ))}
                    </motion.div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={creatFile}>
                        <Download /> Download
                      </Button>
                      <Button onClick={() => handleCopy(mnemonic)}>
                        <Copy /> Copy All
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                variants={walletCardAnimation}
                className="flex justify-between items-center"
              >
                <h2 className="text-2xl font-bold">Your Wallets</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => (network === 'solana' ? handleSolWallet() : handleEthWallet())}
                  >
                    <Plus /> Wallet
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <TrashIcon /> Remove All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your
                          wallets and remove your secret phrase.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          <X />
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-500 hover:bg-red-600 dark:text-gray-200"
                        >
                          <Trash />
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                        onClick={() =>
                          network === 'solana' ? handleSolWallet() : handleEthWallet()
                        }
                        variant="outline"
                      >
                        Add Wallet
                      </Button>
                    </motion.div>
                  ) : (
                    keys.map((key, index) => (
                      <motion.div
                        key={index}
                        variants={walletCardAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="p-6 border rounded-lg shadow-sm "
                      >
                        <div className="flex justify-between items-center mb-6 ">
                          <span className="text-xl font-semibold flex items-center gap-2">
                            {network === 'solana' ? <SiSolana /> : <FaEthereum />} Wallet{' '}
                            {index + 1}
                          </span>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                <TrashIcon /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete all
                                  your wallets and remove your secret phrase.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  <X />
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleKeyDelete(key.privateKey)}
                                  className="bg-red-500 hover:bg-red-600 dark:text-gray-200"
                                >
                                  <Trash />
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 dark:!bg-white/5 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">Private Key</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setVisiblePrivateKeys((prev) =>
                                    prev.includes(key.privateKey)
                                      ? prev.filter((k) => k !== key.privateKey)
                                      : [...prev, key.privateKey],
                                  )
                                }}
                              >
                                {visiblePrivateKeys.includes(key.privateKey) ? (
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
                              {visiblePrivateKeys.includes(key.privateKey)
                                ? key.privateKey
                                : '•'.repeat(40)}
                            </motion.div>
                          </div>

                          <div className="p-4 bg-gray-50 dark:!bg-white/5 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">Public Key</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleCopy(key.publicKey)}
                              >
                                <Copy className="size-4" />
                              </Button>
                            </div>
                            <div className="font-mono text-sm break-all">{key.publicKey}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
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

function MnemonicWordButton({
  word,
  onClick,
  index,
}: {
  word: string
  onClick: () => void
  index: number
}) {
  const containerVariants = {
    initial: {
      backgroundColor: '#f9fafb',
    },
    hover: {
      backgroundColor: '#f3f4f6',
      transition: {
        duration: 0.2,
      },
    },
  }

  const wordVariants = {
    initial: {
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -40,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  const copyTextVariants = {
    initial: {
      y: 40,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.button
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      className="w-full p-3 rounded-lg text-lg relative overflow-hidden cursor-pointer dark:!bg-white/10 dark:hover:!bg-white/15 border"
    >
      <motion.div
        className="select-none size-full flex items-center justify-center "
        variants={wordVariants}
      >
        {word}
      </motion.div>

      <motion.div
        className="select-none absolute inset-0 flex items-center  justify-center text-base font-medium"
        variants={copyTextVariants}
      >
        Click to copy
      </motion.div>
    </motion.button>
  )
}
