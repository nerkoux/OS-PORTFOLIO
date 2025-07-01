"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calculator, Delete, RotateCcw, History } from 'lucide-react'

interface CalculatorProps {
  onClose?: () => void
}

export function CalculatorApp({ onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('calculatorHistory')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [showHistory, setShowHistory] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(display)
    } else if (operation) {
      const currentValue = previousValue || '0'
      const newValue = calculate(parseFloat(currentValue), inputValue, operation)
      
      setDisplay(String(newValue))
      setPreviousValue(String(newValue))
      
      // Add to history
      const calculation = `${currentValue} ${operation} ${inputValue} = ${newValue}`
      addToHistory(calculation)
    }

    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      case '%':
        return firstValue % secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const currentValue = parseFloat(previousValue)
      const newValue = calculate(currentValue, inputValue, operation)
      
      // Add to history
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`
      addToHistory(calculation)
      
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const addToHistory = (calculation: string) => {
    const newHistory = [calculation, ...history.slice(0, 9)] // Keep last 10 calculations
    setHistory(newHistory)
    if (typeof window !== 'undefined') {
      localStorage.setItem('calculatorHistory', JSON.stringify(newHistory))
    }
  }

  const clearDisplay = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.charAt(0) === '-' ? display.slice(1) : '-' + display)
    }
  }

  const clearHistory = () => {
    setHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('calculatorHistory')
    }
  }

  const buttons = [
    { label: 'C', action: clearDisplay, className: 'bg-red-500 hover:bg-red-600 text-white col-span-2' },
    { label: '⌫', action: deleteLast, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: '÷', action: () => inputOperation('÷'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '7', action: () => inputNumber('7'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '8', action: () => inputNumber('8'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '9', action: () => inputNumber('9'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '×', action: () => inputOperation('×'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '4', action: () => inputNumber('4'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '5', action: () => inputNumber('5'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '6', action: () => inputNumber('6'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '-', action: () => inputOperation('-'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '1', action: () => inputNumber('1'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '2', action: () => inputNumber('2'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '3', action: () => inputNumber('3'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '+', action: () => inputOperation('+'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    
    { label: '±', action: toggleSign, className: 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500' },
    { label: '0', action: () => inputNumber('0'), className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '.', action: inputDecimal, className: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' },
    { label: '=', action: performCalculation, className: 'bg-green-500 hover:bg-green-600 text-white' },
  ]

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center bg-gradient-to-r from-gray-600 to-slate-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Calculator</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-white hover:bg-white/20"
              >
                <History className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Display */}
            <div className="mb-4">
              <div className="bg-black text-white p-4 rounded-lg text-right font-mono">
                <div className="text-sm text-gray-400 h-5">
                  {previousValue && operation && `${previousValue} ${operation}`}
                </div>
                <motion.div
                  key={display}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold truncate"
                >
                  {display}
                </motion.div>
              </div>
            </div>

            {/* History Panel */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <Card className="bg-gray-50 dark:bg-gray-800">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">History</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearHistory}
                          className="text-xs"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Clear
                        </Button>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {history.length === 0 ? (
                          <p className="text-xs text-gray-500 text-center py-2">No calculations yet</p>
                        ) : (
                          history.map((calc, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-xs font-mono bg-white dark:bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => {
                                const result = calc.split(' = ')[1]
                                setDisplay(result)
                                setWaitingForNewValue(true)
                              }}
                            >
                              {calc}
                            </motion.div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button Grid */}
            <div className="grid grid-cols-4 gap-2">
              {buttons.map((button, index) => (
                <motion.div
                  key={button.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={button.className?.includes('col-span-2') ? 'col-span-2' : ''}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`w-full h-12 text-lg font-semibold ${button.className} transition-all duration-150`}
                      onClick={button.action}
                    >
                      {button.label === '⌫' ? <Delete className="w-5 h-5" /> : button.label}
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
