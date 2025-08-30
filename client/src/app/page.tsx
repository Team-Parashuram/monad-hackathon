"use client"
import { Account } from '@/components/Account'
import { WalletOptions } from '@/components/WalletOptions'
import { Footer } from '@/components/Footer'
import { useAccount } from 'wagmi'
import Link from 'next/link'

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MonadPe</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected && (
                <Link 
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              MonadPe
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Simple crypto payments on Monad
            </p>
            <p className="text-lg text-gray-500">
              Accept payments in ETH, MON, USDC, and USDT with just a link
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto mb-16">
            {isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-green-600 mb-4">Wallet Connected!</h2>
                <Account />
                <Link 
                  href="/dashboard"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md text-center font-semibold"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Get Started</h2>
                <p className="text-gray-600 mb-4">Connect your wallet to start accepting crypto payments</p>
                <ConnectWallet />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Connect Wallet</h3>
              <p className="text-gray-600 text-sm">Connect your MetaMask or other wallet</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Create Payment Link</h3>
              <p className="text-gray-600 text-sm">Generate QR codes and payment links</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Paid</h3>
              <p className="text-gray-600 text-sm">Receive payments directly to your wallet</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
