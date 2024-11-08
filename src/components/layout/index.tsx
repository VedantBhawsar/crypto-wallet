'use client'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex h-screen  flex-col">
      <Header />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  )
}
