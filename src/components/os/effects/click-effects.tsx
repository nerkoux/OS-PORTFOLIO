"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Ripple {
  id: number
  x: number
  y: number
  timestamp: number
}

interface RippleEffectsProps {
  children: React.ReactNode
  disabled?: boolean
  color?: string
  duration?: number
  maxRipples?: number
}

export function RippleEffects({ 
  children, 
  disabled = false, 
  color = 'rgba(255, 255, 255, 0.6)',
  duration = 600,
  maxRipples = 10
}: RippleEffectsProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const addRipple = useCallback((e: React.MouseEvent) => {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      timestamp: Date.now()
    }

    setRipples(prev => {
      const filtered = prev.filter(r => Date.now() - r.timestamp < duration)
      return [...filtered, newRipple].slice(-maxRipples)
    })
  }, [disabled, duration, maxRipples])

  useEffect(() => {
    const cleanup = () => {
      setRipples(prev => prev.filter(r => Date.now() - r.timestamp < duration))
    }

    const interval = setInterval(cleanup, duration / 2)
    return () => clearInterval(interval)
  }, [duration])

  return (
    <div 
      className="relative overflow-hidden"
      onClick={addRipple}
      style={{ isolation: 'isolate' }}
    >
      {children}
      
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: color,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 1,
            }}
            animate={{
              width: 200,
              height: 200,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Particle system for more advanced effects
interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export function ParticleClick() {
  const [particles, setParticles] = useState<Particle[]>([])

  const createParticles = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
    
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 60,
      maxLife: 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
    }))

    setParticles(prev => [...prev, ...newParticles])
  }, [])

  useEffect(() => {
    const animate = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.2, // gravity
          life: particle.life - 1,
        })).filter(particle => particle.life > 0)
      )
    }

    const interval = setInterval(animate, 16) // ~60fps
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="relative overflow-hidden cursor-pointer"
      onClick={createParticles}
    >
      <div className="p-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
        <h3 className="text-xl font-bold mb-2">Click for Particles!</h3>
        <p>Interactive particle explosion effect</p>
      </div>
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}


