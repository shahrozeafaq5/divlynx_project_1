"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCart({ bookId }: { bookId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity: 1 }),
      });

      if (res.status === 401) {
        alert("Please login to add items to your collection");
        router.push("/login");
        return;
      }

      if (res.ok) {
        // We will keep the alert for now, but the UI styling is updated
        alert("Item archived in your bag.");
        router.refresh(); 
      } else {
        alert("Archive entry failed.");
      }
    } catch (error) {
      console.error("Archive Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`
        w-full py-4 px-6 
        flex items-center justify-center gap-3
        text-[10px] font-bold uppercase tracking-[0.3em]
        transition-all duration-500 ease-out
        relative overflow-hidden
        ${loading 
          ? "bg-[#8B6F47]/20 text-[#8B6F47] cursor-not-allowed" 
          : "bg-[#2B2A28] text-[#FDFCF8] hover:bg-[#8B6F47] active:scale-[0.98]"
        }
      `}
    >
      {/* Subtle Flourish Icon */}
      {!loading && <span className="text-lg opacity-40 font-serif">❧</span>}
      
      <span>
        {loading ? "Processing..." : "Add to Collection"}
      </span>

      {/* Background Texture Overlay to make the button look like inked paper */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none" />
    </button>
  );
}