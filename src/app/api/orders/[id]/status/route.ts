import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; 
import Book from "@/models/Book"; 
import { requireAdmin } from "@/lib/auth-guard";
import { isSameOriginRequest } from "@/lib/security";
import { Model } from "mongoose"; // 1. Added Model import

export const dynamic = "force-dynamic"; // Ensure Vercel doesn't cache this

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Basic Security Check
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Auth Check - Ensure this is an admin request
    await requireAdmin(req);

    // 3. In Next.js 15, params is a Promise and MUST be awaited
    const { id } = await params; 
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    await connectDB();

    // 4. FIX: Cast Order to Model<any> to fix the TypeScript error
    // Also use populate correctly to ensure User and Book models are linked
    const updatedOrder = await (Order as Model<any>).findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate([
      { path: "user", model: User },
      { path: "items.book", model: Book }
    ]);

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 5. Serialize the response to plain JSON
    return NextResponse.json(JSON.parse(JSON.stringify(updatedOrder)));

  } catch (error: any) {
    console.error("ORDER_PATCH_ERROR:", error);
    
    const statusCode =
      error?.message === "Unauthorized"
        ? 401
        : error?.message === "Forbidden"
        ? 403
        : 500;

    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: statusCode }
    );
  }
}