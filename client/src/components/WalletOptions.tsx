import * as React from 'react'
import { Connector, useConnect, useSwitchChain } from 'wagmi'
import { localhost, monadTestnet } from '@/app/config'

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

  return (
    <div className="space-y-3">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => handleConnect(connector)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          <span className="mr-2">
            {connector.name === 'MetaMask' && '🦊'}
            {connector.name === 'WalletConnect' && '🔗'}
          </span>
          Connect {connector.name}
        </button>
      ))}
      <div className="text-xs text-gray-500 text-center mt-2">
        Will automatically switch to {process.env.NEXT_PUBLIC_NETWORK_MODE === "production" ? 'Monad Testnet' : 'Localhost'}
      </div>
    </div>
  )
}