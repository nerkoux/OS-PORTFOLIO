'use client'

import { useState, useEffect } from 'react'
import { AudioProvider } from '@/components/os/audio-provider'
import { BootSequence } from '@/components/os/boot-sequence'
import { LoginScreen } from '@/components/os/login-screen'
import { Desktop } from '@/components/os/desktop'
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-6">💻</div>
          <h1 className="text-2xl font-bold mb-4">Akshat OS</h1>
          <p className="text-lg opacity-90 mb-6">
            Please view on desktop for the full immersive experience.
          </p>
          <p className="text-sm opacity-70">
            This portfolio is designed to mimic a desktop operating system with interactive windows, animations, and audio.
          </p>
        </div>
      </div>
    )
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
