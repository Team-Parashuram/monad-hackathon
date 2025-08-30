"use client"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Built on <span className="font-semibold text-purple-600">Monad</span> - The high-performance EVM
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a 
              href="https://docs.monad.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              Documentation
            </a>
            <a 
              href="https://testnet.monadexplorer.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              Explorer
            </a>
            <a 
              href="https://testnet.monad.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              Faucet
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
