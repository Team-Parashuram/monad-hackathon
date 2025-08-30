"use client"
import React, { useState } from 'react'
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import PaymentForm from '@/components/PaymentForm'
import { WalletOptions } from '@/components/WalletOptions'
import { localhost, monadTestnet } from '@/app/config'

export default function Dashboard() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const isOnCorrectNetwork = process.env.NEXT_PUBLIC_NETWORK_MODE === "production" 
    ? chain?.id === monadTestnet.id 
    : chain?.id === localhost.id || chain?.id === monadTestnet.id

  const handleNetworkSwitch = async () => {
    try {
      const targetChain = process.env.NEXT_PUBLIC_NETWORK_MODE === "production" ? monadTestnet.id : localhost.id
      await switchChain({ chainId: targetChain })
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">MonadPe Dashboard</h1>
          <p className="text-gray-600 mb-6 text-center">
            Connect your wallet to create payment links
          </p>
          <WalletOptions />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MonadPe</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <div>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</div>
                <div className="text-xs">{chain?.name || 'Unknown Network'}</div>
              </div>
              <button
                onClick={() => disconnect()}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Merchant Dashboard
          </h2>
          <p className="text-gray-600">
            Create payment links and QR codes for your customers
          </p>
        </div>

        {!isOnCorrectNetwork && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="font-medium text-yellow-800">Wrong Network</h3>
                  <p className="text-sm text-yellow-700">Please switch to the correct network to create payment links.</p>
                </div>
              </div>
              <button
                onClick={handleNetworkSwitch}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Create Payment Link</h3>
            {isOnCorrectNetwork ? (
              <PaymentForm merchantAddress={address ?? ''} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Please switch to the correct network to create payment links.</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            <div className="text-gray-500 text-center py-8">
              Payment history will appear here
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}