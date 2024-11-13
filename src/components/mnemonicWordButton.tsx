// components/MnemonicWordButton.tsx
import { motion } from 'framer-motion'

interface MnemonicWordButtonProps {
  word: string
  onClick: () => void
  index: number
}

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

export function MnemonicWordButton({ word, onClick, index }: MnemonicWordButtonProps) {
  return (
    <motion.button
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      className="w-full p-3 rounded-lg text-lg relative overflow-hidden cursor-pointer dark:!bg-white/10 dark:hover:!bg-white/15 border"
    >
      <motion.div
        className="select-none size-full flex items-center justify-center"
        variants={wordVariants}
      >
        {word}
      </motion.div>

      <motion.div
        className="select-none absolute inset-0 flex items-center justify-center text-base font-medium"
        variants={copyTextVariants}
      >
        Click to copy
      </motion.div>
    </motion.button>
  )
}
