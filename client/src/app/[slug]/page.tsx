"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, parseUnits } from 'viem'
import { WalletOptions } from '@/components/WalletOptions'
import { CONTRACT_CONFIG, COMMON_TOKENS } from '@/app/contracts'

interface PaymentRequest {
  id: string
  amount: string
  token: string
  tokenSymbol: string
  merchantAddress: string
  link: string
}

export default function PaymentPage() {
  const params = useParams()
  const paymentId = params.slug as string
  const { address, isConnected } = useAccount()
  
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    // Load payment request from localStorage (in real app, fetch from API)
    const storedRequest = localStorage.getItem(`payment_${paymentId}`)
    if (storedRequest) {
      setPaymentRequest(JSON.parse(storedRequest))
    }
  }, [paymentId])

  useEffect(() => {
    if (isConfirmed) {
      setPaymentStatus('success')
    }
  }, [isConfirmed])

  const handlePay = async () => {
    if (!paymentRequest || !address) return

    setIsLoading(true)
    setPaymentStatus('pending')

    try {
      let amount: bigint
      
      if (paymentRequest.tokenSymbol === 'ETH') {
        amount = parseEther(paymentRequest.amount)
      } else {
        // For USDC/USDT (6 decimals)
        amount = parseUnits(paymentRequest.amount, 6)
      }

      await writeContract({
        address: CONTRACT_CONFIG.PAYMENT_RECEIVER_ADDRESS as `0x${string}`,
        abi: CONTRACT_CONFIG.PAYMENT_RECEIVER_ABI,
        functionName: 'pay',
        args: [
          paymentRequest.merchantAddress as `0x${string}`,
          paymentRequest.token as `0x${string}`,
          amount
        ],
        value: paymentRequest.tokenSymbol === 'ETH' ? amount : BigInt(0),
      })

    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!paymentRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Found</h1>
          <p className="text-gray-600">
            The payment request you're looking for doesn't exist or has expired.
          </p>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Your payment of {paymentRequest.amount} {paymentRequest.tokenSymbol} has been processed.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Done
          </a>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Connect Wallet to Pay</h1>
          <div className="text-center mb-6">
            <div className="text-lg font-semibold">
              Pay {paymentRequest.amount} {paymentRequest.tokenSymbol}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              to {paymentRequest.merchantAddress.slice(0, 6)}...{paymentRequest.merchantAddress.slice(-4)}
            </div>
          </div>
          <WalletOptions />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">MonadPay</h1>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {paymentRequest.amount} {paymentRequest.tokenSymbol}
          </div>
          <div className="text-gray-600">
            Payment to: {paymentRequest.merchantAddress.slice(0, 6)}...{paymentRequest.merchantAddress.slice(-4)}
          </div>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">From:</span>
            <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Token:</span>
            <span>{paymentRequest.tokenSymbol}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Network:</span>
            <span>Localhost</span>
          </div>
        </div>

        {paymentStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-600 text-sm">
              Payment failed. Please try again.
            </p>
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={isLoading || isConfirming || paymentStatus === 'pending'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold"
        >
          {isLoading || isConfirming ? 'Processing...' : `Pay ${paymentRequest.amount} ${paymentRequest.tokenSymbol}`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          This will open a transaction in your wallet
        </p>
      </div>
    </div>
  )
}