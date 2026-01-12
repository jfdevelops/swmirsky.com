import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Book } from "@/data/books";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { renderStars } from "./stars";
import { ScrollArea } from "./ui/scroll-area";

type BookModalProps = Omit<ComponentPropsWithRef<typeof Dialog>, "children"> & {
  children: React.ReactNode;
};

type BookModalContentProps = {
  book: Book;
};

export function BookModal({ children, ...props }: BookModalProps) {
  return (
    <Dialog {...props}>
      <AnimatePresence>
        <DialogContent className="w-[55vw] max-w-7xl! max-h-[70vh] bg-slate-800 border-slate-700 p-0 grid! grid-rows-[1fr]! overflow-hidden">
          {children}
        </DialogContent>
      </AnimatePresence>
    </Dialog>
  );
}

export function BookModalContent({ book }: BookModalContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-6 h-full overflow-hidden flex flex-col"
    >
      <div className="grid md:grid-cols-2 gap-8 h-full min-h-0 overflow-hidden">
        {/* Book Cover */}
        <motion.div
          initial={{ opacity: 0, x: -30, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex justify-center md:justify-start"
        >
          <div
            className="relative perspective-1000"
            style={{ perspective: "1000px" }}
          >
            <motion.img
              src={book.coverImage}
              alt={book.title}
              className="w-full max-w-sm rounded-lg shadow-2xl"
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: "preserve-3d" }}
            />
            <motion.div
              className="absolute inset-0 bg-linear-to-tr from-amber-500/20 to-transparent rounded-lg pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Book Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col h-full min-h-0 overflow-hidden"
        >
          <DialogHeader className="shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {book.category.map((cat, idx) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + idx * 0.05 }}
                >
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 text-amber-400 bg-amber-500/10"
                  >
                    {cat}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <DialogTitle className="text-3xl md:text-4xl font-serif text-white mb-2">
                {book.title}
              </DialogTitle>
            </motion.div>
            {book.subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <DialogDescription className="text-lg text-gray-300 mb-4">
                  {book.subtitle}
                </DialogDescription>
              </motion.div>
            )}
          </DialogHeader>

          {/* Rating - Fixed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 shrink-0 mb-4"
          >
            {renderStars({ rating: book.rating })}
            <span className="text-gray-400">({book.rating}/5)</span>
          </motion.div>

          {/* Description - Scrollable */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex-1 min-h-0 mb-4 overflow-y-auto pr-4"
            style={{ maxHeight: "100%" }}
          >
            <ScrollArea className="h-full">
              <div className="pr-4">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {book.description}
                </p>
              </div>
            </ScrollArea>
          </motion.div>

          {/* Price and Buy Button - Fixed */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between pt-4 border-t border-slate-700 shrink-0"
          >
            <span className="text-2xl font-bold text-amber-400">
              {book.price}
            </span>
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <a
                href={book.amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Buy on Amazon
                <ExternalLink size={20} />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function BookModalContentNotFound() {
  return <div className="text-white">Book not found</div>;
}
