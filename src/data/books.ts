import { ASINS } from '@/lib/constants';
import type { SearchResult } from '@/lib/search';

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  description: string;
  category: string[];
  price: string;
  amazonLink: string;
  rating: number;
  featured: boolean;
}

// Metadata for books that isn't available from the API
type BookMetadata = {
  description: string;
  category: string[];
  subtitle?: string;
  featured: boolean;
  coverImageFallback: string;
};

const bookMetadata: Record<string, BookMetadata> = {
  'king-of-vinland': {
    description:
      'Fleeing the ice clad fjords of his native Greenland just ahead of greedy kinsman who would keep his inheritance from him, Sigtrygg Thorgilsson, half-breed grandson of the storied explorer Leif Eiriksson, seeks his fortune on the shores of North America, last glimpsed by his grandfather some forty years before.',
    category: ['historical-fiction', 'world-war-ii', 'drama'],
    subtitle: 'A Novel of Vikings and Indians in Pre-Columbian North America',
    featured: true,
    coverImageFallback: '/book-covers/king-of-vinland.jpg',
  },
  'raft-on-river': {
    description:
      "A novelized account of a young girl's coming of age in the shadow of Germany's occupation of Poland during World War II.",
    category: ['historical-fiction', 'world-war-ii', 'drama'],
    featured: false,
    coverImageFallback: '/book-covers/raft-on-river.jpg',
  },
  'value-and-representation': {
    description:
      'A philosophical work exploring the implications of a pragmatic epistemology for moral thought through three comprehensive essays.',
    category: ['philosophy', 'non-fiction'],
    subtitle:
      'Three Essays Exploring the Implications of a Pragmatic Epistemology for Moral Thought',
    featured: false,
    coverImageFallback: '/book-covers/value-and-representation.jpg',
  },
  'choice-and-action': {
    description:
      'A philosophical exploration of choice and action, examining the fundamental questions of human agency and decision-making.',
    category: ['philosophy', 'non-fiction'],
    featured: false,
    coverImageFallback: '/book-covers/choice-and-action.jpg',
  },
  irregularities: {
    description:
      'A compelling work exploring the complexities and irregularities of human experience and understanding.',
    category: ['fiction'],
    featured: false,
    coverImageFallback: '/book-covers/irregularities.jpg',
  },
};

// Map ASINs to book IDs from the constants
const asinToBookIdMap: Record<string, string> = Object.fromEntries(
  ASINS.map((item) => [item.asin, item.id]),
);

// Map book IDs to ASINs for reverse lookup
const bookIdToAsinMap: Record<string, string> = Object.fromEntries(
  ASINS.map((item) => [item.id, item.asin]),
);

export function getAsinForBook(bookId: string): string | undefined {
  return bookIdToAsinMap[bookId];
}

export function getBookIdForAsin(asin: string): string | undefined {
  return asinToBookIdMap[asin];
}

/**
 * Generates books dynamically from ASINS and API data
 */
export function generateBooksFromApiData(
  apiData: Record<string, SearchResult>,
): Book[] {
  return ASINS.map(({ asin, id }) => {
    const metadata = bookMetadata[id];
    const apiResult = apiData[asin];

    if (!metadata) {
      throw new Error(`Missing metadata for book ID: ${id}`);
    }

    return {
      id,
      title: apiResult?.title || '',
      subtitle: metadata.subtitle,
      coverImage: apiResult?.thumbnails?.[0] || metadata.coverImageFallback,
      description: metadata.description,
      category: metadata.category,
      price: apiResult?.price || '',
      amazonLink: apiResult?.link || '',
      rating: apiResult?.rating || 0,
      featured: metadata.featured,
    };
  });
}

export const allCategories = [
  { id: 'historical-fiction', name: 'Historical Fiction' },
  { id: 'world-war-ii', name: 'World War II' },
  { id: 'drama', name: 'Drama' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'non-fiction', name: 'Non-Fiction' },
  { id: 'fiction', name: 'Fiction' },
];

export const getFeaturedBook = (books: Book[]): Book => {
  return books.find((book) => book.featured) || books[0];
};

export const getBooksByCategory = (category: string, books: Book[]): Book[] => {
  return books.filter((book) => book.category.includes(category));
};

export function getAllCategories(books: Book[]) {
  return books.flatMap((book) => {
    return book.category.map((cat) => {
      const category = allCategories.find((c) => c.id === cat);

      return category ?? {};
    });
  });
}

export function getBook(
  options: {
    id?: string;
    title?: string;
    category?: string;
  },
  books: Book[],
) {
  const { id, title, category } = options;

  return books.find((book) => {
    if (id !== undefined && book.id !== id) {
      return false;
    }

    if (
      title !== undefined &&
      !book.title.toLowerCase().includes(title.toLowerCase())
    ) {
      return false;
    }

    if (category !== undefined && !book.category.includes(category)) {
      return false;
    }

    return true;
  });
}

export function getBooks(
  options: { q?: string; category?: string },
  books: Book[],
) {
  const { q, category } = options;

  return books.filter((book) => {
    const matchesSearch =
      !q ||
      book.title.toLowerCase().includes(q.toLowerCase()) ||
      book.subtitle?.toLowerCase().includes(q.toLowerCase()) ||
      book.description.toLowerCase().includes(q.toLowerCase()) ||
      book.category.some((cat) => cat.toLowerCase().includes(q.toLowerCase()));

    const matchesCategory = !category || book.category.includes(category);

    return matchesSearch && matchesCategory;
  });
}
