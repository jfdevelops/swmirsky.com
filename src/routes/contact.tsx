import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Mail, Facebook, ExternalLink, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/contact')({ component: Contact })

function Contact() {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      description: 'Reach out via email',
      link: 'mailto:contact@stuartwmirsky.com',
      linkText: 'Send Email',
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      title: 'Facebook',
      description: 'Connect on Facebook',
      link: 'https://www.facebook.com/swmirsky/',
      linkText: 'Visit Facebook',
    },
    {
      icon: <ExternalLink className="w-6 h-6" />,
      title: 'Blog',
      description: 'Read latest posts',
      link: 'http://ludwig.squarespace.com/volume-15/',
      linkText: 'Visit Blog',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-full mb-6">
            <Mail className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Contact
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get in touch with Stuart W. Mirsky
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-serif text-white mb-6">Other Ways to Connect</h2>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <Card className="bg-slate-900/50 border-slate-700">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {method.title}
                              </h3>
                              <p className="text-gray-400 text-sm mb-3">{method.description}</p>
                              <a
                                href={method.link}
                                target={method.link.startsWith('http') ? '_blank' : undefined}
                                rel={
                                  method.link.startsWith('http') ? 'noopener noreferrer' : undefined
                                }
                                className="text-amber-400 hover:text-amber-300 text-sm font-medium inline-flex items-center gap-1"
                              >
                                {method.linkText}
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                    <p className="text-gray-400">New York City, New York</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

