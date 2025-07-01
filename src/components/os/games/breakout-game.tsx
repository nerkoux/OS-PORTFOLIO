"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react'

interface BreakoutProps {
  onClose?: () => void
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
}

interface Brick {
  x: number
  y: number
  width: number
  height: number
  color: string
  destroyed: boolean
  points: number
}

export function BreakoutGame({ onClose }: BreakoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver' | 'won'>('menu')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)
  
  const CANVAS_WIDTH = 480
  const CANVAS_HEIGHT = 320
  const PADDLE_SPEED = 6
  const BALL_SPEED = 4

  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 50,
    dx: BALL_SPEED,
    dy: -BALL_SPEED,
    radius: 8
  })

  const [paddle, setPaddle] = useState<Paddle>({
    x: CANVAS_WIDTH / 2 - 40,
    y: CANVAS_HEIGHT - 20,
    width: 80,
    height: 10
  })

  const [bricks, setBricks] = useState<Brick[]>([])
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({})

  // Initialize bricks
  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = []
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3']
    
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 8; col++) {
        newBricks.push({
          x: col * 60 + 10,
          y: row * 20 + 30,
          width: 50,
          height: 15,
          color: colors[row],
          destroyed: false,
          points: (6 - row) * 10
        })
      }
    }
    setBricks(newBricks)
  }, [])

  // Reset game
  const resetGame = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 50,
      dx: BALL_SPEED,
      dy: -BALL_SPEED,
      radius: 8
    })
    setPaddle({
      x: CANVAS_WIDTH / 2 - 40,
      y: CANVAS_HEIGHT - 20,
      width: 80,
      height: 10
    })
    setScore(0)
    setLives(3)
    setLevel(1)
    initializeBricks()
  }, [initializeBricks])

  // Collision detection
  const checkCollision = (rect1: any, rect2: any) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y
  }

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Update paddle position
    setPaddle(prev => {
      let newX = prev.x
      if (keys['ArrowLeft'] || keys['a']) {
        newX = Math.max(0, prev.x - PADDLE_SPEED)
      }
      if (keys['ArrowRight'] || keys['d']) {
        newX = Math.min(CANVAS_WIDTH - prev.width, prev.x + PADDLE_SPEED)
      }
      return { ...prev, x: newX }
    })

    // Update ball position
    setBall(prev => {
      let newX = prev.x + prev.dx
      let newY = prev.y + prev.dy
      let newDx = prev.dx
      let newDy = prev.dy

      // Wall collisions
      if (newX <= prev.radius || newX >= CANVAS_WIDTH - prev.radius) {
        newDx = -newDx
      }
      if (newY <= prev.radius) {
        newDy = -newDy
      }

      // Ball hits bottom
      if (newY >= CANVAS_HEIGHT) {
        setLives(currentLives => {
          const newLives = currentLives - 1
          if (newLives <= 0) {
            setGameState('gameOver')
          } else {
            // Reset ball position
            newX = CANVAS_WIDTH / 2
            newY = CANVAS_HEIGHT - 50
            newDx = BALL_SPEED
            newDy = -BALL_SPEED
          }
          return newLives
        })
      }

      // Paddle collision
      const ballRect = { x: newX - prev.radius, y: newY - prev.radius, width: prev.radius * 2, height: prev.radius * 2 }
      if (checkCollision(ballRect, paddle)) {
        newDy = -Math.abs(newDy)
        // Add some angle based on where ball hits paddle
        const hitPos = (newX - paddle.x) / paddle.width
        newDx = (hitPos - 0.5) * 8
      }

      return { ...prev, x: newX, y: newY, dx: newDx, dy: newDy }
    })

    // Brick collisions
    setBricks(prev => {
      const newBricks = [...prev]
      let hitBrick = false

      for (let i = 0; i < newBricks.length; i++) {
        if (newBricks[i].destroyed) continue

        const ballRect = { 
          x: ball.x - ball.radius, 
          y: ball.y - ball.radius, 
          width: ball.radius * 2, 
          height: ball.radius * 2 
        }

        if (checkCollision(ballRect, newBricks[i])) {
          newBricks[i].destroyed = true
          hitBrick = true
          setScore(currentScore => currentScore + newBricks[i].points)
          
          setBall(currentBall => ({
            ...currentBall,
            dy: -currentBall.dy
          }))
          break
        }
      }

      // Check if all bricks destroyed
      const remainingBricks = newBricks.filter(brick => !brick.destroyed)
      if (remainingBricks.length === 0) {
        setGameState('won')
      }

      return newBricks
    })

    // Draw paddle
    ctx.fillStyle = '#4ecdc4'
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)

    // Draw ball
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#ff6b6b'
    ctx.fill()

    // Draw bricks
    bricks.forEach(brick => {
      if (!brick.destroyed) {
        ctx.fillStyle = brick.color
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height)
        ctx.strokeStyle = '#fff'
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height)
      }
    })

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, keys, ball, paddle, bricks])

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Game loop effect
  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop, gameState])

  const startGame = () => {
    resetGame()
    setGameState('playing')
  }

  const pauseGame = () => {
    setGameState(gameState === 'paused' ? 'playing' : 'paused')
  }

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-2xl border-2 border-purple-500/50">
          <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Breakout</h2>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span>Score: {score}</span>
                <span>Lives: {lives}</span>
                <span>Level: {level}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-black mx-auto block"
              />

              {/* Game overlays */}
              <AnimatePresence>
                {gameState === 'menu' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center text-white">
                      <h3 className="text-3xl font-bold mb-4">Breakout Game</h3>
                      <p className="mb-6">Use arrow keys or A/D to move paddle</p>
                      <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Game
                      </Button>
                    </div>
                  </motion.div>
                )}

                {gameState === 'paused' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-4">Game Paused</h3>
                      <Button onClick={pauseGame} className="bg-purple-600 hover:bg-purple-700">
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    </div>
                  </motion.div>
                )}

                {gameState === 'gameOver' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center text-white">
                      <h3 className="text-3xl font-bold mb-2 text-red-400">Game Over!</h3>
                      <p className="text-xl mb-4">Final Score: {score}</p>
                      <div className="space-x-4">
                        <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Play Again
                        </Button>
                        <Button onClick={() => setGameState('menu')} variant="outline">
                          Menu
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {gameState === 'won' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center text-white">
                      <h3 className="text-3xl font-bold mb-2 text-green-400">You Won!</h3>
                      <p className="text-xl mb-4">Score: {score}</p>
                      <div className="space-x-4">
                        <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                          <Play className="w-4 h-4 mr-2" />
                          Next Level
                        </Button>
                        <Button onClick={() => setGameState('menu')} variant="outline">
                          Menu
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {gameState === 'playing' && (
              <div className="flex justify-center mt-4 space-x-4">
                <Button onClick={pauseGame} variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button onClick={() => setGameState('menu')} variant="outline">
                  Menu
                </Button>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Use Arrow Keys or A/D to move • Break all bricks to win!</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
