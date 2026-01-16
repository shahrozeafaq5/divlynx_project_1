"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Use Next.js Link for better performance

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/login");
  };

  return (
    /* ─── CENTERING WRAPPER ─── */
    <div className="min-h-[80vh] w-full flex items-center justify-center px-6">
      
      <div className="w-full max-w-md bg-[#FDFCF8] p-10 border border-[#8B6F47]/20 shadow-sm">
        
        {/* HEADER */}
        <div className="mb-10 text-center">
          <h2 className="font-serif italic text-4xl text-[#2B2A28] mb-2">Join the Nest</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] font-bold">
            Create your Archive Credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <input
              required
              placeholder="Full Name"
              className="w-full bg-transparent border-b border-[#8B6F47]/30 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#2B2A28] transition-colors placeholder:text-[#8B6F47]/40"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <input
              required
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border-b border-[#8B6F47]/30 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#2B2A28] transition-colors placeholder:text-[#8B6F47]/40"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b border-[#8B6F47]/30 py-3 font-serif italic text-[#2B2A28] outline-none focus:border-[#2B2A28] transition-colors placeholder:text-[#8B6F47]/40"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <p className="text-[#722F37] text-[10px] uppercase tracking-widest font-bold">
              {error}
            </p>
          )}

          <button className="w-full bg-[#2B2A28] text-[#FDFCF8] py-4 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-[#1a1918] transition-all shadow-lg mt-4">
            Create Account
          </button>
        </form>

        <p className="text-[10px] mt-8 text-center uppercase tracking-widest text-[#8B6F47]">
          Already an inhabitant?{" "}
          <Link href="/login" className="text-[#2B2A28] font-bold border-b border-[#2B2A28]/20 hover:border-[#2B2A28]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}