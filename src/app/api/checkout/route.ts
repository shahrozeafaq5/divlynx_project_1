import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Book from "@/models/Book"; // 1. MUST import the model to register it
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // 2. Register Book model explicitly for population
    // This prevents the "Schema hasn't been registered for model 'Book'" error
    console.log("Model check:", Book.modelName); 

    // 3. Get User ID from token
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = await verifyToken(token);
    if (!payload) return null;

    // 4. Find the user's cart and populate
    const cart = await Cart.findOne({ user: payload.id }).populate("items.book");
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 5. Calculate total price with safety check for null books
    const totalPrice = cart.items.reduce((acc: number, item: any) => {
      if (!item.book) return acc; // Skip if book was deleted from DB
      return acc + (item.book.price * item.quantity);
    }, 0);

    // 6. Prepare order items with safety check
    const orderItems = cart.items
      .filter((item: any) => item.book !== null)
      .map((item: any) => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.book.price, 
      }));

    if (orderItems.length === 0) {
      return NextResponse.json({ error: "No valid items in cart" }, { status: 400 });
    }

    // 7. Create the Order
    const newOrder = await Order.create({
      user: payload.id,
      items: orderItems,
      totalPrice,
      status: "pending",
    });

    // 8. Clear the User's Cart
    await Cart.findOneAndUpdate({ user: payload.id }, { items: [] });

    return NextResponse.json({ 
      message: "Order placed successfully", 
      orderId: newOrder._id 
    }, { status: 200 });

  } catch (error: any) {
    // This log will appear in your VS Code terminal/Command Prompt
    console.error("CRITICAL CHECKOUT ERROR:", error.message);
    return NextResponse.json({ 
      error: "Checkout failed", 
      details: error.message 
    }, { status: 500 });
  }
}