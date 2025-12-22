"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar({ user }: { user: any }) {
  return (
    <nav className="fixed top-0 z-[60] w-full h-24 flex items-center bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#8B6F47]/10">
      <div className="max-w-6xl mx-auto w-full px-8 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 border border-[#8B6F47]/40 rounded-full flex items-center justify-center transition-all group-hover:bg-[#2B2A28] group-hover:border-transparent">
             <span className="text-[#8B6F47] group-hover:text-[#FDFCF8] font-serif font-bold text-xl transition-colors">B</span>
          </div>
          <span className="font-serif italic text-2xl tracking-tighter">BookNest</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-12">
          {["Books", "Orders", "About"].map((item) => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8B6F47] hover:text-[#2B2A28] transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#2B2A28] transition-all group-hover:w-full" />
            </Link>
          ))}
          
          <div className="h-4 w-[1px] bg-[#8B6F47]/20" />

          {user ? (
            <Link href="/cart" className="flex items-center gap-3 group">
               <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2B2A28]">The Bag</span>
               <div className="px-2 py-0.5 border border-[#2B2A28] rounded-full text-[10px] font-serif italic font-bold">
                 0
               </div>
            </Link>
          ) : (
            <Link href="/login" className="text-[11px] font-bold uppercase tracking-[0.2em] border border-[#2B2A28] px-6 py-2 rounded-sm hover:bg-[#2B2A28] hover:text-[#FDFCF8] transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}