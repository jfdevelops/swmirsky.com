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

export const allCategories = [
  { id: "historical-fiction", name: "Historical Fiction" },
  { id: "world-war-ii", name: "World War II" },
  { id: "drama", name: "Drama" },
  { id: "philosophy", name: "Philosophy" },
  { id: "non-fiction", name: "Non-Fiction" },
  { id: "fiction", name: "Fiction" },
];

export const books: Book[] = [
  {
    id: "king-of-vinland",
    title: "The King of Vinland's Saga",
    subtitle: "A Novel of Vikings and Indians in Pre-Columbian North America",
    coverImage: "/book-covers/king-of-vinland.jpg",
    description:
      "Fleeing the ice clad fjords of his native Greenland just ahead of greedy kinsman who would keep his inheritance from him, Sigtrygg Thorgilsson, half-breed grandson of the storied explorer Leif Eiriksson, seeks his fortune on the shores of North America, last glimpsed by his grandfather some forty years before.",
    category: ["historical-fiction", "world-war-ii", "drama"],
    price: "$18.99",
    amazonLink:
      "https://www.amazon.com/King-Vinlands-Saga-Vikings-Pre-Columbian/dp/B00EXAMPLE",
    rating: 5,
    featured: true,
  },
  {
    id: "raft-on-river",
    title: "A Raft on the River",
    coverImage: "/book-covers/raft-on-river.jpg",
    description:
      "A novelized account of a young girl's coming of age in the shadow of Germany's occupation of Poland during World War II.",
    category: ["historical-fiction", "world-war-ii", "drama"],
    price: "$18.49",
    amazonLink:
      "https://www.amazon.com/Raft-River-Stuart-W-Mirsky/dp/B00EXAMPLE",
    rating: 5,
    featured: false,
  },
  {
    id: "value-and-representation",
    title: "Value and Representation",
    subtitle:
      "Three Essays Exploring the Implications of a Pragmatic Epistemology for Moral Thought",
    coverImage: "/book-covers/value-and-representation.jpg",
    description:
      "A philosophical work exploring the implications of a pragmatic epistemology for moral thought through three comprehensive essays.",
    category: ["philosophy", "non-fiction"],
    price: "$29.31",
    amazonLink:
      "https://www.amazon.com/Value-Representation-Exploring-Implications-Epistemology/dp/B00EXAMPLE",
    rating: 5,
    featured: false,
  },
  {
    id: "choice-and-action",
    title: "Choice and Action",
    coverImage: "/book-covers/choice-and-action.jpg",
    description:
      "A philosophical exploration of choice and action, examining the fundamental questions of human agency and decision-making.",
    category: ["philosophy", "non-fiction"],
    price: "$15.99",
    amazonLink:
      "https://www.amazon.com/Choice-Action-Stuart-W-Mirsky/dp/B00EXAMPLE",
    rating: 5,
    featured: false,
  },
  {
    id: "irregularities",
    title: "Irregularities",
    coverImage: "/book-covers/irregularities.jpg",
    description:
      "A compelling work exploring the complexities and irregularities of human experience and understanding.",
    category: ["fiction"],
    price: "$22.99",
    amazonLink:
      "https://www.amazon.com/Irregularities-Stuart-W-Mirsky/dp/B00EXAMPLE",
    rating: 5,
    featured: false,
  },
];

export const getFeaturedBook = () => {
  return books.find((book) => book.featured) || books[0];
};

export const getBooksByCategory = (category: string): Book[] => {
  return books.filter((book) => book.category.includes(category));
};

export function getAllCategories() {
  return books
    .flatMap((book) => {
      return book.category.map((cat) => {
        const category = allCategories.find((c) => c.id === cat);

        return category ??{};
      });
    })
}

export function getBook(options: {
  id?: string;
  title?: string;
  category?: string;
}) {
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

export function getBooks(options: { q?: string; category?: string }) {
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
