"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Palette, Monitor, Moon, Sun, Sparkles, Zap, Eye } from 'lucide-react'

interface ThemeSelectorProps {
  onClose?: () => void
}

interface Theme {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  primary: string
  secondary: string
  accent: string
  background: string
  preview: string
  wallpaper?: string
}

const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Classic Blue',
    description: 'Clean and professional',
    icon: <Monitor className="w-5 h-5" />,
    primary: '#3b82f6',
    secondary: '#1e40af', 
    accent: '#60a5fa',
    background: 'from-blue-50 to-indigo-100',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    wallpaper: '/wallpaper/nebula.jpg'
  },
  {
    id: 'dark',
    name: 'Midnight Dark',
    description: 'Easy on the eyes',
    icon: <Moon className="w-5 h-5" />,
    primary: '#1f2937',
    secondary: '#111827',
    accent: '#6b7280',
    background: 'from-gray-900 to-black',
    preview: 'bg-gradient-to-br from-gray-900 to-black',
    wallpaper: '/wallpaper/rm218-bb-07.jpg'
  },
  {
    id: 'neon',
    name: 'Neon Cyber',
    description: 'Futuristic cyberpunk',
    icon: <Zap className="w-5 h-5" />,
    primary: '#00ff00',
    secondary: '#ff00ff',
    accent: '#00ffff',
    background: 'from-black via-purple-900 to-black',
    preview: 'bg-gradient-to-br from-black via-purple-900 to-black',
    wallpaper: '/wallpaper/neon.jpg'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm and vibrant',
    icon: <Sun className="w-5 h-5" />,
    primary: '#f59e0b',
    secondary: '#dc2626',
    accent: '#ec4899',
    background: 'from-orange-300 via-red-400 to-pink-500',
    preview: 'bg-gradient-to-br from-orange-300 via-red-400 to-pink-500',
    wallpaper: '/wallpaper/sunset.png'
  },
  {
    id: 'matrix',
    name: 'Matrix Code',
    description: 'Enter the matrix',
    icon: <Eye className="w-5 h-5" />,
    primary: '#00ff00',
    secondary: '#008000',
    accent: '#90ee90',
    background: 'from-black to-green-950',
    preview: 'bg-gradient-to-br from-black to-green-950',
    wallpaper: '/wallpaper/matrix.jpg'
  },
  {
    id: 'unicorn',
    name: 'Unicorn Dreams',
    description: 'Magical and colorful',
    icon: <Sparkles className="w-5 h-5" />,
    primary: '#a855f7',
    secondary: '#ec4899',
    accent: '#06b6d4',
    background: 'from-purple-400 via-pink-400 to-cyan-400',
    preview: 'bg-gradient-to-br from-purple-400 via-pink-400 to-cyan-400',
    wallpaper: '/wallpaper/unicorn.jpg'
  }
]

