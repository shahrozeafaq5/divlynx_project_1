import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import "@/models/Book"; 
import { verifyToken } from "@/lib/auth.token";
import { isSameOriginRequest } from "@/lib/security";


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
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookId, quantity = 1 } = await req.json();
    if (typeof bookId !== "string" || !bookId) {
      return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
    }
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ book: bookId, quantity: qty }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item: any) => item.book.toString() === bookId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({ book: bookId, quantity: qty });
      }
      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate("items.book");
    return NextResponse.json(updatedCart);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
