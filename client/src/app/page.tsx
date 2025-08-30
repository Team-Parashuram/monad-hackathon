"use client"
import React, { FC, useEffect, useRef, useCallback, useMemo } from 'react'
import { Account } from '@/components/Account'
import { WalletOptions } from '@/components/WalletOptions'
import { Footer } from '@/components/Footer'
import { SimpleThemeToggle } from '@/components/theme-toggle'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Wallet, Link2, Coins, ArrowRight, Sparkles, Zap, TrendingUp, Shield, Globe, Rocket, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { gsap } from 'gsap'

// TargetCursor Component Interface
export interface TargetCursorProps {
  targetSelector?: string
  spinDuration?: number
  hideDefaultCursor?: boolean
}

// TargetCursor Component
const TargetCursor: FC<TargetCursorProps> = ({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null)
  const spinTl = useRef<gsap.core.Timeline | null>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  
  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12,
      parallaxStrength: 0.00005,
    }),
    []
  )
  
  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: "power3.out",
    })
  }, [])
  
  useEffect(() => {
    if (!cursorRef.current) return
    const originalCursor = document.body.style.cursor
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none'
    }
    
    const cursor = cursorRef.current
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(
      ".target-cursor-corner"
    )
    
    let activeTarget: Element | null = null
    let currentTargetMove: ((ev: Event) => void) | null = null
    let currentLeaveHandler: (() => void) | null = null
    let isAnimatingToTarget = false
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null
    
    const cleanupTarget = (target: Element) => {
      if (currentTargetMove) {
        target.removeEventListener("mousemove", currentTargetMove)
      }
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler)
      }
      currentTargetMove = null
      currentLeaveHandler = null
    }
    
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    
    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill()
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" })
    }
    
    createSpinTimeline()
    
    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY)
    window.addEventListener("mousemove", moveHandler)
    
    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return
      const mouseX = gsap.getProperty(cursorRef.current, "x") as number
      const mouseY = gsap.getProperty(cursorRef.current, "y") as number
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY)
      const isStillOverTarget = elementUnderMouse && (
        elementUnderMouse === activeTarget ||
        elementUnderMouse.closest(targetSelector) === activeTarget
      )
      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler()
        }
      }
    }
    
    window.addEventListener("scroll", scrollHandler, { passive: true })
    
    // Click animation handlers
    const mouseDownHandler = (): void => {
      if (!dotRef.current) return
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 })
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 })
    }
    
    const mouseUpHandler = (): void => {
      if (!dotRef.current) return
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 })
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 })
    }
    
    window.addEventListener("mousedown", mouseDownHandler)
    window.addEventListener("mouseup", mouseUpHandler)
    
    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as Element
      const allTargets: Element[] = []
      let current = directTarget
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current)
        }
        current = current.parentElement!
      }
      
      const target = allTargets[0] || null
      if (!target || !cursorRef.current || !cornersRef.current) return
      if (activeTarget === target) return
      
      if (activeTarget) {
        cleanupTarget(activeTarget)
      }
      
      if (resumeTimeout) {
        clearTimeout(resumeTimeout)
        resumeTimeout = null
      }
      
      activeTarget = target
      const corners = Array.from(cornersRef.current)
      corners.forEach(corner => {
        gsap.killTweensOf(corner)
      })
      
      gsap.killTweensOf(cursorRef.current, "rotation")
      spinTl.current?.pause()
      gsap.set(cursorRef.current, { rotation: 0 })
      
      const updateCorners = (mouseX?: number, mouseY?: number) => {
        const rect = target.getBoundingClientRect()
        const cursorRect = cursorRef.current!.getBoundingClientRect()
        const cursorCenterX = cursorRect.left + cursorRect.width / 2
        const cursorCenterY = cursorRect.top + cursorRect.height / 2
        
        const [tlc, trc, brc, blc] = Array.from(cornersRef.current!)
        const { borderWidth, cornerSize, parallaxStrength } = constants
        
        let tlOffset = {
          x: rect.left - cursorCenterX - borderWidth,
          y: rect.top - cursorCenterY - borderWidth,
        }
        let trOffset = {
          x: rect.right - cursorCenterX + borderWidth - cornerSize,
          y: rect.top - cursorCenterY - borderWidth,
        }
        let brOffset = {
          x: rect.right - cursorCenterX + borderWidth - cornerSize,
          y: rect.bottom - cursorCenterY + borderWidth - cornerSize,
        }
        let blOffset = {
          x: rect.left - cursorCenterX - borderWidth,
          y: rect.bottom - cursorCenterY + borderWidth - cornerSize,
        }
        
        if (mouseX !== undefined && mouseY !== undefined) {
          const targetCenterX = rect.left + rect.width / 2
          const targetCenterY = rect.top + rect.height / 2
          const mouseOffsetX = (mouseX - targetCenterX) * parallaxStrength
          const mouseOffsetY = (mouseY - targetCenterY) * parallaxStrength
          
          tlOffset.x += mouseOffsetX
          tlOffset.y += mouseOffsetY
          trOffset.x += mouseOffsetX
          trOffset.y += mouseOffsetY
          brOffset.x += mouseOffsetX
          brOffset.y += mouseOffsetY
          blOffset.x += mouseOffsetX
          blOffset.y += mouseOffsetY
        }
        
        const tl = gsap.timeline()
        const corners = [tlc, trc, brc, blc]
        const offsets = [tlOffset, trOffset, brOffset, blOffset]
        
        corners.forEach((corner, index) => {
          tl.to(
            corner,
            {
              x: offsets[index].x,
              y: offsets[index].y,
              duration: 0.2,
              ease: "power2.out",
            },
            0
          )
        })
      }
      
      isAnimatingToTarget = true
      updateCorners()
      setTimeout(() => {
        isAnimatingToTarget = false
      }, 1)
      
      let moveThrottle: number | null = null
      const targetMove = (ev: Event) => {
        if (moveThrottle || isAnimatingToTarget) return
        moveThrottle = requestAnimationFrame(() => {
          const mouseEvent = ev as MouseEvent
          updateCorners(mouseEvent.clientX, mouseEvent.clientY)
          moveThrottle = null
        })
      }
      
      const leaveHandler = () => {
        activeTarget = null
        isAnimatingToTarget = false
        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current)
          gsap.killTweensOf(corners)
          const { cornerSize } = constants
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 },
          ]
          
          const tl = gsap.timeline()
          corners.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: "power3.out",
              },
              0
            )
          })
        }
        
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(
              cursorRef.current,
              "rotation"
            ) as number
            const normalizedRotation = currentRotation % 360
            spinTl.current.kill()
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: "+=360", duration: spinDuration, ease: "none" })
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => {
                spinTl.current?.restart()
              },
            })
          }
          resumeTimeout = null
        }, 50)
        
        cleanupTarget(target)
      }
      
      currentTargetMove = targetMove
      currentLeaveHandler = leaveHandler
      target.addEventListener("mousemove", targetMove)
      target.addEventListener("mouseleave", leaveHandler)
    }
    
    window.addEventListener("mouseover", enterHandler, { passive: true })
    
    return () => {
      window.removeEventListener("mousemove", moveHandler)
      window.removeEventListener("mouseover", enterHandler)
      window.removeEventListener("scroll", scrollHandler)
      window.removeEventListener("mousedown", mouseDownHandler)
      window.removeEventListener("mouseup", mouseUpHandler)
      if (activeTarget) {
        cleanupTarget(activeTarget)
      }
      spinTl.current?.kill()
      document.body.style.cursor = originalCursor
    }
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor])
  
  useEffect(() => {
    if (!cursorRef.current || !spinTl.current) return
    if (spinTl.current.isActive()) {
      spinTl.current.kill()
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: "+=360", duration: spinDuration, ease: "none" })
    }
  }, [spinDuration])
  
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: 'transform' }}
    >
      <div 
        ref={dotRef}
        className="absolute left-1/2 top-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white transform -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white transform translate-x-1/2 -translate-y-[150%] border-l-0 border-b-0"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white transform translate-x-1/2 translate-y-1/2 border-l-0 border-t-0"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute left-1/2 top-1/2 w-3 h-3 border-[3px] border-white transform -translate-x-[150%] translate-y-1/2 border-r-0 border-t-0"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}

