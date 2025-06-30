"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Globe, Filter, X } from "lucide-react"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image"

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const categories = ["All", "Web App", "E-commerce", "Dashboard", "Landing Page"]

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "E-commerce",
      description: "A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
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
    },
    {
      id: 4,
      title: "SaaS Landing Page",
      category: "Landing Page",
      description: "High-converting SaaS landing page with animations, testimonials, and integrated contact forms.",
      image: "/api/placeholder/600/400",
      technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
      features: [
        "Responsive design for all devices",
        "Smooth scroll animations",
        "Integrated contact forms",
        "SEO optimized structure",
        "Fast loading performance",
        "A/B testing capabilities"
      ],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/username/project",
      stats: {
        conversion: "15%",
        loadTime: "1.2s",
        seoScore: "100/100"
      }
    }
  ]

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A showcase of my recent work, featuring modern web applications built with 
              cutting-edge technologies and best practices.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
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
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project.id)}
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
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
                            <Button size="sm" className="mr-2">
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
                        
                        <div className="flex flex-wrap gap-1 mb-4">
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
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const project = projects.find(p => p.id === selectedProject)
                    if (!project) return null
                    
                    return (
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {project.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProject(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg mb-6 flex items-center justify-center">
                          <div className="text-center">
                            <Globe className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                            <p className="text-slate-600 dark:text-slate-400">Project Screenshots</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                              About This Project
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                              {project.description}
                            </p>
                            
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                              Key Features
                            </h4>
                            <ul className="space-y-2 mb-6">
                              {project.features.map((feature, index) => (
                                <li key={index} className="text-slate-600 dark:text-slate-400 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                              Technologies Used
                            </h4>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                            
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                              Project Stats
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              {Object.entries(project.stats).map(([key, value]) => (
                                <div key={key} className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {value}
                                  </div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex space-x-4">
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <Button>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Live Demo
                                </Button>
                              </a>
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">
                                  <Github className="h-4 w-4 mr-2" />
                                  Source Code
                                </Button>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
