import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";
import { Model } from "mongoose"; // 1. Added Model import

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ exists: false });
    }

    // ✅ NEXT 15+ FIX: await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ exists: false });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ exists: false });
    }

    // 2. FIX: Cast Cart to Model<any> to resolve the 'user' TS issue
    const cart = await (Cart as Model<any>).findOne({
      user: payload.id,
      "items.book": bookId,
    }).lean();

    return NextResponse.json({ exists: Boolean(cart) });
  } catch (error) {
    console.error("Cart check error:", error);
    return NextResponse.json({ exists: false });
  }
}