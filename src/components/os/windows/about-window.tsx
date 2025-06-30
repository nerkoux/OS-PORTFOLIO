"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { User, Code, Coffee, Lightbulb, Users, MapPin, Mail, Phone } from 'lucide-react'

export function AboutWindow() {
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

  const values = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code that stands the test of time."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Always exploring new technologies and creative solutions to complex problems."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Believing in the power of teamwork and effective communication in development."
    },
    {
      icon: Coffee,
      title: "Passion",
      description: "Genuinely passionate about technology and continuous learning in the field."
    }
  ]

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Akshat
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Full Stack Developer
          </p>
        </motion.div>

        {/* About Text */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">About Me</h3>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                  I&apos;m a passionate full-stack developer with over 5 years of experience creating 
                  modern web applications. I specialize in React, Next.js, Node.js, and cloud technologies.
                </p>
                <p>
                  My journey in web development started with curiosity and grew into a passion for 
                  building exceptional digital experiences. I enjoy working across the full stack 
                  to deliver complete solutions.
                </p>
                <p>
                  When I&apos;m not coding, you can find me exploring new technologies, contributing to 
                  open source projects, or sharing knowledge with the developer community.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Facts */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  5+ years of development experience
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  50+ successful projects delivered
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Full-stack expertise
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  Remote-first mindset
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold mb-4">What Drives Me</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-4 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                      <value.icon className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {value.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-600 dark:text-slate-400">hello@akshat.dev</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="text-slate-600 dark:text-slate-400">San Francisco, CA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
