import { motion } from 'framer-motion'
import { Calendar, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  link?: string
  source?: string
}

interface BlogPostCardProps {
  post: BlogPost
  index?: number
}

export function BlogPostCard({ post, index = 0 }: BlogPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="h-full flex flex-col bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-2">
            <CardTitle className="text-xl font-serif text-white line-clamp-2 flex-1">
              {post.title}
            </CardTitle>
            {post.source && (
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded whitespace-nowrap">
                {post.source}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar size={16} />
            <time dateTime={post.date}>{post.date}</time>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-gray-300 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
          {post.link && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 w-fit"
            >
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Read More
                <ExternalLink size={16} />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

