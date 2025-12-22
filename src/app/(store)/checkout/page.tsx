"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      if (res.ok) {
        // Updated wording for the alert
        alert("The archival record has been committed. Your folios are on their way.");
        router.push("/orders"); 
      } else {
        const data = await res.json();
        alert(data.error || "The acquisition could not be authorized at this time.");
      }
    } catch (error) {
      alert("A system error occurred during the archival process.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* ─── PAGE HEADER ─── */}
      <header className="flex flex-col md:flex-row items-baseline gap-8 mb-24 border-b border-[#8B6F47]/10 pb-16">
        <h1 className="font-scripture text-7xl md:text-9xl tracking-tighter text-[#2B2A28] opacity-10">
          04
        </h1>
        <div className="max-w-2xl">
          <h2 className="font-serif italic text-4xl md:text-6xl text-[#2B2A28] mb-6">
            Final <span className="text-[#8B6F47]">Authorization</span>
          </h2>
          <p className="font-serif italic text-lg text-[#6B6B6B] leading-relaxed">
            By authorizing this acquisition, you are committing these works to your 
            permanent collection. Please verify the manifest before finalization.
          </p>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#8B6F47]/5 border border-[#8B6F47]/10 p-12 relative overflow-hidden text-center"
      >
        {/* Decorative Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-scripture text-[12rem] text-[#8B6F47]/5 pointer-events-none select-none">
          BN
        </div>

        <span className="font-scripture text-4xl text-[#8B6F47]/20 block mb-6">❦</span>
        
        <h3 className="font-serif italic text-2xl text-[#2B2A28] mb-4">Terms of Acquisition</h3>
        <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-md mx-auto mb-12 font-serif italic">
          Upon confirmation, our archivists will begin preparing your folios for safe transit. 
          Payment will be collected upon arrival at your residence.
        </p>
        
        {/* Payment Detail Styled as a Library Card Entry */}
        <div className="max-w-xs mx-auto mb-16 py-6 border-y border-[#8B6F47]/20 flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B6F47] mb-2">Payment Protocol</span>
          <span className="font-serif italic text-xl text-[#2B2A28]">Cash on Delivery</span>
          <span className="text-[9px] text-[#A0A0A0] uppercase tracking-[0.2em] mt-1 italic">(Simulated Record)</span>
        </div>

        {/* ─── THE ARCHIVIST'S STAMP (BUTTON) ─── */}
        <div className="relative group max-w-xs mx-auto">
          <div className="absolute inset-0 bg-[#8B6F47]/20 translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`
              relative w-full py-5 px-8
              text-[11px] font-bold uppercase tracking-[0.4em]
              transition-all duration-500
              ${loading 
                ? "bg-[#8B6F47]/20 text-[#8B6F47] cursor-not-allowed" 
                : "bg-[#2B2A28] text-[#FDFCF8] hover:bg-[#8B6F47]"
              }
            `}
          >
            {loading ? "Authorizing..." : "Authorize Acquisition"}
          </button>
        </div>

        <p className="mt-8 text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0] font-serif italic">
          Verba Volant, Scripta Manent
        </p>
      </motion.div>

      {/* ─── BOTTOM DECORATION ─── */}
      <div className="mt-24 text-center">
        <div className="h-px w-24 bg-[#8B6F47]/20 mx-auto mb-8" />
        <p className="text-[10px] text-[#C0C0C0] uppercase tracking-[0.5em]">
          BookNest Sanctuary Archivist Office
        </p>
      </div>
    </div>
  );
}