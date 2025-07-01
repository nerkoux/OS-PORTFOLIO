"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat, 
  Heart, 
  MoreHorizontal, 
  ChevronUp,
  ChevronDown,
  Music,
  Mic2
} from 'lucide-react'

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

export function MobileMusicPlayer() {
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
  const [showLyrics, setShowLyrics] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // Demo tracks
  const tracks: Track[] = [
    { 
      id: 1, 
      title: "Never Gonna Give You Up", 
      artist: "Rick Astley", 
      album: "3 Originals",
      duration: "03:34", 
      file: "/sounds/ng.mp3",
      lrcFile: "/lyrics/ng.lrc",
      cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/69/5b/e3/695be316-9ddf-7262-177c-e37edd599602/0888880777768.jpg/600x600bb.webp"
    },
    { 
      id: 2, 
      title: "Ego", 
      artist: "Qing Madi", 
      album: "MADNESS",
      duration: "03:38", 
      file: "/sounds/ego.mp3",
      lrcFile: "/lyrics/ego.lrc",
      cover: "https://i.scdn.co/image/ab67616d0000b273875b355aece145cc3eb2e2b0"
    },
    { 
      id: 3, 
      title: "Levitating", 
      artist: "Dua Lipa", 
      album: "Future Nostalgia",
      duration: "03:23", 
      file: "/sounds/levitating.mp3",
      lrcFile: "/lyrics/levitating.lrc",
      cover: "https://i.scdn.co/image/ab67616d0000b2734bc66095f8a70bc4e6593f4f"
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

  // Auto-play when component mounts
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const autoPlay = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
      } catch (error) {
        console.log('Autoplay prevented by browser:', error)
      }
    }

    const timer = setTimeout(autoPlay, 100)
    return () => clearTimeout(timer)
  }, [])

  // Load audio when track changes
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

  // Load lyrics when track changes
  useEffect(() => {
    const fetchLyrics = async () => {
      setLoadingLyrics(true)
      setLyrics(null)
      setCurrentLyricIndex(-1)

      try {
        const track = tracks[currentTrack]
        
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
            console.warn('Failed to load LRC file:', lrcError)
          }
        }
        
        const response = await fetch(
          `/api/lyrics?artist=${encodeURIComponent(track.artist)}&title=${encodeURIComponent(track.title)}`
        )
        
        if (response.ok) {
          const lyricsData = await response.json()
          setLyrics(lyricsData)
        }
      } catch (error) {
        console.error('Error fetching lyrics:', error)
      } finally {
        setLoadingLyrics(false)
      }
    }

    fetchLyrics()
  }, [currentTrack])

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

    // Auto-scroll to current lyric line with a small delay to ensure DOM updates
    if (currentLine >= 0 && lyricsRef.current) {
      setTimeout(() => {
        const lyricsContainer = lyricsRef.current
        if (!lyricsContainer) return
        
        const currentLineElement = lyricsContainer.children[currentLine] as HTMLElement
        
        if (currentLineElement) {
          const containerHeight = lyricsContainer.clientHeight
          const lineTop = currentLineElement.offsetTop
          const lineHeight = currentLineElement.clientHeight
          
          // Center the current line in the container
          const scrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2)
          
          lyricsContainer.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          })
        }
      }, 50)
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
    <div className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-indigo-600/20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => skipTrack('next')}
        onError={handleAudioError}
        onCanPlay={handleAudioCanPlay}
        preload="metadata"
      >
        <source src={track.file} type="audio/mpeg" />
      </audio>

      <div className="relative z-10 h-full flex flex-col">
        {/* Main Player Content */}
        <div className="flex-1 flex flex-col">
          {!showLyrics ? (
            // Album Art View
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <motion.div
                className="w-64 h-64 mb-8 rounded-2xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {track.cover ? (
                  <img 
                    src={track.cover} 
                    alt={`${track.title} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Music className="w-24 h-24 text-white/70" />
                  </div>
                )}
              </motion.div>

              {/* Track Info */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-2">{track.title}</h2>
                <p className="text-lg text-white/70">{track.artist}</p>
                {track.album && (
                  <p className="text-sm text-white/50 mt-1">{track.album}</p>
                )}
              </div>

              {/* Track List */}
              <div className="w-full max-w-sm space-y-2 max-h-40 overflow-y-auto">
                {tracks.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentTrack(index)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      index === currentTrack 
                        ? 'bg-white/20 border border-white/30' 
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{t.title}</p>
                        <p className="text-xs text-white/70">{t.artist}</p>
                      </div>
                      <span className="text-xs text-white/50">{t.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Lyrics View
            <div className="flex-1 flex flex-col">
              {/* Mini Player Header in Lyrics Mode */}
              <div className="flex items-center p-4 bg-black/20 border-b border-white/10">
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                  {track.cover ? (
                    <img src={track.cover} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Music className="w-6 h-6 text-white/70" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{track.title}</p>
                  <p className="text-xs text-white/70 truncate">{track.artist}</p>
                </div>
              </div>

              {/* Lyrics Container */}
              <div className="flex-1 relative" style={{ height: 'calc(100vh - 200px)' }}>
                {loadingLyrics ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Mic2 className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                      <p className="text-white/70">Loading lyrics...</p>
                    </div>
                  </div>
                ) : lyrics && lyrics.lyrics.length > 0 ? (
                  <div 
                    ref={lyricsRef}
                    className="absolute inset-0 overflow-y-scroll px-6 py-8 space-y-4"
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    {lyrics.lyrics.map((line, index) => (
                      <motion.div
                        key={index}
                        className={`cursor-pointer transition-all duration-300 text-center py-3 px-4 rounded-lg touch-manipulation ${
                          index === currentLyricIndex
                            ? 'text-white text-xl font-semibold bg-white/10 scale-105'
                            : index === currentLyricIndex - 1 || index === currentLyricIndex + 1
                            ? 'text-white/80 text-lg'
                            : 'text-white/50 text-base hover:text-white/70'
                        }`}
                        onClick={() => seekToLyricLine(line.time)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {line.text}
                      </motion.div>
                    ))}
                    {/* Add padding at the end for better scrolling */}
                    <div className="h-32"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/50">
                      <Mic2 className="w-8 h-8 mx-auto mb-2" />
                      <p>No lyrics available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Player Controls - Fixed at bottom */}
        <div className="bg-black/30 backdrop-blur-md border-t border-white/10">
          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <div className="flex items-center space-x-3 text-xs text-white/70">
              <span>{formatTime(currentTime)}</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #ffffff ${progress}%, rgba(255,255,255,0.2) ${progress}%)`
                  }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between p-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 ${shuffle ? 'text-green-400' : 'text-white/70'} hover:text-white`}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 ${isLiked ? 'text-red-400' : 'text-white/70'} hover:text-white`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Center Controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skipTrack('prev')}
                className="p-2 text-white hover:bg-white/10"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center"
                disabled={audioError}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skipTrack('next')}
                className="p-2 text-white hover:bg-white/10"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLyrics(!showLyrics)}
                className={`p-2 ${showLyrics ? 'text-green-400' : 'text-white/70'} hover:text-white`}
              >
                <Mic2 className="w-4 h-4" />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="p-2 text-white/70 hover:text-white"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-md rounded-lg p-3"
                    >
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        className="h-20 w-4 bg-white/20 rounded-lg appearance-none cursor-pointer slider vertical-slider"
                        style={{ writingMode: 'vertical-lr' as any }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRepeat(!repeat)}
                className={`p-2 ${repeat ? 'text-green-400' : 'text-white/70'} hover:text-white`}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hidden {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }

        /* Custom scrollbar styling for lyrics */
        div[ref]::-webkit-scrollbar {
          width: 4px;
        }
        
        div[ref]::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        div[ref]::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        div[ref]::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .vertical-slider {
          writing-mode: bt-lr;
          -webkit-appearance: slider-vertical;
        }

        /* Ensure touch scrolling works on mobile */
        * {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  )
}
