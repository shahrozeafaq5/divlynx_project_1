"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <section className="relative min-h-screen bg-[#FDFCF8] text-[#1a1a1a] selection:bg-[#c4a484]/30 overflow-hidden">
      
      {/* ─── VINTAGE OVERLAYS ─── */}
      {/* Film Grain/Parchment Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.2] pointer-events-none z-10" />
      
      {/* Vignette (Darkened Edges) */}
      <div className="absolute inset-0 bg-radial-gradient(circle, transparent 40%, rgba(43,42,40,0.05) 100%) pointer-events-none z-10" />

      <div className="relative max-w-6xl mx-auto px-8 py-20 z-20">
        
        {/* ─── LOGO / TOP NAV ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-24"
        >
          <div className="font-serif italic text-xl tracking-tighter">B.N.</div>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-medium text-[#8B6F47]">
            <Link href="/login" className="hover:text-black transition-colors">Archive</Link>
            <Link href="/cart" className="hover:text-black transition-colors">The Bag</Link>
          </div>
        </motion.div>

        {/* ─── HEADER LINE ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="mb-12 flex items-center gap-6 text-[10px] tracking-[0.5em] uppercase text-[#8B6F47]"
        >
          <span className="h-px w-24 bg-[#8B6F47]/30" />
          Established in the Year 2025
        </motion.div>

        {/* ─── MAIN TITLE ─── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h1 className="font-serif text-[clamp(64px,10vw,120px)] leading-[0.9] tracking-tighter italic">
            BookNest
          </h1>
          <p className="mt-4 font-serif text-2xl text-[#8B6F47]/80 italic tracking-tight">
            Curators of Ink & Silence
          </p>
        </motion.div>

        {/* ─── DESCRIPTION ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.5 }}
          className="max-w-md"
        >
          <p className="text-lg text-[#5a5a5a] leading-relaxed font-serif italic mb-12">
            "A book is a heart that only beats in the chest of another." 
            We are a small, quiet sanctuary for those who still find solace in the turning of a physical page.
          </p>
          
          {/* ─── ACTIONS ─── */}
          <div className="flex items-center gap-10">
            <Link
              href="/books"
              className="group relative text-sm font-bold uppercase tracking-[0.2em] pb-2 overflow-hidden"
            >
              <span>Enter the Library</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            </Link>

            <Link
              href="/about"
              className="text-[11px] uppercase tracking-[0.2em] text-[#8B6F47] hover:text-black transition-colors"
            >
              Our Philosophy
            </Link>
          </div>
        </motion.div>

        {/* ─── THE SHELF (DYNAMIC VISUAL) ─── */}
        <div className="mt-32 relative">
          <div className="absolute bottom-0 w-full h-[2px] bg-[#8B6F47]/20" />
          
          <div className="flex items-end gap-[2px]">
            {[
              { title: "Philosophy", h: "h-72", c: "#2B2A28" },
              { title: "Poetry", h: "h-64", c: "#423F3A" },
              { title: "History", h: "h-80", c: "#1A1918" },
              { title: "Fiction", h: "h-72", c: "#2B2A28" },
              { title: "Essays", h: "h-56", c: "#3D3A35" },
              { title: "Art", h: "h-80", c: "#423F3A" },
            ].map((book, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 1 }}
                whileHover={{ y: -20, scale: 1.02 }}
                className={`${book.h} w-14 relative cursor-pointer group rounded-t-[4px] shadow-2xl transition-all`}
                style={{ backgroundColor: book.c }}
              >
                {/* Book Spine Text */}
                <div className="absolute inset-0 flex items-center justify-center p-2 rotate-180 [writing-mode:vertical-lr]">
                  <span className="text-[10px] text-[#FDFCF8]/60 uppercase tracking-[0.3em] font-medium group-hover:text-white transition-colors">
                    {book.title}
                  </span>
                </div>
                
                {/* Gold Foil Accent at top of spine */}
                <div className="absolute top-4 left-0 w-full h-[1px] bg-[#C2A66D]/30" />
                <div className="absolute top-6 left-0 w-full h-[1px] bg-[#C2A66D]/30" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── FOOTER NOTE ─── */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2 }}
          className="mt-20 text-[9px] uppercase tracking-[0.4em] text-center italic"
        >
          Slow Browsing Encouraged — No Algorithms, Just Soul.
        </motion.div>

      </div>
    </section>
  );
}