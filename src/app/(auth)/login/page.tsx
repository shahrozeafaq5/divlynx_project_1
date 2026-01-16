"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Access Denied");
      }

      // Refresh to update Navbar state and redirect
      router.refresh(); 
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/books");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    /* ─── CENTERING WRAPPER ─── */
    <main className="min-h-[85vh] flex items-center justify-center px-6">
      
      <div className="w-full max-w-md bg-[#FDFCF8] p-10 border border-[#8B6F47]/20 shadow-sm">
        
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h2 className="font-serif italic text-4xl text-[#2B2A28] mb-2">Welcome Back</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] font-bold">
            Access the Archive Ledger
          </p>
        </div>

        {error && (
          <p className="text-[#722F37] text-[10px] uppercase tracking-widest font-bold mb-6 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-1">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-[#8B6F47]/30 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#2B2A28] transition-colors placeholder:text-[#8B6F47]/40"
              required
            />
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[#8B6F47]/30 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#2B2A28] transition-colors placeholder:text-[#8B6F47]/40"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2B2A28] text-[#FDFCF8] py-4 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-[#1a1918] transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter Archive"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-[#8B6F47]/10 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#8B6F47]">
            First time at the Nest?{" "}
            <Link href="/register" className="text-[#2B2A28] font-bold border-b border-[#2B2A28]/20 hover:border-[#2B2A28]">
              Register Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}