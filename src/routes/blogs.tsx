import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { BlogPostCard, type BlogPost } from '@/components/blog-post-card'

export const Route = createFileRoute('/blogs')({ component: Blogs })

// Sample blog posts data - in a real app, this would come from a CMS or API
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: "Man Of La Book's Review of The King of Vinland's Saga",
    excerpt:
      "Read the comprehensive review of The King of Vinland's Saga from Man Of La Book, exploring the historical fiction and Viking narrative.",
    date: 'September 15, 2022',
    source: 'Man Of La Book',
  },
  {
    id: '2',
    title: "Goodreads Review of The King of Vinland's Saga",
    excerpt:
      "See what readers on Goodreads are saying about The King of Vinland's Saga and share your own thoughts.",
    date: 'September 15, 2022',
    source: 'Goodreads',
  },
  {
    id: '3',
    title: 'Myths and Legends and their Place in Modern Literature and Film',
    excerpt:
      "Since I was a kid I've loved the mythic world of ancient legend, from the Greek myths to the Norse, to stories of great wars.",
    date: 'September 15, 2022',
    source: 'Blog',
  },
]

function Blogs() {
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
            <FileText className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4">
            Blogs & Media
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Reviews, articles, and media coverage about Stuart W. Mirsky's works
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Empty State Message */}
        {blogPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400">No blog posts available at this time</p>
            <p className="text-gray-500 mt-2">Check back soon for updates</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

