"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Monitor, Volume2, VolumeX } from 'lucide-react'
import { useAudio } from './audio-provider'

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [stage, setStage] = useState<'disclaimer' | 'booting' | 'complete'>('disclaimer')
  const [bootProgress, setBootProgress] = useState(0)
  const [bootText, setBootText] = useState('')
  const { playSound, setEnabled, isEnabled } = useAudio()

  const bootMessages = [
    'Initializing Akshat OS...',
    'Loading system modules...',
    'Starting graphics engine...',
    'Mounting file systems...',
    'Configuring network interfaces...',
    'Loading user preferences...',
    'Starting desktop environment...',
    'System ready!'
  ]

  useEffect(() => {
    if (stage === 'booting') {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          const newProgress = prev + 1
          const messageIndex = Math.floor((newProgress / 100) * (bootMessages.length - 1))
          setBootText(bootMessages[messageIndex] || bootMessages[bootMessages.length - 1])
          
          if (newProgress >= 100) {
            clearInterval(interval)
            setTimeout(() => setStage('complete'), 500)
            setTimeout(onComplete, 2000)
          }
          
          return newProgress
        })
      }, 30) // Fast boot - completes in ~3 seconds

      return () => clearInterval(interval)
    }
  }, [stage, onComplete])

  const handleBootStart = () => {
    console.log('Boot button clicked')
    setEnabled(true)
    
    // Small delay to ensure audio context is ready
    setTimeout(() => {
      console.log('Playing boot sound')
      playSound('boot')
    }, 100)
    
    setStage('booting')
  }

  if (stage === 'disclaimer') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black flex items-center justify-center"
      >
        <div className="text-center max-w-2xl mx-auto px-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Monitor className="w-24 h-24 mx-auto text-blue-400 mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Akshat OS
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                {isEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-400 mr-2" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <h3 className="text-white font-semibold">Audio Experience</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                For an immersive experience, this OS includes interactive sounds and audio feedback. 
                Audio will only start after you click the boot button below.
              </p>
              <p className="text-gray-400 text-xs">
                Note: Audio can be disabled anytime from the taskbar settings.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={handleBootStart}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Monitor className="w-5 h-5 mr-2" />
              Boot Akshat OS
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (stage === 'booting') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
              `
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Scanning Line Effect */}
        <motion.div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          animate={{
            y: [0, window.innerHeight || 800]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="text-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <Monitor className="w-16 h-16 mx-auto text-blue-400 mb-4" />
            <h2 className="text-3xl font-bold mb-2">Akshat OS</h2>
            <p className="text-gray-400">Starting up...</p>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${bootProgress}%` }}
            className="w-96 max-w-full mx-auto mb-6"
          >
            <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative">
                <motion.div
                  className="absolute inset-0 bg-white/30 rounded-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.p
            key={bootText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-400 font-mono"
          >
            {bootText}
          </motion.p>

          <p className="text-xs text-gray-500 mt-4">
            {bootProgress}% complete
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Monitor className="w-20 h-20 mx-auto text-green-400 mb-4" />
        <h2 className="text-2xl font-bold text-green-400">System Ready</h2>
        <p className="text-gray-400 mt-2">Welcome to Akshat OS</p>
      </motion.div>
    </motion.div>
  )
}
