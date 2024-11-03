import './globals.css'

import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Toaster } from 'sonner'

import { Layout } from '@/components'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <Toaster />
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
