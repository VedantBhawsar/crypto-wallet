'use client'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu'
import { MoonIcon, SunIcon, Wallet } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useNavigation } from 'react-day-picker'
import { useRouter } from 'next/navigation'

export function Header() {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

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
    <motion.div
      variants={navVariants}
      initial="initial"
      animate="animate"
      className="relative z-20 border-b  border-gray-200 dark:border-gray-800 py-5 shadow-[0_0_15px_0_rgb(0,0,0,0.1)]"
    >
      <div className="mx-auto flex max-w-7xl items-center px-14 lg:px-6">
        <div className="flex flex-row items-center">
          <motion.div variants={logoVariants} whileHover="hover" initial="initial">
            <Link className="no-underline transition-colors" href="/wallet">
              <motion.span className="fill-">
                <svg height={26} viewBox="0 0 75 65" className="fill-black dark:fill-white">
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
              <Link
                className="text-sm font-semibold no-underline transition-colors"
                rel="noreferrer"
                href="/"
              >
                Crypto wallet
              </Link>
            </motion.li>
          </ul>
        </div>

        <div className="hidden flex-1 items-center gap-4 justify-end md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} variant={'outline'}>
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-3 min-w-52">
              <DropdownMenuItem
                onClick={() => {
                  router.push('/wallet')
                }}
              >
                {' '}
                <Wallet /> Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  )
}
