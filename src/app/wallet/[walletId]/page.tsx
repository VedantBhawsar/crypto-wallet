'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import axios from 'axios'
import { ethers } from 'ethers'
import { useParams, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import solApis from '@/lib/solApis'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/router'
import ethApis from '@/lib/ethApis'
import { SiSolana } from 'react-icons/si'
import { FaEthereum } from 'react-icons/fa'
import { Copy } from 'lucide-react'

export default function WalletPage() {
  const {
    walletId,
  }: {
    walletId: string
  } = useParams()
  const searchParams = useSearchParams()
  const network = searchParams.get('network')

  const [balance, setBalance] = useState<string>('')
  const [account, setAccount] = useState<string>('')

  useEffect(() => {
    if (network === 'solana') {
      solApis
        .getBalance(walletId)
        .then((res) => setBalance(res?.result?.value))
        .catch((error) => console.log(error))

      solApis
        .getAccountInfo(walletId)
        .then((res) => setAccount(res?.result?.value))
        .catch((error) => console.log(error))
    } else {
      ethApis
        .getBalance(walletId)
        .then((res) => setBalance(res?.result?.value))
        .catch((error) => console.log(error))

      ethApis
        .getAccountInfo(walletId)
        .then((res) => setAccount(res?.result?.value))
        .catch((error) => console.log(error))
    }
  }, [walletId])

  return (
    <div className="mt-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <div className="flex items-center text-3xl font-bold">
            {network === 'solana' ? <SiSolana className="mr-2" /> : <FaEthereum className="mr-2" />}
            <span> Wallet</span>
          </div>
          <p className="text-lg mt-1">
            Wallet Id: <span className="font-bold  ">{walletId}</span>
          </p>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-5">
          <Card className="col-span-1">
            <CardHeader>
              <h2 className="font-bold">Wallet Overview</h2>
            </CardHeader>
            <CardContent className="">
              <div className="grid grid-cols-2 gap-5 mb-1">
                <p className="col-span-1 text-sm dark:text-slate-200">SOL Balance</p>
                <p className="col-span-1 text-sm dark:text-white font-bold">{balance} SOL</p>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <span className="col-span-1 text-sm dark:text-slate-200">Token Balance</span>
                <span className="col-span-1 text-sm dark:text-slate-200 font-bold">1 Token</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator className="mt-7" />
        <div className="mt-7">
          <h1 className="text-xl font-semibold mb-5">Transactions</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Signature</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Instructions</TableHead>
                <TableHead>By</TableHead>
                <TableHead>Value (SOL)</TableHead>
                <TableHead>Fee (SOL)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
