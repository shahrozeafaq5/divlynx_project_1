import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ exists: false });
    }

    // ✅ NEXT 16 FIX: await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ exists: false });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ exists: false });
    }

    const cart = await Cart.findOne({
      user: payload.id,
      "items.book": bookId,
    }).lean();

    return NextResponse.json({ exists: Boolean(cart) });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
