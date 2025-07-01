"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RotateCcw, Trophy, Zap } from 'lucide-react'

type Player = 'X' | 'O' | null
type GameMode = 'human' | 'ai'

interface TicTacToeProps {
  onClose?: () => void
}

export function TicTacToe({ onClose }: TicTacToeProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X')
  const [winner, setWinner] = useState<Player | 'tie' | null>(null)
  const [gameMode, setGameMode] = useState<GameMode>('human')
  const [scores, setScores] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ticTacToeScores')
      return saved ? JSON.parse(saved) : { X: 0, O: 0, ties: 0 }
    }
    return { X: 0, O: 0, ties: 0 }
  })
  const [isThinking, setIsThinking] = useState(false)

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ]

  const checkWinner = (board: Player[]): Player | 'tie' | null => {
    // Check for winning combinations
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    
    // Check for tie
    if (board.every(cell => cell !== null)) {
      return 'tie'
    }
    
    return null
  }

  const getMiniMaxScore = (board: Player[], isMaximizing: boolean, depth: number): number => {
    const result = checkWinner(board)
    
    if (result === 'O') return 10 - depth // AI wins
    if (result === 'X') return depth - 10 // Human wins
    if (result === 'tie') return 0
    
    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O'
          const score = getMiniMaxScore(board, false, depth + 1)
          board[i] = null
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X'
          const score = getMiniMaxScore(board, true, depth + 1)
          board[i] = null
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
  }

  const getBestMove = (board: Player[]): number => {
    let bestScore = -Infinity
    let bestMove = -1
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O'
        const score = getMiniMaxScore(board, false, 0)
        board[i] = null
        
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }
    
    return bestMove
  }

  const makeMove = (index: number) => {
    if (board[index] || winner || isThinking) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      updateScores(gameWinner)
      return
    }

    if (gameMode === 'ai' && currentPlayer === 'X') {
      setCurrentPlayer('O')
    } else if (gameMode === 'human') {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  // AI move effect
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner) {
      setIsThinking(true)
      const timer = setTimeout(() => {
        const bestMove = getBestMove(board)
        if (bestMove !== -1) {
          const newBoard = [...board]
          newBoard[bestMove] = 'O'
          setBoard(newBoard)
          
          const gameWinner = checkWinner(newBoard)
          if (gameWinner) {
            setWinner(gameWinner)
            updateScores(gameWinner)
          } else {
            setCurrentPlayer('X')
          }
        }
        setIsThinking(false)
      }, 500 + Math.random() * 1000) // Random delay for more human-like feel
      
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameMode, board, winner])

  const updateScores = (winner: Player | 'tie') => {
    const newScores = { ...scores }
    if (winner === 'tie') {
      newScores.ties++
    } else if (winner) {
      newScores[winner]++
    }
    setScores(newScores)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ticTacToeScores', JSON.stringify(newScores))
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setIsThinking(false)
  }

  const resetScores = () => {
    const newScores = { X: 0, O: 0, ties: 0 }
    setScores(newScores)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ticTacToeScores', JSON.stringify(newScores))
    }
  }

  const switchGameMode = () => {
    setGameMode(gameMode === 'human' ? 'ai' : 'human')
    resetGame()
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Tic Tac Toe</h2>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>Mode: {gameMode === 'ai' ? 'vs AI' : 'vs Human'}</div>
              <div className="flex items-center space-x-4">
                <span>X: {scores.X}</span>
                <span>O: {scores.O}</span>
                <span>Ties: {scores.ties}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Game Status */}
            <div className="text-center mb-6">
              <AnimatePresence mode="wait">
                {winner ? (
                  <motion.div
                    key="winner"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-2xl font-bold p-4 rounded-lg ${
                      winner === 'tie' 
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : winner === 'X'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {winner === 'tie' ? "It's a Tie!" : `Player ${winner} Wins!`}
                    {gameMode === 'ai' && winner === 'O' && (
                      <div className="text-lg mt-2">🤖 AI Wins!</div>
                    )}
                    {gameMode === 'ai' && winner === 'X' && (
                      <div className="text-lg mt-2">🎉 You Beat the AI!</div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-xl font-semibold p-3 rounded-lg ${
                      currentPlayer === 'X' 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {isThinking ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"
                        />
                        <span>AI is thinking...</span>
                      </div>
                    ) : (
                      <>
                        Player {currentPlayer}'s Turn
                        {gameMode === 'ai' && currentPlayer === 'X' && (
                          <div className="text-sm mt-1">Your move!</div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-3 gap-2 mb-6 max-w-xs mx-auto">
              {board.map((cell, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: cell ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    aspect-square text-4xl font-bold rounded-lg transition-all duration-200
                    ${cell 
                      ? cell === 'X' 
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                        : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                    ${!cell && !winner && !isThinking ? 'cursor-pointer' : 'cursor-not-allowed'}
                  `}
                  onClick={() => makeMove(index)}
                  disabled={!!cell || !!winner || isThinking}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: cell ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {cell}
                  </motion.span>
                </motion.button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={resetGame}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
                
                <Button
                  onClick={switchGameMode}
                  variant="outline"
                >
                  {gameMode === 'ai' ? '👥 Play vs Human' : '🤖 Play vs AI'}
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={resetScores}
                  variant="outline"
                  size="sm"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Reset Scores
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              <p>Get three in a row to win!</p>
              {gameMode === 'ai' && (
                <p className="mt-1">🤖 AI uses advanced strategy - good luck!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
