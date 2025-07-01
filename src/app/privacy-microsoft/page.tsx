'use client'

import { motion } from 'framer-motion'
import { Shield, User, Database, Lock, Eye, FileText, Calendar, Mail, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function PrivacyMicrosoftPage() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const generatePDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Dynamically import the PDF libraries
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default
      
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)
      
      // Add header
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Akshat Mehta', margin, 25)
      
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Microsoft 365 Privacy Statement', margin, 35)
      
      // Add line under header
      pdf.setLineWidth(0.5)
      pdf.line(margin, 40, pageWidth - margin, 40)
      
      let currentY = 55
      
      // Title
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      const title = 'Microsoft 365 Privacy Statement'
      pdf.text(title, margin, currentY)
      currentY += 15
      
      // Effective date
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Effective Date: January 1, 2025 | Last Updated: July 1, 2025', margin, currentY)
      currentY += 20
      
      // Content sections
      const sections = [
        {
          title: 'Organization Overview',
          content: [
            'Personal Microsoft 365 Organization',
            'This Microsoft 365 organization is owned and operated solely by Akshat Mehta for personal, educational, and professional development purposes. I am the only user and administrator of this organization.',
            '',
            'Organization Details:',
            '• Organization Name: Akshat Mehta (Personal)',
            '• Administrator: Akshat Mehta',
            '• Total Users: 1 (Personal Use Only)',
            '• Data Location: Microsoft Global Infrastructure'
          ]
        },
        {
          title: 'Data Collection & Usage',
          content: [
            'As the sole user of this Microsoft 365 organization, all data is personal and used exclusively for my own purposes. Data stored includes:',
            '',
            '• Email Data: Personal and professional emails stored in Exchange Online',
            '• Documents: Personal documents, projects, and files in OneDrive and SharePoint',
            '• Calendar Data: Personal appointments, meetings, and scheduling information',
            '• Profile Data: Basic profile information and account settings'
          ]
        },
        {
          title: 'Data Protection & Security',
          content: [
            'Security Measures:',
            '• Multi-factor authentication (MFA) enabled',
            '• Microsoft\'s enterprise-grade encryption at rest and in transit',
            '• Advanced Threat Protection (ATP) enabled',
            '• Regular security updates and patches automatically applied',
            '• Data Loss Prevention (DLP) policies configured',
            '',
            'Privacy Controls:',
            'As the sole administrator, I have full control over all privacy settings, data retention policies, and access controls. No external parties have access to this organization\'s data without my explicit consent.'
          ]
        },
        {
          title: 'Data Sharing & Third Parties',
          content: [
            'No Third-Party Sharing:',
            'I do not share, sell, rent, or otherwise distribute personal data stored in this Microsoft 365 organization with any third parties. Data is used exclusively for personal purposes.',
            '',
            'Microsoft\'s Role:',
            'Microsoft acts as a data processor for this organization. They provide the cloud infrastructure and services but do not have access to the content of my data except as outlined in Microsoft\'s privacy policy and terms of service.'
          ]
        },
        {
          title: 'Your Rights & Data Controls',
          content: [
            'Since I am the sole user and data controller of this organization, I maintain complete control over all data:',
            '',
            '• Data Access: Full access to all data stored in the organization',
            '• Data Portability: Ability to export all data using Microsoft\'s tools',
            '• Data Deletion: Complete control over data retention and deletion',
            '• Privacy Settings: Full administrative control over all privacy configurations'
          ]
        },
        {
          title: 'Contact Information',
          content: [
            'If you have any questions about this privacy statement or data handling practices:',
            '',
            'Data Controller: Akshat Mehta',
            'Email: akshatmehta202005@gmail.com',
            'Website: https://akshatmehta.com'
          ]
        }
      ]
      
      // Add sections to PDF
      for (const section of sections) {
        // Check if we need a new page
        if (currentY > pageHeight - 60) {
          pdf.addPage()
          currentY = margin + 10
        }
        
        // Section title
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text(section.title, margin, currentY)
        currentY += 10
        
        // Section content
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        
        for (const line of section.content) {
          if (currentY > pageHeight - 30) {
            pdf.addPage()
            currentY = margin + 10
          }
          
          if (line === '') {
            currentY += 5
          } else {
            const splitText = pdf.splitTextToSize(line, contentWidth)
            pdf.text(splitText, margin, currentY)
            currentY += splitText.length * 5
          }
        }
        
        currentY += 10
      }
      
      // Add footer to all pages
      const pageCount = (pdf as any).internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        
        // Footer line
        pdf.setLineWidth(0.5)
        pdf.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25)
        
        // Footer text
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text(`© 2025 Akshat Mehta - Microsoft 365 Privacy Statement`, margin, pageHeight - 15)
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 15)
      }
      
      // Save the PDF
      pdf.save('Akshat_Mehta_Microsoft365_Privacy_Statement.pdf')
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-12 max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Microsoft 365 Privacy Statement
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Privacy policy for Akshat Mehta's personal Microsoft 365 organization and data handling practices
          </p>
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-500">
            Effective Date: January 1, 2025 | Last Updated: July 1, 2025
          </div>
          
          {/* Download PDF Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6"
          >
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Organization Overview */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Organization Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Personal Microsoft 365 Organization
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  This Microsoft 365 organization is owned and operated solely by Akshat Mehta for personal, 
                  educational, and professional development purposes. I am the only user and administrator 
                  of this organization.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Organization Name:</strong>
                  <br />
                  <span className="text-slate-600 dark:text-slate-400">Akshat Mehta (Personal)</span>
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Administrator:</strong>
                  <br />
                  <span className="text-slate-600 dark:text-slate-400">Akshat Mehta</span>
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Total Users:</strong>
                  <br />
                  <span className="text-slate-600 dark:text-slate-400">1 (Personal Use Only)</span>
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-slate-100">Data Location:</strong>
                  <br />
                  <span className="text-slate-600 dark:text-slate-400">Microsoft Global Infrastructure</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Collection */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-600" />
                Data Collection & Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                As the sole user of this Microsoft 365 organization, all data is personal and used exclusively 
                for my own purposes. Here's what data is stored and how it's used:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Email Data</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Personal and professional emails stored in Exchange Online
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FileText className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Documents</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Personal documents, projects, and files in OneDrive and SharePoint
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Calendar Data</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Personal appointments, meetings, and scheduling information
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <User className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Profile Data</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Basic profile information and account settings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Protection */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-red-600" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Security Measures
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Multi-factor authentication (MFA) enabled
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Microsoft's enterprise-grade encryption at rest and in transit
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Advanced Threat Protection (ATP) enabled
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Regular security updates and patches automatically applied
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Data Loss Prevention (DLP) policies configured
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Privacy Controls
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  As the sole administrator, I have full control over all privacy settings, data retention policies, 
                  and access controls. No external parties have access to this organization's data without my 
                  explicit consent.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Sharing */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-purple-600" />
                Data Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  No Third-Party Sharing
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  I do not share, sell, rent, or otherwise distribute personal data stored in this Microsoft 365 
                  organization with any third parties. Data is used exclusively for personal purposes.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Microsoft's Role</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Microsoft acts as a data processor for this organization. They provide the cloud infrastructure 
                  and services but do not have access to the content of my data except as outlined in Microsoft's 
                  privacy policy and terms of service.
                </p>
                
                <div className="mt-4">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Microsoft Resources</h4>
                  <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                    <li>
                      <a 
                        href="https://privacy.microsoft.com/privacystatement" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Microsoft Privacy Statement
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.microsoft.com/trust-center" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Microsoft Trust Center
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://docs.microsoft.com/compliance/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Microsoft 365 Compliance Documentation
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rights & Controls */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                Your Rights & Data Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Since I am the sole user and data controller of this organization, I maintain complete control over all data:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Data Access</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Full access to all data stored in the organization
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Data Portability</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Ability to export all data using Microsoft's tools
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Data Deletion</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Complete control over data retention and deletion
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Privacy Settings</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Full administrative control over all privacy configurations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                If you have any questions about this privacy statement or data handling practices:
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                <div className="space-y-2">
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Data Controller:</strong>
                    <br />
                    <span className="text-slate-600 dark:text-slate-400">Akshat Mehta</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Email:</strong>
                    <br />
                    <a 
                      href="mailto:hello@akshatmehta.com" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      hello@akshatmehta.com
                    </a>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">Website:</strong>
                    <br />
                    <a 
                      href="https://akshatmehta.com" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      https://akshatmehta.com
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Updates */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                This privacy statement may be updated periodically to reflect changes in data handling practices 
                or regulatory requirements. Any updates will be posted on this page with a revised "Last Updated" date.
              </p>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm text-orange-900 dark:text-orange-100">
                  <strong>Note:</strong> This privacy statement applies specifically to the Microsoft 365 organization 
                  owned and operated by Akshat Mehta. For privacy policies related to other services or websites, 
                  please refer to their respective privacy statements.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
