import * as React from 'react'
import { Connector, useConnect, useSwitchChain } from 'wagmi'
import { localhost, monadTestnet } from '@/app/config'
import { Wallet, Link, Shield } from 'lucide-react'

export function WalletOptions() {
  const { connectors, connect } = useConnect()
  const { switchChain } = useSwitchChain()

  const handleConnect = async (connector: Connector) => {
    try {
      await connect({ connector })
      try {
        const targetChain = process.env.NEXT_PUBLIC_NETWORK_MODE === "production" ? monadTestnet.id : localhost.id
        await switchChain({ chainId: targetChain })
      } catch (error) {
        console.log('Network switch failed or user rejected:', error)
      }
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  const getWalletIcon = (name: string) => {
    switch(name) {
      case 'MetaMask':
        return (
          <div className="w-8 h-8 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white dark:text-black" />
          </div>
        )
      case 'WalletConnect':
        return (
          <div className="w-8 h-8 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
            <Link className="w-5 h-5 text-white dark:text-black" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white dark:text-black" />
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => handleConnect(connector)}
          className="w-full bg-orange-300 hover:bg-orange-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center text-sm sm:text-base font-semibold shadow-lg border-0"
        >
          <div className="flex items-center gap-3">
            {getWalletIcon(connector.name)}
            <span>Connect {connector.name}</span>
          </div>
        </button>
      ))}
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-orange-500 dark:bg-yellow-500 rounded-full" />
          <span>Auto-switches to {process.env.NEXT_PUBLIC_NETWORK_MODE === "production" ? 'Monad Testnet' : 'Localhost'}</span>
        </div>
      </div>
    </div>
  )
}