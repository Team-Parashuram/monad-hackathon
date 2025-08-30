"use client"
import React, { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import PaymentForm from '@/components/PaymentForm'
import { WalletOptions } from '@/components/WalletOptions'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">MonadPay Dashboard</h1>
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
              <h1 className="text-xl font-bold text-gray-900">MonadPay</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
              </span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Create Payment Link</h3>
            <PaymentForm merchantAddress={address ?? ''} />
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