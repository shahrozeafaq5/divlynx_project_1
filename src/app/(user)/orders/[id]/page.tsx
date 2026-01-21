import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; // Register User
import Book from "@/models/Book"; // Register Book
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";

import { notFound } from "next/navigation";
import { Types } from "mongoose";
import OrderStatusAdmin from "@/components/order/OrderStatusAdmin";

/* ─── TYPES ─── */
type OrderItem = {
  quantity: number;
  price: number;
  book?: {
    _id: Types.ObjectId;
    title: string;
    image?: string;
  };
};

type OrderDetail = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: Date;
};

async function getOrder(id: string): Promise<OrderDetail | null> {
  try {
    await connectDB();

    const cookieStore = await cookies(); // Await cookies for Next.js 16
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const order = await Order.findById(id)
      .populate("items.book")
      .lean();

    if (!order) return null;

    // dY"? Security: User can only view own order unless admin
    if (
      order.user.toString() !== payload.id &&
      payload.role !== "admin"
    ) {
      return null;
    }

    return order as unknown as OrderDetail;
  } catch (error) {
    console.error("OrderDetailPage SSR error:", error);
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // Typed as Promise
}) {
  const { id } = await params; // Await params before use
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto min-h-screen px-6 py-12">
      {/* HEADER */}
      <header className="mb-20 border-b border-[#8B6F47]/10 pb-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#8B6F47] mb-2">
          Archive Record
        </p>
        <h1 className="font-serif italic text-4xl md:text-6xl text-[#2B2A28]">
          Order Ledger
        </h1>
      </header>

      {/* META DATA */}
      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] mb-2 font-bold">Archive ID</p>
          <p className="font-mono text-xs opacity-60 truncate">{order._id.toString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] mb-2 font-bold">Record Date</p>
          <p className="font-serif italic text-lg">
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="space-y-8 mb-20">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center border-b border-[#8B6F47]/10 pb-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-20 bg-[#EAE7E0] border border-[#8B6F47]/10 overflow-hidden">
                {item.book?.image && (
                  <img src={item.book.image} className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all" alt={item.book.title} />
                )}
              </div>
              <div>
                <p className="font-serif italic text-xl">{item.book?.title || "Folio Missing"}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-serif italic text-lg">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* TOTAL VALUE */}
      <div className="flex justify-between items-center bg-[#8B6F47]/5 p-8 md:p-10 mb-20">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] font-bold">Total Value</span>
        <span className="font-serif italic text-3xl md:text-4xl">${order.totalPrice.toFixed(2)}</span>
      </div>

      {/* ADMIN STATUS CONTROL */}
      <div className="border-t border-[#8B6F47]/10 pt-10">
        <OrderStatusAdmin
          orderId={order._id.toString()}
          currentStatus={order.status}
        />
      </div>
    </div>
  );
}