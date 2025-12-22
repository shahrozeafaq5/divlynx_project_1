import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import "@/models/Book"; 
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";

async function getCart() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;

  return await Cart.findOne({ user: payload.id }).populate("items.book").lean();
}

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items || [];
  
  const total = items.reduce((acc: number, item: any) => {
    const price = item.book?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto min-h-screen">
      {/* ─── PAGE HEADER ─── */}
      <header className="flex flex-col md:flex-row items-baseline gap-8 mb-24 border-b border-[#8B6F47]/10 pb-16">
        <h1 className="font-scripture text-7xl md:text-9xl tracking-tighter text-[#2B2A28] opacity-10">
          03
        </h1>
        <div className="max-w-2xl">
          <h2 className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] mb-6">
            Your <span className="text-[#8B6F47]">Collection Bag</span>
          </h2>
          <p className="font-serif italic text-lg text-[#6B6B6B] leading-relaxed">
            Folios currently selected for acquisition. Please review your manifest 
            before finalizing the archival record.
          </p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="py-32 text-center border border-dashed border-[#8B6F47]/20 rounded-sm bg-[#8B6F47]/5">
          <span className="font-scripture text-5xl text-[#8B6F47]/20 mb-6 block">❦</span>
          <p className="font-serif italic text-xl text-[#8B6F47]/60 mb-8">Your bag is currently empty.</p>
          <Link 
            href="/books" 
            className="text-[11px] font-bold uppercase tracking-[0.3em] border border-[#2B2A28] px-10 py-4 hover:bg-[#2B2A28] hover:text-[#FDFCF8] transition-all"
          >
            Return to Library
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Main Cart Items List */}
          <div className="lg:col-span-8 space-y-10">
            {items.map((item: any, index: number) => {
              // Safe Key Generation
              const itemKey = item._id?.toString() || item.book?._id?.toString() || `cart-item-${index}`;
              
              return (
                <div key={itemKey} className="group relative flex items-center justify-between pb-10 border-b border-[#8B6F47]/10 last:border-0">
                  <div className="flex items-center gap-8">
                    {/* Minimal Thumbnail */}
                    <div className="w-20 h-28 bg-[#EAE7E0] border border-[#8B6F47]/10 flex items-center justify-center text-[10px] font-serif italic text-[#8B6F47]/40 shadow-sm relative overflow-hidden">
                       {item.book?.image ? (
                         <img 
                          src={item.book.image} 
                          className="object-cover w-full h-full opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700" 
                          alt={item.book.title} 
                         />
                       ) : "B"}
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none" />
                    </div>
                    
                    <div>
                      <h3 className="font-serif italic text-2xl text-[#2B2A28] group-hover:text-[#8B6F47] transition-colors mb-2">
                        {item.book?.title || "Folio Unavailable"}
                      </h3>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-[#8B6F47] uppercase tracking-[0.2em]">
                        <span>Quantity: {item.quantity}</span>
                        <span className="opacity-30">|</span>
                        {/* FIXED: Convert _id to string before slicing */}
                        <span>Archival Ref: {item.book?._id ? item.book._id.toString().slice(-4) : "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-serif italic text-2xl text-[#2B2A28]">
                      ${((item.book?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <button className="text-[9px] uppercase tracking-[0.2em] text-red-800/40 hover:text-red-800 transition-colors mt-2 font-bold">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-[#8B6F47]/5 p-10 border border-[#8B6F47]/10 rounded-sm sticky top-40">
              <h2 className="font-serif italic text-2xl mb-8 text-[#2B2A28] border-b border-[#8B6F47]/20 pb-4">
                Order Ledger
              </h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B6F47]">
                  <span>Subtotal</span>
                  <span className="text-[#2B2A28]">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] font-bold text-[#8B6F47]">
                  <span>Shipping</span>
                  <span className="italic font-serif normal-case lowercase text-sm">complimentary</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47]">Total Value</span>
                <span className="text-4xl font-serif italic text-[#2B2A28] tracking-tighter leading-none">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Link href="/checkout" className="block w-full group/btn">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#8B6F47]/20 translate-x-1 translate-y-1 group-hover/btn:translate-x-0 group-hover/btn:translate-y-0 transition-transform" />
                  <button 
                    type="button"
                    className="relative w-full py-5 bg-[#2B2A28] text-[#FDFCF8] text-center text-[11px] font-bold uppercase tracking-[0.3em] transition-all hover:bg-[#8B6F47]"
                  >
                    Finalize Acquisition
                  </button>
                </div>
              </Link>
              
              <p className="text-center text-[9px] text-[#A0A0A0] mt-6 font-serif italic uppercase tracking-[0.2em]">
                ❦ Secure Archive Processing ❦
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}