export function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState('default')
  const [previewMode, setPreviewMode] = useState(false)

  const applyTheme = (theme: Theme) => {
    // Update CSS custom properties
    const root = document.documentElement
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-accent', theme.accent)
    
    // Update desktop background - target the main desktop container
    const desktop = document.querySelector('[data-desktop-background]') as HTMLElement
    if (desktop) {
      // Clear existing background styles
      desktop.style.background = ''
      desktop.style.backgroundImage = ''
      desktop.style.backgroundSize = ''
      desktop.style.backgroundPosition = ''
      desktop.style.backgroundRepeat = ''
      desktop.style.backgroundAttachment = ''
      
      // Remove gradient classes
      desktop.className = desktop.className.replace(/bg-gradient-to-\w+\s+[\w-\s]+/g, '').trim()
      
      // Apply wallpaper if provided
      if (theme.wallpaper) {
        desktop.style.backgroundImage = `url(${theme.wallpaper})`
        desktop.style.backgroundSize = 'cover'
        desktop.style.backgroundPosition = 'center'
        desktop.style.backgroundRepeat = 'no-repeat'
        desktop.style.backgroundAttachment = 'fixed'
      } else {
        // Apply gradient background for themes without wallpaper
        const backgroundParts = theme.background.split(' ')
        const direction = backgroundParts[0] // e.g., "from-blue-50"
        const gradientClasses = backgroundParts.slice(1).join(' ') // e.g., "to-indigo-100"
        
        // Create CSS gradient manually since Tailwind classes might not work with direct style manipulation
        let gradientCSS = ''
        if (theme.background.includes('from-blue-50 to-indigo-100')) {
          gradientCSS = 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)'
        } else if (theme.background.includes('from-gray-900 to-black')) {
          gradientCSS = 'linear-gradient(to bottom right, #111827, #000000)'
        } else if (theme.background.includes('from-black via-purple-900 to-black')) {
          gradientCSS = 'linear-gradient(to bottom right, #000000, #581c87, #000000)'
        } else if (theme.background.includes('from-orange-300 via-red-400 to-pink-500')) {
          gradientCSS = 'linear-gradient(to bottom right, #fed7aa, #f87171, #ec4899)'
        } else if (theme.background.includes('from-black to-green-950')) {
          gradientCSS = 'linear-gradient(to bottom right, #000000, #14532d)'
        } else if (theme.background.includes('from-purple-400 via-pink-400 to-cyan-400')) {
          gradientCSS = 'linear-gradient(to bottom right, #c084fc, #f472b6, #22d3ee)'
        }
        
        if (gradientCSS) {
          desktop.style.background = gradientCSS
        }
      }
    }
    
    // Save preference
    localStorage.setItem('portfolio-theme', theme.id)
    
    setSelectedTheme(theme.id)
  }

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme')
    if (savedTheme) {
      const theme = THEMES.find(t => t.id === savedTheme)
      if (theme) {
        setSelectedTheme(savedTheme)
        applyTheme(theme)
      }
    }
  }, [])

  const previewTheme = (theme: Theme) => {
    if (previewMode) {
      applyTheme(theme)
    }
  }

  const resetToOriginal = () => {
    const originalTheme = THEMES.find(t => t.id === 'default')
    if (originalTheme) {
      applyTheme(originalTheme)
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <div className="flex items-center justify-center space-x-2">
              <Palette className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Theme Selector</h2>
            </div>
            <p className="text-purple-100">Customize your desktop experience</p>
          </CardHeader>

          <CardContent className="p-6">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant={previewMode ? "default" : "outline"}
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Live Preview</span>
                </Button>
                {previewMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Hover over themes to preview
                  </motion.div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={resetToOriginal} variant="outline">
                  Reset to Default
                </Button>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>

            {/* Theme Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {THEMES.map((theme) => (
                <motion.div
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => previewTheme(theme)}
                  className="cursor-pointer"
                >
                  <Card 
                    className={`overflow-hidden transition-all duration-200 ${
                      selectedTheme === theme.id 
                        ? 'ring-2 ring-purple-500 shadow-lg' 
                        : 'hover:shadow-md border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Theme Preview */}
                    <div className={`h-24 ${theme.preview} relative overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-white"
                        >
                          {theme.icon}
                        </motion.div>
                      </div>
                      
                      {/* Floating elements for preview */}
                      <div className="absolute top-2 left-2">
                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {theme.description}
                      </p>
                      
                      {/* Color Palette */}
                      <div className="flex space-x-2 mb-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.primary }}
                          title="Primary Color"
                        />
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.secondary }}
                          title="Secondary Color"
                        />
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: theme.accent }}
                          title="Accent Color"
                        />
                      </div>

                      <Button
                        onClick={() => applyTheme(theme)}
                        className="w-full"
                        variant={selectedTheme === theme.id ? "default" : "outline"}
                      >
                        {selectedTheme === theme.id ? "Current Theme" : "Apply Theme"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Custom Theme Builder Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Coming Soon: Custom Theme Builder
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your own custom themes with color pickers, wallpaper uploads, and animation settings.
              </p>
              <Button variant="outline" disabled>
                Custom Builder (Coming Soon)
              </Button>
            </motion.div>

            {/* Theme Info */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Themes are automatically saved and will persist across sessions.</p>
              <p>Some themes include special wallpapers and cursor effects.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
