"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Globe, Filter, X } from 'lucide-react'

export function ProjectsWindow() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Web App",
      description: "Full-featured e-commerce platform with admin dashboard, payment integration, and inventory management.",
      image: "/api/placeholder/600/400",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS"],
      features: [
        "User authentication and authorization",
        "Product catalog with search and filters",
        "Shopping cart and checkout process",
        "Payment integration with Stripe",
        "Admin dashboard for inventory management",
        "Order tracking and email notifications"
      ],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/project",
      stats: {
        users: "1000+",
        performance: "98%",
        uptime: "99.9%"
      }
    },
    {
      id: 2,
      title: "Analytics Dashboard",
      category: "Dashboard",
      description: "Real-time analytics dashboard with interactive charts, data visualization, and reporting features.",
      image: "/api/placeholder/600/400",
      technologies: ["React", "D3.js", "Node.js", "Express", "MongoDB", "WebSocket"],
      features: [
        "Real-time data visualization",
        "Interactive charts and graphs",
        "Custom reporting tools",
        "Data export functionality",
        "User role management",
        "Mobile responsive design"
      ],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/project",
      stats: {
        dataPoints: "1M+",
        responseTime: "<100ms",
        accuracy: "99.5%"
      }
    },
    {
      id: 3,
      title: "Task Management App",
      category: "Web App",
      description: "Collaborative task management application with team features, real-time updates, and project tracking.",
      image: "/api/placeholder/600/400",
      technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"],
      features: [
        "Team collaboration tools",
        "Real-time task updates",
        "Project timeline visualization",
        "File sharing and comments",
        "Custom workflow automation",
        "Mobile app companion"
      ],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/project",
      stats: {
        teams: "500+",
        tasks: "50k+",
        satisfaction: "4.8/5"
      }
    }
  ]

  const categories = ['All', 'Web App', 'Dashboard', 'Landing Page']
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

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

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            My Projects
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A showcase of my recent work, featuring modern web applications built with 
            cutting-edge technologies and best practices.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200"
            >
              {category === "All" && <Filter className="h-4 w-4 mr-2" />}
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer interactive"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setSelectedProject(project.id)
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                        <div className="text-center">
                          <Globe className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                          <p className="text-sm text-slate-600 dark:text-slate-400">Project Preview</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            size="sm" 
                            className="mr-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setSelectedProject(project.id)
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                          {project.category}
                        </span>
                        <div className="flex space-x-2">
                          <a
                            href={project.githubUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                          <a
                            href={project.liveUrl}
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-2 py-1 text-slate-500 dark:text-slate-400 text-xs">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center p-4"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setSelectedProject(null)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseMove={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'all' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                {(() => {
                  const project = projects.find(p => p.id === selectedProject)
                  if (!project) return null
                  
                  return (
                    <>
                      {/* Modal Header */}
                      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Globe className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                              {project.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {project.category}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProject(null)
                          }}
                          className="hover:bg-red-500/10 hover:text-red-500"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      {/* Modal Content - Scrollable */}
                      <div className="overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
                        <div className="p-6">
                          {/* Project Preview */}
                          <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl mb-6 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <div className="text-center">
                              <Globe className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                              <p className="text-slate-600 dark:text-slate-400 font-medium">Project Preview</p>
                              <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Screenshots coming soon</p>
                            </div>
                          </div>
                          
                          {/* Project Details Grid */}
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                  About This Project
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {project.description}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                  Key Features
                                </h4>
                                <ul className="space-y-2">
                                  {project.features.map((feature, index) => (
                                    <li key={index} className="text-slate-600 dark:text-slate-400 flex items-start">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                  Technologies Used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
                                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                  Project Stats
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  {Object.entries(project.stats).map(([key, value]) => (
                                    <div key={key} className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {value}
                                      </div>
                                      <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Modal Footer */}
                        <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800">
                          <div className="flex justify-center space-x-4">
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Live Demo
                              </Button>
                            </a>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="border-slate-300 dark:border-slate-600">
                                <Github className="h-4 w-4 mr-2" />
                                Source Code
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
