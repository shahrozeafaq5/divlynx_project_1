"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NewBookPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });

    router.push("/admin/books");
  }

  if (!mounted) return <div className="min-h-screen bg-[#FDFCF8]" />;

  return (
    <main className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* ─── VINTAGE BACKGROUND OVERLAYS ─── */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.15] pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.03)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-[#FDFCF8] border border-[#8B6F47]/20 p-10 md:p-16 relative z-10 shadow-[20px_20px_60px_rgba(0,0,0,0.02)]"
      >
        {/* HEADER */}
        <div className="mb-12 text-center">
          <span className="font-scripture text-4xl text-[#8B6F47]/40 block mb-4">❦</span>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#2B2A28] tracking-tighter mb-2">
            New Acquisition
          </h1>
          <p className="font-serif italic text-[#8B6F47] text-sm uppercase tracking-[0.3em]">
            Entry into the Archive
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* TEXT FIELDS */}
            {[
              { label: "Book Title", key: "title", placeholder: "e.g. The Republic" },
              { label: "Author", key: "author", placeholder: "e.g. Plato" },
              { label: "Category", key: "category", placeholder: "e.g. Philosophy" },
            ].map((field) => (
              <div key={field.key} className={field.key === "title" ? "md:col-span-2" : ""}>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B6F47] mb-3">
                  {field.label}
                </label>
                <input
                  type="text"
                  required
                  placeholder={field.placeholder}
                  className="w-full bg-transparent border-b border-[#8B6F47]/20 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#8B6F47] transition-all placeholder:text-[#8B6F47]/20"
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            ))}

            {/* NUMERIC FIELDS */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B6F47] mb-3">
                Price (USD)
              </label>
              <input
                type="number"
                required
                placeholder="0.00"
                className="w-full bg-transparent border-b border-[#8B6F47]/20 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#8B6F47] transition-all placeholder:text-[#8B6F47]/20"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B6F47] mb-3">
                Stock Count
              </label>
              <input
                type="number"
                required
                placeholder="Qty"
                className="w-full bg-transparent border-b border-[#8B6F47]/20 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#8B6F47] transition-all placeholder:text-[#8B6F47]/20"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-8 flex flex-col md:flex-row gap-4">
            <button 
              type="submit"
              className="flex-1 bg-[#2B2A28] text-[#FDFCF8] py-5 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-[#1a1918] transition-all duration-500 shadow-lg shadow-black/5"
            >
              Add to Collection
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-8 py-5 border border-[#2B2A28]/10 text-[#2B2A28]/40 text-[11px] font-bold uppercase tracking-[0.4em] hover:text-[#2B2A28] transition-all duration-500"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* FOOTER DECORATION */}
        <div className="mt-12 flex justify-center opacity-20">
          <div className="h-px w-12 bg-[#8B6F47]" />
          <span className="mx-4 text-xs font-serif italic text-[#8B6F47]">Archive Entry</span>
          <div className="h-px w-12 bg-[#8B6F47]" />
        </div>
      </motion.div>
    </main>
  );
}