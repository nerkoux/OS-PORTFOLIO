"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Zap, Coffee, Settings, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface DesktopPetProps {
  isEnabled: boolean
  onClose: () => void
}

type PetType = 'cat' | 'dog' | 'dragon' | 'robot' | 'unicorn'
type Mood = 'happy' | 'sleepy' | 'playful' | 'hungry' | 'excited' | 'grumpy'
type Action = 'idle' | 'walking' | 'jumping' | 'sleeping' | 'dancing' | 'flying'

interface Pet {
  type: PetType
  emoji: string
  color: string
  name: string
  abilities: string[]
}

const PET_TYPES: Record<PetType, Pet> = {
  cat: {
    type: 'cat',
    emoji: '🐱',
    color: '#ff9999',
    name: 'Kitty',
    abilities: ['purr', 'scratch', 'nap']
  },
  dog: {
    type: 'dog',
    emoji: '🐶',
    color: '#99ccff',
    name: 'Buddy',
    abilities: ['fetch', 'bark', 'wag']
  },
  dragon: {
    type: 'dragon',
    emoji: '🐉',
    color: '#99ff99',
    name: 'Draco',
    abilities: ['breathe fire', 'fly', 'roar']
  },
  robot: {
    type: 'robot',
    emoji: '🤖',
    color: '#cccccc',
    name: 'Robo',
    abilities: ['compute', 'beep', 'scan']
  },
  unicorn: {
    type: 'unicorn',
    emoji: '🦄',
    color: '#ffccff',
    name: 'Sparkle',
    abilities: ['magic', 'rainbow', 'heal']
  }
}

