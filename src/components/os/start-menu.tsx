"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Code, 
  Calendar, 
  MapPin, 
  BookOpen,
  User,
  Briefcase,
  Award,
  MessageCircle,
  Power,
  Settings,
  ExternalLink
} from 'lucide-react'
import { AboutWindow } from './windows/about-window'
import { ProjectsWindow } from './windows/projects-window'
import { SkillsWindow } from './windows/skills-window'
import { ExperienceWindow } from './windows/experience-window'
import { ContactWindow } from './windows/contact-window'

interface GitHubProfile {
  name: string
  bio: string
  avatar_url: string
  public_repos: number
  followers: number
  following: number
  location: string
  created_at: string
  updated_at: string
  html_url: string
}

interface GitHubRepo {
  id: number
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  html_url: string
  updated_at: string
}

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenWindow: (item: { 
    id: string; 
    title: string; 
    component: React.ComponentType<Record<string, unknown>>; 
    icon: React.ComponentType<Record<string, unknown>> 
  }) => void
}

export function StartMenu({ isOpen, onClose, onOpenWindow }: StartMenuProps) {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const desktopItems = [
    {
      id: "about",
      name: "About Me",
      title: "About Me",
      icon: User,
      type: "folder",
      component: AboutWindow,
      description: "Personal information & background",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "projects",
      name: "My Projects",
      title: "My Projects",
      icon: Code,
      type: "folder",
      component: ProjectsWindow,
      description: "Featured development projects",
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "skills",
      name: "Skills & Tech",
      title: "Skills & Tech",
      icon: Award,
      type: "folder",
      component: SkillsWindow,
      description: "Technical skills & expertise",
      color: "from-orange-500 to-red-600"
    },
    {
      id: "experience",
      name: "Experience",
      title: "Experience",
      icon: Briefcase,
      type: "folder",
      component: ExperienceWindow,
      description: "Professional experience",
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: "contact",
      name: "Contact",
      title: "Contact",
      icon: MessageCircle,
      type: "folder",
      component: ContactWindow,
      description: "Get in touch with me",
      color: "from-pink-500 to-rose-600"
    }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchGitHubData()
    }
  }, [isOpen])

  const fetchGitHubData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))

      // Fetch GitHub profile with proper headers
      const profileResponse = await fetch('https://api.github.com/users/nerkoux', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      })
      
      if (profileResponse.status === 403) {
        throw new Error('GitHub API rate limit exceeded. This is a temporary issue from GitHub\'s end. Please try again later.')
      }
      
      if (!profileResponse.ok) {
        throw new Error(`Failed to fetch GitHub profile: ${profileResponse.status}`)
      }
      const profileData = await profileResponse.json()
      setProfile(profileData)

      // Fetch top repositories with rate limit handling
      const reposResponse = await fetch('https://api.github.com/users/nerkoux/repos?sort=updated&per_page=6', {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      })
      
      if (reposResponse.status === 403) {
        console.warn('GitHub API rate limited for repos')
        // Still show profile data even if repos fail
        setRepos([])
        return
      }
      
      if (reposResponse.ok) {
        const reposData = await reposResponse.json()
        setRepos(reposData)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data')
      console.error('GitHub API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  const handleItemClick = (item: { 
    id: string; 
    title: string; 
    component: React.ComponentType<Record<string, unknown>>; 
    icon: React.ComponentType<Record<string, unknown>> 
  }) => {
    onOpenWindow(item)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-4xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-700 dark:border-slate-600 rounded-t-2xl shadow-2xl mx-4 mb-16"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white dark:text-slate-100">Akshat&apos;s Portfolio</h2>
                  <p className="text-slate-400 dark:text-slate-500 text-sm">Full Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors flex items-center justify-center">
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Portfolio Sections */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Portfolio Sections
                </h3>
                
                <div className="space-y-2">
                  {desktopItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 dark:bg-slate-800/70 hover:bg-slate-700/50 dark:hover:bg-slate-700/70 transition-colors group"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-white text-sm font-medium">{item.name}</div>
                        <div className="text-slate-400 text-xs">{item.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Right Column - GitHub Status */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  GitHub Status
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                    <p className="text-red-200 mb-3">Error: {error}</p>
                    <button
                      onClick={fetchGitHubData}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : profile ? (
                  <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={profile.avatar_url}
                          alt={profile.name}
                          className="w-16 h-16 rounded-full border-2 border-slate-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-white font-semibold">{profile.name}</h4>
                            <a
                              href={profile.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <p className="text-slate-300 text-sm mb-3">{profile.bio}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400">
                            {profile.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{profile.location}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Joined {formatDate(profile.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-blue-200">{profile.public_repos}</div>
                        <div className="text-xs text-blue-300">Repositories</div>
                      </div>
                      <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-green-200">{profile.followers}</div>
                        <div className="text-xs text-green-300">Followers</div>
                      </div>
                      <div className="bg-purple-900/50 border border-purple-700 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-purple-200">{profile.following}</div>
                        <div className="text-xs text-purple-300">Following</div>
                      </div>
                    </div>

                    {/* Recent Repositories */}
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Recent Repositories</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {repos.slice(0, 4).map((repo) => (
                          <motion.a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="block"
                          >
                            <div className="bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-colors rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="text-white text-sm font-medium truncate">{repo.name}</h5>
                                <div className="flex items-center space-x-1 text-xs text-slate-400">
                                  <Star className="w-3 h-3" />
                                  <span>{repo.stargazers_count}</span>
                                </div>
                              </div>
                              <p className="text-slate-300 text-xs mb-2 line-clamp-2">
                                {repo.description || 'No description available'}
                              </p>
                              <div className="flex items-center justify-between">
                                {repo.language && (
                                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                                    {repo.language}
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  Updated {formatDate(repo.updated_at)}
                                </span>
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <div>Portfolio OS v1.1</div>
              <div>Press Esc to close</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
