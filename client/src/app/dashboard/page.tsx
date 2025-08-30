"use client"
import React, { useState } from 'react'
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi'
import PaymentForm from '@/components/PaymentForm'
import { WalletOptions } from '@/components/WalletOptions'
import { ThemeToggle } from '@/components/theme-toggle'
import { localhost, monadTestnet } from '@/app/config'
import { Coins, LogOut, AlertTriangle, Link2, BarChart3, Activity, FileText, Lock } from 'lucide-react'

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
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        
        <div className="bg-gray-50 dark:bg-gray-900 p-8 sm:p-10 rounded-lg shadow-lg max-w-lg w-full border border-gray-200 dark:border-gray-800 relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-300 dark:bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Coins className="w-10 h-10 text-white dark:text-black" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              MonadPe Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              Connect your wallet to start creating payment links and accepting crypto payments
            </p>
          </div>
          
          <WalletOptions />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  MonadPe
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="scale-90 sm:scale-100">
                <ThemeToggle />
              </div>
              <div className="hidden sm:block bg-gray-100/50 dark:bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-200/50 dark:border-gray-700/50">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{chain?.name || 'Unknown Network'}</div>
              </div>
              <button
                onClick={() => disconnect()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors border-0 text-sm flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Disconnect</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="mb-10 sm:mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-yellow-500/20 rounded-lg px-6 py-3 mb-6 border border-green-200 dark:border-yellow-500/30">
            <Activity className="w-5 h-5 text-green-600 dark:text-yellow-500" />
            <span className="text-sm font-semibold text-green-700 dark:text-yellow-400">Merchant Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Payment Links
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Generate instant payment links and QR codes for your customers. Accept crypto payments with zero setup fees.
          </p>
        </div>

        {!isOnCorrectNetwork && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-200 text-lg">Wrong Network Detected</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Please switch to the correct network to create payment links and accept payments.</p>
                </div>
              </div>
              <button
                onClick={handleNetworkSwitch}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg border-0"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Link Creation */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Payment Link</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Generate instant crypto payment links</p>
                </div>
              </div>
              
              {isOnCorrectNetwork ? (
                <PaymentForm merchantAddress={address ?? ''} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Switch to the correct network to start creating payment links</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats & Recent Activity */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white dark:text-black" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Links</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Payments</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volume</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">0 ETH</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white dark:text-black" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">Activity will appear here</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Create your first payment link to get started</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}