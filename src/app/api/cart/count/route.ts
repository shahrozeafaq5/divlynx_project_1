import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";
import { Model } from "mongoose"; // 1. Added Model import

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // ✅ NEXT 15+ FIX: cookies() is async
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

    // 2. FIX: Cast Cart to Model<any> to resolve the 'user' TS issue
    const cart = await (Cart as Model<any>).findOne({ user: payload.id }).lean();

    const count = cart?.items?.length ?? 0;

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json({ count: 0 });
  }
}