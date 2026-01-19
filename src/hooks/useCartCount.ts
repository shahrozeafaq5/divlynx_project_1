"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useCartCount() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  async function fetchCount() {
    try {
      const res = await fetch("/api/cart/count", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      setCount(data.count || 0);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => {
    fetchCount();
  }, [pathname]);

  useEffect(() => {
    const handler = () => fetchCount();
    window.addEventListener("cart-updated", handler);

    return () => {
      window.removeEventListener("cart-updated", handler);
    };
  }, []);

  return count;
}
