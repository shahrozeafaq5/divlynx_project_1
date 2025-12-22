import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import "@/models/Book"; 
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";

async function getOrders() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;

  return await Order.find({ user: payload.id })
    .populate("items.book")
    .sort({ createdAt: -1 })
    .lean();
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="max-w-5xl mx-auto min-h-screen">
      {/* ─── PAGE HEADER ─── */}
      <header className="flex flex-col md:flex-row items-baseline gap-8 mb-24 border-b border-[#8B6F47]/10 pb-16">
        <h1 className="font-scripture text-7xl md:text-9xl tracking-tighter text-[#2B2A28] opacity-10">
          02
        </h1>
        <div className="max-w-2xl">
          <h2 className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] mb-6">
            Purchase <span className="text-[#8B6F47]">History</span>
          </h2>
          <p className="font-serif italic text-lg text-[#6B6B6B] leading-relaxed">
            A chronological record of folios added to your private collection. 
            Archived and preserved for your reference.
          </p>
        </div>
      </header>

      {!orders || orders.length === 0 ? (
        <div className="py-32 text-center border border-dashed border-[#8B6F47]/20 rounded-sm bg-[#8B6F47]/5">
          <span className="font-scripture text-5xl text-[#8B6F47]/20 mb-6 block">❦</span>
          <p className="font-serif italic text-xl text-[#8B6F47]/60 mb-8">No records found in the archive.</p>
          <Link 
            href="/books" 
            className="text-[11px] font-bold uppercase tracking-[0.3em] border border-[#2B2A28] px-10 py-4 hover:bg-[#2B2A28] hover:text-[#FDFCF8] transition-all"
          >
            Browse the Library
          </Link>
        </div>
      ) : (
        <div className="space-y-20">
          {orders.map((order: any, orderIndex: number) => (
            <div key={order._id.toString()} className="group relative">
              
              {/* Ledger Style Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pb-4 border-b border-[#2B2A28]/10">
                <div className="flex items-baseline gap-4">
                  <span className="font-scripture text-3xl text-[#8B6F47]/30">
                    {orders.length - orderIndex}.
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-1">Archive ID</p>
                    <p className="font-mono text-[11px] text-[#2B2A28] opacity-60 uppercase">{order._id.toString()}</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 text-left md:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-1">Fulfillment Status</p>
                  <span className="font-serif italic text-lg text-[#2B2A28] capitalize">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items List - Styled as a Manifest */}
              <div className="space-y-6 pl-12">
                {order.items.map((item: any, index: number) => {
                  const itemKey = item._id?.toString() || `${order._id}-item-${index}`;
                  
                  return (
                    <div key={itemKey} className="flex justify-between items-center group/item">
                      <div className="flex items-center gap-6">
                        {/* Minimal Image Placeholder */}
                        <div className="w-12 h-16 bg-[#EAE7E0] border border-[#8B6F47]/10 flex items-center justify-center text-[10px] font-serif italic text-[#8B6F47]/40 shadow-sm overflow-hidden relative">
                          {item.book?.image ? (
                             <img src={item.book.image} className="object-cover w-full h-full opacity-60 grayscale group-hover/item:grayscale-0 transition-all duration-700" alt="" />
                          ) : "B"}
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none" />
                        </div>
                        
                        <div>
                          <span className="font-serif italic text-xl text-[#2B2A28] block group-hover/item:text-[#8B6F47] transition-colors">
                            {item.book?.title || "Folio Missing"}
                          </span>
                          <span className="text-[10px] font-bold text-[#8B6F47] uppercase tracking-[0.2em]">
                            Quantity: {item.quantity} — Fixed Rate Acquisition
                          </span>
                        </div>
                      </div>
                      <span className="font-serif italic text-lg text-[#2B2A28]">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer - The "Total" Stamp */}
              <div className="mt-10 pt-8 flex justify-between items-end bg-[#8B6F47]/5 p-8 rounded-sm relative">
                {/* Visual Flourish */}
                <div className="absolute top-4 right-8 text-4xl text-[#8B6F47]/10 font-scripture select-none">❧</div>
                
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-2">Record Date</p>
                  <p className="font-serif italic text-lg text-[#2B2A28]">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-2">Total Value</p>
                  <p className="text-4xl font-serif italic text-[#2B2A28] tracking-tighter">
                    ${(order.totalPrice || 0).toFixed(2)}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ─── BOTTOM DECORATION ─── */}
      <div className="mt-40 pt-20 border-t border-[#8B6F47]/10 text-center">
        <p className="font-scripture text-2xl text-[#8B6F47]/40 tracking-[0.5em] uppercase">
          End of Records
        </p>
      </div>
    </div>
  );
}