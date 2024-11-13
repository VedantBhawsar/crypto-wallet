'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import solApis from '@/lib/solApis'
import ethApis from '@/lib/ethApis'
import { Separator } from '@/components/ui/separator'
import { SiSolana } from 'react-icons/si'
import { FaEthereum } from 'react-icons/fa'
import { Copy } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { lamportsToSol } from '@/lib'
import { Skeleton } from '@/components/ui/skeleton'

export default function WalletPage() {
  const { walletId } = useParams() as {
    walletId: string
  }
  const searchParams = useSearchParams()
  const network = searchParams.get('network')

  const [balance, setBalance] = useState(0)
  const [account, setAccount] = useState(1)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      try {
        if (network === 'solana') {
          const [balanceRes, accountRes, transactionsDetails] = await Promise.all([
            solApis.getBalance(walletId),
            solApis.getAccountInfo(walletId),
            solApis.getTransactionsByAccount(walletId),
          ])

          setTransactions(
            transactionsDetails.map((response) => {
              return {
                signature: response?.result?.transaction?.signatures?.[0],
                block: response?.result?.slot,
                time: new Date(response?.result?.blockTime * 1000).toLocaleDateString(),
                instructions: response?.result?.transaction?.message?.instructions?.length,
                by: response?.result?.transaction?.message?.accountKeys?.find(
                  (key: any) => key?.signer,
                )?.pubkey,
                value: lamportsToSol(response?.result?.meta?.fee),
                fee: lamportsToSol(response?.result?.meta?.fee),
              }
            }),
          )

          setBalance(balanceRes?.result?.value ?? '0')
          setAccount(accountRes?.result?.value ?? 'N/A')
        } else {
          const [balanceRes, accountRes, transactionsDetails] = await Promise.all([
            ethApis.getBalance(walletId),
            ethApis.getAccountInfo(walletId),
            ethApis.getTransactionsByAccount(walletId),
          ])
          setTransactions(transactionsDetails)
          setBalance(balanceRes?.result?.value ?? '0')
          setAccount(accountRes?.result?.value ?? 'N/A')
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching wallet data:', error)
        setLoading(false)
      }
    }
    getData()
  }, [network, walletId])

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="flex items-center text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {network === 'solana' ? <SiSolana className="mr-2" /> : <FaEthereum className="mr-2" />}
          <span> Wallet</span>
        </motion.div>
        <p className="text-lg mt-1">
          Wallet Id: <span className="font-bold">{walletId}</span>
        </p>

        <div className="mt-5 grid grid-cols-4 gap-5">
          <Card className="col-span-1">
            <CardHeader>
              <motion.h2
                className="font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Wallet Overview
              </motion.h2>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-2 gap-5 mb-1"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <p className="col-span-1 text-sm dark:text-slate-200">
                  {network === 'solana' ? 'SOL Balance' : 'ETH Balance'}
                </p>
                <motion.div
                  className="flex  col-span-1 text-sm dark:text-white font-bold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {loading ? (
                    <Skeleton className="rounded-md w-[50px] h-[20px]" />
                  ) : (
                    balance / 1000000000
                  )}{' '}
                  {network === 'solana' ? 'SOL' : 'ETH'}
                </motion.div>
              </motion.div>
              <motion.div
                className="grid grid-cols-2 gap-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="col-span-1 text-sm dark:text-slate-200">Token Balance</span>
                <span className="col-span-1 text-sm dark:text-white font-bold">1 Token</span>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        <Separator className="mt-7" />

        <div className="mt-7">
          <motion.h1
            className="text-xl font-semibold mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Transactions
          </motion.h1>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[100px]">Signature</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Instructions</TableHead>
                <TableHead>By</TableHead>
                <TableHead>Value ({network === 'solana' ? 'SOL' : 'ETH'})</TableHead>
                <TableHead>Fee ({network === 'solana' ? 'SOL' : 'ETH'})</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(10)
                  .fill('')
                  .map((_, index) => <LoadingCell key={index} index={index} />)
              ) : transactions.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <TableCell colSpan={7} className="text-center h-16 text-gray-300">
                    No transactions found
                  </TableCell>
                </motion.tr>
              ) : (
                transactions.map((transaction, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <TableCell className="font-medium">{transaction.signature}</TableCell>
                    <TableCell>{transaction.block}</TableCell>
                    <TableCell>{transaction.time}</TableCell>
                    <TableCell className="text-right">{transaction.instructions}</TableCell>
                    <TableCell>{transaction.by}</TableCell>
                    <TableCell>
                      {transaction.value} {network === 'solana' ? 'SOL' : 'ETH'}
                    </TableCell>
                    <TableCell>
                      {transaction.fee} {network === 'solana' ? 'SOL' : 'ETH'}
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  )
}

function LoadingCell({ index }: { index: number }) {
  return (
    <motion.tr
      key={index}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <TableCell className="font-medium">
        <Skeleton className="w-full h-[20px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px] rounded-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w-full h-[20px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px] rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-full h-[20px] rounded-full" />
      </TableCell>
    </motion.tr>
  )
}
