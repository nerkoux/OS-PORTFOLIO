"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor as DesktopIcon, Volume2, VolumeX, Wifi, User, Code, Briefcase, Award, MessageCircle, X, Minimize, Maximize, Clock, Folder, Search, Battery } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AboutWindow } from "./windows/about-window"
import { ProjectsWindow } from "./windows/projects-window"
import { SkillsWindow } from "./windows/skills-window"
import { ExperienceWindow } from "./windows/experience-window"
import { ContactWindow } from "./windows/contact-window"
import { useOSState } from "./os-state"
import { useAudio } from "./audio-provider"
import { Window } from "./os-state"

export function Desktop() {
  const { state, dispatch } = useOSState()
  const { playSound, isEnabled, setEnabled } = useAudio()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)
      dispatch({ type: 'UPDATE_TIME', time: newTime })
    }, 1000)
    return () => clearInterval(timer)
  }, [dispatch])

  const desktopItems = [
    {
      id: "about",
      name: "About Me",
      icon: User,
      type: "folder",
      component: AboutWindow,
      description: "Personal information & background",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "projects",
      name: "My Projects",
      icon: Code,
      type: "folder", 
      component: ProjectsWindow,
      description: "Featured development projects",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "skills",
      name: "Skills & Tech",
      icon: Award,
      type: "folder",
      component: SkillsWindow,
      description: "Technical skills & expertise",
      color: "from-orange-500 to-red-600"
    },
    {
      id: "experience",
      name: "Experience",
      icon: Briefcase,
      type: "folder",
      component: ExperienceWindow,
      description: "Professional experience",
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: "contact",
      name: "Contact",
      icon: MessageCircle,
      type: "folder",
      component: ContactWindow,
      description: "Get in touch with me",
      color: "from-pink-500 to-rose-600"
    }
  ]

  const openWindow = (item: typeof desktopItems[0]) => {
    playSound('open')
    
    const newWindow: Window = {
      id: item.id,
      title: item.name,
      component: item.component,
      isMinimized: false,
      zIndex: state.highestZIndex + 1,
      position: { x: 100, y: 100 },
      size: { width: 800, height: 600 },
      isMaximized: false,
      icon: item.icon
    }

    dispatch({ type: 'OPEN_WINDOW', window: newWindow })
  }

  const closeWindow = (windowId: string) => {
    playSound('close')
    dispatch({ type: 'CLOSE_WINDOW', windowId })
  }

  const minimizeWindow = (windowId: string) => {
    playSound('minimize')
    dispatch({ type: 'MINIMIZE_WINDOW', windowId })
  }

  const focusWindow = (windowId: string) => {
    playSound('click')
    dispatch({ type: 'FOCUS_WINDOW', windowId })
  }

  const toggleAudio = () => {
    setEnabled(!isEnabled)
    dispatch({ type: 'TOGGLE_AUDIO' })
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 198, 198, 0.3) 0%, transparent 50%)
        `
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)
          `,
          backgroundSize: '20px 20px',
          animation: 'float 20s infinite linear'
        }}></div>
      </div>

      {/* Desktop Icons Grid */}
      <div className="absolute inset-0 p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {desktopItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="group cursor-pointer"
              onDoubleClick={() => openWindow(item)}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 p-4 h-36 relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-blue-500/25">
                <div className="flex flex-col items-center justify-center h-full space-y-3 relative z-10">
                  {/* Icon */}
                  <div className="relative">
                    <motion.div
                      className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                    >
                      <item.icon className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                    
                    {/* Folder Badge */}
                    {item.type === "folder" && (
                      <motion.div 
                        className="absolute -top-2 -right-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                      >
                        <Badge className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 border-0 shadow-lg">
                          <Folder className="w-3 h-3 mr-1" />
                          Folder
                        </Badge>
                      </motion.div>
                    )}
                    
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl -z-10`}></div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="text-center space-y-2">
                    <h3 className="text-white font-semibold text-lg group-hover:text-blue-200 transition-colors duration-300 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-gray-300 text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300 max-w-[120px] leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Windows */}
      <AnimatePresence>
        {state.openWindows
          .filter(window => !window.isMinimized)
          .map((window) => (
            <WindowComponent
              key={window.id}
              window={window}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
            />
          ))}
      </AnimatePresence>

      {/* Enhanced Taskbar */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-2xl border-t border-white/20 shadow-2xl"
        style={{
          background: `
            linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%),
            backdrop-filter: blur(20px)
          `
        }}
      >
        <div className="flex items-center justify-between h-full px-6">
          {/* Left Section - OS Branding */}
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <DesktopIcon className="w-5 h-5 mr-2" />
                <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AKSHAT OS
                </span>
              </Button>
            </motion.div>

            <Separator orientation="vertical" className="h-8 bg-white/20" />

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2 rounded-lg">
                  <Search className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 p-2 rounded-lg"
                  onClick={toggleAudio}
                >
                  {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2 rounded-lg">
                  <Battery className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
            
            <Separator orientation="vertical" className="h-8 bg-white/20" />
            
            {/* Date & Time */}
            <div className="text-right">
              <div className="text-sm font-bold bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-white">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Open Windows */}
          <div className="flex items-center space-x-2">
            {state.openWindows.map((window) => {
              const IconComponent = window.icon
              return (
                <motion.div
                  key={window.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer
                    ${window.isMinimized 
                      ? 'bg-white/10 text-gray-300' 
                      : 'bg-white/20 text-white border border-white/20'
                    }
                  `}
                  onClick={() => window.isMinimized ? focusWindow(window.id) : minimizeWindow(window.id)}
                >
                  <div className="flex items-center space-x-2">
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span className="text-sm font-medium truncate max-w-24">
                      {window.title}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Right Section - System Info */}
          <div className="flex items-center space-x-3">
            <div className="text-white text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4" />
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

interface WindowComponentProps {
  window: Window
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

function WindowComponent({ window, onClose, onMinimize, onFocus }: WindowComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { state, dispatch } = useOSState()

  const handleDragEnd = (event: MouseEvent, info: { offset: { x: number; y: number } }) => {
    const newPosition = {
      x: Math.max(0, window.position.x + info.offset.x),
      y: Math.max(0, window.position.y + info.offset.y)
    }
    dispatch({ type: 'MOVE_WINDOW', windowId: window.id, position: newPosition })
    setIsDragging(false)
  }

  const handleMaximize = () => {
    const currentWindow = state.openWindows.find((w: Window) => w.id === window.id)
    if (currentWindow?.isMaximized && currentWindow.originalPosition && currentWindow.originalSize) {
      // Restore to original position and size
      dispatch({ 
        type: 'MOVE_WINDOW', 
        windowId: window.id, 
        position: currentWindow.originalPosition 
      })
      dispatch({ 
        type: 'RESIZE_WINDOW', 
        windowId: window.id, 
        size: currentWindow.originalSize 
      })
    }
    dispatch({ type: 'MAXIMIZE_WINDOW', windowId: window.id })
  }

  const WindowContent = window.component

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onMouseDown={onFocus}
      className="absolute bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Window Header */}
      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing">
        <div className="flex items-center space-x-2">
          {window.icon && <window.icon className="w-4 h-4" />}
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {window.title}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMinimize}
            className="w-8 h-8 p-0 hover:bg-yellow-500/20"
          >
            <Minimize className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMaximize}
            className="w-8 h-8 p-0 hover:bg-green-500/20"
          >
            <Maximize className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 hover:bg-red-500/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900">
        <WindowContent />
      </div>
    </motion.div>
  )
}
