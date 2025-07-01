"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  User, 
  FolderOpen, 
  Mail, 
  Briefcase, 
  Code2, 
  Home,
  Search,
  MoreVertical,
  ArrowLeft,
  Wifi,
  Battery,
  Signal,
  Monitor,
  Smartphone,
  Power
} from 'lucide-react'
import { AboutWindow } from './windows/about-window'
import { ProjectsWindow } from './windows/projects-window'
import { SkillsWindow } from './windows/skills-window'
import { ExperienceWindow } from './windows/experience-window'
import { ContactWindow } from './windows/contact-window'

interface App {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
  color: string
}

export function MobileOS() {
  const [currentTime, setCurrentTime] = useState('')
  const [currentApp, setCurrentApp] = useState<string | null>(null)
  const [showHomeScreen, setShowHomeScreen] = useState(false)
  const [battery] = useState(85)
  const [osState, setOSState] = useState<'welcome' | 'booting' | 'ready'>('welcome')
  const [bootProgress, setBootProgress] = useState(0)
  const [bootText, setBootText] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const bootMessages = useMemo(() => [
    'Initializing Akshat Mobile OS...',
    'Loading system modules...',
    'Starting mobile interface...',
    'Configuring touch controls...',
    'Loading applications...',
    'Optimizing for mobile...',
    'System ready!'
  ], [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Boot sequence effect
  useEffect(() => {
    if (osState === 'booting') {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          const newProgress = prev + 2
          const messageIndex = Math.floor((newProgress / 100) * (bootMessages.length - 1))
          setBootText(bootMessages[messageIndex] || bootMessages[bootMessages.length - 1])
          
          if (newProgress >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setOSState('ready')
              setShowHomeScreen(true)
            }, 1000)
          }
          
          return newProgress
        })
      }, 50) // Faster boot for mobile

      return () => clearInterval(interval)
    }
  }, [osState, bootMessages])

  // Fullscreen functionality
  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen()
        setIsFullscreen(true)
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await (document.documentElement as any).msRequestFullscreen()
        setIsFullscreen(true)
      }
    } catch (error) {
      console.log('Fullscreen not supported or denied')
    }
  }

  const startOS = async () => {
    await enterFullscreen()
    setOSState('booting')
  }

  const apps: App[] = [
    {
      id: 'about',
      name: 'About',
      icon: User,
      component: AboutWindow,
      color: 'bg-blue-500'
    },
    {
      id: 'projects',
      name: 'Projects',
      icon: FolderOpen,
      component: ProjectsWindow,
      color: 'bg-green-500'
    },
    {
      id: 'skills',
      name: 'Skills',
      icon: Code2,
      component: SkillsWindow,
      color: 'bg-purple-500'
    },
    {
      id: 'experience',
      name: 'Experience',
      icon: Briefcase,
      component: ExperienceWindow,
      color: 'bg-orange-500'
    },
    {
      id: 'contact',
      name: 'Contact',
      icon: Mail,
      component: ContactWindow,
      color: 'bg-red-500'
    }
  ]

  const openApp = (appId: string) => {
    setCurrentApp(appId)
    setShowHomeScreen(false)
  }

  const closeApp = () => {
    setCurrentApp(null)
    setShowHomeScreen(true)
  }

  const currentAppData = apps.find(app => app.id === currentApp)

  // Welcome Screen
  if (osState === 'welcome') {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
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

        <div className="text-center z-10 px-8 max-w-md">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <Smartphone className="w-20 h-20 mx-auto text-blue-400 mb-6" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Akshat Mobile OS
            </h1>
            <p className="text-blue-200 text-lg">
              Portfolio Experience
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-8"
          >
            <p className="text-white/80 text-sm leading-relaxed">
              Experience my portfolio in a unique mobile OS interface. 
              Tap below to enter fullscreen mode and start the system.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={startOS}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Power className="w-5 h-5 mr-2" />
              Enter Akshat OS
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-white/60 text-xs mt-6"
          >
            Best experienced in fullscreen mode
          </motion.p>
        </div>
      </div>
    )
  }

  // Boot Sequence
  if (osState === 'booting') {
    return (
      <div className="h-screen w-full bg-black text-white flex items-center justify-center relative overflow-hidden">
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
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
          animate={{
            y: [0, window.innerHeight || 800]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="text-center z-10 px-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <Smartphone className="w-16 h-16 mx-auto text-blue-400 mb-4 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-2">
              Akshat Mobile OS
            </h2>
            <p className="text-blue-200 text-sm">
              Booting System...
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-80 max-w-full mx-auto mb-6">
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${bootProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <motion.p
            key={bootText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-400 font-mono mb-2"
          >
            {bootText}
          </motion.p>

          <p className="text-xs text-gray-500">
            {bootProgress}% complete
          </p>
        </div>
      </div>
    )
  }

  // Main OS Interface (only show when ready)
  if (osState !== 'ready') {
    return null
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black/20 backdrop-blur-sm flex items-center justify-between px-4 text-white text-xs z-50">
        <div className="flex items-center space-x-1">
          <span>{currentTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <Battery className="w-4 h-3" />
          <span className="text-xs">{battery}%</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showHomeScreen ? (
          <motion.div
            key="homescreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-6 h-full"
          >
            {/* Wallpaper */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url('/wallpaper/nebula.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(2px) brightness(0.8)'
              }}
            />

            {/* Home Screen Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Date and Time Widget */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-white mt-16 mb-8"
              >
                <h1 className="text-4xl font-light mb-2">{currentTime}</h1>
                <p className="text-lg opacity-80">
                  {new Date().toLocaleDateString([], { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="px-6 mb-8"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4">
                  <h2 className="text-white text-lg font-medium mb-3">Akshat&apos;s Portfolio</h2>
                  <p className="text-white/80 text-sm">
                    Tap on any app below to explore my work and experience
                  </p>
                </div>
              </motion.div>

              {/* App Grid */}
              <div className="flex-1 px-6">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-4 gap-6"
                >
                  {apps.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center"
                      onClick={() => openApp(app.id)}
                    >
                      <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center mb-2 shadow-lg`}>
                        <app.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-white text-xs text-center font-medium">
                        {app.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Bar */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="h-20 bg-black/20 backdrop-blur-xl border-t border-white/10"
              >
                <div className="flex items-center justify-center h-full space-x-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center space-y-1 text-white hover:bg-white/10 p-2"
                  >
                    <Home className="w-6 h-6" />
                    <span className="text-xs">Home</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center space-y-1 text-white hover:bg-white/10 p-2"
                  >
                    <Search className="w-6 h-6" />
                    <span className="text-xs">Search</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col items-center space-y-1 text-white hover:bg-white/10 p-2"
                  >
                    <MoreVertical className="w-6 h-6" />
                    <span className="text-xs">Menu</span>
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : currentAppData ? (
          <motion.div
            key={`app-${currentApp}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full bg-white dark:bg-gray-900"
          >
            {/* App Header */}
            <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 pt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeApp}
                className="mr-3 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${currentAppData.color} rounded-lg flex items-center justify-center`}>
                  <currentAppData.icon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentAppData.name}
                </h1>
              </div>
            </div>

            {/* App Content */}
            <div className="h-[calc(100%-4rem)] overflow-auto">
              <currentAppData.component />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
