"use client";
import { motion, Variants } from "framer-motion";

export default function AboutPage() {
  // Explicitly typing the variants to satisfy TypeScript
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] // Framer Motion accepts this, but TS needs the Variants type hint
      } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  return (
    <section className="relative px-4">
      {/* ─── HERO SECTION ─── */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="flex flex-col md:flex-row items-baseline gap-8 mb-32 border-b border-[#8B6F47]/10 pb-20"
      >
        <motion.h1 
          variants={fadeInUp}
          className="font-scripture text-7xl md:text-9xl tracking-tighter text-[#2B2A28]"
        >
          01
        </motion.h1>
        <div className="overflow-hidden">
          <motion.h2 
            variants={fadeInUp}
            className="font-serif italic text-4xl md:text-7xl text-[#2B2A28] mb-4 tracking-tight"
          >
            The Philosophy
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="font-body text-[#8B6F47] uppercase tracking-[0.5em] text-[10px] font-bold"
          >
            Curated with Ink & Silence — Est. 2025
          </motion.p>
        </div>
      </motion.div>

      {/* ─── CONTENT GRID ─── */}
      <div className="grid lg:grid-cols-12 gap-20 items-start">
        
        {/* Visual Column */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="lg:col-span-5 aspect-[4/6] bg-[#EAE7E0] relative overflow-hidden shadow-[40px_40px_100px_rgba(0,0,0,0.08)] group"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-[2s] ease-out scale-110 group-hover:scale-100" />
          <div className="absolute inset-0 bg-[#2B2A28]/20 mix-blend-multiply group-hover:bg-transparent transition-colors duration-1000" />
          <div className="absolute bottom-8 right-8 text-white/40 font-scripture text-4xl">❦</div>
        </motion.div>

        {/* Narrative Column */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-7 lg:pl-12 space-y-20"
        >
          <motion.div variants={fadeInUp} className="space-y-8">
            <h3 className="font-scripture text-3xl text-[#8B6F47]">I. The Physical Word</h3>
            <div className="space-y-6">
              <p className="text-2xl md:text-3xl leading-relaxed text-[#2B2A28] font-serif italic tracking-tight">
                "We believe that a book is not a product, but a physical companion that demands a slower pace."
              </p>
              <p className="text-lg leading-relaxed text-[#5a5a5a] font-serif italic">
                In an era dominated by fleeting digital streams, BookNest stands as a sanctuary for the permanent. 
                Our collection is curated not by algorithms, but by the weight of the ideas held within 
                each spine. We choose works that deserve to be held, smelled, and lived with.
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-8">
            <h3 className="font-scripture text-3xl text-[#8B6F47]">II. The Archive</h3>
            <p className="text-lg leading-relaxed text-[#5a5a5a] font-serif italic">
              Every folio on our shelves has been selected for its ability to stop time. 
              From weathered philosophy to modern poetry, we look for works that possess a soul. 
              This is a quiet place for readers who still believe that stories deserve patience.
            </p>
            <div className="h-px w-24 bg-[#8B6F47]/30" />
          </motion.div>
        </motion.div>
      </div>

      {/* ─── QUOTE SECTION ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mt-60 text-center py-40 border-y border-[#8B6F47]/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 font-scripture text-[20rem] text-[#8B6F47]/5 select-none pointer-events-none">
          Archive
        </div>
        <p className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] max-w-4xl mx-auto leading-[1.1] relative z-10 tracking-tighter">
          "A book is a heart that only beats in the chest of another."
        </p>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-px bg-[#8B6F47] mx-auto mt-12"
        />
      </motion.div>
    </section>
  );
}