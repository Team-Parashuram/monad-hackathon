"use client"
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import QRCodeGenerator from './QRCodeGenerator'
import { COMMON_TOKENS } from '@/app/contracts'
import { CheckCircle2, Copy, ExternalLink, Gem } from 'lucide-react'

interface PaymentFormProps {
  merchantAddress: string
}

interface PaymentLink {
  id: string
  amount: string
  token: string
  tokenSymbol: string
  merchantAddress: string
  link: string
}

const PaymentForm = ({ merchantAddress }: PaymentFormProps) => {
  const [amount, setAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState('ETH')
  const [generatedLink, setGeneratedLink] = useState<PaymentLink | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !selectedToken) return

    setIsLoading(true)
    
   try {
  const paymentId = uuidv4()
  const tokenData = selectedToken === 'MON' ? COMMON_TOKENS.MON :
                    selectedToken === 'ETH' ? COMMON_TOKENS.ETH :
                    selectedToken === 'USDC' ? COMMON_TOKENS.USDC :
                    selectedToken === 'USDT' ? COMMON_TOKENS.USDT :
                    COMMON_TOKENS.ETH // fallback
                    
  const params = new URLSearchParams({
          merchant: merchantAddress,
          amount,
          token: tokenData.address,
          tokenSymbol: tokenData.symbol,
        }).toString()

        const link = `${window.location.origin}/pay/${paymentId}?${params}`

        const paymentLink: PaymentLink = {
          id: paymentId,
          amount,
          token: tokenData.address,
          tokenSymbol: tokenData.symbol,
          merchantAddress,
          link
        }
        localStorage.setItem(`payment_${paymentId}`, JSON.stringify(paymentLink))

        setGeneratedLink(paymentLink)
      } catch (error) {
        console.error('Error generating payment link:', error)
      } finally {
        setIsLoading(false)
      }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={handleGenerateLink} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 text-sm sm:text-base"
          >
            <option value="MON">MON - Monad</option>
            <option value="ETH">ETH - Ethereum</option>
            <option value="USDC">USDC - USD Coin</option>
            <option value="USDT">USDT - Tether</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.000001"
            min="0"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-yellow-500 text-sm sm:text-base"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount}
          className="w-full bg-orange-200 hover:bg-orange-300 dark:bg-yellow-500 dark:hover:bg-yellow-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-2.5 sm:py-3 px-4 rounded-md transition-colors font-medium shadow-md text-sm sm:text-base"
        >
          {isLoading ? 'Generating...' : 'Generate Payment Link'}
        </button>
      </form>

      {generatedLink && (
        <div className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center mr-4 shadow-lg">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-orange-300 dark:text-yellow-600 text-lg sm:text-xl">Payment Link Generated!</h4>
              <p className="text-orange-300 dark:text-yellow-500 text-sm">Ready to share with your customers</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Details:</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {generatedLink.amount} {generatedLink.tokenSymbol}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    To: {merchantAddress.slice(0, 8)}...{merchantAddress.slice(-6)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Gem className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Share Payment Link:</p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="text"
                  value={generatedLink.link}
                  readOnly
                  className="flex-1 px-4 py-3 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono focus:border-orange-500 dark:focus:border-yellow-500 transition-colors"
                />
                <button
                  onClick={() => copyToClipboard(generatedLink.link)}
                  className={`px-6 py-3 text-xs sm:text-sm rounded-lg font-semibold transition-all duration-300 whitespace-nowrap shadow-lg ${
                    copied 
                      ? 'bg-orange-200 text-white' 
                      : 'bg-orange-200 hover:bg-orange-300 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2 inline" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <QRCodeGenerator 
                  value={generatedLink.link} 
                  title="Scan to Pay"
                  size={160}
                />
              </div>
            </div>

            <div className="text-center">
              <a 
                href={generatedLink.link}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-orange-200 hover:bg-orange-300 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Test Payment Link
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentForm