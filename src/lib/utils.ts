import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const lamportsToSol = (lamports: number) => lamports / 1e9

export const weiToEth = (wei: number) => {
  if (!wei) return '0'
  try {
    const weiBigInt = BigInt(wei)
    const ethValue = Number(weiBigInt) / Math.pow(10, 18)
    return ethValue.toFixed(18).replace(/\.?0+$/, '')
  } catch (error) {
    console.error('Error converting Wei to ETH:', error)
    return '0'
  }
}
