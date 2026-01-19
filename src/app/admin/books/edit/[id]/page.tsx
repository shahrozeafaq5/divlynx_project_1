"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then(setForm);
  }, [id]);

  if (!form) return <p>Loading...</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload = { ...form };
    if (typeof payload.category === "string") {
      payload.category = payload.category.toLowerCase().trim();
    }
    if (typeof payload.image === "string" && payload.image.trim() === "") {
      delete (payload as { image?: string }).image;
    }

    const res = await fetch(`/api/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error?.formErrors?.[0] || data?.error || "Failed to update book.");
      return;
    }

    router.push("/admin/books");
  }

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Edit Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-700 text-sm font-medium">
            {error}
          </p>
        )}

        {["title", "author"].map((field) => (
          <input
            key={field}
            className="w-full border p-2 rounded"
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <select
          className="w-full border p-2 rounded"
          value={form.category || ""}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="philosophy">Philosophy</option>
          <option value="poetry">Poetry</option>
          <option value="history">History</option>
          <option value="fiction">Fiction</option>
          <option value="essays">Essays</option>
        </select>

        <input
          type="url"
          placeholder="Cover image URL"
          className="w-full border p-2 rounded"
          value={form.image || ""}
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: Number(e.target.value) })
          }
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Update Book
        </button>
      </form>
    </div>
  );
}
