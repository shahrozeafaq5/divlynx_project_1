import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { requireAdmin } from "@/lib/auth-guard";
import { isSameOriginRequest } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!isSameOriginRequest(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await requireAdmin(req);

    // 1. Establish connection to the Archive
    await connectDB();
    console.log("❧ Archive Connection: Active");

    // 2. Clear existing books (Optional but recommended for a clean reset)
    await Book.deleteMany({});
    console.log("🧹 Previous folios purged from the shelves.");

    // 3. The New Collection (Your specific list)
    const books = [
      {
        title: "Meditations",
        author: "Marcus Aurelius",
        category: "philosophy",
        price: 18,
        stock: 12,
        image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
        description: "A timeless collection of Stoic philosophy written as personal reflections by the Roman emperor.",
      },
      {
        title: "Thus Spoke Zarathustra",
        author: "Friedrich Nietzsche",
        category: "philosophy",
        price: 21,
        stock: 8,
        image: "https://covers.openlibrary.org/b/id/11153262-L.jpg",
        description: "A philosophical novel exploring ideas of individuality, morality, and the Übermensch.",
      },
      {
        title: "The Odyssey",
        author: "Homer",
        category: "poetry",
        price: 20,
        stock: 10,
        image: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
        description: "An epic poem chronicling Odysseus’s long journey home after the Trojan War.",
      },
      {
        title: "Leaves of Grass",
        author: "Walt Whitman",
        category: "poetry",
        price: 16,
        stock: 7,
        image: "https://covers.openlibrary.org/b/id/8231852-L.jpg",
        description: "A groundbreaking collection of poems celebrating individuality, nature, and humanity.",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        category: "history",
        price: 26,
        stock: 14,
        image: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
        description: "A brief history of humankind, exploring how biology and history shaped modern society.",
      },
      {
        title: "Guns, Germs, and Steel",
        author: "Jared Diamond",
        category: "history",
        price: 24,
        stock: 9,
        image: "https://covers.openlibrary.org/b/id/8235092-L.jpg",
        description: "An analysis of how geography and environment shaped the modern world.",
      },
      {
        title: "1984",
        author: "George Orwell",
        category: "fiction",
        price: 15,
        stock: 20,
        image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        description: "A dystopian novel exploring surveillance, authoritarianism, and loss of freedom.",
      },
      {
        title: "Dune",
        author: "Frank Herbert",
        category: "fiction",
        price: 22,
        stock: 18,
        image: "https://covers.openlibrary.org/b/id/8101350-L.jpg",
        description: "A science fiction epic about politics, religion, and power on the desert planet Arrakis.",
      },
      {
        title: "A Room of One’s Own",
        author: "Virginia Woolf",
        category: "essays",
        price: 14,
        stock: 6,
        image: "https://covers.openlibrary.org/b/id/8231881-L.jpg",
        description: "An extended essay examining women’s role in literary history and creative freedom.",
      },
      {
        title: "Self-Reliance and Other Essays",
        author: "Ralph Waldo Emerson",
        category: "essays",
        price: 17,
        stock: 11,
        image: "https://covers.openlibrary.org/b/id/8235089-L.jpg",
        description: "A collection of essays promoting individualism, intuition, and self-trust.",
      },
    ];

    // 4. Populate the Database
    await Book.insertMany(books);

    return NextResponse.json({ 
      success: true, 
      message: "The Great Archive has been successfully restored.",
      count: books.length 
    }, { status: 200 });

  } catch (error: any) {
    const status =
      error?.message === "Unauthorized"
        ? 401
        : error?.message === "Forbidden"
        ? 403
        : 500;

    console.error("Archival Failure:", error?.message);
    return NextResponse.json(
      { success: false, error: "Archival Process Failed" },
      { status }
    );
  }
}

