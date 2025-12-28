"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RemoveFromCart from "./RemoveFromCart";

type CartItem = {
  book: {
    _id: string;
    title: string;
    price: number;
    image?: string;
  };
  quantity: number;
};

export default function CartItemsClient({
  initialItems,
}: {
  initialItems: CartItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (acc, item) => acc + item.book.price * item.quantity,
    0
  );

  function handleRemove(bookId: string) {
    // ✅ Optimistic update
    setItems((prev) => prev.filter((i) => i.book._id !== bookId));

    // 🔥 Update navbar badge
    window.dispatchEvent(new Event("cart-updated"));
  }

  async function finalizeAcquisition() {
    if (items.length === 0) return;

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
    });

    if (!res.ok) {
      setLoading(false);
      alert("Failed to finalize acquisition");
      return;
    }

    // Navbar badge reset (cart cleared on server)
    window.dispatchEvent(new Event("cart-updated"));

    router.push("/order-success");
  }

  return (
    <div className="grid lg:grid-cols-12 gap-16 items-start">
      {/* ITEMS */}
      <div className="lg:col-span-8 space-y-10">
        {items.map((item) => (
          <div
            key={item.book._id}
            className="group flex items-center justify-between pb-10 border-b border-[#8B6F47]/10"
          >
            <div className="flex items-center gap-8">
              <div className="w-20 h-28 bg-[#EAE7E0] border border-[#8B6F47]/10 overflow-hidden">
                {item.book.image && (
                  <img
                    src={item.book.image}
                    alt={item.book.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                )}
              </div>

              <div>
                <h3 className="font-serif italic text-2xl">
                  {item.book.title}
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-serif italic text-2xl">
                ${(item.book.price * item.quantity).toFixed(2)}
              </p>

              <RemoveFromCart
                bookId={item.book._id}
                onRemoved={handleRemove}
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="italic text-[#8B6F47]/60">
            Your bag is now empty.
          </p>
        )}
      </div>

      {/* SUMMARY */}
      <aside className="lg:col-span-4">
        <div className="bg-[#8B6F47]/5 p-10 border border-[#8B6F47]/10 sticky top-40">
          <h2 className="font-serif italic text-2xl mb-8">
            Order Ledger
          </h2>

          <div className="flex justify-between mb-6 text-[11px] uppercase tracking-[0.2em]">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={finalizeAcquisition}
            disabled={loading || items.length === 0}
            className="w-full py-5 bg-[#2B2A28] text-white uppercase tracking-[0.3em] text-[11px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Finalizing…" : "Finalize Acquisition"}
          </button>
        </div>
      </aside>
    </div>
  );
}
