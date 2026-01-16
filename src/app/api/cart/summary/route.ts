import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ items: [], total: 0 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ items: [], total: 0 });

    const cart = await Cart.findOne({ user: payload.id })
      .populate("items.book")
      .lean();

    if (!cart) return NextResponse.json({ items: [], total: 0 });

    const items = cart.items.slice(0, 3).map((item: any) => ({
      id: item.book._id.toString(),
      title: item.book.title,
      price: item.book.price,
      image: item.book.image,
      quantity: item.quantity,
    }));

    const total = cart.items.reduce(
      (sum: number, i: any) => sum + i.book.price * i.quantity,
      0
    );

    return NextResponse.json({ items, total });
  } catch {
    return NextResponse.json({ items: [], total: 0 });
  }
}
