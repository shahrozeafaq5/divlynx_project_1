"use client";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function HomePage() {
  const containerRef = useRef(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix for potential hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 200]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -120]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  if (!mounted) return <div className="bg-[#FDFCF8] min-h-screen" />;

  return (
    <main ref={containerRef} className="bg-[#FDFCF8] text-[#2B2A28] selection:bg-[#8B6F47]/20 overflow-x-hidden min-h-screen">
      
      {/* ─── PERSISTENT VINTAGE OVERLAYS ─── */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.12] pointer-events-none z-50" />
      <div className="fixed inset-0 pointer-events-none z-40 shadow-[inset_0_0_150px_rgba(0,0,0,0.08)]" />

      {/* ─── SECTION 1: THE VESTIBULE (HERO) ─── */}
      <section className="relative h-screen flex flex-col justify-center px-8 md:px-24 overflow-hidden bg-[#FDFCF8]">
        
        {/* HERO BACKGROUND IMAGE LAYER */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2940&auto=format&fit=crop"
            alt="Moody Library Archive Stacks"
            fill
            className={`object-cover grayscale-[50%] sepia-[15%] contrast-[1.1] transition-opacity duration-1000 ${heroLoaded ? 'opacity-45' : 'opacity-0'}`}
            priority
            onLoadingComplete={() => setHeroLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF8]/95 via-[#FDFCF8]/40 to-[#FDFCF8]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCF8]/60 via-transparent to-transparent hidden md:block" />
        </motion.div>

        {/* HERO NAVIGATION */}
        <motion.div style={{ opacity: opacityFade }} className="absolute top-12 left-12 right-12 flex justify-between items-center z-40">
           <span className="font-serif italic text-xl tracking-tighter text-[#2B2A28]">B.N.</span>
           <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B6F47]">
             <Link href="/books" className="hover:text-black transition-colors">Archive</Link>
             <Link href="/login" className="hover:text-black transition-colors">Access</Link>
           </div>
        </motion.div>

        {/* HERO MAIN CONTENT */}
        <AnimatePresence>
          {heroLoaded && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ y: titleY }} 
              className="relative z-20"
            >
              <div className="flex items-center gap-6 text-[10px] tracking-[0.5em] uppercase text-[#8B6F47] mb-8 font-bold">
                <span className="h-px w-20 bg-[#8B6F47]/40" />
                Curators of Ancient & Modern Thought
              </div>
              
              <h1 className="font-serif text-[clamp(70px,13vw,180px)] leading-[0.8] tracking-tighter italic mb-8 text-[#2B2A28] drop-shadow-[0_4px_12px_rgba(253,252,248,1)]">
                BookNest
              </h1>
              
              <div className="max-w-xl">
                <p className="text-2xl md:text-3xl font-serif italic text-[#3D3B38] leading-snug mb-12 drop-shadow-sm">
                  "A library is a place where you can lose your head and find your soul."
                </p>
                <Link href="/books" className="inline-block border-2 border-[#2B2A28] px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-[#2B2A28] hover:bg-[#2B2A28] hover:text-[#FDFCF8] transition-all duration-700 shadow-sm">
                  Enter the Collection
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.4em] text-[#8B6F47] z-30 font-bold"
        >
          Scroll to Explore
        </motion.div>
      </section>

      {/* ─── SECTION 2: THE SHELVES ─── */}
      <section className="relative z-10 py-40 px-8 md:px-24 border-y border-[#8B6F47]/10 bg-[#8B6F47]/5">
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
              { title: "Philosophy", h: "h-80" },
              { title: "Poetry", h: "h-64" },
              { title: "History", h: "h-96" },
              { title: "Fiction", h: "h-72" },
              { title: "Art", h: "h-80" },
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

      {/* ─── SECTION 3: THE LIBRARIAN'S CHOICE ─── */}
      <section className="relative z-10 py-60 px-8 md:px-24 overflow-hidden bg-[#FDFCF8]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2940&auto=format&fit=crop"
            alt="Study Aesthetic"
            fill
            className="object-cover opacity-30 grayscale-[30%] sepia-[10%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF8]/95 via-[#FDFCF8]/60 to-[#FDFCF8]" />
        </div>

        <motion.div 
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto text-center relative z-20"
        >
          <span className="font-scripture text-5xl text-[#8B6F47]/30 block mb-8">❦</span>
          <h3 className="font-serif italic text-5xl md:text-8xl text-[#2B2A28] mb-12 tracking-tighter drop-shadow-sm">
            Curated with <br /> Intent.
          </h3>
          <p className="text-xl font-serif italic text-[#3D3B38] leading-relaxed mb-16 px-12 drop-shadow-sm">
            "In the digital age, the act of physical reading is a quiet rebellion. We provide the tools for that rebellion."
          </p>
          <div className="h-px w-24 bg-[#8B6F47]/40 mx-auto" />
        </motion.div>
      </section>

      {/* ─── SECTION 4: CONTACT & MEMBERSHIP ─── */}
      <section className="relative z-10 bg-[#1a1918] py-32 px-8 md:px-24 overflow-hidden">
        <div className="absolute top-0 right-0 font-scripture text-[20rem] text-[#FDFCF8]/5 select-none pointer-events-none translate-x-1/2 -translate-y-1/4">
          ❦
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
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
            
            <div className="space-y-8">
              <div className="group cursor-pointer">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#8B6F47] mb-1">Electronic Dispatch</p>
                <p className="text-xl font-serif italic text-[#FDFCF8] border-b border-[#FDFCF8]/10 inline-block pb-1 group-hover:text-[#8B6F47] transition-colors">
                  email@booknest.com
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#8B6F47] mb-1">Physical Sanctuary</p>
                <p className="text-xl font-serif italic text-[#FDFCF8]">westridge, Islamabad</p>
              </div>
            </div>
          </motion.div>

          <div className="bg-[#2B2A28] p-10 md:p-16 border border-[#FDFCF8]/5 relative z-10">
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
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 py-20 px-8 border-t border-[#FDFCF8]/5 bg-[#1a1918] text-[#FDFCF8]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h4 className="font-serif italic text-3xl mb-2 tracking-tighter">BookNest</h4>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#8B6F47] font-bold">Preserving the Weight of Words</p>
          </div>
          
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold">
            <Link href="/books" className="hover:text-[#8B6F47] transition-colors">The Collection</Link>
            <Link href="/about" className="hover:text-[#8B6F47] transition-colors">Philosophy</Link>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 font-mono">
            © 2025 BookNest Archive
          </div>
        </div>
      </footer>
    </main>
  );
}
