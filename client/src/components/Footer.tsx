"use client"
import { FileText, Search, Droplets, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative z-10 max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm sm:text-base font-medium">
              Built on <span className="font-bold text-orange-500 dark:text-yellow-500">Monad</span> - The high-performance EVM
            </p>
            <div className="w-24 h-0.5 bg-orange-500 dark:bg-yellow-500 mx-auto rounded-full" />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-8 mb-6">
            <a 
              href="https://docs.monad.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-yellow-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 shadow-sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </a>
            <a 
              href="https://testnet.monadexplorer.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-yellow-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 shadow-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Explorer
            </a>
            <a 
              href="https://testnet.monad.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-yellow-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 shadow-sm"
            >
              <Droplets className="w-4 h-4 mr-2" />
              Faucet
            </a>
          </div>
          
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-6">
            <p className="mb-2">© 2024 MonadPe. Empowering seamless crypto payments.</p>
            <p className="text-gray-500 dark:text-gray-600 flex items-center justify-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500" /> for the Monad ecosystem
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
