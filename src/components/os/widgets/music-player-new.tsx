"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Heart, MoreHorizontal, X, Mic2 } from 'lucide-react'

interface MusicPlayerProps {
  onClose?: () => void
}

interface Track {
  id: number
  title: string
  artist: string
  album?: string
  duration: string
  file: string
  lrcFile?: string
  cover?: string
}

interface LyricsLine {
  text: string
  time: number
}

interface LyricsData {
  artist: string
  title: string
  lyrics: LyricsLine[]
  source?: 'lrc' | 'genius' | 'mock'
}

export function MusicPlayer({ onClose }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const [lyrics, setLyrics] = useState<LyricsData | null>(null)
  const [loadingLyrics, setLoadingLyrics] = useState(false)
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1)
  const [showLyrics, setShowLyrics] = useState(true)

  // Demo tracks
  const tracks: Track[] = [
    { 
      id: 1, 
      title: "Never Gonna Give You Up", 
      artist: "Rick Astley", 
      album: "3 Originals",
      duration: "03:34", 
      file: "/sounds/ng.mp3",
      lrcFile: "/lyrics/ng.lrc"
    },
    { 
      id: 2, 
      title: "Ego", 
      artist: "Qing Madi", 
      album: "MADNESS",
      duration: "03:38", 
      file: "/sounds/ego.mp3",
      lrcFile: "/lyrics/ego.lrc"
    },
    { 
      id: 3, 
      title: "Levitating", 
      artist: "Dua Lipa", 
      album: "Future Nostalgia",
      duration: "03:23", 
      file: "/sounds/levitating.mp3",
      lrcFile: "/lyrics/levitating.lrc"
    }
  ]

  // Parse LRC file format
  const parseLRC = (lrcContent: string, artist: string, title: string): LyricsData => {
    const lines = lrcContent.split('\n')
    const lyrics: LyricsLine[] = []
    
    for (const line of lines) {
      // Match format [mm:ss.xx] or [mm:ss] lyrics
      const match = line.match(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)/)
      if (match) {
        const [, minutes, seconds, centiseconds = '0', text] = match
        const time = parseInt(minutes) * 60000 + parseInt(seconds) * 1000 + parseInt(centiseconds.padEnd(3, '0'))
        if (text.trim()) {
          lyrics.push({ text: text.trim(), time })
        }
      }
    }
    
    return {
      artist,
      title,
      lyrics: lyrics.sort((a, b) => a.time - b.time),
      source: 'lrc'
    }
  }

  // Load audio and lyrics when track changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.load()
    setCurrentTime(0)
    setDuration(0)

    if (isPlaying) {
      audio.play().catch(console.error)
    }
  }, [currentTrack])

  // Load lyrics when track changes or lyrics toggle
  useEffect(() => {
    if (!showLyrics) return

    const fetchLyrics = async () => {
      setLoadingLyrics(true)
      setLyrics(null)
      setCurrentLyricIndex(-1)

      try {
        const track = tracks[currentTrack]
        
        // Try to load LRC file first
        if (track.lrcFile) {
          try {
            const lrcResponse = await fetch(track.lrcFile)
            if (lrcResponse.ok) {
              const lrcContent = await lrcResponse.text()
              const lyricsData = parseLRC(lrcContent, track.artist, track.title)
              setLyrics(lyricsData)
              return
            }
          } catch (lrcError) {
            console.warn('Failed to load LRC file, falling back to API:', lrcError)
          }
        }
        
        const response = await fetch(
          `/api/lyrics?artist=${encodeURIComponent(track.artist)}&title=${encodeURIComponent(track.title)}`
        )
        
        if (response.ok) {
          const lyricsData = await response.json()
          setLyrics(lyricsData)
        } else {
          console.error('Failed to fetch lyrics:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching lyrics:', error)
      } finally {
        setLoadingLyrics(false)
      }
    }

    fetchLyrics()
  }, [currentTrack, showLyrics])

  // Update current lyric line and auto-scroll
  useEffect(() => {
    if (!lyrics || !isPlaying) return

    const currentTimeMs = currentTime * 1000
    const currentLine = lyrics.lyrics.findIndex(
      (line, index) => {
        const nextLine = lyrics.lyrics[index + 1]
        return currentTimeMs >= line.time && (!nextLine || currentTimeMs < nextLine.time)
      }
    )

    setCurrentLyricIndex(currentLine)

    // Auto-scroll to current lyric line
    if (currentLine >= 0 && lyricsRef.current) {
      const lyricsContainer = lyricsRef.current
      const currentLineElement = lyricsContainer.children[currentLine] as HTMLElement
      
      if (currentLineElement) {
        const containerHeight = lyricsContainer.clientHeight
        const lineTop = currentLineElement.offsetTop
        const lineHeight = currentLineElement.clientHeight
        
        // Calculate the scroll position to center the current line
        const scrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2)
        
        lyricsContainer.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        })
      }
    }
  }, [currentTime, lyrics, isPlaying])

  // Control functions
  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skipTrack = (direction: 'next' | 'prev') => {
    let newIndex
    if (direction === 'next') {
      newIndex = shuffle ? Math.floor(Math.random() * tracks.length) : (currentTrack + 1) % tracks.length
    } else {
      newIndex = currentTrack - 1 < 0 ? tracks.length - 1 : currentTrack - 1
    }
    setCurrentTrack(newIndex)
    setIsPlaying(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (audio) {
      const newTime = (parseFloat(e.target.value) / 100) * duration
      audio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleAudioError = () => {
    setAudioError(true)
    setIsPlaying(false)
  }

  const handleAudioCanPlay = () => {
    setAudioError(false)
  }

  const seekToLyricLine = (timeMs: number) => {
    const audio = audioRef.current
    if (audio) {
      const timeInSeconds = timeMs / 1000
      audio.currentTime = timeInSeconds
      setCurrentTime(timeInSeconds)
    }
  }

  const track = tracks[currentTrack]
  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative flex flex-col">
   
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />


      {/* Main Content Container */}
      <div className="relative z-10 flex-1 overflow-hidden">
        {!showLyrics ? (
          /* Full Player Mode */
          <div className="h-full flex flex-col justify-center px-8">
            {/* Album Art & Track Info */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={currentTrack}
              className="text-center mb-8"
            >
              <motion.div 
                className="relative mx-auto mb-6 group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                  
                  {/* Animated background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-400/50 via-pink-400/50 to-indigo-400/50"
                    animate={{
                      background: isPlaying 
                        ? ['linear-gradient(45deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5), rgba(99,102,241,0.5))',
                           'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5), rgba(236,72,153,0.5))',
                           'linear-gradient(225deg, rgba(236,72,153,0.5), rgba(99,102,241,0.5), rgba(168,85,247,0.5))',
                           'linear-gradient(315deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5), rgba(99,102,241,0.5))']
                        : 'linear-gradient(45deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5), rgba(99,102,241,0.5))'
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <Music className="w-24 h-24 text-white/90 relative z-10" />
                  
                  {/* Play indicator */}
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ scale: [1, 0.8, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                            className="w-4 h-4 bg-white rounded-full"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-2">{track.title}</h3>
                <p className="text-gray-300 text-lg mb-1">{track.artist}</p>
                {track.album && <p className="text-gray-500 text-sm">{track.album}</p>}
              </motion.div>
            </motion.div>

            {/* Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center space-x-8 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShuffle(!shuffle)}
                className={`p-3 rounded-full transition-colors ${
                  shuffle ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => skipTrack('prev')}
                className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center shadow-lg transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => skipTrack('next')}
                className="p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRepeat(!repeat)}
                className={`p-3 rounded-full transition-colors ${
                  repeat ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Secondary Controls */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked ? 'text-red-400 bg-red-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowLyrics(!showLyrics)}
                  className={`p-2 rounded-full transition-colors ${
                    showLyrics ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Mic2 className="w-5 h-5" />
                </motion.button>
              </div>


            </motion.div>
          </div>
        ) : (
          /* Split Mode: Player + Lyrics */
          <div className="h-full flex">
            {/* Left Side: Compact Player */}
            <div className="w-1/2 flex flex-col justify-center px-6">
              {/* Compact Album Art & Track Info */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={currentTrack}
                className="text-center mb-6"
              >
                <motion.div 
                  className="relative mx-auto mb-4 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
                    
                    {/* Animated background */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-purple-400/50 via-pink-400/50 to-indigo-400/50"
                      animate={{
                        background: isPlaying 
                          ? ['linear-gradient(45deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5), rgba(99,102,241,0.5))',
                             'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5), rgba(236,72,153,0.5))',
                             'linear-gradient(225deg, rgba(236,72,153,0.5), rgba(99,102,241,0.5), rgba(168,85,247,0.5))',
                             'linear-gradient(315deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5), rgba(99,102,241,0.5))']
                          : 'linear-gradient(45deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5), rgba(99,102,241,0.5))'
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <Music className="w-16 h-16 text-white/90 relative z-10" />
                    
                    {/* Play indicator */}
                    <AnimatePresence>
                      {isPlaying && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                          >
                            <motion.div
                              animate={{ scale: [1, 0.8, 1] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                              className="w-3 h-3 bg-white rounded-full"
                            />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-1">{track.title}</h3>
                  <p className="text-gray-300 text-sm mb-1">{track.artist}</p>
                  {track.album && <p className="text-gray-500 text-xs">{track.album}</p>}
                </motion.div>
              </motion.div>

              {/* Compact Controls */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center space-x-6 mb-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShuffle(!shuffle)}
                  className={`p-2 rounded-full transition-colors ${
                    shuffle ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skipTrack('prev')}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center shadow-lg transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skipTrack('next')}
                  className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRepeat(!repeat)}
                  className={`p-2 rounded-full transition-colors ${
                    repeat ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Compact Secondary Controls */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked ? 'text-red-400 bg-red-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLyrics(!showLyrics)}
                    className={`p-2 rounded-full transition-colors ${
                      showLyrics ? 'text-purple-400 bg-purple-400/20' : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Mic2 className="w-4 h-4" />
                  </motion.button>
                </div>

              </motion.div>
            </div>

            {/* Right Side: Lyrics */}
            <div className="w-1/2 px-6 py-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full bg-black/20 backdrop-blur-md rounded-2xl p-6 overflow-hidden flex flex-col"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Mic2 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold">Lyrics</h3>
                </div>
                
                <div 
                  ref={lyricsRef}
                  className="flex-1 overflow-y-auto custom-scrollbar space-y-3"
                >
                  {lyrics ? (
                    lyrics.lyrics.map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                          opacity: index === currentLyricIndex ? 1 : 0.5,
                          x: 0,
                          scale: index === currentLyricIndex ? 1.02 : 1
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={() => seekToLyricLine(line.time)}
                        className={`cursor-pointer transition-all duration-300 p-3 rounded-xl ${
                          index === currentLyricIndex
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <p className={`text-center transition-all duration-300 ${
                          index === currentLyricIndex
                            ? 'text-base font-medium text-white'
                            : 'text-sm text-gray-300 hover:text-white'
                        }`}>
                          {line.text}
                        </p>
                      </motion.div>
                    ))
                  ) : loadingLyrics ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Music className="w-8 h-8 text-purple-400" />
                      </motion.div>
                      <p className="text-gray-400 text-sm">Loading lyrics...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <Mic2 className="w-12 h-12 text-gray-600" />
                      <div className="text-center">
                        <p className="text-gray-400 mb-2">No lyrics available</p>
                        <p className="text-gray-500 text-sm">Enjoy the music!</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (repeat) {
            audioRef.current?.play()
          } else {
            skipTrack('next')
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration)
            audioRef.current.volume = volume
          }
        }}
        onError={handleAudioError}
        onCanPlay={handleAudioCanPlay}
      />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a855f7, #ec4899);
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 6px 12px rgba(0,0,0,0.4);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(45deg, #a855f7, #ec4899);
            cursor: pointer;
            border: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          }
          
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(168,85,247,0.5) transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #a855f7, #ec4899);
            border-radius: 2px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #9333ea, #db2777);
          }
        `
      }} />
    </div>
  )
}
