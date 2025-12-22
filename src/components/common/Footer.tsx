export default function Footer() {
  return (
    <footer className="relative z-10 py-16 mt-20 border-t border-[#8B6F47]/10 text-center">
      <div className="max-w-xl mx-auto px-8">
        <h2 className="font-serif italic text-xl mb-4 text-[#2B2A28]">BookNest</h2>
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#8B6F47] mb-8">
          Established in the year 2025
        </p>
        
        <div className="flex justify-center gap-8 mb-8 text-[11px] font-serif italic text-[#6B6B6B]">
          <span className="cursor-pointer hover:text-[#2B2A28]">Terms</span>
          <span className="cursor-pointer hover:text-[#2B2A28]">Privacy</span>
          <span className="cursor-pointer hover:text-[#2B2A28]">Contact</span>
        </div>

        <p className="text-[10px] text-[#A0A0A0] font-serif italic">
          © {new Date().getFullYear()} — All stories belong to their respective authors. 
          <br /> Curated with patience and ink.
        </p>
      </div>
    </footer>
  );
}