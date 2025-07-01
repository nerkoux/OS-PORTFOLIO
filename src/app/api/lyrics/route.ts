import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

// Genius API Configuration
const GENIUS_ACCESS_TOKEN = 'gWStcfDmfSZOnaslw-dAwWytRTZgxRbJPlJP2-UJ1u7gX_D_SJ1lfF-aCP60VloU'

interface LyricsLine {
  text: string
  time: number
}

interface LyricsResponse {
  artist: string
  title: string
  lyrics: LyricsLine[]
  source: 'genius' | 'mock'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const artist = searchParams.get('artist')
    const title = searchParams.get('title')

    if (!artist || !title) {
      return NextResponse.json(
        { error: 'Artist and title parameters are required' },
        { status: 400 }
      )
    }

    // Try to fetch real lyrics from Genius first
    try {
      const geniusLyrics = await fetchGeniusLyrics(artist, title)
      if (geniusLyrics) {
        return NextResponse.json({
          artist,
          title,
          lyrics: geniusLyrics,
          source: 'genius'
        } as LyricsResponse)
      }
    } catch (geniusError) {
      console.log('Genius API failed, falling back to mock data:', geniusError)
    }

    // Fallback to mock lyrics
    const trackKey = title.toLowerCase().replace(/\s+/g, '')
    const lyrics = mockLyrics[trackKey as keyof typeof mockLyrics]

