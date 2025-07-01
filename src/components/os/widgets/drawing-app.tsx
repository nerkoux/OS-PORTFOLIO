"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Palette, Download, RotateCcw, Brush, Eraser } from 'lucide-react'

interface DrawingAppProps {
  onClose?: () => void
}

export function DrawingApp({ onClose }: DrawingAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState('#3b82f6')
  const [brushSize, setBrushSize] = useState(3)
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush')
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#ffc0cb', '#a52a2a', '#808080', '#000080', '#008000'
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Fill with white background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set default drawing properties
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastPosition({ x, y })
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosition) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : brushColor
    ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, lastPosition.y)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastPosition({ x, y })
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPosition(null)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'my-drawing.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="h-full bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 p-6 overflow-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Drawing Canvas</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadImage}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCanvas}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Tools */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              {/* Tool Selection */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={tool === 'brush' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTool('brush')}
                >
                  <Brush className="w-4 h-4 mr-2" />
                  Brush
                </Button>
                <Button
                  variant={tool === 'eraser' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTool('eraser')}
                >
                  <Eraser className="w-4 h-4 mr-2" />
                  Eraser
                </Button>
              </div>

              {/* Brush Size */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Size:</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm w-6">{brushSize}</span>
              </div>

              {/* Color Palette */}
              {tool === 'brush' && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Color:</label>
                  <div className="flex flex-wrap gap-1">
                    {colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-6 h-6 rounded-full border-2 ${
                          brushColor === color ? 'border-gray-600' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBrushColor(color)}
                      />
                    ))}
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair bg-white"
                style={{ width: '100%', height: '400px' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              
              {/* Brush Preview */}
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {tool === 'brush' ? `🖌️ Brush (${brushSize}px)` : `🧹 Eraser (${brushSize * 2}px)`}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              <p>Click and drag to draw • Use the eraser tool to remove parts of your drawing</p>
              <p>Change brush size and color to create amazing artwork!</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
