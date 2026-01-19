"use client";

export default function RemoveFromCart({
  bookId,
  onRemoved,
}: {
  bookId: string;
  onRemoved: (bookId: string) => void;
}) {
  async function handleRemove() {
    // 🔥 Optimistic UI first
    onRemoved(bookId);

    // Background API call
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bookId }),
    });
  }

  return (
    <button
      onClick={handleRemove}
      className="text-[9px] uppercase tracking-[0.2em] text-red-800/40 hover:text-red-800 mt-2 font-bold"
    >
      Remove
    </button>
  );
}