    if (!lyrics) {
      return NextResponse.json(
        { error: 'Lyrics not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      artist,
      title,
      lyrics: lyrics.lines,
      source: 'mock'
    } as LyricsResponse)

  } catch (error) {
    console.error('Error fetching lyrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function fetchGeniusLyrics(artist: string, title: string): Promise<LyricsLine[] | null> {
  try {
    // Step 1: Search for the song on Genius
    const searchQuery = `${artist} ${title}`.trim()
    const searchResponse = await fetch(
      `https://api.genius.com/search?q=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    )

    if (!searchResponse.ok) {
      throw new Error(`Genius search failed: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()
    
    if (!searchData.response?.hits?.length) {
      throw new Error('No results found on Genius')
    }

    // Get the first result (most relevant)
    const song = searchData.response.hits[0].result
    const songUrl = song.url

    console.log(`Found song on Genius: ${song.full_title} - ${songUrl}`)

    // Step 2: Scrape lyrics from the Genius page
    const lyricsResponse = await fetch(songUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!lyricsResponse.ok) {
      throw new Error(`Failed to fetch lyrics page: ${lyricsResponse.status}`)
    }

    const html = await lyricsResponse.text()
    const $ = cheerio.load(html)

    // Extract lyrics from the page
    let lyricsText = ''
    
    // Try multiple selectors as Genius sometimes changes their structure
    const selectors = [
      '[data-lyrics-container="true"]',
      '.lyrics',
      '.Lyrics__Container-sc-1ynbvzw-1',
      '#lyrics-root',
      '[class*="lyrics"]'
    ]

    for (const selector of selectors) {
      const element = $(selector)
      if (element.length > 0) {
        // Get text content and preserve line breaks
        lyricsText = element.html() || ''
        break
      }
    }

    if (!lyricsText) {
      throw new Error('Could not extract lyrics from Genius page')
    }

    // Clean up the HTML and convert to plain text with line breaks
    const cleanLyrics = lyricsText
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\[.*?\]/g, '') // Remove section headers like [Verse 1]
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    // Convert to timed lyrics format (estimate timing)
    // Since we don't have real timing data, we'll estimate based on typical reading speed
    const avgLineTime = 3000 // 3 seconds per line average
    const timedLyrics: LyricsLine[] = cleanLyrics.map((line, index) => ({
      text: line,
      time: index * avgLineTime
    }))

    console.log(`Extracted ${timedLyrics.length} lines of lyrics from Genius`)
    return timedLyrics

  } catch (error) {
    console.error('Error fetching from Genius:', error)
    return null
  }
}

// Mock lyrics data for fallback
const mockLyrics = {
  ego: {
    lines: [
      { text: "They call me crazy, I call it confident", time: 5000 },
      { text: "Living my life like I'm so magnificent", time: 8000 },
      { text: "Ego so big, it could fill up the room", time: 11000 },
      { text: "Walking with pride, dispelling the gloom", time: 14000 },
      { text: "Mirror reflection shows my dedication", time: 17000 },
      { text: "Building my empire with determination", time: 20000 },
      { text: "Some call it ego, I call it self-love", time: 23000 },
      { text: "Rising above what I'm dreaming of", time: 26000 },
      { text: "Confidence flowing through every vein", time: 29000 },
      { text: "Success and glory, that's my domain", time: 32000 },
      { text: "They whisper my name in the hallways", time: 35000 },
      { text: "I'm writing my story in my own ways", time: 38000 },
      { text: "Ego's my armor, pride is my shield", time: 41000 },
      { text: "Never backing down, I never yield", time: 44000 },
      { text: "This is my moment, this is my time", time: 47000 },
      { text: "Living my truth in rhythm and rhyme", time: 50000 }
    ]
  },
  valorant: {
    lines: [
      { text: "Loading into the battlefield tonight", time: 3000 },
      { text: "Agents ready, weapons in sight", time: 6000 },
      { text: "Spike planted, time is running low", time: 9000 },
      { text: "One shot, one kill, here we go", time: 12000 },
      { text: "Radiant ranked, climbing up high", time: 15000 },
      { text: "Headshots flying, making them cry", time: 18000 },
      { text: "Jett dashing through the smoky haze", time: 21000 },
      { text: "Phoenix rising through the blaze", time: 24000 },
      { text: "Sage healing teammates back to life", time: 27000 },
      { text: "Cutting through enemies like a knife", time: 30000 },
      { text: "Omen teleporting behind their lines", time: 33000 },
      { text: "Victory tastes sweeter than fine wines", time: 36000 },
      { text: "Defuse successful, round is won", time: 39000 },
      { text: "Another victory under the sun", time: 42000 },
      { text: "This is Valorant, this is our game", time: 45000 },
      { text: "Legends born, earning our fame", time: 48000 }
    ]
  },
  demotrack: {
    lines: [
      { text: "This is a demo track for testing", time: 2000 },
      { text: "Synced lyrics in our music player", time: 5000 },
      { text: "Every line appears at the right time", time: 8000 },
      { text: "Making the experience more sublime", time: 11000 },
      { text: "Technology meets creativity here", time: 14000 },
      { text: "In this portfolio atmosphere", time: 17000 },
      { text: "Code and music in harmony", time: 20000 },
      { text: "This is our digital symphony", time: 23000 }
    ]
  }
}

// Example of how to integrate with real Genius API (commented out for demo)
/*
async function fetchGeniusLyrics(artist: string, title: string) {
  const GENIUS_API_TOKEN = process.env.GENIUS_API_TOKEN
  
  if (!GENIUS_API_TOKEN) {
    throw new Error('Genius API token not configured')
  }

  // Search for song
  const searchResponse = await fetch(
    `https://api.genius.com/search?q=${encodeURIComponent(`${artist} ${title}`)}`,
    {
      headers: {
        'Authorization': `Bearer ${GENIUS_API_TOKEN}`
      }
    }
  )

  const searchData = await searchResponse.json()
  
  if (!searchData.response.hits.length) {
    throw new Error('Song not found')
  }

  const songUrl = searchData.response.hits[0].result.url
  
  // Note: Genius API doesn't provide lyrics directly in their API
  // You would need to scrape the lyrics from the song page
  // or use a third-party service that provides synced lyrics
  
  return {
    url: songUrl,
    // lyrics would need to be scraped or obtained from another source
  }
}
*/
