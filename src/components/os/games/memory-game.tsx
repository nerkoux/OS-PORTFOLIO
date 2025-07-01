"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RotateCcw, Trophy, Brain, Timer } from 'lucide-react'

interface MemoryCard {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  onClose?: () => void
}

export function MemoryGame({ onClose }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bestTime, setBestTime] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('memoryGameBestTime') || '999')
    }
    return 999
  })

  const emojis = ['🚀', '🎮', '💻', '🎨', '🎵', '⚡', '🌟', '🔥']

  const initializeGame = () => {
    const gameCards: MemoryCard[] = []
    emojis.forEach((emoji, index) => {
      // Add two cards for each emoji
      gameCards.push(
        { id: index * 2, value: emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, value: emoji, isFlipped: false, isMatched: false }
      )
    })
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
    }
    
    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
    setTimeElapsed(0)
    setIsPlaying(true)
  }

  const handleCardClick = (cardId: number) => {
    if (!isPlaying || gameWon) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ))
          setMatches(prev => {
            const newMatches = prev + 1
            if (newMatches === emojis.length) {
              setGameWon(true)
              setIsPlaying(false)
              if (timeElapsed < bestTime) {
                setBestTime(timeElapsed)
                if (typeof window !== 'undefined') {
                  localStorage.setItem('memoryGameBestTime', timeElapsed.toString())
                }
              }
            }
            return newMatches
          })
          setFlippedCards([])
        }, 600)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameWon])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    initializeGame()
  }, [])

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Brain className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Memory Game</h2>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-1">
                <Timer className="w-4 h-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
              <div>Moves: {moves}</div>
              <div>Matches: {matches}/{emojis.length}</div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>Best: {bestTime === 999 ? '--' : formatTime(bestTime)}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Game Board */}
            <div className="grid grid-cols-4 gap-3 mb-6 max-w-md mx-auto">
              <AnimatePresence>
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      aspect-square rounded-lg cursor-pointer flex items-center justify-center text-2xl font-bold
                      transition-all duration-300 shadow-lg
                      ${card.isMatched 
                        ? 'bg-green-200 dark:bg-green-800 border-2 border-green-400' 
                        : card.isFlipped 
                          ? 'bg-white dark:bg-gray-700 border-2 border-purple-400' 
                          : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'
                      }
                    `}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <motion.div
                      animate={{ 
                        rotateY: card.isFlipped || card.isMatched ? 0 : 180,
                        scale: card.isMatched ? [1, 1.2, 1] : 1
                      }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center w-full h-full"
                    >
                      {card.isFlipped || card.isMatched ? (
                        <span className="select-none">{card.value}</span>
                      ) : (
                        <span className="text-white text-lg">?</span>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Game Won Overlay */}
            <AnimatePresence>
              {gameWon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center mb-6"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg p-4 shadow-xl">
                    <h3 className="text-2xl font-bold mb-2">🎉 Congratulations! 🎉</h3>
                    <p className="text-lg">You won in {moves} moves and {formatTime(timeElapsed)}!</p>
                    {timeElapsed === bestTime && (
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-yellow-200 font-bold mt-2"
                      >
                        🏆 New Best Time! 🏆
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={initializeGame}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              <p>Find all matching pairs by flipping cards</p>
              <p>Try to complete the game in the fewest moves and fastest time!</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
