import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; // Explicitly register User schema
import Book from "@/models/Book"; // Explicitly register Book schema
import { requireAdmin } from "@/lib/auth-guard";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(req);
    // If requireAdmin returns a response (like 401/403), return it immediately
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { id } = await params; // Await params for Next.js 16
    const { status } = await req.json();

    await connectDB();
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user items.book");

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}