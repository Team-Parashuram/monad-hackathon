"use client"
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useSendTransaction } from 'wagmi'
import { parseEther, parseUnits, formatEther, formatUnits } from 'viem'
import { WalletOptions } from '@/components/WalletOptions'
import { CONTRACT_CONFIG, COMMON_TOKENS } from '@/app/contracts'
import { monadTestnet, localhost } from '@/app/config'

interface PaymentRequest {
  id: string
  amount: string
  token: string
  tokenSymbol: string
  merchantAddress: string
  merchantName?: string
  link: string
}

export default function PaymentPage() {
  const params = useParams()
  const { sendTransactionAsync } = useSendTransaction()
  const paymentId = params.id as string
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const { writeContract, data: hash } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const isOnCorrectNetwork = process.env.NEXT_PUBLIC_NETWORK_MODE === "production" 
    ? chain?.id === monadTestnet.id 
    : chain?.id === localhost.id || chain?.id === monadTestnet.id

  useEffect(() => {
    if (isConfirmed) {
      setPaymentStatus('success')
    }
  }, [isConfirmed])


useEffect(() => {
  try {
    const storedRequest = localStorage.getItem(`payment_${paymentId}`)
    if (storedRequest) {
      setPaymentRequest(JSON.parse(storedRequest))
      return
    }
  } catch (err) {
    console.warn('localStorage read failed', err)
  }

  try {
    const search = typeof window !== 'undefined' ? window.location.search : ''
    if (search) {
      const params = new URLSearchParams(search)
      const merchant = params.get('merchant')
      const amount = params.get('amount')
      const token = params.get('token')
      const tokenSymbol = params.get('tokenSymbol')

      if (merchant && amount && token && tokenSymbol) {
        setPaymentRequest({
          id: paymentId,
          amount,
          token,
          tokenSymbol,
          merchantAddress: merchant,
          link: window.location.href
        })
        return
      }
    }
  } catch (err) {
    console.warn('Failed to parse URL params', err)
  }
}, [paymentId])

useEffect(() => {
  if (isConfirmed) {
    setPaymentStatus('success')
    try {
      localStorage.removeItem(`payment_${paymentId}`)
    } catch (err) {
      console.warn('Failed to clear localStorage', err)
    }
  }
}, [isConfirmed, paymentId])


  const handleNetworkSwitch = async () => {
    try {
      const targetChain = process.env.NEXT_PUBLIC_NETWORK_MODE === "production" ? monadTestnet.id : localhost.id
      await switchChain({ chainId: targetChain })
    } catch (error) {
      console.error('Failed to switch network:', error)
      setErrorMessage('Failed to switch network. Please switch manually.')
    }
  }

 const ERC20_ABI = [
  // minimal ABI for approve
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
];

const handlePay = async () => {
  if (!paymentRequest || !address) return
  if (!isOnCorrectNetwork) {
    setErrorMessage('Please switch to the correct network first.')
    return
  }

  setIsLoading(true)
  setPaymentStatus('pending')
  setErrorMessage('')

  try {
    const tokenSymbol = paymentRequest.tokenSymbol
    const tokenEntry = Object.values(COMMON_TOKENS).find(
      (t) => t.symbol === tokenSymbol || t.address.toLowerCase() === paymentRequest.token.toLowerCase()
    )
    const decimals = tokenEntry ? tokenEntry.decimals : 18
    const amount: bigint = parseUnits(paymentRequest.amount, decimals)

    const isNative = tokenSymbol === 'ETH' || tokenSymbol === 'MON'

    if (isNative) {
      // 🚀 Direct native transfer (no contract)
      await sendTransactionAsync({
        to: paymentRequest.merchantAddress as `0x${string}`,
        value: amount,
      })
    } else {
      // 🔗 ERC20 → approve + contract.pay
      try {
        await writeContract({
          address: paymentRequest.token as `0x${string}`,
          abi: ERC20_ABI as any,
          functionName: 'approve',
          args: [CONTRACT_CONFIG.PAYMENT_RECEIVER_ADDRESS as `0x${string}`, amount],
        })
      } catch (err: any) {
        console.error('Approve failed:', err)
        setPaymentStatus('error')
        setErrorMessage('Approval failed or was rejected.')
        setIsLoading(false)
        return
      }

      await writeContract({
        address: CONTRACT_CONFIG.PAYMENT_RECEIVER_ADDRESS as `0x${string}`,
        abi: CONTRACT_CONFIG.PAYMENT_RECEIVER_ABI,
        functionName: 'pay',
        args: [
          paymentRequest.merchantAddress as `0x${string}`,
          paymentRequest.token as `0x${string}`,
          amount,
        ],
      })
    }
  } catch (error: any) {
    console.error('Payment error:', error)
    setPaymentStatus('error')
    setErrorMessage(error?.message || 'Transaction failed. Please try again.')
  } finally {
    setIsLoading(false)
  }
}

  if (!paymentRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Found</h1>
          <p className="text-gray-600 mb-6">
            The payment request you're looking for doesn't exist or has expired.
          </p>
          <a 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">
            You've successfully paid <span className="font-semibold">{paymentRequest.amount} {paymentRequest.tokenSymbol}</span>
          </p>
          <p className="text-gray-600 mb-6">
            To: {paymentRequest.merchantAddress.slice(0, 6)}...{paymentRequest.merchantAddress.slice(-4)}
          </p>
          {hash && (
            <p className="text-sm text-gray-500 mb-6">
              Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
            </p>
          )}
          <a 
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">MonadPe Payment</h1>
          <p className="text-gray-600">Complete your payment below</p>
        </div>

        {!isConnected ? (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><span className="font-medium">Amount:</span> {paymentRequest.amount} {paymentRequest.tokenSymbol}</p>
                <p><span className="font-medium">To:</span> {paymentRequest.merchantAddress.slice(0, 6)}...{paymentRequest.merchantAddress.slice(-4)}</p>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-gray-600 mb-4">Connect your wallet to proceed with payment</p>
            </div>
            <WalletOptions />
          </div>
        ) : (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span className="font-semibold">{paymentRequest.amount} {paymentRequest.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">To:</span>
                  <span className="font-mono">{paymentRequest.merchantAddress.slice(0, 8)}...{paymentRequest.merchantAddress.slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Network:</span>
                  <span>{chain?.name || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {!isOnCorrectNetwork && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium text-yellow-800">Wrong Network</span>
                </div>
                <button
                  onClick={handleNetworkSwitch}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm"
                >
                  Switch Network
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handlePay}
                disabled={isLoading || isConfirming || !isOnCorrectNetwork || paymentStatus === 'pending'}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md text-lg font-semibold transition-colors"
              >
                {isLoading || isConfirming ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isConfirming ? 'Confirming...' : 'Processing...'}
                  </span>
                ) : (
                  `Pay ${paymentRequest.amount} ${paymentRequest.tokenSymbol}`
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
