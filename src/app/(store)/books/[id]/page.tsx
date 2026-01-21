import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import AddToCart from "@/components/cart/AddToCart";
import BookCard from "@/components/books/BookCard";
import { notFound } from "next/navigation";
import Image from "next/image";
export const runtime = "nodejs";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
  try {
    const conn = await connectDB();
    if (!conn) return notFound();

    const { id } = await params;

    const book = await Book.findById(id).lean();
    if (!book) return notFound();

    const data = JSON.parse(JSON.stringify(book));
    const bookId = data._id.toString();

    // ✅ RELATED BOOKS (same category, exclude current)
    const relatedRaw = await Book.find({
    category: data.category,
    _id: { $ne: data._id },
    })
    .limit(4)
    .lean();

    const relatedBooks = JSON.parse(JSON.stringify(relatedRaw));

    return (
    <div className="max-w-[1100px] mx-auto min-h-[85vh] py-20 px-4">

      {/* ─── MAIN BOOK SECTION ─── */}
      <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center w-full">

        {/* LEFT — COVER */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[3/4.2] w-full bg-[#EAE7E0] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm overflow-hidden transition-all duration-700 group-hover:-translate-y-3">
            {data.image ? (
              <Image
                src={data.image}
                alt={data.title}
                fill
                priority
                quality={75}
                sizes="(max-width: 768px) 90vw, 40vw"
                className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif italic text-[#8B6F47]/40">
                ❦
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="lg:col-span-7">
          <header className="border-b border-[#8B6F47]/20 pb-12 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8B6F47] block mb-6">
              Authenticated Archive Folio
            </span>

            <h1 className="font-serif italic text-5xl md:text-7xl tracking-tighter text-[#2B2A28] mb-8 uppercase">
              {data.title}
            </h1>

            <p className="font-serif italic text-xl">
              Authored by{" "}
              <span className="text-[#8B6F47] font-bold uppercase tracking-widest ml-1">
                {data.author}
              </span>
            </p>
          </header>

          <p className="text-xl leading-relaxed text-[#4A4947] font-serif italic mb-12">
            {data.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-10 pt-10 border-t border-[#8B6F47]/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#8B6F47] font-bold block mb-2">
                Acquisition Value
              </span>
              <span className="text-6xl font-serif italic text-[#2B2A28]">
                ${data.price}
              </span>
            </div>

            <div className="min-w-[240px]">
              <AddToCart bookId={bookId} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── RELATED BOOKS ─── */}
      {relatedBooks.length > 0 && (
        <section className="mt-32 border-t border-[#8B6F47]/10 pt-20">
          <div className="mb-12 flex items-center gap-4">
            <span className="h-px w-12 bg-[#8B6F47]/40" />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#8B6F47]">
              More from this category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
            {relatedBooks.map((book: any, index: number) => (
              <BookCard key={book._id} book={book} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
    );
  } catch (error) {
    console.error("BookDetailPage SSR error:", error);
    return notFound();
  }
}
