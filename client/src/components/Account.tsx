import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import { User, LogOut } from 'lucide-react'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className="text-center space-y-4">
      {/* Avatar section */}
      <div className="mb-4">
        {ensAvatar ? (
          <img 
            alt="ENS Avatar" 
            src={ensAvatar} 
            className="w-16 h-16 rounded-lg mx-auto border-2 border-orange-500 dark:border-yellow-500 shadow-lg" 
          />
        ) : (
          <div className="w-16 h-16 bg-orange-300 dark:bg-yellow-500 rounded-lg mx-auto flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white dark:text-black" />
          </div>
        )}
      </div>

      {/* Address section */}
      {address && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">Connected Wallet</p>
          <div className="font-mono text-sm text-gray-900 dark:text-gray-100 font-medium">
            {ensName ? (
              <div className="space-y-1">
                <div className="text-orange-300 dark:text-yellow-500 font-semibold">{ensName}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">{`${address.slice(0, 8)}...${address.slice(-6)}`}</div>
              </div>
            ) : (
              `${address.slice(0, 8)}...${address.slice(-6)}`
            )}
          </div>
        </div>
      )}

      {/* Disconnect button */}
      <button 
        onClick={() => disconnect()}
        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg border-0"
      >
        <LogOut className="w-4 h-4 mr-2" />
        <span>Disconnect Wallet</span>
      </button>
    </div>
  )
}