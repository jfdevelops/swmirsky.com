import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BlogPost } from '@/components/blog-post-card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Book } from '@/data/books';
import { cn } from '@/lib/utils';

/**
 * Extracts the dominant color from an image
 */
function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('#654321'); // Fallback to brown
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Sample pixels from the image (sample every 10th pixel for performance)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const colorCounts: Record<string, number> = {};

        // Sample pixels
        for (let i = 0; i < pixels.length; i += 40) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Quantize colors to reduce variations
          const quantizedR = Math.floor(r / 10) * 10;
          const quantizedG = Math.floor(g / 10) * 10;
          const quantizedB = Math.floor(b / 10) * 10;
          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }

        // Find the most common color
        let maxCount = 0;
        let dominantColor = '654321'; // Default brown

        for (const [color, count] of Object.entries(colorCounts)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
          }
        }

        const [r, g, b] = dominantColor.split(',').map(Number);
        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        console.error('Error extracting color:', error);
        resolve('#654321'); // Fallback to brown
      }
    };
    img.onerror = () => {
      resolve('#654321'); // Fallback to brown
    };
    img.src = imageUrl;
  });
}

interface BookshelfProps {
  books: Book[];
  blogPosts?: BlogPost[];
  className?: string;
  onBookClick?: (bookId: string) => void;
}

interface BookSpineProps {
  book: Book;
  index: number;
  onBookClick?: (bookId: string) => void;
}

interface ShelfItemProps {
  title: string;
  excerpt?: string;
  icon: React.ReactNode;
  link: string;
  index: number;
}

function BookSpine({ book, index, onBookClick }: BookSpineProps) {
  const [spineColor, setSpineColor] = useState<string>('#654321');

  useEffect(() => {
    getDominantColor(book.coverImage).then(setSpineColor);
  }, [book.coverImage]);

  // Determine text color based on background brightness
  const getTextColor = (bgColor: string) => {
    // Extract RGB values
    const rgbMatch = bgColor.match(/\d+/g);
    if (!rgbMatch || rgbMatch.length < 3) return '#ffffff';

    const r = parseInt(rgbMatch[0]);
    const g = parseInt(rgbMatch[1]);
    const b = parseInt(rgbMatch[2]);

    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const textColor = getTextColor(spineColor);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='relative flex flex-col items-center'
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.15, zIndex: 10, y: -5 }}
            className='relative cursor-pointer'
            onClick={() => onBookClick?.(book.id)}
          >
            <div
              className='relative h-52 w-14 perspective-1000'
              style={{ perspective: '1000px' }}
            >
              {/* Book spine with extracted color */}
              <div className='relative h-full w-full transform-gpu'>
                <div
                  className='absolute inset-0 rounded-sm shadow-2xl overflow-hidden'
                  style={{
                    backgroundColor: spineColor,
                    transform: 'rotateY(-8deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Subtle gradient overlay for depth */}
                  <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20' />
                  {/* Spine edge highlight */}
                  <div className='absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-white/20 via-white/5 to-transparent' />

                  {/* Title on spine */}
                  <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                    <div
                      className='font-serif font-bold uppercase tracking-tight text-center px-1'
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        transform: 'rotate(180deg)',
                        color: textColor,
                        fontSize: 'clamp(8px, 0.65vw, 10px)',
                        lineHeight: '1.2',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textShadow:
                          textColor === '#ffffff'
                            ? '1px 1px 2px rgba(0,0,0,0.5)'
                            : '1px 1px 2px rgba(255,255,255,0.3)',
                      }}
                    >
                      {book.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side='top'
          className='bg-slate-900 text-white border-amber-500/50'
        >
          {book.title}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}

