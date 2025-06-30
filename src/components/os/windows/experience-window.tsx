"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Building, Calendar, MapPin } from 'lucide-react'

export function ExperienceWindow() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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

  const experiences = [
    {
      title: "Web Developer",
      company: "Tale Of Humankind",
      location: "Remote",
      period: "Apr 2023 - Present",
      description: "Supervise & Manage the Website of this NGO. Responsible for maintaining and developing the organization's web presence.",
      achievements: [
        "Managing complete web development lifecycle",
        "Implementing modern web technologies and frameworks",
        "Ensuring website accessibility and performance optimization",
        "Collaborating with the NGO team to enhance user experience"
      ],
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Content Management"]
    },
    {
      title: "Web Developer",
      company: "Environment And Wildlife Care Society",
      location: "Remote",
      period: "Jan 2019 - Present",
      description: "Managing the Web development of this NGO. Leading the digital transformation initiatives and maintaining the organization's online presence.",
      achievements: [
        "Successfully managing web development for 6+ years",
        "Implemented responsive design for better mobile experience",
        "Integrated donation systems and volunteer management",
        "Developed content management systems for easy updates",
        "Improved website performance and SEO rankings"
      ],
      technologies: ["HTML", "CSS", "JavaScript", "PHP", "WordPress", "MySQL"]
    }
  ]

  return (
    <div className="p-6 h-full overflow-y-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Professional Experience
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            A journey through various roles and companies, each contributing to my growth as a 
            developer and problem solver in the tech industry.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-700"></div>
          
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <motion.div
                key={`${experience.company}-${index}`}
                variants={itemVariants}
                className="relative flex items-start"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 transform -translate-x-1/2 w-4 h-4 bg-blue-500 border-4 border-white dark:border-slate-950 rounded-full z-10"></div>
                
                {/* Content */}
                <div className="w-full ml-12">
                  <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {experience.title}
                          </h3>
                          <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                            <Building className="h-4 w-4 mr-2" />
                            <span className="font-medium">{experience.company}</span>
                          </div>
                          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{experience.period}</span>
                          </div>
                          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {experience.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          Key Achievements:
                        </h4>
                        <ul className="space-y-1">
                          {experience.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="text-sm text-slate-600 dark:text-slate-400 flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          Technologies:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
