"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <section className="relative">
      {/* Hero Section with Large Typography */}
      <div className="flex flex-col md:flex-row items-baseline gap-8 mb-32 border-b border-[#8B6F47]/10 pb-20">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-scripture text-7xl md:text-9xl tracking-tighter text-[#2B2A28]"
        >
          01
        </motion.h1>
        <div>
          <h2 className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] mb-4">
            The Philosophy
          </h2>
          <p className="font-body text-[#8B6F47] uppercase tracking-[0.4em] text-xs font-bold">
            Curated with Ink & Silence — Est. 2025
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image/Visual Space */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="lg:col-span-5 aspect-[4/5] bg-[#EAE7E0] relative overflow-hidden rounded-sm group shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
          <div className="absolute inset-0 bg-[#2B2A28]/10 group-hover:bg-transparent transition-colors" />
        </motion.div>

        {/* Right Column: The Story */}
        <div className="lg:col-span-7 lg:pl-12 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="font-scripture text-2xl text-[#8B6F47]">I. The Physical Word</h3>
            <p className="text-xl leading-relaxed text-[#4A4947] font-serif italic">
              "We believe that a book is not a product, but a physical companion that demands a slower pace."
            </p>
            <p className="text-lg leading-relaxed text-[#6B6B6B]">
              In an era dominated by fleeting digital streams, BookNest stands as a sanctuary for the permanent. 
              Our collection is curated not by algorithms, but by the weight of the ideas held within 
              each spine. We choose works that deserve to be held, smelled, and lived with.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="font-scripture text-2xl text-[#8B6F47]">II. The Archive</h3>
            <p className="text-lg leading-relaxed text-[#6B6B6B]">
              Every folio on our shelves has been selected for its ability to stop time. 
              From weathered philosophy to modern poetry, we look for works that possess a soul. 
              This is a quiet place for readers who still believe that stories deserve patience.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quote Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-40 text-center py-24 border-y border-[#8B6F47]/10"
      >
        <p className="font-scripture text-3xl md:text-5xl text-[#2B2A28] max-w-4xl mx-auto leading-tight">
          "A book is a heart that only beats in the chest of another."
        </p>
      </motion.div>
    </section>
  );
}