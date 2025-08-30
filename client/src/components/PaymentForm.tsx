"use client"
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import QRCodeGenerator from './QRCodeGenerator'
import { COMMON_TOKENS } from '@/app/contracts'

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
      const tokenData = selectedToken === 'ETH' ? COMMON_TOKENS.ETH : 
                       selectedToken === 'MON' ? COMMON_TOKENS.MON :
                       selectedToken === 'USDC' ? COMMON_TOKENS.USDC : 
                       selectedToken === 'USDT' ? COMMON_TOKENS.USDT :
                       COMMON_TOKENS.ETH // fallback

      const link = `${window.location.origin}/pay/${paymentId}`
      
      const paymentLink: PaymentLink = {
        id: paymentId,
        amount,
        token: tokenData.address,
        tokenSymbol: tokenData.symbol,
        merchantAddress,
        link
      }

      // Store payment request in localStorage for demo (in real app, store in database)
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
    <div className="space-y-6">
      <form onSubmit={handleGenerateLink} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token
          </label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ETH">ETH - Ethereum</option>
            <option value="MON">MON - Monad</option>
            <option value="USDC">USDC - USD Coin</option>
            <option value="USDT">USDT - Tether</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.000001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !amount}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate Payment Link'}
        </button>
      </form>

      {generatedLink && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="font-semibold text-green-800">Payment Link Generated!</h4>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-1">Payment Details:</p>
              <p className="text-lg font-semibold text-gray-900">
                {generatedLink.amount} {generatedLink.tokenSymbol}
              </p>
              <p className="text-sm text-gray-600">
                To: {merchantAddress.slice(0, 8)}...{merchantAddress.slice(-6)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Share Payment Link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={generatedLink.link}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white font-mono"
                />
                <button
                  onClick={() => copyToClipboard(generatedLink.link)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    copied 
                      ? 'bg-green-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <QRCodeGenerator 
                value={generatedLink.link} 
                title="Scan to Pay"
                size={200}
              />
            </div>

            <div className="text-center">
              <a 
                href={generatedLink.link}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
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