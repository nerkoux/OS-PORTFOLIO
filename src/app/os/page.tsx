"use client"

import { useState, useEffect } from "react"
import { BootSequence } from "@/components/os/boot-sequence"
import { LoginScreen } from "@/components/os/login-screen"
import { Desktop } from "@/components/os/desktop"
import { AudioProvider } from "@/components/os/audio-provider"
import { OSStateProvider } from "@/components/os/os-state"

export default function OSPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
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
