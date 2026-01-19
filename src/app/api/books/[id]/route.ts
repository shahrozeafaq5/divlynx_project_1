import { requireAdmin } from "@/lib/auth-guard";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { BookValidator } from "@/lib/validators";
import { isSameOriginRequest } from "@/lib/security";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    await connectDB();
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await requireAdmin(req);

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const parsed = BookValidator.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const payload = {
      ...parsed.data,
      image: parsed.data.image ?? parsed.data.coverImage,
    };
    delete (payload as { coverImage?: string }).coverImage;

    const updated = await Book.findByIdAndUpdate(id, payload, { new: true });

    return NextResponse.json(updated);
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await requireAdmin(req);
    
    const { id } = await params;
    await connectDB();

    const deletedBook = await Book.findByIdAndDelete(id);
    
    if (!deletedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted" });
  } catch (error: any) {
    const status = error.message === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
