'use client'
import { motion } from 'framer-motion'
import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-screen flex-col">
      <Header />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  )
}

export function Header() {
  const [isHovered, setIsHovered] = useState(false)

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 360,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  const navVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.nav
      variants={navVariants}
      initial="initial"
      animate="animate"
      className="relative z-20 border-b border-gray-200 py-5 shadow-[0_0_15px_0_rgb(0,0,0,0.1)]"
    >
      <div className="mx-auto flex max-w-7xl items-center px-14 lg:px-6">
        <div className="flex flex-row items-center">
          <motion.div variants={logoVariants} whileHover="hover" initial="initial">
            <Link className="no-underline transition-colors" href="/">
              <motion.span>
                <svg height={26} viewBox="0 0 75 65" fill="#000">
                  <title>Vercel Logo</title>
                  <path d="M37.59.25l36.95 64H.64l36.95-64z" />
                </svg>
              </motion.span>
            </Link>
          </motion.div>

          <ul className="flex content-center items-center">
            <li className="ml-2 text-gray-200">
              <motion.svg
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                viewBox="0 0 24 24"
                width={32}
                height={32}
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M16.88 3.549L7.12 20.451" />
              </motion.svg>
            </li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              className="font-medium"
              style={{ letterSpacing: '.01px' }}
            >
              <a
                className="text-sm font-semibold no-underline transition-colors hover:text-blue-500"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/chhpt/nextjs-starter"
              >
                Crypto wallet
              </a>
            </motion.li>
          </ul>
        </div>

        <div className="hidden flex-1 justify-end md:flex">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </motion.nav>
  )
}

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
              className="text-black cursor-pointer"
            >
              © 2023 Crypto wallet
            </motion.span>
            <motion.span
              variants={textVariants}
              whileHover="hover"
              className="text-black cursor-pointer"
            >
              Made with
              {' '}
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
              </motion.span>
              {' '}
              by Vedant
            </motion.span>
            <motion.span
              variants={textVariants}
              whileHover="hover"
              className="text-black cursor-pointer"
            >
              Powered by Vercel
            </motion.span>
          </div>

          <div className="flex gap-3">
            <motion.div variants={iconVariants} whileHover="hover">
              <Link href="/" className="text-black hover:text-gray-600">
                <Github size={24} />
              </Link>
            </motion.div>

            <motion.div variants={iconVariants} whileHover="hover">
              <Link href="/" className="text-black hover:text-blue-400">
                <Twitter size={24} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
