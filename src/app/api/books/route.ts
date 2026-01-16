import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { BookValidator } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth-guard";
import { isSameOriginRequest } from "@/lib/security";

const MAX_LIMIT = 50;
const MAX_SEARCH_LENGTH = 100;
const ALLOWED_CATEGORIES = new Set([
  "philosophy",
  "poetry",
  "history",
  "fiction",
  "essays",
]);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number(searchParams.get("limit") || 10))
    );

    const query: any = {};

    if (search && search.length <= MAX_SEARCH_LENGTH) {
      const safeSearch = escapeRegExp(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { author: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category && ALLOWED_CATEGORIES.has(category)) {
      query.category = category;
    }

    let booksQuery = Book.find(query);

    if (sort === "price-asc") booksQuery = booksQuery.sort({ price: 1 });
    if (sort === "price-desc") booksQuery = booksQuery.sort({ price: -1 });
    if (sort === "newest") booksQuery = booksQuery.sort({ createdAt: -1 });

    const books = await booksQuery
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Book.countDocuments(query);

    return NextResponse.json({
      data: books,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await requireAdmin(req);

    await connectDB();

    const body = await req.json();
    const parsed = BookValidator.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const book = await Book.create(parsed.data);

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    const status =
      error.message === "Unauthorized"
        ? 401
        : error.message === "Forbidden"
        ? 403
        : 500;

    return NextResponse.json(
      { error: error.message || "Failed to create book" },
      { status }
    );
  }
}
