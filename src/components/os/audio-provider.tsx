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

  useEffect(() => {
    // Preload sounds
    Object.entries(sounds).forEach(([name, src]) => {
      console.log(`Loading sound: ${name} from ${src}`)
      soundsRef.current[name] = new Howl({
        src: [src],
        volume: 0.5,
        preload: true,
        onload: () => {
          console.log(`Successfully loaded sound: ${name}`)
        },
        onloaderror: (id, error) => {
          console.error(`Failed to load sound: ${name}`, error)
        },
        onplayerror: (id, error) => {
          console.error(`Failed to play sound: ${name}`, error)
        }
      })
    })

    return () => {
      // Cleanup on unmount
      Object.values(soundsRef.current).forEach(sound => {
        sound.unload()
      })
    }
  }, [])

  const playSound = (soundName: string) => {
    console.log(`Attempting to play sound: ${soundName}, isEnabled: ${isEnabled}, isMuted: ${isMuted}`)
    
    // Allow boot sound to play even when audio is initially disabled
    if (soundName !== 'boot' && (!isEnabled || isMuted)) {
      console.log(`Sound ${soundName} blocked - audio disabled or muted`)
      return
    }
    
    const sound = soundsRef.current[soundName]
    if (sound) {
      console.log(`Playing sound: ${soundName}`)
      sound.play()
    } else {
      console.warn(`Sound not found: ${soundName}`)
    }
  }

  const setVolume = (volume: number) => {
    Howler.volume(volume)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    Howler.mute(!isMuted)
  }

  const setEnabled = (enabled: boolean) => {
    console.log(`Audio enabled state changing from ${isEnabled} to ${enabled}`)
    setIsEnabled(enabled)
    if (!enabled) {
      Howler.mute(true)
    } else {
      Howler.mute(isMuted)
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
