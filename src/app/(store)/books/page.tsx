import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import BookCard from "@/components/books/BookCard";
import BookFilter from "@/components/books/BookFilters"; // Assuming you have this component
import { motion } from "framer-motion";

export default async function BooksPage() {
  await connectDB();
  
  // Fetching books with lean() for performance
  const rawBooks = await Book.find({}).sort({ createdAt: -1 }).lean();
  const books = JSON.parse(JSON.stringify(rawBooks));

  return (
    <div className="min-h-screen">
      {/* ─── PAGE HEADER ─── */}
      <header className="flex flex-col md:flex-row items-baseline gap-8 mb-24 border-b border-[#8B6F47]/10 pb-16">
        <h1 className="font-scripture text-7xl md:text-9xl tracking-tighter text-[#2B2A28] opacity-10">
          01
        </h1>
        <div className="max-w-2xl">
          <h2 className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] mb-6">
            Selected <span className="text-[#8B6F47]">Folios</span>
          </h2>
          <p className="font-serif italic text-lg text-[#6B6B6B] leading-relaxed">
            "Every volume on these shelves has been selected for its ability to stop time." 
            Browse our curated archive of essential human thought.
          </p>
        </div>
      </header>

      {/* ─── CATALOG FILTER ─── */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="h-px w-12 bg-[#8B6F47]/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#8B6F47] font-bold">
            The Catalog
          </span>
        </div>
        <BookFilter />
      </div>

      {/* ─── THE GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
        {books.map((book: any, index: number) => (
          <BookCard key={book._id} book={book} index={index} />
        ))}
      </div>

      {/* ─── BOTTOM DECORATION ─── */}
      <div className="mt-40 pt-20 border-t border-[#8B6F47]/10 text-center">
        <p className="font-scripture text-2xl text-[#8B6F47]/40 tracking-[0.5em] uppercase">
          Finis
        </p>
      </div>
    </div>
  );
}