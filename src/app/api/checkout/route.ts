import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Book from "@/models/Book"; 
import { verifyToken } from "@/lib/auth.token";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    
    // Ensure Book model is registered
    if (!Book) {
      console.error("Archive Error: Book model not found");
    }

    // 1. Get User ID from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Access Denied: No token found" }, { status: 401 });
    }
    
    const payload = await verifyToken(token);
    
    // FIXED: Changed 'return null' to a proper NextResponse
    if (!payload) {
      return NextResponse.json({ error: "Access Denied: Invalid signature" }, { status: 401 });
    }

    // 2. Find the user's manifest (cart) and populate
    const cart = await Cart.findOne({ user: payload.id }).populate("items.book");
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "The acquisition manifest is empty" }, { status: 400 });
    }

    // 3. Calculate total value with safety check for null books
    const totalPrice = cart.items.reduce((acc: number, item: any) => {
      if (!item.book) return acc; 
      return acc + (item.book.price * item.quantity);
    }, 0);

    // 4. Prepare items for the permanent record (Order)
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

    // 5. Commit the Order to the Archive
    const newOrder = await Order.create({
      user: payload.id,
      items: orderItems,
      totalPrice,
      status: "pending",
    });

    // 6. Clear the User's temporary bag
    await Cart.findOneAndUpdate({ user: payload.id }, { items: [] });

    return NextResponse.json({ 
      message: "Archive record created successfully", 
      orderId: newOrder._id 
    }, { status: 200 });

  } catch (error: any) {
    console.error("ARCHIVE SYSTEM ERROR:", error.message);
    return NextResponse.json({ 
      error: "Authorization failed", 
      details: error.message 
    }, { status: 500 });
  }
}
