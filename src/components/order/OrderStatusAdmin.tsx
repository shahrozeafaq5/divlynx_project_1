"use client";

import { useState } from "react";

const STATUSES = ["pending", "shipped", "delivered", "cancelled"];

export default function OrderStatusAdmin({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);

    const res = await fetch(`/api/order/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
    } else {
      alert("Failed to update status");
    }

    setLoading(false);
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#8B6F47] mb-4">
        Fulfillment Status
      </p>

      <div className="flex gap-4 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            disabled={loading || s === status}
            onClick={() => updateStatus(s)}
            className={`px-6 py-2 text-[10px] uppercase tracking-[0.3em] border transition-all
              ${
                s === status
                  ? "bg-[#2B2A28] text-white border-[#2B2A28]"
                  : "border-[#8B6F47]/40 hover:bg-[#8B6F47]/10"
              }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
