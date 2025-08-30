"use client"
import { Account } from '@/components/Account'
import { WalletOptions } from '@/components/WalletOptions'
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
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MonadPay
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Simple crypto payments for everyone
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            {isConnected ? (
              <div className="space-y-4">
                <Account />
                <Link 
                  href="/dashboard"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Get Started</h2>
                <ConnectWallet />
              </div>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </div>
  )
}
