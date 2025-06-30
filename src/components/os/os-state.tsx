"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface Window {
  id: string
  title: string
  component: React.ComponentType<Record<string, unknown>>
  isMinimized: boolean
  zIndex: number
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMaximized: boolean
  icon?: React.ComponentType<Record<string, unknown>>
  originalPosition?: { x: number; y: number }
  originalSize?: { width: number; height: number }
}

interface OSState {
  openWindows: Window[]
  highestZIndex: number
  isAudioEnabled: boolean
  theme: 'light' | 'dark'
  time: Date
}

type OSAction =
  | { type: 'OPEN_WINDOW'; window: Window }
  | { type: 'CLOSE_WINDOW'; windowId: string }
  | { type: 'MINIMIZE_WINDOW'; windowId: string }
  | { type: 'MAXIMIZE_WINDOW'; windowId: string }
  | { type: 'FOCUS_WINDOW'; windowId: string }
  | { type: 'MOVE_WINDOW'; windowId: string; position: { x: number; y: number } }
  | { type: 'RESIZE_WINDOW'; windowId: string; size: { width: number; height: number } }
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'UPDATE_TIME'; time: Date }

const initialState: OSState = {
  openWindows: [],
  highestZIndex: 100,
  isAudioEnabled: false,
  theme: 'dark',
  time: new Date()
}

function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case 'OPEN_WINDOW':
      if (state.openWindows.find(w => w.id === action.window.id)) {
        return {
          ...state,
          openWindows: state.openWindows.map(w =>
            w.id === action.window.id
              ? { ...w, isMinimized: false, zIndex: state.highestZIndex + 1 }
              : w
          ),
          highestZIndex: state.highestZIndex + 1
        }
      }
      return {
        ...state,
        openWindows: [...state.openWindows, { ...action.window, zIndex: state.highestZIndex + 1 }],
        highestZIndex: state.highestZIndex + 1
      }

    case 'CLOSE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.filter(w => w.id !== action.windowId)
      }

    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, isMinimized: !w.isMinimized } : w
        )
      }

    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId 
            ? { 
                ...w, 
                isMaximized: !w.isMaximized,
                // Store original position and size when maximizing for first time
                originalPosition: w.isMaximized ? w.originalPosition : w.position,
                originalSize: w.isMaximized ? w.originalSize : w.size
              } 
            : w
        )
      }

    case 'FOCUS_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, zIndex: state.highestZIndex + 1 } : w
        ),
        highestZIndex: state.highestZIndex + 1
      }

    case 'MOVE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, position: action.position } : w
        )
      }

    case 'RESIZE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, size: action.size } : w
        )
      }

    case 'TOGGLE_AUDIO':
      return {
        ...state,
        isAudioEnabled: !state.isAudioEnabled
      }

    case 'SET_THEME':
      return {
        ...state,
        theme: action.theme
      }

    case 'UPDATE_TIME':
      return {
        ...state,
        time: action.time
      }

    default:
      return state
  }
}

const OSStateContext = createContext<{
  state: OSState
  dispatch: React.Dispatch<OSAction>
} | null>(null)

export function OSStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(osReducer, initialState)

  return (
    <OSStateContext.Provider value={{ state, dispatch }}>
      {children}
    </OSStateContext.Provider>
  )
}

export function useOSState() {
  const context = useContext(OSStateContext)
  if (!context) {
    throw new Error('useOSState must be used within an OSStateProvider')
  }
  return context
}
