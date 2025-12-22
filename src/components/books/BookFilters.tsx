"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
const CATEGORIES = ["All", "Philosophy", "Poetry", "History", "Fiction", "Essays"];

export default function BookFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/books?${params.toString()}`);
  };

  return (
    <div className="mb-20 pb-6 border-b border-[#8B6F47]/20">
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            className={`text-[11px] font-bold uppercase tracking-[0.3em] transition-all relative group ${
              currentCategory === cat ? "text-[#2B2A28]" : "text-[#8B6F47]/60 hover:text-[#2B2A28]"
            }`}
          >
            {cat}
            {/* Active Indicator: A subtle dot beneath the text */}
            {currentCategory === cat && (
              <motion.div 
                layoutId="activeFilter"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8B6F47] rounded-full"
              />
            )}
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#2B2A28]/20 transition-all group-hover:w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}