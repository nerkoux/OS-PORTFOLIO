"use client"

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import { Howl, Howler } from 'howler'

interface AudioContextType {
  playSound: (soundName: string) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  isEnabled: boolean
  setEnabled: (enabled: boolean) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

const sounds = {
  boot: '/sounds/boot.mp3',
  click: '/sounds/click.wav',
  open: '/sounds/open.wav',
  close: '/sounds/close.wav',
  minimize: '/sounds/minimize.wav',
  error: '/sounds/error.wav',
  login: '/sounds/login.wav',
  notification: '/sounds/notification.wav'
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const soundsRef = useRef<{ [key: string]: Howl }>({})
  const [isEnabled, setIsEnabled] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  useEffect(() => {
    // Detect if user is on mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
      return mobileKeywords.some(keyword => userAgent.includes(keyword)) || window.innerWidth <= 768
    }
    
    setIsMobile(checkMobile())
    
    // Don't load sounds on mobile to prevent errors
    if (checkMobile()) {
      console.log('Mobile device detected - skipping audio loading')
      return
    }

    // Preload sounds only on desktop
    Object.entries(sounds).forEach(([name, src]) => {
      console.log(`Loading sound: ${name} from ${src}`)
      soundsRef.current[name] = new Howl({
        src: [src],
        volume: 0.5,
        preload: true,
        onload: () => {
          console.log(`Successfully loaded sound: ${name}`)
        },
        onloaderror: () => {
          console.warn(`Failed to load sound: ${name} - this is normal on mobile devices`)
        },
        onplayerror: () => {
          console.warn(`Failed to play sound: ${name} - this is normal on mobile devices`)
        }
      })
    })

    return () => {
      // Cleanup on unmount
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const currentSounds = soundsRef.current
      Object.values(currentSounds).forEach(sound => {
        sound.unload()
      })
    }
  }, [])

  const playSound = (soundName: string) => {
    // Don't try to play sounds on mobile devices
    if (isMobile) {
      console.log(`Sound ${soundName} skipped - mobile device detected`)
      return
    }

    console.log(`Attempting to play sound: ${soundName}, isEnabled: ${isEnabled}, isMuted: ${isMuted}`)
    
    // Allow boot sound to play even when audio is initially disabled
    if (soundName !== 'boot' && (!isEnabled || isMuted)) {
      console.log(`Sound ${soundName} blocked - audio disabled or muted`)
      return
    }
    
    const sound = soundsRef.current[soundName]
    if (sound) {
      console.log(`Playing sound: ${soundName}`)
      try {
        sound.play()
      } catch (error) {
        console.warn(`Failed to play sound: ${soundName}`, error)
      }
    } else {
      console.warn(`Sound not found: ${soundName} - this is normal on mobile devices`)
    }
  }

  const setVolume = (volume: number) => {
    if (!isMobile) {
      Howler.volume(volume)
    }
  }

  const toggleMute = () => {
    if (!isMobile) {
      setIsMuted(!isMuted)
      Howler.mute(!isMuted)
    }
  }

  const setEnabled = (enabled: boolean) => {
    console.log(`Audio enabled state changing from ${isEnabled} to ${enabled}`)
    setIsEnabled(enabled)
    if (!isMobile) {
      if (!enabled) {
        Howler.mute(true)
      } else {
        Howler.mute(isMuted)
      }
    }
  }

  const value: AudioContextType = {
    playSound,
    setVolume,
    toggleMute,
    isEnabled,
    setEnabled
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
