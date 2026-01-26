import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { type } from 'arktype';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import {
  BookCard,
  BookCardContent,
  BookCardGrid,
} from '@/components/book-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  generateBooksFromApiData,
  getAllCategories,
  getBooks,
} from '@/data/books';
import { serpApiQueryOptions } from '@/lib/queries/serp-api';

const searchParams = type({
  'q?': 'string',
  'category?': 'string',
});

export const Route = createFileRoute('/books')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { asins, queryClient } = context;
    const asinData = await queryClient.ensureQueryData(
      serpApiQueryOptions({ asins }),
    );

    return { asinData };
  },
  validateSearch: searchParams,
});

function RouteComponent() {
  const { asinData } = Route.useLoaderData();
  const books = generateBooksFromApiData(asinData || {});
  const { q, category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const filteredBooks = getBooks({ q, category }, books);

  const clearFilters = () => {
    navigate({
      to: '/books',
      search: {
        q: undefined,
        category: undefined,
      },
    });
  };

  const hasActiveFilters = q !== undefined || category !== undefined;

  return (
    <div className='min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 pt-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h1 className='text-5xl md:text-6xl font-serif font-bold text-white mb-4'>
            Books
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
            Explore the complete collection of works by Stuart W. Mirsky
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-8 space-y-6'
        >
          {/* Search Bar */}
          <div className='relative max-w-2xl mx-auto'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <Input
              type='text'
              placeholder='Search by title, description, or category...'
              value={q || ''}
              onChange={(e) =>
                navigate({
                  to: '/books',
                  search: (prev: { q?: string; category?: string }) => ({
                    ...prev,
                    q: e.target.value || undefined,
                  }),
                })
              }
              className='pl-12 pr-12 py-6 text-lg bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-amber-500'
            />
            {q && (
              <Button
                variant='ghost'
                size='icon'
                onClick={() =>
                  navigate({
                    to: '/books',
                    search: (prev: { q?: string; category?: string }) => ({
                      ...prev,
                      q: undefined,
                    }),
                  })
                }
                aria-label='Clear search'
              >
                <X className='w-4 h-4' />
              </Button>
            )}
          </div>

          {/* Category Filters */}
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <span className='text-gray-400 font-medium'>
              Filter by category:
            </span>
            <Button
              variant={category === undefined ? 'default' : 'outline'}
              size='sm'
              onClick={() =>
                navigate({ to: '/books', search: { category: undefined } })
              }
              className={
                category === undefined
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'border-slate-600 text-gray-300 hover:bg-slate-700'
              }
            >
              All
            </Button>
            {getAllCategories(books).map(({ id, name }) => (
              <Button
                key={id}
                variant={category === id ? 'default' : 'outline'}
                size='sm'
                asChild
                className={
                  category === id
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'border-slate-600 text-gray-300 hover:bg-slate-700'
                }
              >
                <Link
                  to='/books'
                  search={(prev) => ({ ...prev, category: id })}
                >
                  {name}
                </Link>
              </Button>
            ))}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className='flex items-center justify-center gap-2 flex-wrap'>
              <span className='text-gray-400 text-sm'>Active filters:</span>
              {q && (
                <Badge
                  variant='outline'
                  className='border-amber-500/50 text-amber-400'
                >
                  Search: "{q}"
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      navigate({
                        to: '/books',
                        search: (prev: { q?: string; category?: string }) => ({
                          ...prev,
                          q: undefined,
                        }),
                      })
                    }
                    className='ml-2 hover:text-amber-300'
                    aria-label='Remove search filter'
                  >
                    <X size={14} />
                  </Button>
                </Badge>
              )}
              {category && (
                <Badge
                  variant='outline'
                  className='border-amber-500/50 text-amber-400'
                >
                  Category: {category}
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      navigate({
                        to: '/books',
                        search: (prev: { q?: string; category?: string }) => ({
                          ...prev,
                          category: undefined,
                        }),
                      })
                    }
                    className='ml-2 hover:text-amber-300'
                    aria-label='Remove category filter'
                  >
                    <X size={14} />
                  </Button>
                </Badge>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='text-gray-400 hover:text-white'
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div className='text-center'>
            <p className='text-gray-400'>
              Showing{' '}
              <span className='text-amber-400 font-semibold'>
                {filteredBooks.length}
              </span>{' '}
              {filteredBooks.length === 1 ? 'book' : 'books'}
              {hasActiveFilters && ` (of ${books.length} total)`}
            </p>
          </div>
        </motion.div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <BookCardGrid>
            {filteredBooks.map((book) => (
              <BookCard key={book.id}>
                <Link to='/books/$bookId' params={{ bookId: book.id }}>
                  <BookCardContent book={book} />
                </Link>
              </BookCard>
            ))}
          </BookCardGrid>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-center py-20'
          >
            <p className='text-2xl text-gray-400 mb-4'>No books found</p>
            <p className='text-gray-500 mb-6'>
              Try adjusting your search or filters
            </p>
            <Button
              onClick={clearFilters}
              className='bg-amber-500 hover:bg-amber-600 text-white'
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
      {/* Render child routes (like /books/$bookId) */}
      <Outlet />
    </div>
  );
}
