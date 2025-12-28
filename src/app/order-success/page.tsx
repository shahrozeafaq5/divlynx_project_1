"use client";
import { useState, useEffect } from "react"; // Added hooks
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  // 1. Create a state for the record number
  const [recordNumber, setRecordNumber] = useState<number | null>(null);

  // 2. Only generate the number once the component mounts (on the client)
  useEffect(() => {
    setRecordNumber(Math.floor(Math.random() * 10000));
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full text-center relative"
      >
        {/* ... existing decorative elements and content ... */}
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <span className="font-scripture text-[15rem] md:text-[20rem] text-[#8B6F47]/5 select-none pointer-events-none">
            Finis
          </span>
        </div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          className="font-scripture text-5xl text-[#8B6F47] mb-8"
        >
          ❦
        </motion.div>

        <h1 className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] mb-6 tracking-tight">
          Acquisition Successful
        </h1>
        
        <div className="h-px w-24 bg-[#8B6F47]/20 mx-auto mb-8" />

        <p className="font-serif italic text-lg md:text-xl text-[#5a5a5a] leading-relaxed mb-12 max-w-md mx-auto">
          "The ledger has been updated. Your selected folios are being prepared for dispatch with the utmost care."
        </p>

        {/* Status Box */}
        <div className="bg-[#8B6F47]/5 border border-[#8B6F47]/10 p-8 mb-12 rounded-sm inline-block w-full">
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] mb-2 font-bold">Dispatch Status</p>
              <p className="font-serif italic text-[#2B2A28]">Awaiting Packaging</p>
            </div>
            <div className="h-px md:h-10 w-full md:w-px bg-[#8B6F47]/20" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] mb-2 font-bold">Est. Delivery</p>
              <p className="font-serif italic text-[#2B2A28]">3 — 5 Business Days</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/books" className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#8B6F47] hover:text-[#2B2A28] transition-colors border-b border-[#8B6F47]/20 pb-1">
            Return to Archive
          </Link>
          <span className="hidden sm:block text-[#8B6F47]/30 text-xs">|</span>
          <Link href="/" className="px-10 py-4 bg-[#2B2A28] text-[#FDFCF8] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#1a1918] transition-all shadow-xl">
            Back to Vestibule
          </Link>
        </div>

        {/* BOTTOM DETAIL: Fixed for Hydration */}
        <p className="mt-16 text-[9px] uppercase tracking-[0.5em] text-[#8B6F47]/40">
          Official Record № {recordNumber || "...."} — Est. 2025
        </p>
      </motion.div>
    </div>
  );
}