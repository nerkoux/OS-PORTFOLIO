"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Play, Pause, RotateCcw, Trophy, Gamepad2 } from 'lucide-react'

interface Position {
  x: number
  y: number
}

interface SnakeGameProps {
  onClose?: () => void
}

export function SnakeGame({ onClose }: SnakeGameProps) {
  const GRID_SIZE = 20
  const INITIAL_SNAKE = [{ x: 10, y: 10 }]
  const INITIAL_FOOD = { x: 15, y: 15 }
  const INITIAL_DIRECTION = { x: 0, y: -1 }

  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('snakeHighScore') || '0')
    }
    return 0
  })
  const [gameOver, setGameOver] = useState(false)
  const [speed, setSpeed] = useState(150)

  const generateFood = useCallback(() => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setScore(0)
    setGameOver(false)
    setSpeed(150)
  }

  const toggleGame = () => {
    if (gameOver) {
      resetGame()
    }
    setIsPlaying(!isPlaying)
  }

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }

      head.x += direction.x
      head.y += direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10
          if (newScore > highScore) {
            setHighScore(newScore)
            if (typeof window !== 'undefined') {
              localStorage.setItem('snakeHighScore', newScore.toString())
            }
          }
          return newScore
        })
        setFood(generateFood())
        // Increase speed slightly
        setSpeed(prev => Math.max(50, prev - 2))
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, generateFood, gameOver, highScore, isPlaying])

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed)
    return () => clearInterval(gameInterval)
  }, [moveSnake, speed])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return

      const keyMap: { [key: string]: Position } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 }
      }

      const newDirection = keyMap[e.key]
      if (newDirection) {
        e.preventDefault()
        // Prevent reverse direction
        if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
          setDirection(newDirection)
        }
      }

      if (e.key === ' ') {
        e.preventDefault()
        toggleGame()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, isPlaying])

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Gamepad2 className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Snake Game</h2>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm">
                Score: <span className="font-bold">{score}</span>
              </div>
              <div className="text-sm flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>Best: {highScore}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Game Board */}
            <div className="relative mx-auto mb-6" style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}>
              <div
                className="border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 relative"
                style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
              >
                {/* Snake */}
                <AnimatePresence>
                  {snake.map((segment, index) => (
                    <motion.div
                      key={`${segment.x}-${segment.y}-${index}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={`absolute w-5 h-5 rounded-sm ${
                        index === 0 
                          ? 'bg-green-500 shadow-lg' 
                          : 'bg-green-400'
                      }`}
                      style={{
                        left: segment.x * 20,
                        top: segment.y * 20
                      }}
                    >
                      {index === 0 && (
                        <div className="w-full h-full bg-green-600 rounded-sm flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Food */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute w-5 h-5 bg-red-500 rounded-full shadow-lg"
                  style={{
                    left: food.x * 20,
                    top: food.y * 20
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-full"></div>
                </motion.div>

                {/* Game Over Overlay */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/70 flex items-center justify-center"
                    >
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                        <p className="text-lg mb-4">Score: {score}</p>
                        {score === highScore && score > 0 && (
                          <motion.p
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-yellow-400 font-bold mb-4"
                          >
                            🎉 New High Score! 🎉
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mb-4">
              <Button
                onClick={toggleGame}
                className={`${
                  isPlaying 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : gameOver 
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : gameOver ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </Button>

              <Button
                onClick={resetGame}
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">Use arrow keys or WASD to move</p>
              <p>Press Space to pause/resume</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
