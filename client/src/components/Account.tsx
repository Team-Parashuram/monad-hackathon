import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div className="text-center space-y-4">
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} className="w-16 h-16 rounded-full mx-auto" />}
      {address && (
        <div className="space-y-2">
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">
            {ensName ? `${ensName} (${address})` : `${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
        </div>
      )}
      <button 
        onClick={() => disconnect()}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
      >
        Disconnect
      </button>
    </div>
  )
}