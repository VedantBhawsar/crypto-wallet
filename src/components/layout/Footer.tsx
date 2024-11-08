'use client'
import { motion } from 'framer-motion'
import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const footerVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 15,
      transition: { duration: 0.2 },
    },
  }

  const textVariants = {
    initial: { opacity: 0.8 },
    hover: {
      opacity: 1,
      x: 5,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.footer
      className="mt-5 border-t"
      variants={footerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <div className="mx-auto max-w-7xl py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-4">
            <motion.span
              variants={textVariants}
              whileHover="hover"
              className="text-black dark:text-white/70 cursor-pointer"
            >
              © 2023 Crypto wallet
            </motion.span>
            <motion.span
              variants={textVariants}
              whileHover="hover"
              className="text-black dark:text-white/70 cursor-pointer"
            >
              Made with{' '}
              <motion.span
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.2, 1],
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }}
                className="inline-block"
              >
                ❤️
              </motion.span>{' '}
              by Vedant
            </motion.span>
            <motion.span
              variants={textVariants}
              whileHover="hover"
              className="text-black cursor-pointer dark:text-white/70"
            >
              Powered by Vercel
            </motion.span>
          </div>

          <div className="flex gap-3">
            <motion.div variants={iconVariants} whileHover="hover">
              <Link href="/" className="text-black hover:text-gray-600 dark:text-white/70">
                <Github size={24} />
              </Link>
            </motion.div>

            <motion.div variants={iconVariants} whileHover="hover">
              <Link href="/" className="text-black hover:text-blue-400 dark:text-white/70">
                <Twitter size={24} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
