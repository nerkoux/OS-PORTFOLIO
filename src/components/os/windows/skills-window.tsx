"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

export function SkillsWindow() {
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

  const skillCategories = [
    {
      title: "Frontend Development",
      skills: [
        { name: "React/Next.js", level: 95, color: "bg-blue-500" },
        { name: "TypeScript", level: 90, color: "bg-blue-600" },
        { name: "Tailwind CSS", level: 92, color: "bg-cyan-500" },
        { name: "Framer Motion", level: 85, color: "bg-pink-500" },
        { name: "HTML/CSS", level: 95, color: "bg-orange-500" }
      ]
    },
    {
      title: "Backend Development",
      skills: [
        { name: "Node.js", level: 88, color: "bg-green-600" },
        { name: "Python", level: 85, color: "bg-yellow-600" },
        { name: "PostgreSQL", level: 82, color: "bg-blue-700" },
        { name: "MongoDB", level: 80, color: "bg-green-700" },
        { name: "REST APIs", level: 90, color: "bg-purple-600" }
      ]
    },
    {
      title: "Tools & Technologies",
      skills: [
        { name: "Git/GitHub", level: 92, color: "bg-gray-700" },
        { name: "Docker", level: 75, color: "bg-blue-800" },
        { name: "AWS", level: 70, color: "bg-orange-600" },
        { name: "Vercel", level: 90, color: "bg-black" },
        { name: "VS Code", level: 95, color: "bg-blue-400" }
      ]
    }
  ]

  const technologies = [
    "React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", 
    "MongoDB", "Tailwind CSS", "Framer Motion", "Git", "Docker", "AWS", 
    "Vercel", "REST APIs", "GraphQL", "Jest", "Prisma", "tRPC"
  ]

  return (
    <div className="p-6 h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Skills & Technologies
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            A comprehensive toolkit of modern technologies and frameworks that I use to build 
            exceptional web applications and solve complex problems.
          </p>
        </motion.div>

        {/* Skill Categories */}
        <div className="grid gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="group"
            >
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 text-center">
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: categoryIndex * 0.1 + index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {skill.name}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${skill.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: categoryIndex * 0.1 + index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technologies */}
        <motion.div variants={itemVariants}>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 text-center">
            Technologies I Work With
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
