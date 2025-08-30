"use client"
import React, { FC, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Sparkles } from 'lucide-react'

// FuzzyText Component Interface
interface FuzzyTextProps {
  children: React.ReactNode
  fontSize?: number | string
  fontWeight?: string | number
  fontFamily?: string
  color?: string
  enableHover?: boolean
  baseIntensity?: number
  hoverIntensity?: number
}

// FuzzyText Component
const FuzzyText: FC<FuzzyTextProps> = ({
  children,
  fontSize = "clamp(2rem, 8vw, 8rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff",
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzyText?: () => void}>(null)
  
  useEffect(() => {
    let animationFrameId: number
    let isCancelled = false
    const canvas = canvasRef.current
    if (!canvas) return
    
    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready
      }
      if (isCancelled) return
      
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      
      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily
          
      const fontSizeStr =
        typeof fontSize === "number" ? `${fontSize}px` : fontSize
        
      let numericFontSize: number
      if (typeof fontSize === "number") {
        numericFontSize = fontSize
      } else {
        const temp = document.createElement("span")
        temp.style.fontSize = fontSize
        document.body.appendChild(temp)
        const computedSize = window.getComputedStyle(temp).fontSize
        numericFontSize = parseFloat(computedSize)
        document.body.removeChild(temp)
      }
      
      const text = React.Children.toArray(children).join("")
      const offscreen = document.createElement("canvas")
      const offCtx = offscreen.getContext("2d")
      if (!offCtx) return
      
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`
      offCtx.textBaseline = "alphabetic"
      const metrics = offCtx.measureText(text)
      
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0
      const actualRight = metrics.actualBoundingBoxRight ?? metrics.width
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize
      const actualDescent =
        metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2
        
      const textBoundingWidth = Math.ceil(actualLeft + actualRight)
      const tightHeight = Math.ceil(actualAscent + actualDescent)
      
      const extraWidthBuffer = 10
      const offscreenWidth = textBoundingWidth + extraWidthBuffer
      offscreen.width = offscreenWidth
      offscreen.height = tightHeight
      
      const xOffset = extraWidthBuffer / 2
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`
      offCtx.textBaseline = "alphabetic"
      offCtx.fillStyle = color
      offCtx.fillText(text, xOffset - actualLeft, actualAscent)
      
      const horizontalMargin = 50
      const verticalMargin = 0
      canvas.width = offscreenWidth + horizontalMargin * 2
      canvas.height = tightHeight + verticalMargin * 2
      ctx.translate(horizontalMargin, verticalMargin)
      
      const interactiveLeft = horizontalMargin + xOffset
      const interactiveTop = verticalMargin
      const interactiveRight = interactiveLeft + textBoundingWidth
      const interactiveBottom = interactiveTop + tightHeight
      
      let isHovering = false
      const fuzzRange = 30
      
      const run = () => {
        if (isCancelled) return
        
        ctx.clearRect(
          -fuzzRange,
          -fuzzRange,
          offscreenWidth + 2 * fuzzRange,
          tightHeight + 2 * fuzzRange
        )
        
        const intensity = isHovering ? hoverIntensity : baseIntensity
        
        for (let j = 0; j < tightHeight; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange)
          ctx.drawImage(
            offscreen,
            0,
            j,
            offscreenWidth,
            1,
            dx,
            j,
            offscreenWidth,
            1
          )
        }
        
        animationFrameId = window.requestAnimationFrame(run)
      }
      
      run()
      
      const isInsideTextArea = (x: number, y: number) =>
        x >= interactiveLeft &&
        x <= interactiveRight &&
        y >= interactiveTop &&
        y <= interactiveBottom
        
      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) return
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        isHovering = isInsideTextArea(x, y)
      }
      
      const handleMouseLeave = () => {
        isHovering = false
      }
      
      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) return
        e.preventDefault()
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        isHovering = isInsideTextArea(x, y)
      }
      
      const handleTouchEnd = () => {
        isHovering = false
      }
      
      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove)
        canvas.addEventListener("mouseleave", handleMouseLeave)
        canvas.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        })
        canvas.addEventListener("touchend", handleTouchEnd)
      }
      
      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId)
        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove)
          canvas.removeEventListener("mouseleave", handleMouseLeave)
          canvas.removeEventListener("touchmove", handleTouchMove)
          canvas.removeEventListener("touchend", handleTouchEnd)
        }
      }
      
      canvas.cleanupFuzzyText = cleanup
    }
    
    init()
    
    return () => {
      isCancelled = true
      window.cancelAnimationFrame(animationFrameId)
      if (canvas && canvas.cleanupFuzzyText) {
        canvas.cleanupFuzzyText()
      }
    }
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
  ])
  
  return <canvas ref={canvasRef} />
}

// Not Found Page Component
const NotFound: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/30 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="text-center z-10 px-4 max-w-4xl mx-auto">
        {/* Main 404 Text with FuzzyText */}
        <div className="mb-8 flex justify-center">
          <FuzzyText
            fontSize="clamp(4rem, 12vw, 12rem)"
            fontWeight={900}
            color="#ffffff"
            enableHover={true}
            baseIntensity={0.25}
            hoverIntensity={0.8}
          >
            404
          </FuzzyText>
        </div>
        
        {/* Secondary Text with FuzzyText */}
        <div className="mb-6 flex justify-center">
          <FuzzyText
            fontSize="clamp(1.5rem, 4vw, 3rem)"
            fontWeight={700}
            color="#a5b4fc"
            enableHover={true}
            baseIntensity={0.15}
            hoverIntensity={0.6}
          >
            Page Not Found
          </FuzzyText>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Oops! It looks like this page has vanished into the blockchain. 
          The page you're looking for might have been moved, deleted, or never existed.
        </p>
        
        {/* Glitch Effect for Error Code */}
        <div className="mb-12 relative">
          <div className="text-red-400 font-mono text-sm opacity-60 animate-pulse">
            ERROR_CODE: WALLET_NOT_FOUND_0x404
          </div>
          <div className="absolute inset-0 text-red-400 font-mono text-sm opacity-30 animate-ping">
            ERROR_CODE: WALLET_NOT_FOUND_0x404
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Back to Home
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button variant="outline" className="border-2 border-gray-300 text-gray-300 hover:border-white hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 group bg-transparent">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
