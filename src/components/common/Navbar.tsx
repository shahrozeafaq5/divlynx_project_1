"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartCount } from "@/hooks/useCartCount";

export default function Navbar() {
  const cartCount = useCartCount();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Fetch logged-in user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-[60] w-full bg-[#FDFCF8]/90 backdrop-blur-md border-b border-[#8B6F47]/10">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 border border-[#8B6F47]/40 rounded-full flex items-center justify-center group-hover:bg-[#2B2A28] transition">
            <span className="text-[#8B6F47] group-hover:text-[#FDFCF8] font-serif font-bold text-lg">
              B
            </span>
          </div>
          <span className="font-serif italic text-xl tracking-tighter text-[#2B2A28]">
            BookNest
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink href="/books">Archive</NavLink>
          <NavLink href="/books">Books</NavLink>
          <NavLink href="/about">About</NavLink>

          {!user && (
            <NavLink href="/login" className="ml-4">
              Sign In
            </NavLink>
          )}

          {user && (
            <>
              <NavLink href="/orders">My Orders</NavLink>
              <button
                onClick={logout}
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 hover:text-red-800 transition"
              >
                Logout
              </button>
            </>
          )}

          <div className="flex items-center gap-3 pl-6 border-l border-[#8B6F47]/10">
            <Link href="/cart" className="relative flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                The Bag
              </span>
              {cartCount > 0 && (
                <span className="min-w-[16px] h-[16px] rounded-full bg-[#8B6F47] text-[#FDFCF8] text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
        >
          <span className="w-6 h-[1px] bg-[#2B2A28]" />
          <span className="w-6 h-[1px] bg-[#2B2A28]" />
          <span className="w-6 h-[1px] bg-[#2B2A28]" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-[#8B6F47]/10 bg-[#FDFCF8] px-6 py-8 space-y-6">
          <MobileLink href="/books" onClick={() => setOpen(false)}>
            Archive
          </MobileLink>
          <MobileLink href="/books" onClick={() => setOpen(false)}>
            Books
          </MobileLink>
          <MobileLink href="/about" onClick={() => setOpen(false)}>
            About
          </MobileLink>

          {!user && (
            <MobileLink href="/login" onClick={() => setOpen(false)}>
              Sign In
            </MobileLink>
          )}

          {user && (
            <>
              <MobileLink href="/orders" onClick={() => setOpen(false)}>
                My Orders
              </MobileLink>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="block text-sm font-bold uppercase tracking-widest text-red-600"
              >
                Logout
              </button>
            </>
          )}

          <MobileLink href="/cart" onClick={() => setOpen(false)}>
            The Bag {cartCount > 0 && `(${cartCount})`}
          </MobileLink>
        </div>
      )}
    </nav>
  );
}

/* ---------- SMALL HELPERS ---------- */

function NavLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B6F47] hover:text-[#2B2A28] transition ${className}`}
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-sm font-bold uppercase tracking-widest text-[#2B2A28]"
    >
      {children}
    </Link>
  );
}
