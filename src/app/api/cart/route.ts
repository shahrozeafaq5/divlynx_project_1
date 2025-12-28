import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import "@/models/Book"; 
import { verifyToken } from "@/lib/auth.token";


async function getUserId(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload ? payload.id : null;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const cart = await Cart.findOne({ user: userId }).populate("items.book");
    return NextResponse.json(cart || { items: [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookId, quantity = 1 } = await req.json();
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ book: bookId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item: any) => item.book.toString() === bookId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ book: bookId, quantity });
      }
      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate("items.book");
    return NextResponse.json(updatedCart);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}