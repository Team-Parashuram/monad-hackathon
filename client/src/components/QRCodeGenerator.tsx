"use client"
import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { useTheme } from 'next-themes'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  title?: string
}

const QRCodeGenerator = ({ value, size = 256, title }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (canvasRef.current && value && mounted) {
      setIsLoading(true)
      setError(null)
      
      // Determine colors based on theme
      const isDark = resolvedTheme === 'dark'
      
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: isDark ? '#ffffff' : '#1f2937', // white for dark mode, gray-800 for light
          light: isDark ? '#1f2937' : '#ffffff' // gray-800 for dark mode, white for light
        },
        errorCorrectionLevel: 'M'
      }, (error) => {
        setIsLoading(false)
        if (error) {
          console.error('QR Code generation error:', error)
          setError('Failed to generate QR code')
        }
      })
    }
  }, [value, size, mounted, resolvedTheme])

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = 'monadpe-payment-qr.png'
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  if (!value) return null

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-red-500/30">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="text-center p-6">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-3xl animate-pulse mx-auto backdrop-blur-sm"></div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      {title && (
        <h4 className="text-lg font-bold text-orange-200 dark:text-yellow-500">{title}</h4>
      )}
      <div className="relative inline-block group">
        <div className="relative p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg backdrop-blur-sm z-10">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 dark:border-yellow-500/20 dark:border-t-yellow-500 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Generating QR...</p>
              </div>
            </div>
          )}
          
          <div className="relative z-0">
            <canvas 
              ref={canvasRef} 
              className="rounded-lg shadow-sm max-w-full h-auto bg-white dark:bg-gray-800" 
            />
          </div>
        </div>
        
        {/* Download button on hover */}
        <button
          onClick={downloadQR}
          className="absolute top-2 right-2 p-2 bg-gray-800/80 hover:bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border-0 backdrop-blur-sm"
          title="Download QR Code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default QRCodeGenerator