"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Play, Pause, RotateCcw, Trophy, Square } from 'lucide-react'

interface TetrisProps {
  onClose?: () => void
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const EMPTY = 0

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

interface Tetromino {
  shape: number[][]
  color: string
  type: TetrominoType
}

const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0',
    type: 'I'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000',
    type: 'O'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a000f0',
    type: 'T'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00f000',
    type: 'S'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#f00000',
    type: 'Z'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000f0',
    type: 'J'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f0a000',
    type: 'L'
  }
}

export function TetrisGame({ onClose }: TetrisProps) {
  const [board, setBoard] = useState<string[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  )
  const [currentPiece, setCurrentPiece] = useState<{
    tetromino: Tetromino
    x: number
    y: number
    rotation: number
  } | null>(null)
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu')
  const [dropTime, setDropTime] = useState(1000)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getRandomTetromino = useCallback((): Tetromino => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
    const randomType = types[Math.floor(Math.random() * types.length)]
    return TETROMINOES[randomType]
  }, [])

  const rotatePiece = (piece: number[][]): number[][] => {
    const rotated = piece[0].map((_, index) =>
      piece.map(row => row[index]).reverse()
    )
    return rotated
  }

  const isValidMove = useCallback((
    tetromino: number[][],
    x: number,
    y: number
  ): boolean => {
    for (let dy = 0; dy < tetromino.length; dy++) {
      for (let dx = 0; dx < tetromino[dy].length; dx++) {
        if (tetromino[dy][dx]) {
          const newX = x + dx
          const newY = y + dy
          
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return false
          }
        }
      }
    }
    return true
  }, [board])

  const placePiece = useCallback(() => {
    if (!currentPiece) return

    const newBoard = board.map(row => [...row])
    
    for (let dy = 0; dy < currentPiece.tetromino.shape.length; dy++) {
      for (let dx = 0; dx < currentPiece.tetromino.shape[dy].length; dx++) {
        if (currentPiece.tetromino.shape[dy][dx]) {
          const x = currentPiece.x + dx
          const y = currentPiece.y + dy
          if (y >= 0) {
            newBoard[y][x] = currentPiece.tetromino.color
          }
        }
      }
    }

    // Check for completed lines
    const completedLines: number[] = []
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every(cell => cell !== '')) {
        completedLines.push(y)
      }
    }

    // Remove completed lines
    completedLines.forEach(lineIndex => {
      newBoard.splice(lineIndex, 1)
      newBoard.unshift(Array(BOARD_WIDTH).fill(''))
    })

    // Update score and lines
    const linesCleared = completedLines.length
    setLines(prev => prev + linesCleared)
    setScore(prev => prev + linesCleared * 100 * level)
    setLevel(Math.floor(lines / 10) + 1)
    setDropTime(Math.max(50, 1000 - (level - 1) * 50))

    setBoard(newBoard)
    
    // Check game over
    if (currentPiece.y <= 0) {
      setGameState('gameOver')
      return
    }

    // Spawn new piece
    setCurrentPiece({
      tetromino: nextPiece || getRandomTetromino(),
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      rotation: 0
    })
    setNextPiece(getRandomTetromino())
  }, [currentPiece, board, nextPiece, getRandomTetromino, lines, level])

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece) return

    const newX = currentPiece.x + dx
    const newY = currentPiece.y + dy

    if (isValidMove(currentPiece.tetromino.shape, newX, newY)) {
      setCurrentPiece(prev => prev ? { ...prev, x: newX, y: newY } : null)
    } else if (dy > 0) {
      // Piece hit bottom or another piece
      placePiece()
    }
  }, [currentPiece, isValidMove, placePiece])

  const rotatePieceAction = useCallback(() => {
    if (!currentPiece) return

    const rotated = rotatePiece(currentPiece.tetromino.shape)
    
    if (isValidMove(rotated, currentPiece.x, currentPiece.y)) {
      setCurrentPiece(prev => prev ? {
        ...prev,
        tetromino: { ...prev.tetromino, shape: rotated },
        rotation: (prev.rotation + 90) % 360
      } : null)
    }
  }, [currentPiece, isValidMove])

  const dropPiece = useCallback(() => {
    movePiece(0, 1)
  }, [movePiece])

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      intervalRef.current = setInterval(dropPiece, dropTime)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameState, dropPiece, dropTime])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          movePiece(-1, 0)
          break
        case 'ArrowRight':
        case 'd':
          movePiece(1, 0)
          break
        case 'ArrowDown':
        case 's':
          movePiece(0, 1)
          break
        case 'ArrowUp':
        case 'w':
        case ' ':
          rotatePieceAction()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState, movePiece, rotatePieceAction])

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('')))
    setScore(0)
    setLines(0)
    setLevel(1)
    setDropTime(1000)
    
    const firstPiece = getRandomTetromino()
    setCurrentPiece({
      tetromino: firstPiece,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0,
      rotation: 0
    })
    setNextPiece(getRandomTetromino())
    setGameState('playing')
  }

  const togglePause = () => {
    setGameState(prev => prev === 'paused' ? 'playing' : 'paused')
  }

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    
    // Add current piece to display
    if (currentPiece) {
      for (let dy = 0; dy < currentPiece.tetromino.shape.length; dy++) {
        for (let dx = 0; dx < currentPiece.tetromino.shape[dy].length; dx++) {
          if (currentPiece.tetromino.shape[dy][dx]) {
            const x = currentPiece.x + dx
            const y = currentPiece.y + dy
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
              displayBoard[y][x] = currentPiece.tetromino.color
            }
          }
        }
      }
    }

    return displayBoard
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto flex gap-6"
      >
        {/* Game Board */}
        <Card className="shadow-2xl border-2 border-purple-500/50">
          <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center justify-center space-x-2">
              <Square className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Tetris</h2>
            </div>
          </CardHeader>

          <CardContent className="p-4 bg-black">
            <div className="relative">
              <div 
                className="grid gap-px bg-gray-800 p-2 mx-auto"
                style={{ 
                  gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
                  gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
                  width: '300px',
                  height: '600px'
                }}
              >
                {renderBoard().map((row, y) =>
                  row.map((cell, x) => (
                    <motion.div
                      key={`${x}-${y}`}
                      className="w-full h-full border border-gray-700"
                      style={{
                        backgroundColor: cell || '#111',
                      }}
                      animate={{
                        scale: cell ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 0.1,
                      }}
                    />
                  ))
                )}
              </div>

              {/* Game overlays */}
              <AnimatePresence>
                {gameState === 'menu' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center text-white">
                      <h3 className="text-3xl font-bold mb-4">Tetris</h3>
                      <p className="mb-6">Use arrow keys or WASD to play</p>
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
                    className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg"
                  >
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-4">Game Paused</h3>
                      <Button onClick={togglePause} className="bg-purple-600 hover:bg-purple-700">
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
                    className="absolute inset-0 bg-black/95 flex items-center justify-center rounded-lg"
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
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <Card className="shadow-xl border border-purple-500/30">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-3">Stats</h3>
              <div className="space-y-2 text-white">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-mono">{score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lines:</span>
                  <span className="font-mono">{lines}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-mono">{level}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Piece */}
          {nextPiece && (
            <Card className="shadow-xl border border-purple-500/30">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">Next</h3>
                <div className="grid gap-px bg-gray-800 p-2" style={{ 
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(4, 1fr)'
                }}>
                  {Array(16).fill(0).map((_, i) => {
                    const x = i % 4
                    const y = Math.floor(i / 4)
                    const isActive = nextPiece.shape[y] && nextPiece.shape[y][x]
                    
                    return (
                      <div
                        key={i}
                        className="w-6 h-6 border border-gray-700"
                        style={{
                          backgroundColor: isActive ? nextPiece.color : '#111'
                        }}
                      />
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <Card className="shadow-xl border border-purple-500/30">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-white mb-3">Controls</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <div>↔ / A D: Move</div>
                <div>↓ / S: Drop</div>
                <div>↑ / W / Space: Rotate</div>
              </div>
              {gameState === 'playing' && (
                <Button 
                  onClick={togglePause} 
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
