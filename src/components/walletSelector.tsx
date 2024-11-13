'use client'
import { motion } from 'framer-motion'
import { FaEthereum } from 'react-icons/fa'
import { SiSolana } from 'react-icons/si'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fadeIn } from '@/lib/animations'

interface WalletSelectorProps {
  network: string
  setNetwork: (network: string) => void
  inputString: string
  setInputString: (input: string) => void
  error: string
  setError: (error: string) => void
  generateMnem: () => void
  connectWallet: () => void
}

export function WalletSelector({
  network,
  setNetwork,
  inputString,
  setInputString,
  error,
  setError,
  generateMnem,
  connectWallet,
}: WalletSelectorProps) {
  return (
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
          <NetworkTab
            title="Ethereum Wallet"
            inputString={inputString}
            setInputString={setInputString}
            error={error}
            setError={setError}
            generateMnem={generateMnem}
            connectWallet={connectWallet}
          />
        </TabsContent>

        <TabsContent value="solana">
          <NetworkTab
            title="Solana Wallet"
            inputString={inputString}
            setInputString={setInputString}
            error={error}
            setError={setError}
            generateMnem={generateMnem}
            connectWallet={connectWallet}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

interface NetworkTabProps {
  title: string
  inputString: string
  setInputString: (input: string) => void
  error: string
  setError: (error: string) => void
  generateMnem: () => void
  connectWallet: () => void
}

function NetworkTab({
  title,
  inputString,
  setInputString,
  error,
  setError,
  generateMnem,
  connectWallet,
}: NetworkTabProps) {
  return (
    <motion.div variants={fadeIn} className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
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
  )
}
