"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FloatingElementProps {
  children: React.ReactNode
  speed?: number
  range?: number
}

export function FloatingElement({ children, speed = 2, range = 20 }: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-range, range, -range],
        x: [-range/2, range/2, -range/2]
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

interface BackgroundEffectsProps {
  theme?: 'matrix' | 'stars' | 'bubbles' | 'none'
}

export function BackgroundEffects({ theme = 'none' }: BackgroundEffectsProps) {
  const [elements, setElements] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (theme === 'none') return

    const count = theme === 'matrix' ? 50 : theme === 'stars' ? 100 : 30
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }))
    setElements(newElements)
  }, [theme])

  if (theme === 'none') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {theme === 'matrix' && (
        <div className="absolute inset-0 bg-black/5">
          {elements.map(element => (
            <motion.div
              key={element.id}
              className="absolute text-green-400 font-mono text-xs opacity-30"
              style={{ left: `${element.x}%`, top: `${element.y}%` }}
              animate={{ y: ['0%', '100vh'] }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: element.delay,
                ease: "linear"
              }}
            >
              {Math.random() > 0.5 ? '1' : '0'}
            </motion.div>
          ))}
        </div>
      )}

      {theme === 'stars' && (
        <div className="absolute inset-0">
          {elements.map(element => (
            <motion.div
              key={element.id}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${element.x}%`, top: `${element.y}%` }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: element.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {theme === 'bubbles' && (
        <div className="absolute inset-0">
          {elements.map(element => (
            <motion.div
              key={element.id}
              className="absolute w-4 h-4 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20"
              style={{ left: `${element.x}%`, top: '100%' }}
              animate={{ 
                y: [0, -window.innerHeight - 50],
                x: [0, (Math.random() - 0.5) * 100]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: element.delay,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ScreenSaverProps {
  isActive: boolean
  onDeactivate: () => void
  type?: 'dvd' | 'pipes' | 'starfield'
}

export function ScreenSaver({ isActive, onDeactivate, type = 'dvd' }: ScreenSaverProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [velocity, setVelocity] = useState({ x: 1, y: 1 })
  const [color, setColor] = useState('#3b82f6')

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']

  useEffect(() => {
    if (!isActive) return

    const handleActivity = () => {
      onDeactivate()
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [isActive, onDeactivate])

  useEffect(() => {
    if (!isActive || type !== 'dvd') return

    const interval = setInterval(() => {
      setPosition(prev => {
        const newX = prev.x + velocity.x
        const newY = prev.y + velocity.y
        let newVelX = velocity.x
        let newVelY = velocity.y

        if (newX <= 0 || newX >= 90) {
          newVelX = -newVelX
          setColor(colors[Math.floor(Math.random() * colors.length)])
        }
        if (newY <= 0 || newY >= 90) {
          newVelY = -newVelY
          setColor(colors[Math.floor(Math.random() * colors.length)])
        }

        setVelocity({ x: newVelX, y: newVelY })

        return {
          x: Math.max(0, Math.min(90, newX)),
          y: Math.max(0, Math.min(90, newY))
        }
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isActive, velocity, type])

  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-none"
      onClick={onDeactivate}
    >
      {type === 'dvd' && (
        <motion.div
          className="absolute w-20 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm select-none"
          style={{ 
            backgroundColor: color,
            left: `${position.x}%`,
            top: `${position.y}%`
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          DVD
        </motion.div>
      )}

      {type === 'starfield' && (
        <div className="relative w-full h-full">
          {Array.from({ length: 200 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Move mouse or press any key to exit
      </div>
    </motion.div>
  )
}


// Floating elements that react to cursor
interface FloatingElementsProps {
  isEnabled?: boolean
  elementCount?: number
}

export function FloatingElements({ 
  isEnabled = true, 
  elementCount = 5 
}: FloatingElementsProps) {
  const [elements, setElements] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    emoji: string
    targetX: number
    targetY: number
  }>>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const emojis = ['✨', '🌟', '💫', '⭐', '🔮', '💎', '🌈', '🎭', '🎪', '🎨']

  useEffect(() => {
    if (!isEnabled) return

    const initialElements = Array.from({ length: elementCount }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
      size: Math.random() * 20 + 10,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      targetX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      targetY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
    }))
    
    setElements(initialElements)
  }, [isEnabled, elementCount])

  useEffect(() => {
    if (!isEnabled) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isEnabled])

  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      setElements(prev => prev.map(element => {
        const dx = mousePosition.x - element.x
        const dy = mousePosition.y - element.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        let newTargetX = element.targetX
        let newTargetY = element.targetY
        
        // React to mouse proximity
        if (distance < 200) {
          const angle = Math.atan2(dy, dx)
          const repelForce = Math.max(0, 200 - distance) / 200
          newTargetX = element.x - Math.cos(angle) * repelForce * 100
          newTargetY = element.y - Math.sin(angle) * repelForce * 100
        } else {
          // Random movement when not near mouse
          if (Math.random() < 0.1) {
            newTargetX = Math.random() * window.innerWidth
            newTargetY = Math.random() * window.innerHeight
          }
        }
        
        // Smooth movement towards target
        const moveSpeed = 0.05
        const newX = element.x + (newTargetX - element.x) * moveSpeed
        const newY = element.y + (newTargetY - element.y) * moveSpeed
        
        return {
          ...element,
          x: newX,
          y: newY,
          targetX: newTargetX,
          targetY: newTargetY
        }
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [isEnabled, mousePosition])

  if (!isEnabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl select-none"
          style={{
            left: element.x,
            top: element.y,
            fontSize: element.size,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  )
}

// Enhanced background effects with more variety
interface EnhancedBackgroundEffectsProps {
  isEnabled?: boolean
  style?: 'particles' | 'matrix' | 'geometric' | 'organic'
}

export function EnhancedBackgroundEffects({ 
  isEnabled = true, 
  style = 'particles' 
}: EnhancedBackgroundEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isEnabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationId: number

    if (style === 'matrix') {
      // Matrix rain effect
      const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const fontSize = 14
      const columns = canvas.width / fontSize
      const drops: number[] = []

      for (let i = 0; i < columns; i++) {
        drops[i] = 1
      }

      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#0F0'
        ctx.font = `${fontSize}px monospace`

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          }
          drops[i]++
        }
      }

      const interval = setInterval(draw, 50)
      return () => clearInterval(interval)
    } else if (style === 'geometric') {
      // Geometric patterns
      const shapes: Array<{
        x: number
        y: number
        size: number
        rotation: number
        color: string
        type: 'triangle' | 'square' | 'circle'
      }> = []

      for (let i = 0; i < 20; i++) {
        shapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 50 + 10,
          rotation: 0,
          color: `hsla(${Math.random() * 360}, 70%, 50%, 0.1)`,
          type: ['triangle', 'square', 'circle'][Math.floor(Math.random() * 3)] as 'triangle' | 'square' | 'circle'
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        shapes.forEach(shape => {
          ctx.save()
          ctx.translate(shape.x, shape.y)
          ctx.rotate(shape.rotation)
          ctx.fillStyle = shape.color
          ctx.strokeStyle = shape.color.replace('0.1', '0.3')

          if (shape.type === 'circle') {
            ctx.beginPath()
            ctx.arc(0, 0, shape.size, 0, Math.PI * 2)
            ctx.fill()
          } else if (shape.type === 'square') {
            ctx.fillRect(-shape.size/2, -shape.size/2, shape.size, shape.size)
          } else if (shape.type === 'triangle') {
            ctx.beginPath()
            ctx.moveTo(0, -shape.size/2)
            ctx.lineTo(-shape.size/2, shape.size/2)
            ctx.lineTo(shape.size/2, shape.size/2)
            ctx.closePath()
            ctx.fill()
          }

          ctx.restore()

          shape.rotation += 0.01
          shape.x += Math.sin(shape.rotation) * 0.5
          shape.y += Math.cos(shape.rotation) * 0.3

          if (shape.x > canvas.width + 50) shape.x = -50
          if (shape.y > canvas.height + 50) shape.y = -50
        })

        animationId = requestAnimationFrame(animate)
      }

      animate()
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isEnabled, style])

  if (!isEnabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ opacity: 0.3 }}
    />
  )
}
