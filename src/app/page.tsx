'use client'

import { useState, useEffect } from 'react'
import { AudioProvider } from '@/components/os/audio-provider'
import { BootSequence } from '@/components/os/boot-sequence'
import { LoginScreen } from '@/components/os/login-screen'
import { Desktop } from '@/components/os/desktop'
import { MobileOS } from '@/components/os/mobile-os'
import { OSStateProvider } from '@/components/os/os-state'

type OSPhase = 'boot' | 'login' | 'desktop'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<OSPhase>('boot')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleBootComplete = () => {
    setCurrentPhase('login')
  }

  const handleLoginComplete = () => {
    setCurrentPhase('desktop')
  }

  if (isMobile) {
    return <MobileOS />
  }

  return (
    <AudioProvider>
      <OSStateProvider>
        <div className="h-screen overflow-hidden bg-black">
          {currentPhase === 'boot' && <BootSequence onComplete={handleBootComplete} />}
          {currentPhase === 'login' && <LoginScreen onComplete={handleLoginComplete} />}
          {currentPhase === 'desktop' && <Desktop />}
        </div>
      </OSStateProvider>
    </AudioProvider>
  )
}
