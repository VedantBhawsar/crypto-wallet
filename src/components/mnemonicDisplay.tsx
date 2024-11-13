// components/MnemonicDisplay.tsx
'use client'
import { motion } from 'framer-motion'
import { Copy, Download, Eye, EyeClosed, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { MnemonicWordButton } from '@/components/mnemonicWordButton'
import { walletCardAnimation, staggerContainer } from '@/lib/animations'

interface MnemonicDisplayProps {
  mnemonic: string
  visibleMnemonic: boolean
  setVisibleMnemonic: (visible: boolean) => void
  setMnemonic: (mnemonic: string) => void
}

export function MnemonicDisplay({
  mnemonic,
  visibleMnemonic,
  setVisibleMnemonic,
  setMnemonic,
}: MnemonicDisplayProps) {
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  async function createFile() {
    toast.success('Creating text file')
    const blob = new Blob([mnemonic], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'secret-key.txt'
    link.href = url
    link.click()
  }

  return (
    <motion.div variants={walletCardAnimation} className="rounded-lg border p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">Your Secret Key</h2>
          <p className="text-gray-600 dark:text-white/70 mb-6">Save these words in a safe place.</p>
        </div>
        <div className="flex gap-5">
          <Button
            variant={'outline'}
            size={'icon'}
            onClick={() => setVisibleMnemonic(!visibleMnemonic)}
          >
            {visibleMnemonic ? <EyeClosed /> : <Eye />}
          </Button>
          <Button
            size={'icon'}
            variant={'destructive'}
            onClick={() => {
              setMnemonic('')
              setVisibleMnemonic(false)
              toast.success('Cleared mnemonic')
            }}
          >
            <Trash />
          </Button>
        </div>
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
            <Button variant="outline" onClick={createFile}>
              <Download /> Download
            </Button>
            <Button onClick={() => handleCopy(mnemonic)}>
              <Copy /> Copy All
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
