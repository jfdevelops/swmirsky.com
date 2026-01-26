import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Book } from '@/data/books';
import { cn } from '@/lib/utils';
import { renderStars } from './stars';

type BookCardContentProps = {
  book: Book;
  index?: number;
};

type BookCardProps = {
  children: React.ReactNode;
  index?: number;
};

export function BookCardContent({ book }: BookCardContentProps) {
  return (
    <Card className='h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 border-slate-700 bg-slate-800/50 cursor-pointer'>
      <CardHeader className='p-0'>
        <div className='relative overflow-hidden group'>
          <motion.img
            src={book.coverImage}
            alt={book.title}
            className='w-full h-64 object-contain bg-slate-900/50'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>
      </CardHeader>
      <CardContent className='flex-1 p-6 flex flex-col min-h-0'>
        <div className='flex flex-wrap gap-2 mb-3 shrink-0'>
          {book.category.slice(0, 2).map((cat) => (
            <Badge
              key={cat}
              variant='outline'
              className='text-xs border-amber-500/30 text-amber-400'
            >
              {cat}
            </Badge>
          ))}
        </div>
        <CardTitle className='text-xl font-serif mb-2 text-white line-clamp-2 shrink-0'>
          {book.title}
        </CardTitle>
        {book.subtitle && (
          <p className='text-sm text-gray-400 mb-3 line-clamp-2 shrink-0'>
            {book.subtitle}
          </p>
        )}
        <ScrollArea className='flex-1 min-h-0 mb-4'>
          <p className='text-sm text-gray-300'>{book.description}</p>
        </ScrollArea>
        <div className='flex items-center gap-1 shrink-0'>
          {renderStars({ rating: book.rating })}
          <span className='text-xs text-gray-400 ml-2'>({book.rating}/5)</span>
        </div>
      </CardContent>
      <CardFooter className='p-6 pt-0 flex items-center justify-between'>
        <span className='text-lg font-bold text-amber-400'>{book.price}</span>
        <Button
          asChild
          className='bg-amber-500 hover:bg-amber-600 text-white'
          size='sm'
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={book.amazonLink}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2'
          >
            Buy Now
            <ExternalLink size={16} />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function BookCard({ children, index = 0 }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
}

export function BookCardGrid({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className,
      )}
      {...props}
    />
  );
}