export function DesktopPet({ isEnabled, onClose }: DesktopPetProps) {
  const [currentPetType, setCurrentPetType] = useState<PetType>('cat')
  const [position, setPosition] = useState({ x: window.innerWidth - 200, y: window.innerHeight - 200 })
  const [mood, setMood] = useState<Mood>('happy')
  const [action, setAction] = useState<Action>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [showSpeech, setShowSpeech] = useState(false)
  const [speechText, setSpeechText] = useState('')
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const [showCustomization, setShowCustomization] = useState(false)
  const [energy, setEnergy] = useState(100)
  const [happiness, setHappiness] = useState(100)
  const [hunger, setHunger] = useState(0)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, emoji: string}>>([])
  
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 })
  const currentPet = PET_TYPES[currentPetType]

  const moodEmojis: Record<Mood, string> = {
    happy: '😊',
    sleepy: '😴',
    playful: '🤪',
    hungry: '🤤',
    excited: '🤩',
    grumpy: '😤'
  }

  const speeches: Record<Mood, string[]> = {
    happy: ['Hello there!', 'Having a great day!', 'You\'re awesome!', 'Keep coding!'],
    sleepy: ['*yawn*', 'So sleepy...', 'Maybe a quick nap?', 'Zzz...'],
    playful: ['Let\'s play!', 'Wanna see a trick?', 'Catch me if you can!', 'Wheee!'],
    hungry: ['Feed me!', 'I\'m hungry...', 'Got any snacks?', 'Nom nom nom!'],
    excited: ['WOW!', 'This is amazing!', 'I love this!', 'So exciting!'],
    grumpy: ['Hmph!', 'Leave me alone...', 'Not in the mood', 'Grr...']
  }

  // Stats management
  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      // Decrease stats over time
      setEnergy(prev => Math.max(0, prev - 1))
      setHappiness(prev => Math.max(0, prev - 0.5))
      setHunger(prev => Math.min(100, prev + 0.5))

      // Auto mood changes based on stats
      if (energy < 30) {
        setMood('sleepy')
        setAction('sleeping')
      } else if (hunger > 70) {
        setMood('hungry')
      } else if (happiness < 30) {
        setMood('grumpy')
      } else if (happiness > 80 && energy > 60) {
        setMood('excited')
        setAction('dancing')
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [isEnabled])

  // Auto change mood and action
  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteraction
      
      // Change mood based on time since last interaction
      if (timeSinceInteraction > 300000) { // 5 minutes
        setMood('sleepy')
        setAction('sleeping')
      } else if (timeSinceInteraction > 120000) { // 2 minutes
        setMood('hungry')
      } else {
        const moods: Mood[] = ['happy', 'playful']
        const randomMood = moods[Math.floor(Math.random() * moods.length)]
        setMood(randomMood)
      }

      // Random actions based on pet type
      if (mood !== 'sleepy') {
        let actions: Action[] = ['idle', 'walking', 'jumping']
        
        if (currentPetType === 'dragon' || currentPetType === 'unicorn') {
          actions.push('flying')
        }
        if (currentPetType === 'robot') {
          actions = ['idle', 'walking', 'dancing']
        }
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        setAction(randomAction)
        
        // Random walking/flying
        if (randomAction === 'walking' || randomAction === 'flying') {
          const newX = Math.max(0, Math.min(window.innerWidth - 150, position.x + (Math.random() - 0.5) * 200))
          const newY = Math.max(0, Math.min(window.innerHeight - 150, position.y + (Math.random() - 0.5) * 100))
          setPosition({ x: newX, y: newY })
        }
      }
    }, 5000 + Math.random() * 5000)

    return () => clearInterval(interval)
  }, [isEnabled, lastInteraction, mood, position, currentPetType])

  // Random speech
  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        const moodSpeeches = speeches[mood]
        const randomSpeech = moodSpeeches[Math.floor(Math.random() * moodSpeeches.length)]
        setSpeechText(randomSpeech)
        setShowSpeech(true)
        
        setTimeout(() => setShowSpeech(false), 3000)
      }
    }, 10000 + Math.random() * 10000)

    return () => clearInterval(interval)
  }, [isEnabled, mood])

  const createParticles = (emoji: string, count: number = 5) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: position.x + 75,
      y: position.y + 50,
      emoji
    }))
    
    setParticles(prev => [...prev, ...newParticles])
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 2000)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setLastInteraction(Date.now())
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - dragRef.current.startX
      const deltaY = e.clientY - dragRef.current.startY
      
      const newX = Math.max(0, Math.min(window.innerWidth - 150, dragRef.current.startPosX + deltaX))
      const newY = Math.max(0, Math.min(window.innerHeight - 150, dragRef.current.startPosY + deltaY))
      
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleClick = () => {
    setLastInteraction(Date.now())
    setHappiness(prev => Math.min(100, prev + 5))
    
    // Pet-specific reactions
    if (currentPetType === 'cat') {
      setSpeechText('Meow! *purr*')
      createParticles('💕')
    } else if (currentPetType === 'dog') {
      setSpeechText('Woof! *wag wag*')
      createParticles('🎾')
    } else if (currentPetType === 'dragon') {
      setSpeechText('Roar! *breathes fire*')
      createParticles('🔥')
    } else if (currentPetType === 'robot') {
      setSpeechText('Beep boop! *happy circuits*')
      createParticles('⚡')
    } else if (currentPetType === 'unicorn') {
      setSpeechText('Magical! *sparkles*')
      createParticles('✨')
    }
    
    setMood('happy')
    setAction('jumping')
    setShowSpeech(true)
    setTimeout(() => setShowSpeech(false), 2000)
  }

  const handleFeed = () => {
    setLastInteraction(Date.now())
    setHunger(prev => Math.max(0, prev - 30))
    setHappiness(prev => Math.min(100, prev + 10))
    setMood('happy')
    setSpeechText('Yummy! Thank you!')
    setShowSpeech(true)
    createParticles('🍖')
    setTimeout(() => setShowSpeech(false), 2000)
  }

  const handlePlay = () => {
    setLastInteraction(Date.now())
    setEnergy(prev => Math.max(0, prev - 10))
    setHappiness(prev => Math.min(100, prev + 15))
    setMood('playful')
    setAction('jumping')
    setSpeechText('Wheee! This is fun!')
    setShowSpeech(true)
    createParticles('🎪')
    setTimeout(() => setShowSpeech(false), 2000)
  }

  const handleRest = () => {
    setLastInteraction(Date.now())
    setEnergy(prev => Math.min(100, prev + 20))
    setMood('sleepy')
    setAction('sleeping')
    setSpeechText('*yawn* Time for a nap...')
    setShowSpeech(true)
    createParticles('💤')
    setTimeout(() => setShowSpeech(false), 2000)
  }

  const handleSpecialAbility = () => {
    setLastInteraction(Date.now())
    const ability = currentPet.abilities[Math.floor(Math.random() * currentPet.abilities.length)]
    
    if (currentPetType === 'dragon') {
      setSpeechText('🔥 DRAGON FIRE! 🔥')
      createParticles('🔥', 8)
      setAction('flying')
    } else if (currentPetType === 'unicorn') {
      setSpeechText('✨ RAINBOW MAGIC! ✨')
      createParticles('🌈', 6)
      setAction('flying')
    } else if (currentPetType === 'robot') {
      setSpeechText('🤖 SYSTEM SCAN COMPLETE! 🤖')
      createParticles('💻', 5)
      setAction('dancing')
    } else if (currentPetType === 'cat') {
      setSpeechText('😸 Super purr power! 😸')
      createParticles('💕', 6)
    } else if (currentPetType === 'dog') {
      setSpeechText('🐕 Fetch master activated! 🐕')
      createParticles('🎾', 4)
    }
    
    setMood('excited')
    setShowSpeech(true)
    setTimeout(() => setShowSpeech(false), 3000)
  }

  if (!isEnabled) return null

  return (
    <AnimatePresence>
      {/* Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed z-50 pointer-events-none text-2xl"
          style={{ left: particle.x, top: particle.y }}
          initial={{ opacity: 1, scale: 0, y: 0 }}
          animate={{ 
            opacity: 0, 
            scale: 1.5, 
            y: -50,
            x: Math.random() * 100 - 50 
          }}
          transition={{ duration: 2 }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="fixed z-40 select-none"
        style={{ left: position.x, top: position.y }}
      >
        {/* Customization Panel */}
        <AnimatePresence>
          {showCustomization && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute -top-40 left-0 z-50"
            >
              <Card className="w-64 shadow-xl">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Choose Your Pet
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.values(PET_TYPES).map((pet) => (
                      <Button
                        key={pet.type}
                        variant={currentPetType === pet.type ? "default" : "outline"}
                        size="sm"
                        className="text-2xl p-2 h-auto"
                        onClick={() => {
                          setCurrentPetType(pet.type)
                          setMood('happy')
                          createParticles('⭐', 3)
                        }}
                        title={pet.name}
                      >
                        {pet.emoji}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-center">
                    <p className="font-medium">{currentPet.name}</p>
                    <p className="text-gray-500">{currentPet.abilities.join(', ')}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speech Bubble */}
        <AnimatePresence>
          {showSpeech && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap max-w-48 text-center"
            >
              {speechText}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pet Container */}
        <motion.div
          className="relative backdrop-blur-sm rounded-2xl shadow-lg border p-4 cursor-grab active:cursor-grabbing min-w-[140px]"
          style={{ 
            backgroundColor: `${currentPet.color}20`,
            borderColor: currentPet.color
          }}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          animate={{
            y: action === 'jumping' ? [0, -20, 0] : 
               action === 'flying' ? [0, -10, 0] :
               action === 'sleeping' ? 0 : [0, -5, 0],
            rotate: action === 'dancing' ? [0, 5, -5, 0] : 
                    mood === 'playful' ? [0, 2, -2, 0] : 0
          }}
          transition={{
            y: { 
              duration: action === 'jumping' ? 0.5 : 
                       action === 'flying' ? 1.5 : 2, 
              repeat: action === 'sleeping' ? 0 : Infinity 
            },
            rotate: { duration: 1, repeat: Infinity }
          }}
        >
          {/* Close Button */}
          <motion.button
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3 h-3" />
          </motion.button>

          {/* Settings Button */}
          <motion.button
            className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs"
            onClick={(e) => {
              e.stopPropagation()
              setShowCustomization(!showCustomization)
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Settings className="w-3 h-3" />
          </motion.button>

          {/* Pet Face */}
          <div className="text-5xl mb-2 text-center">
            <motion.span
              animate={{
                scale: action === 'jumping' ? [1, 1.2, 1] : 
                       action === 'dancing' ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: 0.5, 
                repeat: action === 'jumping' || action === 'dancing' ? 3 : 0 
              }}
            >
              {currentPet.emoji}
            </motion.span>
          </div>

          {/* Mood Indicator */}
          <div className="text-center text-lg mb-2">
            {moodEmojis[mood]}
          </div>

          {/* Stats */}
          <div className="mb-3 space-y-1">
            <div className="flex items-center text-xs">
              <span className="w-12">⚡</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${energy}%` }}
                />
              </div>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-12">💖</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-pink-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${happiness}%` }}
                />
              </div>
            </div>
            <div className="flex items-center text-xs">
              <span className="w-12">🍽️</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${100 - hunger}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pet Actions */}
          <div className="grid grid-cols-2 gap-1">
            <motion.button
              className="w-full h-8 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-lg flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                handleFeed()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Feed"
            >
              <Coffee className="w-4 h-4 text-red-600 dark:text-red-400" />
            </motion.button>

            <motion.button
              className="w-full h-8 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-lg flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                handlePlay()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Play"
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </motion.button>

            <motion.button
              className="w-full h-8 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                handleRest()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Rest"
            >
              💤
            </motion.button>

            <motion.button
              className="w-full h-8 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 rounded-lg flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                handleSpecialAbility()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Special Ability"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </motion.button>
          </div>

          {/* Pet Name & Status */}
          <div className="text-center mt-2">
            <p className="text-sm font-medium">{currentPet.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
              {mood} {action !== 'idle' && `• ${action}`}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
