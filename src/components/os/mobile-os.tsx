"use client"

import React, { useState, useEffect } from 'react'
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
  Signal
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
  const [showHomeScreen, setShowHomeScreen] = useState(true)
  const [battery] = useState(85)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

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
