import { createFileRoute, Link } from '@tanstack/react-router';
import { type } from 'arktype';
import { motion } from 'framer-motion';
import { ArrowRight, Film } from 'lucide-react';
import { AuthorAvatar } from '@/components/author-avatar';
import type { BlogPost } from '@/components/blog-post-card';
import {
  BookModal,
  BookModalContent,
  BookModalContentNotFound,
} from '@/components/book-modal';
import { Bookshelf } from '@/components/bookshelf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VinlandProposalModal } from '@/components/vinland-proposal-modal';
import { generateBooksFromApiData, getFeaturedBook } from '@/data/books';
import { serpApiQueryOptions } from '@/lib/queries/serp-api';

const searchParams = type({
  'bookId?': 'string',
  'vinlandProposal?': 'boolean',
});

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    const { asins, queryClient } = context;
    const asinData = await queryClient.ensureQueryData(
      serpApiQueryOptions({ asins }),
    );

    return { asinData };
  },
  validateSearch: searchParams,
});

function Home() {
  const { asinData } = Route.useLoaderData();
  const books = generateBooksFromApiData(asinData || {});
  const featuredBook = getFeaturedBook(books);
  const navigate = Route.useNavigate();
  const { bookId, vinlandProposal } = Route.useSearch();
  const book = bookId ? books.find((book) => book.id === bookId) : undefined;
  const isVinlandBook = featuredBook.id === 'king-of-vinland';

  // Blog posts data for the bookshelf
  const blogPosts: BlogPost[] = [
    {
      id: 'man-of-la-books-review',
      title: "Man Of La Book's Review",
      excerpt: "Read the latest review of The King of Vinland's Saga",
      date: 'September 15, 2022',
      source: 'Man Of La Book',
      link: '/blogs',
    },
    {
      id: 'goodreads-review',
      title: 'Goodreads Review',
      excerpt: 'See what readers are saying about the books',
      date: 'September 15, 2022',
      source: 'Goodreads',
      link: '/blogs',
    },
  ];

  const handleBookClick = (bookId: string) => {
    navigate({ to: '/', search: { bookId } });
  };

  return (
    <>
      <div className='min-h-screen bg-slate-900'>
        {/* Bookshelf Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'>
          <div className='max-w-7xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-center mb-12'
            >
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4'>
                The Library
              </h1>
              <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
                Explore books, media, and blogs from Stuart W. Mirsky
              </p>
            </motion.div>
            <Bookshelf
              books={books}
              blogPosts={blogPosts}
              onBookClick={handleBookClick}
            />
          </div>
        </section>

        {/* Streaming Proposal Button - Only for Vinland */}
        {isVinlandBook && (
          <section className='py-12 px-4 sm:px-6 lg:px-8 bg-slate-900'>
            <div className='max-w-7xl mx-auto'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className='text-center'
              >
                <Button
                  asChild
                  size='lg'
                  className='bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg px-8 py-6'
                >
                  <Link
                    to='/'
                    search={{ vinlandProposal: true }}
                    className='inline-flex items-center gap-2'
                  >
                    <Film size={20} />
                    View Streaming Series Proposal
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* About Preview Section */}
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-slate-900 to-slate-800'>
          <div className='max-w-4xl mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className='bg-slate-800/50 border-slate-700'>
                <CardHeader>
                  <div className='flex items-center gap-3 mb-4'>
                    <AuthorAvatar />

                    <CardTitle className='text-3xl font-serif text-white'>
                      About the Author
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-300 text-lg leading-relaxed mb-6'>
                    Stuart W. Mirsky is an author of two novels and two works of
                    philosophy as well as a former government bureaucrat and
                    journalist. His works include historical fiction,{' '}
                    <em className='text-amber-400'>
                      The King of Vinland's Saga
                    </em>{' '}
                    and <em className='text-amber-400'>A Raft on the River</em>,
                    as well as philosophical works exploring pragmatic
                    epistemology and moral thought.
                  </p>
                  <Button
                    asChild
                    variant='outline'
                    className='border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                  >
                    <Link to='/about' className='flex items-center gap-2'>
                      Read More About Stuart
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      <BookModal
        open={!!bookId}
        onOpenChange={() => {
          navigate({ to: '/', search: { bookId: undefined } });
        }}
      >
        {book ? <BookModalContent book={book} /> : <BookModalContentNotFound />}
      </BookModal>

      <VinlandProposalModal
        open={!!vinlandProposal}
        onOpenChange={(open) => {
          navigate({
            to: '/',
            search: { vinlandProposal: open === true ? true : undefined },
          });
        }}
      />
    </>
  );
}
