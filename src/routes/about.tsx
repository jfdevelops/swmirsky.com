import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { User, BookOpen, Award, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  const achievements = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Published Works',
      description: 'Two novels and two works of philosophy',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Former Commissioner',
      description: 'New York City Department of Health and Mental Hygiene',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Location',
      description: 'New York City',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-500/20 rounded-full mb-6">
            <User className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Stuart W. Mirsky
          </h1>
          <p className="text-xl text-gray-400">Author, Philosopher, Former Government Bureaucrat</p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-white">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                Stuart W. Mirsky is an author of two novels and two works of philosophy as well as
                a former government bureaucrat and journalist. His works include historical fiction,{' '}
                <em className="text-amber-400">The King of Vinland's Saga: A Novel of Vikings and
                Indians in Pre-Columbian North America</em> and{' '}
                <em className="text-amber-400">A Raft on the River</em>, a novelized account of a
                young girl's coming of age in the shadow of Germany's occupation of Poland during
                World War II.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                He is also the author of two works of philosophy:{' '}
                <em className="text-amber-400">Choice and Action (2016)</em> and{' '}
                <em className="text-amber-400">
                  Value and Representation: Three Essays Exploring the Implications of a Pragmatic
                  Epistemology for Moral Thought (2019)
                </em>{' '}
                and has authored a number of philosophy articles including "Moral Ideas and
                Religious Belief" (The Journal of Leadership, Accountability and Ethics) and
                several articles on Academia.edu: "Logic, Language and Life"; "Waiting for
                Wednesday"; "The Phenomenology of Morals"; "Reason or Rationalization: An Essay on
                System Pragmatics"; and "Conceiving Concepts," among others.
              </p>
            </CardContent>
          </Card>

          {/* Background */}
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Background</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300 leading-relaxed">
                Mirsky is a former bureaucrat who last served in the New York City Department of
                Health and Mental Hygiene as Assistant Commissioner for Operations. He retired in
                2002 to pursue his interests in narrative fiction and philosophy. He has lived
                abroad but currently resides in New York City with his wife of more than forty
                years. He's the father of three and grandfather of nine. He also holds a second
                degree black belt in the art of karate although it didn't help in bringing up the
                kids.
              </p>
            </CardContent>
          </Card>

          {/* Online Presence */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-white">Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                He currently blogs at{' '}
                <a
                  href="http://ludwig.squarespace.com/volume-15/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  http://ludwig.squarespace.com/volume-15/
                </a>{' '}
                and has a presence on{' '}
                <a
                  href="https://www.facebook.com/swmirsky/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline"
                >
                  Facebook
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 h-full text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4 text-amber-400">
                    {achievement.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{achievement.title}</h3>
                  <p className="text-gray-400">{achievement.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

