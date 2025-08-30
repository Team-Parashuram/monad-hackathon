"use client"
import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  value: string
  size?: number
}

const QRCodeGenerator = ({ value, size = 200 }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error)
      })
    }
  }, [value, size])

  if (!value) return null

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="border border-gray-200 rounded" />
    </div>
  )
}

export default QRCodeGenerator