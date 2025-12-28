import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";


export const dynamic = "force-dynamic";

type CartItem = {
  quantity?: number;
};

export async function GET() {
  try {
    await connectDB();

    // ✅ cookies() is async in Next 16
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ count: 0 });
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json({ count: 0 });
    }

    if (!payload?.id) {
      return NextResponse.json({ count: 0 });
    }

    const cart = await Cart.findOne({ user: payload.id }).lean();

const count = cart?.items?.length ?? 0;


    return NextResponse.json({ count });
  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
