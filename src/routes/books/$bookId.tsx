import { createFileRoute } from "@tanstack/react-router";
import {
  BookModal,
  BookModalContent,
  BookModalContentNotFound,
} from "@/components/book-modal";
import { books } from "@/data/books";

export const Route = createFileRoute("/books/$bookId")({
  component: RouteComponent,
  loader: ({ params }) => {
    const book = books.find((b) => b.id === params.bookId);

    if (!book) {
      throw new Error("Book not found");
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
        navigate({ to: "/books" });
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
        navigate({ to: "/books" });
      }}
    >
      <BookModalContentNotFound />
    </BookModal>
  );
}
