import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return (
    <div className="space-y-3">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}