import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import "@/models/Book";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";

import Link from "next/link";
import { redirect } from "next/navigation";
import CartItemsClient from "@/components/cart/CartItemsClient";

async function getCart() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return { items: null, isAuthed: false };

    const payload = await verifyToken(token);
    if (!payload) return { items: null, isAuthed: false };

    const cart = await Cart.findOne({ user: payload.id })
      .populate("items.book")
      .lean();

    if (!cart) return { items: [], isAuthed: true };

    // Manual serialization for client props.
    const serializedItems = cart.items.map((item: any) => ({
      quantity: item.quantity,
      book: {
        _id: item.book._id.toString(),
        title: item.book.title,
        price: item.book.price,
        image: item.book.image || "",
      },
    }));

    return { items: serializedItems, isAuthed: true };
  } catch (error) {
    console.error("CartPage SSR error:", error);
    return { items: [], isAuthed: true };
  }
}

export default async function CartPage() {
  const { items, isAuthed } = await getCart();

  // 🔐 Protect route
  if (!isAuthed) {
    redirect("/login");
  }

  const safeItems = items ?? [];

  return (
    <div className="max-w-6xl mx-auto min-h-screen">

      {/* ─── HEADER ─── */}
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

      {/* ─── EMPTY STATE ─── */}
      {safeItems.length === 0 ? (
        <div className="py-32 text-center border border-dashed border-[#8B6F47]/20 rounded-sm bg-[#8B6F47]/5">
          <span className="font-scripture text-5xl text-[#8B6F47]/20 mb-6 block">
            ❦
          </span>

          <p className="font-serif italic text-xl text-[#8B6F47]/60 mb-8">
            Your bag is currently empty.
          </p>

          <Link
            href="/books"
            className="text-[11px] font-bold uppercase tracking-[0.3em] border border-[#2B2A28] px-10 py-4 hover:bg-[#2B2A28] hover:text-[#FDFCF8] transition-all"
          >
            Return to Library
          </Link>
        </div>
      ) : (
        // ✅ NOW SAFE: plain objects only
        <CartItemsClient initialItems={safeItems} />
      )}
    </div>
  );
}
