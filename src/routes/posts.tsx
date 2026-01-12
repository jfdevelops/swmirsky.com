import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { PenTool } from 'lucide-react'
import { BlogPostCard, type BlogPost } from '@/components/blog-post-card'

export const Route = createFileRoute('/posts')({ component: Posts })

// Sample posts data - in a real app, this would come from a CMS or API
const posts: BlogPost[] = [
  {
    id: '1',
    title: 'Myths and Legends and their Place in Modern Literature and Film',
    excerpt:
      "Since I was a kid I've loved the mythic world of ancient legend, from the Greek myths to the Norse, to stories of great wars. This essay explores how these timeless narratives continue to influence contemporary storytelling.",
    date: 'September 15, 2022',
    link: 'http://ludwig.squarespace.com/volume-15/',
  },
  {
    id: '2',
    title: 'The Phenomenology of Morals',
    excerpt:
      'An exploration of moral ideas and their representation in philosophical thought, examining the implications of a pragmatic epistemology.',
    date: '2022',
    link: 'http://ludwig.squarespace.com/volume-15/',
  },
  {
    id: '3',
    title: 'Logic, Language and Life',
    excerpt:
      'A philosophical examination of the relationships between logic, language, and lived experience, published on Academia.edu.',
    date: '2022',
    link: 'https://www.academia.edu/',
  },
]

function Posts() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-full mb-6">
            <PenTool className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Mirsky's Posts
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Philosophical essays, articles, and writings by Stuart W. Mirsky
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* External Blog Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            For more posts and articles, visit Stuart's blog:
          </p>
          <a
            href="http://ludwig.squarespace.com/volume-15/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline text-lg"
          >
            http://ludwig.squarespace.com/volume-15/
          </a>
        </motion.div>

        {/* Empty State Message */}
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400">No posts available at this time</p>
            <p className="text-gray-500 mt-2">Check back soon for updates</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

