import './globals.css'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'sonner'

import { Layout } from '@/components'
import { ThemeProvider } from '@/components/providers/theme-provider'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Crypto Wallet',
  description: 'Crypto Wallet',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.className} antialiased dark:!bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Toaster toastOptions={{ className: 'dark:!bg-black dark:!text-white' }} />
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
