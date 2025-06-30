"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Coffee, Lightbulb, Users } from "lucide-react"

export function About() {
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
    <section id="about" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              About Me
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              I'm a passionate full-stack developer with a love for creating digital experiences 
              that make a difference. With expertise in modern web technologies, I bring ideas to life 
              through clean, efficient code and thoughtful design.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                My Journey
              </h3>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                  My journey in web development started with curiosity and grew into a passion for 
                  building exceptional digital experiences. I specialize in creating modern, 
                  responsive applications that prioritize both user experience and performance.
                </p>
                <p>
                  With experience in both frontend and backend development, I enjoy working across 
                  the full stack to deliver complete solutions. I'm particularly passionate about 
                  React, TypeScript, and modern web frameworks.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new technologies, contributing to 
                  open source projects, or sharing knowledge with the developer community.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg p-8">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Quick Facts
                </h4>
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
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-8 text-center">
              What Drives Me
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  variants={itemVariants}
                  className="group"
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                        <value.icon className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
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
        </motion.div>
      </div>
    </section>
  )
}
