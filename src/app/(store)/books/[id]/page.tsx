import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import AddToCart from "@/components/cart/AddToCart";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const book = await Book.findById(id).lean();
  if (!book) return notFound();
  const data = JSON.parse(JSON.stringify(book));

  return (
    <div className="max-w-[1100px] mx-auto min-h-[85vh] flex items-center py-20 px-4">
      <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center w-full">
        
        {/* LEFT — The Exhibition Piece */}
        <div className="lg:col-span-5 relative group">
          <div className="relative aspect-[3/4.2] w-full bg-[#EAE7E0] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-sm overflow-hidden transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group-hover:-translate-y-3">
            <div className="absolute left-0 top-0 w-10 h-full bg-gradient-to-r from-black/25 via-black/5 to-transparent z-10" />
            {data.image && data.image.trim() !== "" ? (
              <Image src={data.image} alt={data.title} fill className="object-cover opacity-95 grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 scale-[1.01] group-hover:scale-105" priority />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#FDFCF8] border border-[#8B6F47]/10 px-8 text-center">
                <span className="font-scripture text-5xl text-[#8B6F47]/20 mb-4">❦</span>
                <p className="font-serif italic text-[#8B6F47]/60 text-[11px] tracking-[0.3em] uppercase">Archive Missing Visual</p>
              </div>
            )}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-25 pointer-events-none z-20" />
          </div>
        </div>

        {/* RIGHT — The Archive Entry */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <header className="border-b border-[#8B6F47]/20 pb-12 mb-12 relative">
            <span className="font-scripture text-5xl text-[#8B6F47]/10 absolute -top-14 left-0">BookNest</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#8B6F47] block mb-6">Authenticated Archive Folio</span>
            <h1 className="font-serif italic text-5xl md:text-7xl tracking-tighter text-[#2B2A28] leading-[0.9] mb-8 uppercase">{data.title}</h1>
            <div className="flex items-center gap-4">
              <div className="h-px w-10 bg-[#8B6F47]/60" />
              <p className="font-serif italic text-xl text-[#2B2A28]">Authored by <span className="text-[#8B6F47] font-bold not-italic text-sm uppercase tracking-widest ml-1">{data.author}</span></p>
            </div>
          </header>

          <div className="space-y-12">
            <div className="relative">
              <span className="absolute -left-8 -top-4 text-6xl text-[#8B6F47]/10 font-serif">“</span>
              <p className="text-xl leading-relaxed text-[#4A4947] font-serif italic pl-4 border-l-2 border-[#8B6F47]/5">{data.description}</p>
            </div>

            <div className="pt-12 border-t border-[#8B6F47]/10 flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-10">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#8B6F47] mb-2 font-bold">Acquisition Value</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[14px] font-serif italic text-[#8B6F47] mr-1">$</span>
                    <span className="text-6xl font-serif italic text-[#2B2A28] tracking-tighter leading-none">{data.price}</span>
                  </div>
               </div>
               
               {/* ─── THE NEW STAMP-STYLE BUTTON ─── */}
               <div className="w-full sm:w-auto min-w-[240px] relative group/btn">
                  {/* Subtle shadow offset for "Tactile" feel */}
                  <div className="absolute inset-0 bg-[#8B6F47]/10 translate-x-1.5 translate-y-1.5 transition-transform group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
                  
                  <div className="relative border border-[#2B2A28] bg-[#2B2A28] text-[#FDFCF8] transition-all duration-500 hover:bg-[#8B6F47] hover:border-[#8B6F47]">
                    {/* IMPORTANT: If the button inside AddToCart still has blue classes, 
                        you must go to components/cart/AddToCart.tsx and remove:
                        'bg-blue-600', 'hover:bg-blue-700', etc.
                    */}
                    <AddToCart bookId={data._id} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}