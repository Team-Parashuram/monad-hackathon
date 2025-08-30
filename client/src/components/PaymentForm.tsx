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

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !selectedToken) return

    setIsLoading(true)
    
    try {
      const paymentId = uuidv4()
      const tokenData = selectedToken === 'ETH' ? COMMON_TOKENS.ETH : 
                       selectedToken === 'USDC' ? COMMON_TOKENS.USDC : 
                       COMMON_TOKENS.USDT

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
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
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Payment Link Generated</h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Payment Details:</p>
              <p className="text-sm text-gray-600">
                {generatedLink.amount} {generatedLink.tokenSymbol} to {merchantAddress.slice(0, 6)}...{merchantAddress.slice(-4)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">Payment Link:</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={generatedLink.link}
                  readOnly
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded bg-white"
                />
                <button
                  onClick={() => copyToClipboard(generatedLink.link)}
                  className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">QR Code:</p>
              <QRCodeGenerator value={generatedLink.link} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentForm