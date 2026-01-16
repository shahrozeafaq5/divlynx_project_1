import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; // Explicitly register User schema
import Book from "@/models/Book"; // Explicitly register Book schema
import { requireAdmin } from "@/lib/auth-guard";
import { isSameOriginRequest } from "@/lib/security";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await requireAdmin(req);

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
    const status =
      error?.message === "Unauthorized"
        ? 401
        : error?.message === "Forbidden"
        ? 403
        : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
