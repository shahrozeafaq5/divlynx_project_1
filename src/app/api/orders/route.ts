import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Book from "@/models/Book";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.token";
import { isSameOriginRequest } from "@/lib/security";

import { Types } from "mongoose";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type PopulatedCartItem = {
  book: {
    _id: Types.ObjectId;
    title: string;
    price: number;
    stock: number;
  };
  quantity: number;
};

/* ─────────────────────────────────────────────
   CREATE ORDER (FINALIZE ACQUISITION)
───────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    /* ─── AUTH ─── */
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    /* ─── FETCH CART ─── */
    const cart = await Cart.findOne({ user: payload.id })
      .populate("items.book")
      .lean();

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const items = cart.items as PopulatedCartItem[];

    /* ─── VALIDATE & CALCULATE ─── */
    let totalPrice = 0;

    for (const item of items) {
      const book = item.book;

      if (book.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${book.title}` },
          { status: 400 }
        );
      }

      totalPrice += book.price * item.quantity;
    }

    /* ─── CREATE ORDER ─── */
    const order = await Order.create({
      user: payload.id,
      items: items.map((item) => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.book.price,
      })),
      totalPrice,
      status: "pending",
    });

    /* ─── UPDATE STOCK ─── */
    for (const item of items) {
      await Book.findByIdAndUpdate(item.book._id, {
        $inc: { stock: -item.quantity },
      });
    }

    /* ─── CLEAR CART ─── */
    await Cart.updateOne(
      { user: payload.id },
      { $set: { items: [] } }
    );

    return NextResponse.json(
      { success: true, orderId: order._id },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
