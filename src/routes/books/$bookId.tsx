import { createFileRoute } from '@tanstack/react-router';
import {
  BookModal,
  BookModalContent,
  BookModalContentNotFound,
} from '@/components/book-modal';
import { generateBooksFromApiData } from '@/data/books';
import { serpApiQuerOptions } from '@/lib/queries/serp-api';

export const Route = createFileRoute('/books/$bookId')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { asins, queryClient } = context;
    const asinData = await queryClient.ensureQueryData(
      serpApiQuerOptions({ asins }),
    );

    const books = generateBooksFromApiData(asinData || {});
    const book = books.find((b) => b.id === params.bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    return { book };
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const { book } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  const { bookId } = Route.useParams();

  return (
    <BookModal
      open={!!bookId}
      onOpenChange={() => {
        navigate({ to: '/books' });
      }}
    >
      <BookModalContent book={book} />
    </BookModal>
  );
}

function ErrorComponent() {
  const navigate = Route.useNavigate();

  return (
    <BookModal
      open={true}
      onOpenChange={() => {
        navigate({ to: '/books' });
      }}
    >
      <BookModalContentNotFound />
    </BookModal>
  );
}
