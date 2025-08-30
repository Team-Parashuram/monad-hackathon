"use client"
import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  value: string
  size?: number
  title?: string
}

const QRCodeGenerator = ({ value, size = 256, title }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (canvasRef.current && value) {
      setIsLoading(true)
      setError(null)
      
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#1f2937', // gray-800
          light: '#ffffff'
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
  }, [value, size])

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
      <div className="text-center p-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      {title && (
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      )}
      <div className="relative inline-block">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
            <svg className="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="border border-gray-200 rounded-lg shadow-sm bg-white" 
        />
      </div>
      <button
        onClick={downloadQR}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download QR
      </button>
    </div>
  )
}

export default QRCodeGenerator