import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Book from "@/models/Book"; 
import { verifyToken } from "@/lib/auth.token";
import { isSameOriginRequest } from "@/lib/security";
import { cookies } from "next/headers"; // Added for Next.js 15
import { Model } from "mongoose";      // Added for Type Casting

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    
    // 1. Get Token using Next.js 15 async API
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Access Denied: No token found" }, { status: 401 });
    }
    
    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Access Denied: Invalid signature" }, { status: 401 });
    }

    // 2. Fetch and Populate Manifest (Cart)
    // FIX: Cast to Model<any> to resolve 'user' property issue
    const cart = await (Cart as Model<any>).findOne({ user: payload.id })
      .populate({ path: "items.book", model: Book });
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "The acquisition manifest is empty" }, { status: 400 });
    }

    // 3. Calculate Total
    const totalPrice = cart.items.reduce((acc: number, item: any) => {
      if (!item.book) return acc; 
      return acc + (item.book.price * item.quantity);
    }, 0);

    // 4. Prepare Order Items
    const orderItems = cart.items
      .filter((item: any) => item.book !== null)
      .map((item: any) => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.book.price, 
      }));

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "No valid folios found in manifest" }, { status: 400 });
    }

    // 5. Commit to Archive (Order)
    const newOrder = await (Order as Model<any>).create({
      user: payload.id,
      items: orderItems,
      totalPrice,
      status: "pending",
    });

    // 6. Clear Manifest (Cart)
    // FIX: Passing 3rd argument {} and casting to fix "Expected 3 arguments"
    await (Cart as Model<any>).findOneAndUpdate(
      { user: payload.id }, 
      { $set: { items: [] } }, 
      { new: true } // 3rd argument: options
    );

    return NextResponse.json({ 
      message: "Archive record created successfully", 
      orderId: newOrder._id.toString() 
    }, { status: 200 });

  } catch (error: any) {
    console.error("ARCHIVE SYSTEM ERROR:", error.message);
    return NextResponse.json({ 
      error: "Authorization failed", 
      details: error.message 
    }, { status: 500 });
  }
}