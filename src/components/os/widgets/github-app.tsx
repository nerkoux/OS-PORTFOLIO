"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Github, 
  GitBranch, 
  Star, 
  Users, 
  Calendar,
  MapPin,
  Link,
  Building,
  Mail,
  BookOpen,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Activity,
  TrendingUp,
  Eye,
  Clock,
  Code,
  Trophy,
  Flame,
  Heart,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Zap,
  Target,
  Award
} from 'lucide-react'

interface GitHubProfile {
  login: string
  name: string
  avatar_url: string
  bio: string
  company: string
  location: string
  email: string
  blog: string
  twitter_username: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

interface Repository {
  id: number
  name: string
  full_name: string
  description: string
  language: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  html_url: string
  topics: string[]
  size: number
}

interface Contribution {
  date: string
  count: number
  level: number
}

interface GitHubStats {
  totalCommits: number
  totalPRs: number
  totalIssues: number
  totalStars: number
  contributionsThisYear: number
  longestStreak: number
  currentStreak: number
}

export function GitHubApp() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'repos' | 'activity' | 'stats'>('overview')
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['profile']))

  const username = 'nerkoux' // Your actual GitHub username

  useEffect(() => {
    fetchGitHubData()
  }, [])

  const fetchGitHubData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Fetch profile data with proper headers
      const profileResponse = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      })
      
      if (profileResponse.status === 403) {
        throw new Error('GitHub API rate limit exceeded. This is a temporary issue from GitHub\'s end. Please try again later.')
      }
      
      if (!profileResponse.ok) {
        throw new Error(`Failed to fetch profile: ${profileResponse.status}`)
      }
      
      const profileData = await profileResponse.json()
      setProfile(profileData)

      // Fetch repositories with rate limit handling
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      })
      
      if (reposResponse.status === 403) {
        console.warn('GitHub API rate limited for repos')
        // Still show profile data even if repos fail
        setRepositories([])
      } else if (reposResponse.ok) {
        const reposData = await reposResponse.json()
        setRepositories(reposData)
        calculateStats(reposData)
      }

      // Generate mock contribution data (in real app, you'd use GitHub GraphQL API)
      generateMockContributions()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const generateMockContributions = () => {
    const contributions: Contribution[] = []
    const today = new Date()
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const count = Math.floor(Math.random() * 10)
      const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4
      
      contributions.push({
        date: date.toISOString().split('T')[0],
        count,
        level
      })
    }
    
    setContributions(contributions)
  }

  const calculateStats = (repos: Repository[]) => {
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0)
    
    // Mock data for commits, PRs, issues
    const mockStats: GitHubStats = {
      totalCommits: 1250 + Math.floor(Math.random() * 500),
      totalPRs: 85 + Math.floor(Math.random() * 20),
      totalIssues: 45 + Math.floor(Math.random() * 15),
      totalStars,
      contributionsThisYear: 365 + Math.floor(Math.random() * 200),
      longestStreak: 42 + Math.floor(Math.random() * 20),
      currentStreak: 12 + Math.floor(Math.random() * 10)
    }
    
    setStats(mockStats)
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      React: '#61dafb',
      'Next.js': '#000000',
      CSS: '#1572b6',
      HTML: '#e34f26',
      Java: '#ed8b00',
      'C++': '#00599c',
      Go: '#00add8',
      Rust: '#dea584',
      PHP: '#777bb4'
    }
    return colors[language] || '#6b7280'
  }

  const getContributionColor = (level: number) => {
    const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
    return colors[level] || colors[0]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-purple-400"
        >
          <Github className="h-12 w-12" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <Github className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Failed to load GitHub data</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchGitHubData} className="bg-purple-600 hover:bg-purple-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Github className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">GitHub</h1>
              <p className="text-sm text-gray-400">@{profile?.login}</p>
            </div>
          </div>
          <Button
            onClick={fetchGitHubData}
            size="sm"
            variant="ghost"
            className="text-purple-400 hover:text-purple-300"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20 p-2">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'repos', label: 'Repos', icon: BookOpen },
            { id: 'activity', label: 'Activity', icon: GitCommit },
            { id: 'stats', label: 'Stats', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 ${
                activeTab === id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            {activeTab === 'overview' && (
              <>
                {/* Profile Section */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <button
                        onClick={() => toggleSection('profile')}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <h3 className="font-semibold text-purple-400 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Profile
                        </h3>
                        {expandedSections.has('profile') ? 
                          <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        }
                      </button>
                      
                      <AnimatePresence>
                        {expandedSections.has('profile') && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 space-y-4"
                          >
                            <div className="flex items-start space-x-4">
                              <img
                                src={profile?.avatar_url}
                                alt={profile?.name}
                                className="w-16 h-16 rounded-full border-2 border-purple-500"
                              />
                              <div className="flex-1">
                                <h4 className="font-bold text-white text-lg">{profile?.name}</h4>
                                <p className="text-purple-400">@{profile?.login}</p>
                                {profile?.bio && (
                                  <p className="text-gray-300 text-sm mt-2">{profile.bio}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                {profile?.company && (
                                  <div className="flex items-center text-sm text-gray-300">
                                    <Building className="h-4 w-4 mr-2 text-purple-400" />
                                    {profile.company}
                                  </div>
                                )}
                                {profile?.location && (
                                  <div className="flex items-center text-sm text-gray-300">
                                    <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                                    {profile.location}
                                  </div>
                                )}
                                {profile?.email && (
                                  <div className="flex items-center text-sm text-gray-300">
                                    <Mail className="h-4 w-4 mr-2 text-purple-400" />
                                    {profile.email}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                {profile?.blog && (
                                  <div className="flex items-center text-sm text-gray-300">
                                    <Link className="h-4 w-4 mr-2 text-purple-400" />
                                    <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                                      Website
                                    </a>
                                  </div>
                                )}
                                <div className="flex items-center text-sm text-gray-300">
                                  <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                                  Joined {formatDate(profile?.created_at || '')}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-purple-500/20">
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{profile?.public_repos}</div>
                                <div className="text-xs text-gray-400">Repos</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{profile?.followers}</div>
                                <div className="text-xs text-gray-400">Followers</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{profile?.following}</div>
                                <div className="text-xs text-gray-400">Following</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{stats?.totalStars}</div>
                                <div className="text-xs text-gray-400">Stars</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-purple-400 mb-4 flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Quick Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-white">{stats?.totalCommits}</div>
                              <div className="text-sm text-purple-300">Total Commits</div>
                            </div>
                            <GitCommit className="h-8 w-8 text-purple-400" />
                          </div>
                        </div>
                        <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-2xl font-bold text-white">{stats?.currentStreak}</div>
                              <div className="text-sm text-green-300">Day Streak</div>
                            </div>
                            <Flame className="h-8 w-8 text-green-400" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Top Repositories */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-purple-400 mb-4 flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        Top Repositories
                      </h3>
                      <div className="space-y-3">
                        {repositories.slice(0, 3).map((repo) => (
                          <div
                            key={repo.id}
                            className="bg-white/5 rounded-lg p-3 border border-gray-700/50 hover:border-purple-500/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedRepo(repo)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white flex items-center">
                                  <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                                  {repo.name}
                                </h4>
                                {repo.description && (
                                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                    {repo.description}
                                  </p>
                                )}
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                                  {repo.language && (
                                    <div className="flex items-center">
                                      <div
                                        className="w-2 h-2 rounded-full mr-1"
                                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                                      />
                                      {repo.language}
                                    </div>
                                  )}
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 mr-1" />
                                    {repo.stargazers_count}
                                  </div>
                                  <div className="flex items-center">
                                    <GitBranch className="h-3 w-3 mr-1" />
                                    {repo.forks_count}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}

            {activeTab === 'repos' && (
              <motion.div variants={itemVariants} className="space-y-3">
                {repositories.map((repo) => (
                  <Card key={repo.id} className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                            {repo.name}
                          </h4>
                          {repo.description && (
                            <p className="text-gray-400 text-sm mt-1">{repo.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                            {repo.language && (
                              <div className="flex items-center">
                                <div
                                  className="w-2 h-2 rounded-full mr-1"
                                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                                />
                                {repo.language}
                              </div>
                            )}
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {repo.stargazers_count}
                            </div>
                            <div className="flex items-center">
                              <GitBranch className="h-3 w-3 mr-1" />
                              {repo.forks_count}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {repo.watchers_count}
                            </div>
                          </div>

                          {repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {repo.topics.slice(0, 3).map((topic) => (
                                <span
                                  key={topic}
                                  className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                                >
                                  {topic}
                                </span>
                              ))}
                              {repo.topics.length > 3 && (
                                <span className="px-2 py-1 text-gray-400 text-xs">
                                  +{repo.topics.length - 3} more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-gray-500 mt-2">
                            Updated {formatDate(repo.updated_at)}
                          </div>
                        </div>
                        
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div variants={itemVariants}>
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-purple-400 mb-4 flex items-center">
                      <Activity className="h-4 w-4 mr-2" />
                      Contribution Graph
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {stats?.contributionsThisYear} contributions in the last year
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span>Less</span>
                          <div className="flex space-x-1">
                            {[0, 1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className="w-2 h-2 rounded-sm"
                                style={{ backgroundColor: getContributionColor(level) }}
                              />
                            ))}
                          </div>
                          <span>More</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 gap-1 overflow-x-auto">
                        {contributions.map((contribution, index) => (
                          <div
                            key={index}
                            className="w-2 h-2 rounded-sm"
                            style={{ backgroundColor: getContributionColor(contribution.level) }}
                            title={`${contribution.count} contributions on ${contribution.date}`}
                          />
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-500/20">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{stats?.longestStreak}</div>
                          <div className="text-sm text-gray-400">Longest Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{stats?.currentStreak}</div>
                          <div className="text-sm text-gray-400">Current Streak</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div variants={itemVariants} className="space-y-4">
                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-purple-400 mb-4 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Developer Statistics
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-600/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-white">{stats?.totalCommits}</div>
                            <div className="text-sm text-blue-300">Total Commits</div>
                          </div>
                          <GitCommit className="h-8 w-8 text-blue-400" />
                        </div>
                      </div>
                      
                      <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-white">{stats?.totalPRs}</div>
                            <div className="text-sm text-green-300">Pull Requests</div>
                          </div>
                          <GitPullRequest className="h-8 w-8 text-green-400" />
                        </div>
                      </div>
                      
                      <div className="bg-yellow-600/20 rounded-lg p-4 border border-yellow-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-white">{stats?.totalIssues}</div>
                            <div className="text-sm text-yellow-300">Issues Opened</div>
                          </div>
                          <Target className="h-8 w-8 text-yellow-400" />
                        </div>
                      </div>
                      
                      <div className="bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-white">{stats?.totalStars}</div>
                            <div className="text-sm text-purple-300">Total Stars</div>
                          </div>
                          <Star className="h-8 w-8 text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-purple-400 mb-4 flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Language Breakdown
                    </h3>
                    
                    <div className="space-y-3">
                      {Object.entries(repositories
                        .filter(repo => repo.language)
                        .reduce((acc: Record<string, number>, repo) => {
                          acc[repo.language] = (acc[repo.language] || 0) + 1
                          return acc
                        }, {}))
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([language, count]) => (
                          <div key={language} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-3"
                                style={{ backgroundColor: getLanguageColor(language) }}
                              />
                              <span className="text-white">{language}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-700 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    backgroundColor: getLanguageColor(language),
                                    width: `${(count / repositories.length) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Repository Modal */}
      <AnimatePresence>
        {selectedRepo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRepo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-purple-500/30 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-lg">{selectedRepo.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRepo(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {selectedRepo.description && (
                  <p className="text-gray-300">{selectedRepo.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                    <div className="text-lg font-bold text-white">{selectedRepo.stargazers_count}</div>
                    <div className="text-xs text-purple-300">Stars</div>
                  </div>
                  <div className="text-center p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                    <div className="text-lg font-bold text-white">{selectedRepo.forks_count}</div>
                    <div className="text-xs text-blue-300">Forks</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Code className="h-4 w-4 mr-2 text-purple-400" />
                    {selectedRepo.language || 'Unknown'}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                    Created {formatDate(selectedRepo.created_at)}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-2 text-purple-400" />
                    Updated {formatDate(selectedRepo.updated_at)}
                  </div>
                </div>
                
                {selectedRepo.topics.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-2">Topics</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedRepo.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <a
                  href={selectedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