function ShelfItem({ title, excerpt, icon, link, index }: ShelfItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='relative'
    >
      <Link
        to={link}
        className='relative cursor-pointer block'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Paper stack layers - appear on hover from right corner */}
        {Array.from({ length: 5 }, (_, i) => {
          const sheetId = `${link}-sheet-${i}`;
          return (
            <div
              key={sheetId}
              className='absolute inset-0 bg-white rounded-sm transition-all duration-300 ease-out pointer-events-none'
              style={{
                boxShadow:
                  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)',
                transform: isHovered
                  ? `translateX(${(5 - i) * 4}px) translateY(${(5 - i) * 4}px) rotate(${(5 - i) * 0.8}deg)`
                  : 'translateX(0) translateY(0) rotate(0deg)',
                opacity: isHovered ? 1 : 0,
                transitionDelay: `${i * 40}ms`,
                zIndex: i,
                width: '280px',
                height: '360px',
              }}
            />
          );
        })}

        {/* Main paper - always visible */}
        <div
          className='relative bg-white w-[280px] h-[360px] rounded-sm transition-all duration-300 ease-out overflow-hidden'
          style={{
            boxShadow: isHovered
              ? '0 10px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)'
              : '0 2px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
            transform: isHovered ? 'translateX(-8px) translateY(-8px)' : 'none',
            zIndex: 10,
          }}
        >
          {/* Article header */}
          <div className='w-full h-24 bg-gradient-to-br from-amber-100 to-amber-200 relative'>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2E4YTI5ZSIgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')] opacity-20" />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-amber-600'>{icon}</div>
            </div>
          </div>

          {/* Article content */}
          <div className='p-4'>
            {/* Title */}
            <h3 className='font-serif text-base text-stone-800 leading-tight mb-3 line-clamp-2'>
              {title}
            </h3>

            {/* Article preview text */}
            {excerpt && (
              <p className='text-stone-600 text-xs leading-relaxed mb-4 line-clamp-4'>
                {excerpt}
              </p>
            )}

            {/* Text skeleton lines */}
            <div className='space-y-2 mb-4'>
              <div className='h-1.5 bg-stone-100 rounded w-full' />
              <div className='h-1.5 bg-stone-100 rounded w-full' />
              <div className='h-1.5 bg-stone-100 rounded w-11/12' />
            </div>

            {/* Read more link */}
            <div className='pt-3 border-t border-stone-100'>
              <span className='text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors'>
                Read more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Shelf({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className='relative mb-8'>
      {/* Shelf label */}
      {label && (
        <div className='mb-4 px-2'>
          <h3 className='text-amber-400 font-serif text-lg font-semibold'>
            {label}
          </h3>
        </div>
      )}

      {/* Shelf surface */}
      <div className='relative'>
        {/* Wood grain shelf */}
        <div
          className='h-4 rounded-t-lg shadow-lg'
          style={{
            background:
              'linear-gradient(to bottom, #8B4513 0%, #654321 50%, #8B4513 100%)',
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 4px
              )
            `,
            boxShadow:
              'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.5)',
          }}
        />

        {/* Shelf content area */}
        <div className='bg-slate-900/60 px-6 py-8 rounded-b-lg border-x-2 border-b-2 border-amber-900/50 min-h-[220px] backdrop-blur-sm'>
          <div className='flex flex-wrap items-end gap-6'>{children}</div>
        </div>

        {/* Shelf edge shadow */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-amber-900/30 to-transparent' />
      </div>
    </div>
  );
}

export function Bookshelf({
  books,
  blogPosts = [],
  className,
  onBookClick,
}: BookshelfProps) {
  // Separate featured and other books
  const featuredBook = books.find((book) => book.featured);
  const otherBooks = books.filter((book) => !book.featured);

  // Prepare blog/media items
  const blogItems = blogPosts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    link: post.link || '/blogs',
    icon: <FileText size={20} />,
  }));

  return (
    <div className={cn('w-full', className)}>
      <div className='max-w-7xl mx-auto'>
        {/* Bookshelf frame */}
        <div
          className='relative rounded-lg p-8'
          style={{
            background:
              'linear-gradient(135deg, #654321 0%, #8B4513 50%, #654321 100%)',
            boxShadow:
              'inset 0 0 50px rgba(0,0,0,0.5), 0 10px 40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Wood grain texture */}
          <div
            className='absolute inset-0 rounded-lg opacity-20'
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(0,0,0,0.1) 10px,
                  rgba(0,0,0,0.1) 20px
                )
              `,
            }}
          />

          <div className='relative z-10'>
            {/* Featured Book Shelf */}
            {featuredBook && (
              <Shelf label='Featured'>
                <BookSpine
                  book={featuredBook}
                  index={0}
                  onBookClick={onBookClick}
                />
              </Shelf>
            )}

            {/* Books Shelf */}
            {otherBooks.length > 0 && (
              <Shelf label='Books'>
                {otherBooks.map((book, index) => (
                  <BookSpine
                    key={book.id}
                    book={book}
                    index={index}
                    onBookClick={onBookClick}
                  />
                ))}
              </Shelf>
            )}

            {/* Media & Blogs Shelf */}
            {blogItems.length > 0 && (
              <Shelf label='Media & Blogs'>
                <div className='flex flex-wrap gap-6 w-full items-end'>
                  {blogItems.map((item, index) => (
                    <ShelfItem
                      key={item.id}
                      title={item.title}
                      excerpt={item.excerpt}
                      icon={item.icon}
                      link={item.link}
                      index={index}
                    />
                  ))}
                </div>
              </Shelf>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
