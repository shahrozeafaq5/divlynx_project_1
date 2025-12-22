"use client";
import BookCard from "./BookCard";
import { motion } from "framer-motion";

export default function BookGrid({ books }: { books: any[] }) {
  if (!books || books.length === 0) {
    return (
      <div className="py-40 text-center">
        <p className="font-serif italic text-xl text-[#8B6F47]/60">The shelves are currently empty...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
      {books.map((book, index) => (
        <BookCard key={book._id} book={book} index={index} />
      ))}
    </div>
  );
}