// Main App Component Type Definitions
interface StepItemProps {
  number: string | number
  title: string
  description: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
  icon: LucideIcon
  delay?: number
}

interface HeroSectionProps {
  isConnected: boolean
}

interface WalletConnectionCardProps {
  isConnected: boolean
}

interface NavigationProps {
  isConnected: boolean
}

interface FeatureItem {
  label: string
  value: string
  color: 'green' | 'blue' | 'purple' | 'orange'
}

// Animated Step Component inspired by React Bits
// Professional Step Component
const StepItem: FC<StepItemProps> = ({ number, title, description, color, icon: Icon, delay = 0 }) => {
  
  return (
    <div className="text-center p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 transition-colors hover:shadow-lg">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white dark:text-black" />
        </div>
        <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-orange-300 dark:bg-yellow-500 rounded-full flex items-center justify-center text-white dark:text-black text-sm sm:text-base font-bold shadow-lg">
          {number}
        </div>
      </div>
      
      <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg sm:text-xl">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// Professional Hero Section Component
const HeroSection: FC<HeroSectionProps> = ({ isConnected }) => {
  return (
    <div className="relative text-center mb-16 sm:mb-20 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-12 bg-orange-300 dark:bg-yellow-500 rounded-xl flex items-center justify-center">
            <Coins className="w-7 h-7 text-white dark:text-black" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white">
            MonadPe
          </h1>
        </div>
        
        <div className="mb-8">
          <p className="text-xl sm:text-2xl lg:text-3xl mb-4 font-bold text-gray-800 dark:text-gray-200">
            The Future of Crypto Payments
          </p>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
            Built on <span className="font-bold text-orange-300 dark:text-yellow-500">Monad</span> • Lightning Fast • Zero Fees
          </p>
          <p className="text-base lg:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Accept payments in <span className="font-semibold text-orange-300 dark:text-yellow-500">ETH, MON, USDC, and USDT</span> with just a link. 
            No complex setup, no hidden fees, no hassle.
          </p>
        </div>

        {!isConnected && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-orange-300 hover:bg-orange-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300 text-lg border-0">
              Get Started Now
              <Rocket className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 dark:border-gray-600 hover:border-orange-500 dark:hover:border-yellow-500 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300">
              Learn More
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Professional Wallet Connection Card
const WalletConnectionCard: FC<WalletConnectionCardProps> = ({ isConnected }) => {
  return (
    <div className="max-w-lg mx-auto mb-16 sm:mb-20">
      <Card className="shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="p-8 sm:p-10">
          {isConnected ? (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-orange-300 dark:bg-yellow-500 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white dark:text-black" />
              </div>
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-orange-300 dark:text-yellow-500 mb-3 flex items-center gap-3 justify-center">
                  <Rocket className="w-8 h-8" />
                  Ready to Launch!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">Your wallet is connected and ready to accept payments</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <Account />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full bg-orange-300 hover:bg-orange-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 text-base sm:text-lg border-0">
                    <Rocket className="w-5 h-5 mr-2" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-300 dark:bg-yellow-500 rounded-xl flex items-center justify-center mx-auto shadow-lg mb-6">
                <Wallet className="w-10 h-10 text-white dark:text-black" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-base sm:text-lg px-4">
                Connect your wallet to start accepting crypto payments on the 
                <span className="font-bold text-orange-300 dark:text-yellow-500"> Monad blockchain</span>
              </p>
              
              <div className="space-y-6">
                <WalletOptions />
                
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span>Secure connection via WalletConnect</span>
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Professional Navigation
const Navigation: FC<NavigationProps> = ({ isConnected }) => {
  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-300 dark:bg-yellow-500 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                MonadPe
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Web3 Payments</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="scale-90 sm:scale-100">
              <SimpleThemeToggle />
            </div>
            {isConnected && (
              <Link href="/dashboard">
                <Button className="bg-orange-300 hover:bg-orange-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-black px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold border-0 transition-colors">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dash</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Main App Component
const ConnectWallet: FC = () => {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

const Home: FC = () => {
  const { isConnected } = useAccount()
  
  const features: FeatureItem[] = [
    { label: "Zero Setup Fees", value: "Free", color: "green" },
    { label: "Transaction Time", value: "< 2 min", color: "blue" },
    { label: "Supported Tokens", value: "4+", color: "purple" },
    { label: "Network", value: "Monad", color: "orange" }
  ]
  
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
      <Navigation isConnected={isConnected} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <HeroSection isConnected={isConnected} />
        
        <WalletConnectionCard isConnected={isConnected} />
        
        {/* Professional Steps Section */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-yellow-500/20 rounded-lg px-6 py-3 mb-6 border border-orange-200 dark:border-yellow-500/30">
              <TrendingUp className="w-5 h-5 text-orange-300 dark:text-yellow-500" />
              <span className="text-sm font-semibold text-green-700 dark:text-yellow-400">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Simple. Fast. Secure.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-base sm:text-lg px-4 leading-relaxed">
              Get started with crypto payments in three simple steps. No complex setup, no hidden fees, just seamless Web3 payments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <StepItem
              number="01"
              title="Connect Wallet"
              description="Connect your MetaMask, WalletConnect, or any compatible Ethereum wallet securely to the Monad network"
              color="blue"
              icon={Wallet}
              delay={0}
            />
            <StepItem
              number="02"
              title="Create Payment Link"
              description="Generate customizable QR codes and shareable payment links for your customers in seconds"
              color="green"
              icon={Link2}
              delay={200}
            />
            <StepItem
              number="03"
              title="Get Paid Instantly"
              description="Receive payments directly to your wallet with real-time notifications and zero transaction fees"
              color="purple"
              icon={Coins}
              delay={400}
            />
          </div>
        </section>
        
        {/* Professional Features Section */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-yellow-500/20 rounded-lg px-6 py-3 mb-6 border border-orange-200 dark:border-yellow-500/30">
              <Shield className="w-5 h-5 text-orange-300 dark:text-yellow-500" />
              <span className="text-sm font-semibold text-green-700 dark:text-yellow-400">Why Choose MonadPe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for the Future
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature: FeatureItem, index: number) => {
              const icons = {
                green: <TrendingUp className="w-6 h-6 text-orange-300 dark:text-yellow-500" />,
                blue: <Rocket className="w-6 h-6 text-orange-300 dark:text-yellow-500" />,
                purple: <Globe className="w-6 h-6 text-orange-300 dark:text-yellow-500" />,
                orange: <Shield className="w-6 h-6 text-orange-300 dark:text-yellow-500" />
              }
              
              return (
                <Card key={index} className="text-center p-4 sm:p-6 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 transition-all duration-300 hover:shadow-lg rounded-lg">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-3">
                      {icons[feature.color]}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold mb-2 text-orange-300 dark:text-yellow-500">
                      {feature.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">{feature.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default Home
