"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor as DesktopIcon, Folder, Volume2, VolumeX, Wifi, Battery, User, Code, Briefcase, Award, MessageCircle, X, Minimize, Maximize, Calendar, Clock, Search, Star, Sun, Moon } from "lucide-react"
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
import { StartMenu } from "./start-menu"

export function Desktop() {
  const { state, dispatch } = useOSState()
  const { playSound, isEnabled, setEnabled } = useAudio()
  const [time, setTime] = useState(new Date())
  const [iconPositions, setIconPositions] = useState<{ [key: string]: { x: number, y: number } }>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)
      dispatch({ type: 'UPDATE_TIME', time: newTime })
    }, 1000)
    return () => clearInterval(timer)
  }, [dispatch])

  // Initialize icon positions
  useEffect(() => {
    const initialPositions: { [key: string]: { x: number; y: number } } = {}
    desktopItems.forEach((item, index) => {
      initialPositions[item.id] = { x: 24, y: 24 + (index * 120) } // Vertical layout with more spacing
    })
    setIconPositions(initialPositions)
  }, [])

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

  const focusWindow = (windowId: string, preventClickSound = false) => {
    if (!preventClickSound) {
      playSound('click')
    }
    dispatch({ type: 'FOCUS_WINDOW', windowId })
  }

  const toggleAudio = () => {
    setEnabled(!isEnabled)
    dispatch({ type: 'TOGGLE_AUDIO' })
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsStartMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div 
      className="h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-slate-900 dark:via-slate-800 dark:to-black relative overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}
    >
      {/* Grid Guide - Shows when dragging */}
      {isDragging && (
        <div 
          className="absolute inset-0 pointer-events-none z-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '90px 90px',
            backgroundPosition: '24px 24px'
          }}
        />
      )}
      {/* Desktop Icons - Modern Windows/macOS Style */}
      <div className="absolute inset-0 pb-20">
        {desktopItems.map((item, index) => {
          const IconComponent = item.icon
          const defaultPosition = { x: 24, y: 24 + (index * 120) }
          const position = iconPositions[item.id] || defaultPosition
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.4,
                ease: "easeOut"
              }}
              drag
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(event, info) => {
                setIsDragging(false)
                const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
                const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
                
                // Snap to grid (every 120px for better spacing)
                const gridSize = 120
                const rawX = position.x + info.offset.x
                const rawY = position.y + info.offset.y
                
                const snappedX = Math.round(rawX / gridSize) * gridSize
                const snappedY = Math.round(rawY / gridSize) * gridSize
                
                const newPosition = {
                  x: Math.max(24, Math.min(screenWidth - 96, snappedX)),
                  y: Math.max(24, Math.min(screenHeight - 200, snappedY))
                }
                
                setIconPositions(prev => ({
                  ...prev,
                  [item.id]: newPosition
                }))
              }}
              dragConstraints={{
                left: 24,
                right: typeof window !== 'undefined' ? window.innerWidth - 96 : 1824,
                top: 24,
                bottom: typeof window !== 'undefined' ? window.innerHeight - 200 : 880
              }}
              className="group cursor-pointer select-none absolute"
              style={{
                left: position.x,
                top: position.y,
                zIndex: 10 + index
              }}
              onDoubleClick={() => openWindow(item)}
            >
              {/* Modern Desktop Icon */}
              <div className="desktop-icon flex flex-col items-center p-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 active:bg-white/30 dark:active:bg-white/20 transition-all duration-200 w-24 min-h-[110px]">
                {/* Icon Container - Modern Windows 11 style with better spacing */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-active:scale-95 transition-transform duration-200 mb-2 border border-white/30 dark:border-white/20`}>
                  <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                
                {/* Icon Label with better background */}
                <div className="text-center px-2 py-1 rounded-md desktop-icon-bg transition-all duration-200">
                  <span className="text-xs text-white dark:text-slate-200 font-bold leading-tight desktop-icon-text">
                    {item.name}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
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

      {/* Modern Taskbar - Windows 11 Style */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-14 bg-black/20 dark:bg-black/40 backdrop-blur-2xl border-t border-white/10 dark:border-white/5"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`
        }}
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Section - Start Menu */}
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsStartMenuOpen(!isStartMenuOpen)
                  playSound('click')
                }}
                className={`text-white dark:text-slate-200 hover:bg-white/10 dark:hover:bg-white/5 px-3 py-2 rounded-lg backdrop-blur-sm h-10 transition-colors ${
                  isStartMenuOpen ? 'bg-white/20 dark:bg-white/10' : ''
                }`}
              >
                <DesktopIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Start</span>
              </Button>
            </motion.div>

            <Separator orientation="vertical" className="h-8 bg-white/20" />

            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2 rounded-lg h-10 w-10">
                  <Search className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 p-2 rounded-lg h-10 w-10"
                  onClick={toggleAudio}
                >
                  {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Center Section - Open Windows Taskbar */}
          <div className="flex items-center space-x-1">
            {state.openWindows.map((window) => {
              const IconComponent = window.icon
              return (
                <motion.div
                  key={window.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer h-10 min-w-[120px]
                    ${window.isMinimized 
                      ? 'bg-white/10 hover:bg-white/15 text-gray-300 border border-white/10' 
                      : 'bg-white/20 hover:bg-white/25 text-white border border-white/20 shadow-lg'
                    }
                  `}
                  onClick={() => {
                    if (window.isMinimized) {
                      // Restore window
                      dispatch({ type: 'MINIMIZE_WINDOW', windowId: window.id })
                      focusWindow(window.id)
                    } else {
                      // Minimize window
                      minimizeWindow(window.id)
                    }
                  }}
                >
                  {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                  <span className="text-sm font-medium truncate">
                    {window.title}
                  </span>
                  {/* Active indicator */}
                  {!window.isMinimized && (
                    <div className="w-1 h-1 bg-white rounded-full flex-shrink-0" />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Right Section - System Tray */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-white text-sm bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/10 h-10">
              <Wifi className="w-4 h-4" />
              <Separator orientation="vertical" className="h-4 bg-white/20" />
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs opacity-75">
                    {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Start Menu */}
      <StartMenu 
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenWindow={openWindow}
      />
    </div>
  )
}

interface WindowComponentProps {
  window: Window
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
}

function WindowComponent({ window: windowData, onClose, onMinimize, onFocus }: WindowComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { state, dispatch } = useOSState()

  const handleDragEnd = (event: any, info: any) => {
    if (!windowData.isMaximized) {
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
      const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
      const taskbarHeight = 56
      const headerHeight = 60
      
      const maxX = screenWidth - windowData.size.width
      const maxY = screenHeight - windowData.size.height - taskbarHeight
      
      const newPosition = {
        x: Math.max(0, Math.min(maxX, windowData.position.x + info.offset.x)),
        y: Math.max(0, Math.min(maxY, windowData.position.y + info.offset.y))
      }
      dispatch({ type: 'MOVE_WINDOW', windowId: windowData.id, position: newPosition })
    }
    setIsDragging(false)
  }

  const handleMaximize = () => {
    const currentWindow = state.openWindows.find((w: Window) => w.id === windowData.id)
    
    if (currentWindow?.isMaximized) {
      // Restore to original position and size
      if (currentWindow.originalPosition && currentWindow.originalSize) {
        dispatch({ 
          type: 'MOVE_WINDOW', 
          windowId: windowData.id, 
          position: currentWindow.originalPosition 
        })
        dispatch({ 
          type: 'RESIZE_WINDOW', 
          windowId: windowData.id, 
          size: currentWindow.originalSize 
        })
      }
    }
    
    // Toggle maximize state
    dispatch({ type: 'MAXIMIZE_WINDOW', windowId: windowData.id })
  }

  const WindowContent = windowData.component

  // Calculate window style based on maximized state
  const windowStyle = windowData.isMaximized 
    ? {
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 56px)', // Account for taskbar
        zIndex: windowData.zIndex,
      }
    : {
        left: windowData.position.x,
        top: Math.max(0, windowData.position.y), // Ensure window doesn't go above screen
        width: windowData.size.width,
        height: windowData.size.height,
        zIndex: windowData.zIndex,
      }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseDown={(e) => {
        // Don't focus if clicking on window control buttons
        const target = e.target as HTMLElement
        if (!target.closest('button')) {
          onFocus()
        }
      }}
      className={`absolute bg-white dark:bg-slate-900 shadow-2xl overflow-hidden ${
        windowData.isMaximized ? 'rounded-none border-0' : 'rounded-xl border border-slate-200 dark:border-slate-700'
      }`}
      style={{
        ...windowStyle,
        maxHeight: 'calc(100vh - 70px)' // Ensure window never goes below taskbar
      }}
    >
      {/* Modern Window Header - Fixed dragging constraints */}
      <div 
        className={`flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 select-none ${
          windowData.isMaximized ? '' : 'cursor-grab active:cursor-grabbing'
        }`}
        onMouseDown={(e) => {
          if (!windowData.isMaximized) {
            setIsDragging(true)
            const startX = e.clientX - windowData.position.x
            const startY = e.clientY - windowData.position.y
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const screenWidth = window.innerWidth
              const screenHeight = window.innerHeight
              const taskbarHeight = 56
              
              const maxX = screenWidth - windowData.size.width
              const maxY = screenHeight - windowData.size.height - taskbarHeight
              
              const newX = Math.max(0, Math.min(maxX, moveEvent.clientX - startX))
              const newY = Math.max(0, Math.min(maxY, moveEvent.clientY - startY))
              
              dispatch({ 
                type: 'MOVE_WINDOW', 
                windowId: windowData.id, 
                position: { x: newX, y: newY } 
              })
            }
            
            const handleMouseUp = () => {
              setIsDragging(false)
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }
        }}
        style={{ cursor: isDragging ? 'grabbing' : (windowData.isMaximized ? 'default' : 'grab') }}
      >
        <div className="flex items-center space-x-3">
          {windowData.icon && <windowData.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {windowData.title}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {/* Modern window controls - Better positioning */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize()
            }}
            className="w-7 h-7 p-0 rounded-full hover:bg-yellow-400/20 hover:text-yellow-600 transition-colors"
            title="Minimize"
          >
            <Minimize className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleMaximize()
            }}
            className="w-7 h-7 p-0 rounded-full hover:bg-green-400/20 hover:text-green-600 transition-colors"
            title={windowData.isMaximized ? "Restore" : "Maximize"}
          >
            <Maximize className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="w-7 h-7 p-0 rounded-full hover:bg-red-400/20 hover:text-red-600 transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Window Content - Not draggable, fully interactive */}
      <div 
        className="relative overflow-hidden bg-white dark:bg-slate-900 pointer-events-auto" 
        style={{ 
          height: windowData.isMaximized ? 'calc(100vh - 56px - 60px)' : `${windowData.size.height - 60}px` 
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <WindowContent />
        </div>
      </div>
    </motion.div>
  )
}
