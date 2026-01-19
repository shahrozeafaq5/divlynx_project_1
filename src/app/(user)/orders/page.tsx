import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import "@/models/Book"; 
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";

import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image"; // ✅ Import Image

async function getOrders() {
  await connectDB();
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

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

  if (!orders) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* ─── FIXED BACKGROUND IMAGE ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2940&auto=format&fit=crop"
          alt="Vintage Archive Background"
          fill
          className="object-cover opacity-[0.06] grayscale sepia-[25%]"
          priority
        />
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.12]" />
        {/* Soft Vignette to focus center content */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#FDFCF8_100%)]" />
      </div>

      {/* ─── CONTENT LAYER ─── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-0">
        
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
          <div className="py-32 text-center border border-dashed border-[#8B6F47]/20 rounded-sm bg-[#8B6F47]/5 backdrop-blur-[2px]">
            <span className="font-scripture text-5xl text-[#8B6F47]/20 mb-6 block">❦</span>
            <p className="font-serif italic text-xl text-[#8B6F47]/60 mb-8">
              No records found in the archive.
            </p>
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
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-1">
                        Archive ID
                      </p>

                      <p className="font-mono text-[11px] text-[#2B2A28] opacity-80 uppercase">
                        {order._id.toString()}
                      </p>

                      <Link
                        href={`/order/${order._id.toString()}`}
                        className="mt-2 inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B6F47] hover:text-[#2B2A28] transition-colors"
                      >
                        View Record
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 text-left md:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-1">
                      Fulfillment Status
                    </p>
                    <span className="font-serif italic text-lg text-[#2B2A28] capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-6 pl-0 md:pl-12">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={`${order._id}-item-${index}`}
                      className="flex justify-between items-center"
                    >
                      <span className="font-serif italic text-xl text-[#2B2A28]">
                        {item.book?.title || "Folio Missing"} × {item.quantity}
                      </span>
                      <span className="font-serif italic text-lg text-[#2B2A28]">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer / Total Section */}
                <div className="mt-10 pt-8 flex justify-between items-end bg-[#8B6F47]/5 p-8 rounded-sm backdrop-blur-[4px] border border-[#8B6F47]/10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-2">
                      Record Date
                    </p>
                    <p className="font-serif italic text-lg text-[#2B2A28]">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-2">
                      Total Value
                    </p>
                    <p className="text-4xl font-serif italic tracking-tighter text-[#2B2A28]">
                      ${(order.totalPrice || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-40 py-20 border-t border-[#8B6F47]/10 text-center">
          <p className="font-scripture text-2xl text-[#8B6F47]/40 tracking-[0.5em] uppercase">
            End of Records
          </p>
        </div>
      </div>
    </div>
  );
}