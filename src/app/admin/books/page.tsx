import Link from "next/link";
import AdminBooksTable from "@/components/admin/AdminBooksTable";

async function getBooks() {
  // Use environment variable for the base URL to avoid hardcoding localhost
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/books`, {
    cache: "no-store",
  });

  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

export default async function AdminBooksPage() {
  const books = await getBooks();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen">
      
      {/* ─── HEADER: Clean & Balanced ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="font-serif text-4xl text-[#2B2A28] tracking-tight">
            Catalog Archive
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F47] mt-1 font-bold">
            Total Inventory: {books.length}
          </p>
        </div>

        <Link
          href="/admin/books/new"
          className="bg-[#2B2A28] text-[#FDFCF8] px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-[#1a1918] transition-all shadow-md"
        >
          + Add New Book
        </Link>
      </div>

      {/* ─── TABLE AREA: Minimalist & Focused ─── */}
      <div className="bg-[#FDFCF8] border border-[#8B6F47]/10 rounded-sm">
        {books.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-[#8B6F47]/20 m-4">
            <p className="font-serif italic text-lg text-[#8B6F47]/60">
              Your archive is currently empty.
            </p>
            <Link href="/admin/books/new" className="text-xs text-[#2B2A28] underline mt-2 block">
              Create a record
            </Link>
          </div>
        ) : (
          /* Wrap the table to ensure it doesn't feel cramped */
          <div className="p-1"> 
            <AdminBooksTable books={books} />
          </div>
        )}
      </div>
    </div>
  );
}