"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <main ref={containerRef} className="bg-[#FDFCF8] text-[#1a1a1a] selection:bg-[#c4a484]/30">
      
      {/* ─── PERSISTENT VINTAGE OVERLAYS ─── */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.15] pointer-events-none z-50" />
      <div className="fixed inset-0 pointer-events-none z-50 shadow-[inset_0_0_150px_rgba(0,0,0,0.05)]" />

      {/* ─── SECTION 1: THE VESTIBULE (HERO) ─── */}
      <section className="relative h-screen flex flex-col justify-center px-8 md:px-24 overflow-hidden">
        <motion.div style={{ opacity: opacityFade }} className="absolute top-12 left-12 right-12 flex justify-between items-center z-40">
           <span className="font-serif italic text-xl tracking-tighter">B.N.</span>
           <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B6F47]">
             <Link href="/books" className="hover:text-black transition-colors">Archive</Link>
             {/* <Link href="/cart" className="hover:text-black transition-colors">The Bag</Link> */}
           </div>
        </motion.div>

        <motion.div style={{ y: titleY }} className="relative z-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5 }}
            className="flex items-center gap-6 text-[10px] tracking-[0.5em] uppercase text-[#8B6F47] mb-8"
          >
            <span className="h-px w-20 bg-[#8B6F47]/30" />
            Curators of Ancient & Modern Thought
          </motion.div>
          
          <h1 className="font-serif text-[clamp(80px,15vw,180px)] leading-[0.8] tracking-tighter italic mb-8">
            BookNest
          </h1>
          
          <div className="max-w-xl">
            <p className="text-2xl md:text-3xl font-serif italic text-[#8B6F47]/90 leading-snug mb-12">
              "A library is a place where you can lose your head and find your soul."
            </p>
            <Link href="/books" className="inline-block border border-black px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-700">
              Enter the Collection
            </Link>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.4em] text-[#8B6F47]/40"
        >
          Scroll to Explore
        </motion.div>
      </section>

      {/* ─── SECTION 2: THE SHELVES (CATEGORY REVEAL) ─── */}
      <section className="py-40 px-8 md:px-24 border-y border-[#8B6F47]/10 bg-[#8B6F47]/5">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#8B6F47] mb-6 font-bold">The Catalog</h2>
            <p className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] leading-tight mb-8">
              Every genre, a different <span className="text-[#8B6F47]">dimension.</span>
            </p>
            <p className="font-serif italic text-[#5a5a5a] text-lg leading-relaxed mb-10">
              From the heavy silence of Philosophy to the rhythmic pulse of Poetry, we categorize our archive not just by subject, but by soul.
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end gap-1">
            {[
              { title: "Philosophy", h: "h-80", c: "#2B2A28" },
              { title: "Poetry", h: "h-64", c: "#423F3A" },
              { title: "History", h: "h-96", c: "#1A1918" },
              { title: "Fiction", h: "h-72", c: "#2B2A28" },
              { title: "Art", h: "h-80", c: "#423F3A" },
            ].map((book, i) => (
              <motion.div
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className={`${book.h} w-16 bg-[#2B2A28] rounded-t-sm shadow-2xl relative group overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center p-2 rotate-180 [writing-mode:vertical-lr]">
                  <span className="text-[9px] text-[#FDFCF8]/40 uppercase tracking-[0.4em] font-medium group-hover:text-white transition-colors">
                    {book.title}
                  </span>
                </div>
                <div className="absolute top-4 left-0 w-full h-[1px] bg-[#C2A66D]/20" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: THE LIBRARIAN'S CHOICE (FEATURED) ─── */}
      <section className="py-60 px-8 md:px-24">
        <motion.div 
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="font-scripture text-5xl text-[#8B6F47]/20 block mb-8">❦</span>
          <h3 className="font-serif italic text-5xl md:text-8xl text-[#2B2A28] mb-12 tracking-tighter">
            Curated with <br /> Intent.
          </h3>
          <p className="text-xl font-serif italic text-[#5a5a5a] leading-relaxed mb-16 px-12">
            "In the digital age, the act of physical reading is a quiet rebellion. We provide the tools for that rebellion."
          </p>
          <div className="h-px w-24 bg-[#8B6F47]/30 mx-auto" />
        </motion.div>
      </section>

      {/* ─── NEW SECTION: DARK CONTACT & DISPATCH ─── */}
      <section className="bg-[#1a1918] py-32 px-8 md:px-24 relative overflow-hidden">
        {/* Subtle Background Flourish */}
        <div className="absolute top-0 right-0 font-scripture text-[20rem] text-[#FDFCF8]/5 select-none pointer-events-none translate-x-1/2 -translate-y-1/4">
          ❦
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* Correspondence Info */}
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-[#8B6F47] mb-6 font-bold">Correspondence</h2>
            <h3 className="font-serif italic text-4xl md:text-6xl text-[#FDFCF8] leading-tight mb-8">
              Write to the <br /> <span className="text-[#8B6F47]">Archivist.</span>
            </h3>
            <p className="font-serif italic text-lg text-[#FDFCF8]/60 leading-relaxed mb-12 max-w-md">
              Whether you are seeking a lost folio or wish to discuss a rare acquisition, our doors—and our ledger—are always open.
            </p>
            
            <div className="space-y-8">
              <div className="group cursor-pointer">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#8B6F47] mb-1">Electronic Dispatch</p>
                <p className="text-xl font-serif italic text-[#FDFCF8] border-b border-[#FDFCF8]/10 inline-block pb-1 group-hover:text-[#8B6F47] transition-colors">
                  email@booknest.com
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#8B6F47] mb-1">Physical Sanctuary</p>
                <p className="text-xl font-serif italic text-[#FDFCF8]">
                  westridge,Islmabad
                </p>
              </div>
            </div>
          </motion.div>

          {/* Membership Dispatch (Newsletter) */}
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            className="bg-[#2B2A28] p-10 md:p-16 border border-[#FDFCF8]/5 relative group"
          >
            {/* Stamp Detail */}
            {/* <div className="absolute top-6 right-6 text-[#8B6F47]/20 text-3xl font-serif italic select-none">
              № 2025
            </div> */}

            <h4 className="text-[11px] uppercase tracking-[0.4em] text-[#8B6F47] mb-6 font-bold">The Membership</h4>
            <p className="font-serif italic text-2xl text-[#FDFCF8] mb-10 leading-snug">
              Receive monthly chronicles of rare acquisitions.
            </p>

            <form className="space-y-6">
              <input 
                type="email" 
                placeholder="Enter your email address..."
                className="w-full bg-transparent border-b border-[#FDFCF8]/10 py-4 font-serif italic text-[#FDFCF8] outline-none focus:border-[#8B6F47] transition-all placeholder:text-[#FDFCF8]/20"
              />
              <button className="w-full py-5 bg-[#8B6F47] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#a6845d] transition-all">
                Affix Signature
              </button>
            </form>
            
            <p className="mt-8 text-[9px] uppercase tracking-[0.2em] text-[#FDFCF8]/30 italic text-center">
              Slow Browsing Guaranteed. No Spam, Just Soul.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER: THE END OF THE MANUSCRIPT ─── */}
      <footer className="py-20 px-8 border-t border-[#FDFCF8]/5 bg-[#1a1918] text-[#FDFCF8]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h4 className="font-serif italic text-3xl mb-2 tracking-tighter">BookNest</h4>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#8B6F47] font-bold">Preserving the Weight of Words</p>
          </div>
          
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold">
            <Link href="/books" className="hover:text-[#8B6F47] transition-colors underline underline-offset-8 decoration-[#8B6F47]/30">The Collection</Link>
            <Link href="/about" className="hover:text-[#8B6F47] transition-colors">Philosophy</Link>
            <Link href="/login" className="hover:text-[#8B6F47] transition-colors">Access</Link>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-mono">
            © 2025 BookNest Archive
          </div>
        </div>
      </footer>

    </main>
  );
}