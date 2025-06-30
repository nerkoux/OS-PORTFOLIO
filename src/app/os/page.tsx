"use client"

import { useState, useEffect } from "react"
import { BootSequence } from "@/components/os/boot-sequence"
import { LoginScreen } from "@/components/os/login-screen"
import { Desktop } from "@/components/os/desktop"
import { MobileOS } from "@/components/os/mobile-os"
import { AudioProvider } from "@/components/os/audio-provider"
import { OSStateProvider } from "@/components/os/os-state"

export default function OSPage() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
      const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword))
      const isMobileViewport = window.innerWidth <= 768
      return isMobileUserAgent || isMobileViewport
    }
    
    setIsMobile(checkMobile())
    
    // Listen for resize events
    const handleResize = () => {
      setIsMobile(checkMobile())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!mounted) {
    return null
  }

  // Show mobile OS directly for mobile devices
  if (isMobile) {
    return (
      <AudioProvider>
        <OSStateProvider>
          <div className="min-h-screen overflow-hidden">
            <MobileOS />
          </div>
        </OSStateProvider>
      </AudioProvider>
    )
  }

  return (
    <AudioProvider>
      <OSStateProvider>
        <div className="min-h-screen overflow-hidden">
          <OSRenderer />
        </div>
      </OSStateProvider>
    </AudioProvider>
  )
}

function OSRenderer() {
  const [currentScreen, setCurrentScreen] = useState<'boot' | 'login' | 'desktop'>('boot')

  const handleBootComplete = () => {
    setCurrentScreen('login')
  }

  const handleLoginComplete = () => {
    setCurrentScreen('desktop')
  }

  if (currentScreen === 'boot') {
    return <BootSequence onComplete={handleBootComplete} />
  }

  if (currentScreen === 'login') {
    return <LoginScreen onComplete={handleLoginComplete} />
  }

  return <Desktop />
}
